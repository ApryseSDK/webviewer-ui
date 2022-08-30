import React from 'react';
import './HoverTab.scss';
import Icon from 'components/Icon';

const HoverTab = ({ onDragOver, onDragLeave }) => {
  return (
    <div className="HoverTab" onDragOver={onDragOver} onDragLeave={onDragLeave}>
      <Icon glyph="icon-download" />
    </div>
  );
};

export default HoverTab;