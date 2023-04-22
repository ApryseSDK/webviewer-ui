import React from 'react';
import WatermarkPanel from './WatermarkPanel';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import useMedia from 'hooks/useMedia';
import DataElementWrapper from '../DataElementWrapper';
import Icon from 'components/Icon';

export const WatermarkPanelContainer = () => {
  const [
    isOpen,
    isDisabled,
    watermarkPanelWidth,
    isInDesktopOnlyMode,
  ] = useSelector(
    (state) => [
      selectors.isElementOpen(state, 'watermarkPanel'),
      selectors.isElementDisabled(state, 'watermarkPanel'),
      selectors.getWatermarkPanelWidth(state),
      selectors.isInDesktopOnlyMode(state),
    ], shallowEqual);

  const isMobile = useMedia(
    // Media queries
    ['(max-width: 640px)'],
    [true],
    // Default value
    false,
  );


  const dispatch = useDispatch();
  const closeWatermarkPanel = () => {
    dispatch(actions.closeElement('watermarkPanel'));
  };

  const renderMobileCloseButton = () => {
    return (
      <div
        className="close-container"
      >
        <div
          className="close-icon-container"
          onClick={closeWatermarkPanel}
        >
          <Icon
            glyph="ic_close_black_24px"
            className="close-icon"
          />
        </div>
      </div>
    );
  };

  const style = !isInDesktopOnlyMode && isMobile ? {} : { width: `${watermarkPanelWidth}px`, minWidth: `${watermarkPanelWidth}px`, };

  if (isDisabled || !isOpen) {
    return null;
  }
  return (
    <DataElementWrapper
      dataElement="watermarkPanel"
      className="Panel WatermarkPanel"
      style={style}
    >
      {(!isInDesktopOnlyMode && isMobile) && renderMobileCloseButton()}
      <WatermarkPanel
      />
    </DataElementWrapper>
  );
};

export default WatermarkPanelContainer;