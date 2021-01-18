import React, { useState, useCallback } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import Icon from 'components/Icon';

import core from 'core';
import { isMobile } from 'helpers/device';
import actions from 'actions';
import selectors from 'selectors';

import './Outline.scss';

const propTypes = {
  outline: PropTypes.object.isRequired,
};

function Outline({ outline }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const dispatch = useDispatch();

  const handleClickExpand = useCallback(function() {
    setIsExpanded(expand => !expand);
  }, []);

  const handleOutlineClick = useCallback(function() {
    core.goToOutline(outline);

    if (isMobile()) {
      dispatch(actions.closeElement('leftPanel'));
    }
  }, [dispatch]);

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
      <div className="content">
        <button className="title" onClick={handleOutlineClick}>
          {outline.getName()}
        </button>
        {isExpanded && outline.getChildren().map((outline, i) => <Outline outline={outline} key={i} />)}
      </div>
    </div>
  );
}

Outline.propTypes = propTypes;

export default Outline;
