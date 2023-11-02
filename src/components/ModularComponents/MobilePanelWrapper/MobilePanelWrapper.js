import React, { useState, useEffect } from 'react';
import './MobilePanelWrapper.scss';
import { Swipeable } from 'react-swipeable';
import { isMobileSize } from 'helpers/getDeviceSize';
import { useSelector, useDispatch } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import classNames from 'classnames';

const propTypes = {};

const PANEL_SIZES = {
  FULL_SIZE: 'full-size',
  HALF_SIZE: 'half-size',
  SMALL_SIZE: 'small-size',
};

const MobilePanelWrapper = () => {
  const isMobile = isMobileSize();
  const dispatch = useDispatch();
  const [panelSize, setPanelSize] = useState(PANEL_SIZES.SMALL_SIZE);
  const [isOpen] = useSelector((state) => [
    selectors.isElementOpen(state, 'MobilePanelWrapper')
  ]);

  useEffect(() => {
    if (isOpen) {
      setPanelSize(PANEL_SIZES.SMALL_SIZE);
    }
  }, [isOpen]);

  const closePanel = () => {
    setPanelSize(PANEL_SIZES.SMALL_SIZE);
    dispatch(actions.closeElement('MobilePanelWrapper'));
  };

  if (!isMobile || !isOpen) {
    return null;
  }

  const onSwipedUp = () => {
    switch (panelSize) {
      case PANEL_SIZES.SMALL_SIZE:
        setPanelSize(PANEL_SIZES.HALF_SIZE);
        break;
      case PANEL_SIZES.HALF_SIZE:
        setPanelSize(PANEL_SIZES.FULL_SIZE);
        break;
    }
  };

  const onSwipedDown = () => {
    switch (panelSize) {
      case PANEL_SIZES.FULL_SIZE:
        setPanelSize(PANEL_SIZES.HALF_SIZE);
        break;
      case PANEL_SIZES.HALF_SIZE:
        setPanelSize(PANEL_SIZES.SMALL_SIZE);
        break;
      case PANEL_SIZES.SMALL_SIZE:
        closePanel();
        break;
    }
  };

  const onContainerClick = (e) => {
    e.stopPropagation();
  };

  return (
    <Swipeable
      onSwipedUp={onSwipedUp}
      onSwipedDown={onSwipedDown}
      trackMouse
      preventDefaultTouchmoveEvent
    >
      <div data-element="MobilePanelWrapper" className={classNames('MobilePanelWrapper', {
        [panelSize]: true,
      })} onClick={onContainerClick}
      >
        <div className="swipe-indicator"/>
      </div>
    </Swipeable>
  );
};

MobilePanelWrapper.propTypes = propTypes;

export default MobilePanelWrapper;