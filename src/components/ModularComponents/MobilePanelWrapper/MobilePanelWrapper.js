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

const minimumSizeForPanel = {
  'notesPanel': PANEL_SIZES.HALF_SIZE,
  'stylePanel': PANEL_SIZES.HALF_SIZE,
  'textEditingPanel': PANEL_SIZES.HALF_SIZE,
  'tabPanel': PANEL_SIZES.HALF_SIZE,
};

const MobilePanelWrapper = ({ children }) => {
  const isMobile = isMobileSize();
  const dispatch = useDispatch();
  const contentElement = children?.props?.dataElement;

  const [
    isOpen,
    isContentOpen,
    documentContainerWidthStyle,
    mobilePanelSize,
    isSearchAndReplaceDisabled
  ] = useSelector((state) => [
    selectors.isElementOpen(state, MOBILE_PANEL_WRAPPER),
    selectors.isElementOpen(state, contentElement),
    selectors.getDocumentContentContainerWidthStyle(state),
    selectors.getMobilePanelSize(state),
    selectors.isElementDisabled(state, 'searchAndReplace'),
  ]);

  const [style, setStyle] = useState({});
  const [wrapperBodyStyle, setWrapperBodyStyle] = useState({});

  const setMobilePanelSize = (size) => {
    dispatch(actions.setMobilePanelSize(size));
  };

  const [wrapperRef, dimensions] = useResizeObserver();

  useEffect(() => {
    const panelsStartingAtHalfSize = [
      panelNames.RUBBER_STAMP,
      panelNames.STYLE,
      panelNames.NOTES,
      panelNames.SEARCH,
      panelNames.TABS,
      panelNames.TEXT_EDITING,
      panelNames.REDACTION,
    ];
    if (isOpen) {
      if (panelsStartingAtHalfSize.includes(contentElement)) {
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
      let currentMobilePanelSize = mobilePanelSize;

      if (currentMobilePanelSize === minimumSizeForPanel[contentElement]) {
        currentMobilePanelSize = PANEL_SIZES.SMALL_SIZE;
      }

      const isSearchPanelActiveWithSearchAndReplace = !isSearchAndReplaceDisabled && contentElement === panelNames.SEARCH;

      switch (currentMobilePanelSize) {
        case PANEL_SIZES.FULL_SIZE:
          setMobilePanelSize(PANEL_SIZES.HALF_SIZE);
          break;
        case PANEL_SIZES.HALF_SIZE:
          if (isSearchPanelActiveWithSearchAndReplace) {
            closePanel();
          } else {
            setMobilePanelSize(PANEL_SIZES.SMALL_SIZE);
          }
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
    >
      <div data-element={MOBILE_PANEL_WRAPPER} className={classNames(MOBILE_PANEL_WRAPPER, {
        [mobilePanelSize]: true,
      })}
      ref={wrapperRef}
      style={style}
      role='none'
      onClick={onContainerClick}
      onKeyDown={onContainerClick}>
        <div className="swipe-indicator-wrapper">
          <div className="swipe-indicator" />
        </div>
        <div className="mobile-panel-body" style={wrapperBodyStyle}>
          {React.Children.map(children, (child) => React.cloneElement(child, { panelSize: mobilePanelSize }))}
        </div>
      </div>
    </Swipeable>
  );
};

MobilePanelWrapper.propTypes = propTypes;

export default MobilePanelWrapper;