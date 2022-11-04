import React, { useState, useRef, useEffect, useLayoutEffect, forwardRef, useImperativeHandle } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import hotkeysManager from 'helpers/hotkeysManager';
import { useSelector } from 'react-redux';
import selectors from 'selectors';

import { isMac, isWindows, isIOS, isAndroid } from 'helpers/device';

import './Tooltip.scss';

const propTypes = {
  children: PropTypes.element.isRequired,
  content: PropTypes.string,
  hideShortcut: PropTypes.bool,
  forcePosition: PropTypes.string,
  hideOnClick: PropTypes.bool
};

const Tooltip = forwardRef(({ content = '', children, hideShortcut, forcePosition, hideOnClick }, ref) => {
  const timeoutRef = useRef(null);
  const childRef = useRef(null);
  useImperativeHandle(ref, () => childRef.current);
  const isDisabled = useSelector((state) => selectors.isElementDisabled(state, 'tooltip'));

  const tooltipRef = useRef(null);
  const [show, setShow] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });
  const [location, setLocation] = useState('bottom');
  const [t] = useTranslation();
  const delayShow = 300;
  const opacityTimeout = 50;

  useEffect(() => {
    const showToolTip = () => {
      timeoutRef.current = setTimeout(() => {
        setShow(true);
      }, delayShow - opacityTimeout);
    };

    const hideTooltip = () => {
      clearTimeout(timeoutRef.current);
      setShow(false);
    };

    childRef.current?.addEventListener('mouseenter', showToolTip);
    childRef.current?.addEventListener('mouseleave', hideTooltip);
    if (hideOnClick) {
      childRef.current?.addEventListener('click', hideTooltip);
    }
    if (childRef.current['ariaLabel'] !== 'action.close') {
      childRef.current?.addEventListener('focus', showToolTip);
      childRef.current?.addEventListener('blur', hideTooltip);
    }

    const observer = new MutationObserver((mutations) => {
      // hide tooltip when button get disabled, disable buttons don't have "mouseleave" events
      const lastMutation = mutations[mutations.length - 1];
      if (lastMutation && lastMutation.attributeName === 'disabled' && lastMutation.target.disabled) {
        hideTooltip();
      }
    });

    observer.observe(childRef.current, { attributes: true, childList: false, characterData: false });

    return () => {
      hideTooltip();
      observer.disconnect();

      childRef.current?.removeEventListener('mouseenter', showToolTip);
      childRef.current?.removeEventListener('mouseleave', hideTooltip);
      if (hideOnClick) {
        childRef.current?.removeEventListener('click', hideTooltip);
      }
      childRef.current?.removeEventListener('focus', showToolTip);
      childRef.current?.removeEventListener('blur', hideTooltip);
    };
  }, [childRef, hideOnClick]);

  useLayoutEffect(() => {
    const childEle = childRef.current;
    const tooltipEle = tooltipRef.current;

    const setTopAndLeft = () => {
      const childRect = childEle.getBoundingClientRect();
      const tooltipRect = tooltipEle.getBoundingClientRect();

      const locationTopLeftMap = {
        // TODO be able to support other directions too
        bottom: {
          top: childRect.bottom,
          left: childRect.left + childRect.width / 2 - tooltipRect.width / 2,
        },
        bottomLeft: {
          top: childRect.bottom,
          left: childRect.left,
        },
        left: {
          top: childRect.top + childRect.height / 2 - tooltipRect.height / 2,
          left: childRect.left - tooltipRect.width,
        },
        right: {
          top: childRect.top + childRect.height / 2 - tooltipRect.height / 2,
          left: childRect.right,
        },
        top: {
          top: childRect.top - tooltipRect.height,
          left: childRect.left + childRect.width / 2 - tooltipRect.width / 2,
        },
      };

      // starting from placing the tooltip at the bottom location
      // if the tooltip can't fit into the window, try placing it counterclockwise until we can find a location to fit it
      const bestLocation = Object.keys(locationTopLeftMap).find((location) => {
        if (forcePosition) {
          return location === forcePosition;
        }
        const { top: newTop, left: newLeft } = locationTopLeftMap[location];

        return (
          newTop > 0
            && newTop + tooltipRect.height < window.innerHeight
            && newLeft > 0
            && newLeft + tooltipRect.width < window.innerWidth
        );
      }) || 'bottom';
      const { top: tooltipTop, left: tooltipLeft } = locationTopLeftMap[
        bestLocation
      ];

      setPosition({
        top: tooltipTop,
        left: tooltipLeft,
      });
      setLocation(bestLocation);
    };

    if (show && childEle && tooltipEle) {
      setTopAndLeft();
      setTimeout(() => {
        setOpacity(1);
      }, opacityTimeout);
    } else {
      setOpacity(0);
    }
  }, [childRef, show]);

  const isUsingMobileDevices = isIOS || isAndroid;
  const child = React.cloneElement(children, {
    ref: childRef,
  });
  const translatedContent = t(content);
  // If shortcut.xxx exists in translation-en.json file
  // method t will return the shortcut, otherwise it will return shortcut.xxx
  let shortcutKey = content.slice(content.indexOf('.') + 1);
  if (isWindows && shortcutKey === 'redo') {
    shortcutKey = 'redo_windows';
  }
  const isActive = hotkeysManager.isActive(shortcutKey);

  let hasShortcut = t(`shortcut.${shortcutKey}`).indexOf('.') === -1;
  let shortcut = t(`shortcut.${shortcutKey}`);
  if (isMac) {
    shortcut = shortcut.replace('Ctrl', 'Cmd');
  }

  if (!isActive) {
    hasShortcut = false;
  }

  return (
    <React.Fragment>
      {child}
      {show &&
        translatedContent &&
        !isUsingMobileDevices &&
        !isDisabled &&
        ReactDOM.createPortal(
          <div
            className={`tooltip--${location}`}
            style={{ opacity, ...position }}
            ref={tooltipRef}
            data-element="tooltip"
          >
            <div className={'tooltip__content'}>
              {translatedContent}
              {hasShortcut && !hideShortcut && (
                <span className="tooltip__shortcut">{shortcut}</span>
              )}
            </div>
          </div>,
          document.getElementById('app'),
        )}
    </React.Fragment>
  );
});

Tooltip.displayName = 'Tooltip';
Tooltip.propTypes = propTypes;

export default Tooltip;
