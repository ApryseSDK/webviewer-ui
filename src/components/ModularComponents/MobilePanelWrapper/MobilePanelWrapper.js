import React, { useState, useEffect } from 'react';
import './MobilePanelWrapper.scss';
import { Swipeable } from 'react-swipeable';
import { isMobileSize } from 'helpers/getDeviceSize';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import selectors from 'selectors';
import actions from 'actions';
import classNames from 'classnames';
import { PANEL_SIZES, panelNames } from 'constants/panel';

const propTypes = {
  children: PropTypes.node,
};

const MOBILE_PANEL_WRAPPER = 'MobilePanelWrapper';

const MobilePanelWrapper = ({ children }) => {
  const isMobile = isMobileSize();
  const dispatch = useDispatch();

  const [
    isOpen,
    isContentOpen,
    documentContainerWidthStyle,
    mobilePanelSize,
  ] = useSelector((state) => [
    selectors.isElementOpen(state, MOBILE_PANEL_WRAPPER),
    selectors.isElementOpen(state, children?.props?.dataElement),
    selectors.getDocumentContentContainerWidthStyle(state),
    selectors.getMobilePanelSize(state),
  ]);

  const [style, setStyle] = useState({});

  const setMobilePanelSize = (size) => {
    dispatch(actions.setMobilePanelSize(size));
  };

  useEffect(() => {
    const contentElement = children?.props?.dataElement;
    if (isOpen) {
      if (contentElement === panelNames.RUBBER_STAMP) {
        setMobilePanelSize(PANEL_SIZES.HALF_SIZE);
      } else {
        setMobilePanelSize(PANEL_SIZES.SMALL_SIZE);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isContentOpen) {
      dispatch(actions.closeElement(MOBILE_PANEL_WRAPPER));
    }
  }, [isContentOpen]);

  useEffect(() => {
    setStyle({ width: documentContainerWidthStyle });
  }, [documentContainerWidthStyle]);

  const closePanel = () => {
    setMobilePanelSize(PANEL_SIZES.SMALL_SIZE);
    dispatch(actions.closeElement(MOBILE_PANEL_WRAPPER));
  };

  if (!isMobile || !isOpen) {
    return null;
  }

  const isAreaScrollable = (e) => {
    const targetElement = e.event.target;
    const className = targetElement.className;
    return className.includes('swipe-indicator-wrapper');
  };

  const onSwipedUp = (e) => {
    if (isAreaScrollable(e)) {
      switch (mobilePanelSize) {
        case PANEL_SIZES.SMALL_SIZE:
          setMobilePanelSize(PANEL_SIZES.HALF_SIZE);
          break;
        case PANEL_SIZES.HALF_SIZE:
          setMobilePanelSize(PANEL_SIZES.FULL_SIZE);
          break;
      }
    }
  };

  const onSwipedDown = (e) => {
    if (isAreaScrollable(e)) {
      switch (mobilePanelSize) {
        case PANEL_SIZES.FULL_SIZE:
          setMobilePanelSize(PANEL_SIZES.HALF_SIZE);
          break;
        case PANEL_SIZES.HALF_SIZE:
          setMobilePanelSize(PANEL_SIZES.SMALL_SIZE);
          break;
        case PANEL_SIZES.SMALL_SIZE:
          closePanel();
          break;
      }
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
      <div data-element={MOBILE_PANEL_WRAPPER} className={classNames(MOBILE_PANEL_WRAPPER, {
        [mobilePanelSize]: true,
      })}
      style={style}
      role='none'
      onClick={onContainerClick}
      onKeyDown={onContainerClick}>
        <div className="swipe-indicator-wrapper">
          <div className="swipe-indicator" />
        </div>
        <div className="mobile-panel-body">
          {React.Children.map(children, (child) => React.cloneElement(child, { panelSize: mobilePanelSize }))}
        </div>
      </div>
    </Swipeable>
  );
};

MobilePanelWrapper.propTypes = propTypes;

export default MobilePanelWrapper;