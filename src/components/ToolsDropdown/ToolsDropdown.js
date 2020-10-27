import React from 'react';
import Icon from 'components/Icon';
import classNames from 'classnames';

import './ToolsDropdown.scss';


const ToolsDropdown = ({ isActive, isDisabled, onClick, style }) => {
  return (
    <button
      className={classNames({
        "tools-dropdown-container": true,
        active: isActive,
        disabled: isDisabled,
      })}
      data-element="styling-button"
      onClick={onClick}
      style={style}
    >
      {isActive ?
        <Icon className="tools-arrow-up" glyph="icon-chevron-up" /> :
        <Icon className="tools-arrow-down" glyph="icon-chevron-down" />}
    </button>
  );
};

export default ToolsDropdown;