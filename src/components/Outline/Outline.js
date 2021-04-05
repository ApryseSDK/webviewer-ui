import React, { useState, useCallback, useContext } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import Icon from 'components/Icon';
import Button from 'components/Button';
import OutlineContext from './Context';

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
  const { setSelectedOutlinePath, isOutlineSelected } = useContext(OutlineContext);
  const dispatch = useDispatch();

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
      </div>
    </div>
  );
}

Outline.propTypes = propTypes;

export default Outline;
