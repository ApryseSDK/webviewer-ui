import React, { useState, useCallback, useContext, useEffect, useLayoutEffect } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import OutlineContext from './Context';
import Icon from 'components/Icon';
import Button from 'components/Button';
import DataElementWrapper from 'components/DataElementWrapper';
import OutlineEditPopup from 'components/OutlineEditPopup';
import OutlineTextInput from 'components/OutlineTextInput';

import core from 'core';
import outlineUtils from 'helpers/OutlineUtils';
import { isMobile } from 'helpers/device';
import actions from 'actions';
import selectors from 'selectors';

import './Outline.scss';

const propTypes = {
  outline: PropTypes.object.isRequired,
};

function Outline({ outline }) {
  const outlines = useSelector(state => selectors.getOutlines(state));
  const {
    setSelectedOutlinePath,
    isOutlineSelected,
    selectedOutlinePath,
    setIsAddingNewOutline,
    isAddingNewOutline,
    reRenderPanel,
    addNewOutline,
  } = useContext(OutlineContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [showHoverBackground, setShowHoverBackground] = useState(false);
  const dispatch = useDispatch();
  const [t] = useTranslation();

  useEffect(() => {
    // automatically sets the current outline to be expanded in two cases
    // 1. another outline is nested into this outline (by listening to the change of selectedOutlinePath)
    // 2. a new child outline is going to be added (by listening to the change of isAddingNewOutline)
    const path = outlineUtils.getPath(outline);

    if (
      selectedOutlinePath !== null &&
      selectedOutlinePath !== path &&
      selectedOutlinePath.startsWith(path)
    ) {
      setIsExpanded(true);
    }
  }, [selectedOutlinePath, isAddingNewOutline, outline]);

  useLayoutEffect(() => {
    setIsEditingName(false);
  }, [outlines]);

  const handleClickExpand = useCallback(function() {
    setIsExpanded(expand => !expand);
  }, []);

  const handleOutlineClick = useCallback(
    function() {
      core.goToOutline(outline);
      setSelectedOutlinePath(outlineUtils.getPath(outline));

      if (isMobile()) {
        dispatch(actions.closeElement('leftPanel'));
      }
    },
    [dispatch, setSelectedOutlinePath, outline],
  );

  function handleOutlineDoubleClick() {
    if (!core.isFullPDFEnabled()) {
      return;
    }

    setIsEditingName(true);
  }

  async function changeOutlineName(e) {
    const newName = e.target.value;

    if (!newName || outline.getName() === newName) {
      setIsEditingName(false);
      return;
    }

    await outlineUtils.setOutlineName(outlineUtils.getPath(outline), newName);
    reRenderPanel();
  }

  const isSelected = isOutlineSelected(outline);

  return (
    <div className="Outline">
      <div className="padding">
        {outline.getChildren().length > 0 && (
          <div
            className={classNames({
              arrow: true,
              expanded: isExpanded,
            })}
            onClick={handleClickExpand}
          >
            <Icon glyph="ic_chevron_right_black_24px" />
          </div>
        )}
      </div>
      <div className={classNames({ content: true, editable: core.isFullPDFEnabled() })}>
        {isEditingName ? (
          <OutlineTextInput
            defaultValue={outline.getName()}
            onEscape={() => setIsEditingName(false)}
            onEnter={changeOutlineName}
            onBlur={changeOutlineName}
          />
        ) : (
          <div className={classNames({ row: true, selected: isSelected, hover: showHoverBackground && !isSelected })}>
            <Button
              className="contentButton"
              onDoubleClick={handleOutlineDoubleClick}
              label={outline.getName()}
              onClick={handleOutlineClick}
            />
            <OutlineEditButton
              outline={outline}
              setIsEditingName={setIsEditingName}
              onPopupOpen={() => setShowHoverBackground(true)}
              onPopupClose={() => setShowHoverBackground(false)}
            />
          </div>
        )}
        {isExpanded &&
          outline.getChildren().map(outline => <Outline outline={outline} key={outlineUtils.getOutlineId(outline)} />)}
        {isAddingNewOutline && isSelected && (
          <OutlineTextInput
            defaultValue={t('message.untitled')}
            onEscape={() => setIsAddingNewOutline(false)}
            onEnter={addNewOutline}
            onBlur={addNewOutline}
          />
        )}
      </div>
    </div>
  );
}

Outline.propTypes = propTypes;

function OutlineEditButton({ outline, setIsEditingName, onPopupOpen, onPopupClose }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      onPopupOpen();
    } else {
      onPopupClose();
    }
  }, [isOpen, onPopupOpen, onPopupClose]);

  function handleButtonClick() {
    setIsOpen(open => !open);
  }

  const trigger = `edit-button-${outlineUtils.getPath(outline)}`;

  return (
    <DataElementWrapper className="editOutlineButton" dataElement="editOutlineButton">
      <Button dataElement={trigger} img="icon-tool-more" onClick={handleButtonClick} />
      {isOpen && (
        <OutlineEditPopup
          outline={outline}
          trigger={trigger}
          setIsOpen={setIsOpen}
          setIsEditingName={setIsEditingName}
        />
      )}
    </DataElementWrapper>
  );
}

export default Outline;
