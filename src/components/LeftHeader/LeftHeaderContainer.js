import React from 'react';
import DataElements from 'constants/dataElement';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import { RESIZE_BAR_WIDTH } from 'constants/panel';
import './LeftHeader.scss';


function LeftHeaderContainer() {
  const [
    featureFlags,
    headerList,
    isLeftPanelOpen,
    leftPanelWidth
  ] = useSelector(
    (state) => [
      selectors.getFeatureFlags(state),
      selectors.getModularHeaderList(state),
      selectors.isElementOpen(state, DataElements.LEFT_PANEL),
      selectors.getLeftPanelWidth(state),
    ]);
  const { modularHeader } = featureFlags;

  const leftHeader = headerList.find((header) => header.props.placement === 'left');

  const style = isLeftPanelOpen ? { transform: `translateX(${leftPanelWidth + RESIZE_BAR_WIDTH}px)` } : null;
  if (modularHeader && leftHeader) {
    return (
      <div className='LeftHeader' style={style}>
        {leftHeader}
      </div>
    );
  }
  return null;
}

export default LeftHeaderContainer;