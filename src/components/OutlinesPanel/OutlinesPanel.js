import React, { useState, useLayoutEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { DndProvider } from 'react-dnd';
import { isMobileDevice } from 'helpers/device';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TouchBackEnd from 'react-dnd-touch-backend';
import OutlineControls from '../OutlineControls';
import Outline from 'components/Outline';
import OutlineContext from 'components/Outline/Context';
import Icon from 'components/Icon';
import Button from 'components/Button';
import OutlineTextInput from 'components/OutlineTextInput';
import DataElementWrapper from 'components/DataElementWrapper';

import core from 'core';
import outlineUtils from 'helpers/OutlineUtils';
import DataElements from 'constants/dataElement';
import actions from 'actions';
import selectors from 'selectors';

import './OutlinesPanel.scss';

function OutlinesPanel() {
  const isDisabled = useSelector(state => selectors.isElementDisabled(state, DataElements.OUTLINES_PANEL));
  const outlines = useSelector(state => selectors.getOutlines(state));
  const outlineControlVisibility = useSelector(state => selectors.isOutlineControlVisible(state));
  const [selectedOutlinePath, setSelectedOutlinePath] = useState(null);
  const [isAddingNewOutline, setIsAddingNewOutline] = useState(false);
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const nextPathRef = useRef(null);

  // use layout effect to avoid flickering in the panel
  useLayoutEffect(() => {
    setIsAddingNewOutline(false);

    if (nextPathRef.current !== null) {
      setSelectedOutlinePath(nextPathRef.current);
      nextPathRef.current = null;
    }
  }, [outlines]);

  async function addNewOutline(e) {
    const name = e.target.value;

    if (!name) {
      setIsAddingNewOutline(false);
      return;
    }

    const currentPage = core.getCurrentPage();
    let nextPath;
    if (outlines.length === 0) {
      nextPath = await outlineUtils.addRootOutline(name, currentPage);
    } else {
      nextPath = await outlineUtils.addNewOutline(name, selectedOutlinePath, currentPage);
    }

    nextPathRef.current = nextPath;
    reRenderPanel();
  }

  function reRenderPanel() {
    core.getOutlines(outlines => {
      dispatch(actions.setOutlines(outlines));
    });
  }

  function generalMoveOutlineAction(dragOutline, dropOutline, moveDirection) {
    const dragPath = outlineUtils.getPath(dragOutline);
    const dropPath = outlineUtils.getPath(dropOutline);
    moveDirection.call(outlineUtils, dragPath, dropPath).then(path => {
      reRenderPanel();
      nextPathRef.current = path;
    });
    core.goToOutline(dragOutline);
  }

  function moveOutlineAfterTarget(dragOutline, dropOutline) {
    generalMoveOutlineAction(dragOutline, dropOutline, outlineUtils.moveOutlineAfterTarget);
  }

  function moveOutlineBeforeTarget(dragOutline, dropOutline) {
    generalMoveOutlineAction(dragOutline, dropOutline, outlineUtils.moveOutlineBeforeTarget);
  }

  function moveOutlineInward(dragOutline, dropOutline) {
    generalMoveOutlineAction(dragOutline, dropOutline, outlineUtils.moveOutlineInTarget);
  }

  return isDisabled ? null : (
    <div className="Panel OutlinesPanel" data-element={DataElements.OUTLINES_PANEL}>
      <OutlineContext.Provider
        value={{
          setSelectedOutlinePath,
          selectedOutlinePath,
          setIsAddingNewOutline,
          isAddingNewOutline,
          isOutlineSelected: outline => outlineUtils.getPath(outline) === selectedOutlinePath,
          addNewOutline,
          reRenderPanel,
        }}
      >
        {outlineControlVisibility && <OutlineControls />}
        <DndProvider backend={isMobileDevice ? TouchBackEnd : HTML5Backend}>
          <div className="Outlines">
            {!isAddingNewOutline && outlines.length === 0 && (
              <div className="no-outlines">
                <Icon className="empty-icon" glyph="illustration - empty state - outlines" />
                <div className="msg">{t('message.noOutlines')}</div>
              </div>
            )}
            {outlines.map(outline => (
              <Outline
                key={outlineUtils.getOutlineId(outline)}
                outline={outline}
                moveOutlineInward={moveOutlineInward}
                moveOutlineBeforeTarget={moveOutlineBeforeTarget}
                moveOutlineAfterTarget={moveOutlineAfterTarget}
              />
            ))}
            {isAddingNewOutline && selectedOutlinePath === null && (
              <OutlineTextInput
                className="marginLeft"
                defaultValue={t('message.untitled')}
                onEnter={addNewOutline}
                onEscape={() => setIsAddingNewOutline(false)}
                onBlur={addNewOutline}
              />
            )}
          </div>
        </DndProvider>
        <DataElementWrapper className="addNewOutlineButtonContainer" dataElement="addNewOutlineButtonContainer">
          <Button
            dataElement="addNewOutlineButton"
            img="icon-menu-add"
            label={t('option.outlineControls.add')}
            onClick={() => setIsAddingNewOutline(true)}
          />
        </DataElementWrapper>
      </OutlineContext.Provider>
    </div>
  );
}

export default React.memo(OutlinesPanel);
