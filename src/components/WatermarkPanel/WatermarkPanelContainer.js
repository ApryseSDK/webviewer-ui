import React, { useState, useEffect } from 'react';
import WatermarkPanel from './WatermarkPanel';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import { isMobileSize } from 'helpers/getDeviceSize';
import DataElementWrapper from '../DataElementWrapper';
import Icon from 'components/Icon';

const WatermarkPanelContainer = () => {
  const [isOpen, isDisabled, watermarkPanelWidth, isInDesktopOnlyMode] = useSelector(
    (state) => [
      selectors.isElementOpen(state, 'watermarkPanel'),
      selectors.isElementDisabled(state, 'watermarkPanel'),
      selectors.getWatermarkPanelWidth(state),
      selectors.isInDesktopOnlyMode(state),
    ],
    shallowEqual,
  );

  const isMobile = isMobileSize();

  const dispatch = useDispatch();
  const closeWatermarkPanel = () => {
    dispatch(actions.closeElement('watermarkPanel'));
  };

  const renderMobileCloseButton = () => {
    return (
      <div className="close-container">
        <div className="close-icon-container" onClick={closeWatermarkPanel}>
          <Icon glyph="ic_close_black_24px" className="close-icon" />
        </div>
      </div>
    );
  };

  const style =
    !isInDesktopOnlyMode && isMobile ? {} : { width: `${watermarkPanelWidth}px`, minWidth: `${watermarkPanelWidth}px` };

  const [renderNull, setRenderNull] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setRenderNull(!isOpen);
    }, 500);
    return () => {
      clearTimeout(timeout);
    };
  }, [isOpen]);

  if (isDisabled || (!isOpen && renderNull)) {
    return null;
  }

  return (
    <DataElementWrapper dataElement="watermarkPanel" className="Panel WatermarkPanel" style={style}>
      {!isInDesktopOnlyMode && isMobile && renderMobileCloseButton()}
      <WatermarkPanel />
    </DataElementWrapper>
  );
};

export default WatermarkPanelContainer;