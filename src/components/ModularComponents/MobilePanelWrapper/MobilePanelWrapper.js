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
import useResizeObserver from 'hooks/useResizeObserver';

const propTypes = {
  children: PropTypes.node,
};

const MOBILE_PANEL_WRAPPER = 'MobilePanelWrapper';

const  smallSizedPanels = [panelNames.SIGNATURE_LIST, panelNames.RUBBER_STAMP];

const MobilePanelWrapper = ({ children }) => {
  const isMobile = isMobileSize();
  const dispatch = useDispatch();
  const contentElement = children?.props?.dataElement;

  const isOpen = useSelector((state) => selectors.isElementOpen(state, MOBILE_PANEL_WRAPPER));
  const isContentOpen = useSelector((state) => selectors.isElementOpen(state, contentElement));
  const mobilePanelSize = useSelector(selectors.getMobilePanelSize);
  const isSearchAndReplaceDisabled = useSelector((state) => selectors.isElementDisabled(state, 'searchAndReplace'));

  const [wrapperBodyStyle, setWrapperBodyStyle] = useState({});

  const setMobilePanelSize = (size) => {
    dispatch(actions.setMobilePanelSize(size));
  };

  const [wrapperRef, dimensions] = useResizeObserver();

  useEffect(() => {
    if (isOpen) {
      setMobilePanelSize(PANEL_SIZES.HALF_SIZE);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isContentOpen) {
      dispatch(actions.closeElement(MOBILE_PANEL_WRAPPER));
    }
  }, [isContentOpen]);

  useEffect(() => {
    if (dimensions.height !== null) {
      // 16px is the padding of the mobile panel body
      setWrapperBodyStyle({
        display: 'flex',
        flexDirection: 'column',
        height: dimensions.height - 16,
      });
    }
  }, [dimensions]);

  const closePanel = () => {
    dispatch(actions.closeElement(MOBILE_PANEL_WRAPPER));
    dispatch(actions.closeElement(contentElement));
  };

  if (!isMobile || !isOpen) {
    return null;
  }

  const onSwipedUp = () => {
    switch (mobilePanelSize) {
      case PANEL_SIZES.SMALL_SIZE:
        setMobilePanelSize(PANEL_SIZES.HALF_SIZE);
        break;
      case PANEL_SIZES.HALF_SIZE:
        setMobilePanelSize(PANEL_SIZES.FULL_SIZE);
        break;
    }
  };

  const onSwipedDown = () => {
    let currentMobilePanelSize = mobilePanelSize;

    const isSearchPanelActiveWithSearchAndReplace = !isSearchAndReplaceDisabled && contentElement === panelNames.SEARCH;
    const isPanelAllowedToBeSmallSize = smallSizedPanels.includes(contentElement);

    switch (currentMobilePanelSize) {
      case PANEL_SIZES.FULL_SIZE:
        setMobilePanelSize(PANEL_SIZES.HALF_SIZE);
        break;
      case PANEL_SIZES.HALF_SIZE:
        if (isSearchPanelActiveWithSearchAndReplace || !isPanelAllowedToBeSmallSize) {
          closePanel();
        } else {
          setMobilePanelSize(PANEL_SIZES.SMALL_SIZE);
        }
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
    <div data-element={MOBILE_PANEL_WRAPPER} className={classNames(MOBILE_PANEL_WRAPPER, {
      [mobilePanelSize]: true,
    })}
    ref={wrapperRef}
    role='none'
    onClick={onContainerClick}
    onKeyDown={onContainerClick}>
      <Swipeable
        onSwipedUp={onSwipedUp}
        onSwipedDown={onSwipedDown}
        trackMouse
      >
        <div className="swipe-indicator-wrapper">
          <div className="swipe-indicator" />
        </div>
      </Swipeable>
      <div className="mobile-panel-body" style={wrapperBodyStyle}>
        {React.Children.map(children, (child) => React.cloneElement(child, { panelSize: mobilePanelSize }))}
      </div>
    </div>
  );
};

MobilePanelWrapper.propTypes = propTypes;

export default MobilePanelWrapper;