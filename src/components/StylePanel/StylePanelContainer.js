import React from 'react';
import StylePanel from './StylePanel';
import DataElementWrapper from '../DataElementWrapper';
import './StylePanel.scss';

const StylePanelContainer = () => {
  return (
    <DataElementWrapper dataElement="stylePanel" className="Panel StylePanel">
      <StylePanel />
    </DataElementWrapper>
  );
};

export default StylePanelContainer;