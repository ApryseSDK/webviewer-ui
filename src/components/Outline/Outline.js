import React, { useState, useCallback, useContext, useLayoutEffect } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Icon from 'components/Icon';
import Button from 'components/Button';
import OutlineContext from './Context';
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
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    setSelectedOutlinePath,
    selectedOutlinePath,
    isOutlineSelected,
    setIsAddingNewOutline,
    isAddingNewOutline,
    addNewOutline,
  } = useContext(OutlineContext);
  const dispatch = useDispatch();
  const [t] = useTranslation();

  useLayoutEffect(() => {
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
    [dispatch],
  );

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
        <div className={classNames({ row: true, selected: isSelected })}>
          <Button className="contentButton" label={outline.getName()} onClick={handleOutlineClick} />
        </div>
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

export default Outline;
