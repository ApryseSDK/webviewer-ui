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

import '../../constants/bookmarksOutlinesShared.scss';
import './OutlinesPanel.scss';

function OutlinesPanel() {
  const isDisabled = useSelector(state => selectors.isElementDisabled(state, DataElements.OUTLINE_PANEL));
  const outlines = useSelector(state => selectors.getOutlines(state));
  const outlineControlVisibility = useSelector(state => selectors.isOutlineControlVisible(state));
  const outlineEditingEnabled = useSelector(state => selectors.getIsOutlineEditing(state));
  const [selectedOutlinePath, setSelectedOutlinePath] = useState(null);
  const [isAddingNewOutline, setIsAddingNewOutline] = useState(false);
  const [isMultiSelectionMode, setMultiSelectionMode] = useState(false);
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

  const addNewOutline = async (e) => {
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
    updateOutlines();
  }

  const updateOutlines = () => {
    core.getOutlines(outlines => {
      dispatch(actions.setOutlines(outlines));
    });
  }

  const generalMoveOutlineAction = (dragOutline, dropOutline, moveDirection) => {
    const dragPath = outlineUtils.getPath(dragOutline);
    const dropPath = outlineUtils.getPath(dropOutline);
    moveDirection.call(outlineUtils, dragPath, dropPath).then(path => {
      updateOutlines();
      nextPathRef.current = path;
    });
    core.goToOutline(dragOutline);
  }

  const moveOutlineAfterTarget = (dragOutline, dropOutline) => {
    generalMoveOutlineAction(dragOutline, dropOutline, outlineUtils.moveOutlineAfterTarget);
  }

  const moveOutlineBeforeTarget = (dragOutline, dropOutline) => {
    generalMoveOutlineAction(dragOutline, dropOutline, outlineUtils.moveOutlineBeforeTarget);
  }

  const moveOutlineInward = (dragOutline, dropOutline) => {
    generalMoveOutlineAction(dragOutline, dropOutline, outlineUtils.moveOutlineInTarget);
  }

  if (isDisabled) {
    return null;
  }

  return (
    <div
      className="Panel OutlinesPanel bookmark-outline-panel"
      data-element={DataElements.OUTLINE_PANEL}
    >
      <div className="bookmark-outline-panel-header">
        <div className="header-title">
          {t('component.outlinesPanel')}
        </div>
      </div>
      <OutlineContext.Provider
        value={{
          setSelectedOutlinePath,
          selectedOutlinePath,
          setIsAddingNewOutline,
          isAddingNewOutline,
          isOutlineSelected: outline => outlineUtils.getPath(outline) === selectedOutlinePath,
          addNewOutline,
          updateOutlines,
        }}
      >
        {outlineControlVisibility && <OutlineControls />}
        <DndProvider backend={isMobileDevice ? TouchBackEnd : HTML5Backend}>
          <div className="Outlines bookmark-outline-row">
            {!isAddingNewOutline && outlines.length === 0 && (
              <div className="msg msg-no-bookmark-outline">{t('message.noOutlines')}</div>
            )}
            {outlines.map(outline => (
              <Outline
                key={outlineUtils.getOutlineId(outline)}
                outline={outline}
                outlineEditingEnabled={outlineEditingEnabled}
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
        <DataElementWrapper
          className="bookmark-outline-footer"
          dataElement="addNewOutlineButtonContainer"
        >
          <Button
            dataElement="addNewOutlineButton"
            className="bookmark-outline-control-button add-new-button"
            img="icon-menu-add"
            disabled={isAddingNewOutline || isMultiSelectionMode}
            label={`${t('action.add')} ${t('component.outlinePanel')}`}
            onClick={() => setIsAddingNewOutline(true)}
          />
        </DataElementWrapper>
      </OutlineContext.Provider>
    </div>
  );
}

export default React.memo(OutlinesPanel);
