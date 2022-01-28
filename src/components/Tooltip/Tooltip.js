import React, { useState, useRef, useEffect, useLayoutEffect, forwardRef, useImperativeHandle } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

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

  const tooltipRef = useRef(null);
  const [show, setShow] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });
  const [location, setLocation] = useState('bottom');
  const [t] = useTranslation();
  const delayShow = 700;
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
      const bestLocation = Object.keys(locationTopLeftMap).find(location => {
        if (forcePosition) {
          return location === forcePosition;
        } else {
          const { top: newTop, left: newLeft } = locationTopLeftMap[location];

          return (
            newTop > 0
            && newTop + tooltipRect.height < window.innerHeight
            && newLeft > 0
            && newLeft + tooltipRect.width < window.innerWidth
          );
        }
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
  const hasShortcut = t(`shortcut.${shortcutKey}`).indexOf('.') === -1;
  let shortcut = t(`shortcut.${shortcutKey}`);
  if (isMac) {
    shortcut = shortcut.replace('Ctrl', 'Cmd');
  }

  return (
    <React.Fragment>
      {child}
      {show
        && translatedContent
        && !isUsingMobileDevices
        && ReactDOM.createPortal(
          <div
            className={`tooltip--${location}`}
            style={{ opacity, ...position }}
            ref={tooltipRef}
          >
            <div className={`tooltip__content`}>
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

Tooltip.propTypes = propTypes;

export default Tooltip;
