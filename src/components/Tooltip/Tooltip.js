import React, { useState, useRef, useEffect, useLayoutEffect, forwardRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { isMac, isIOS, isAndroid } from 'helpers/device';

import './Tooltip.scss';

const propTypes = {
  children: PropTypes.element.isRequired,
  content: PropTypes.string,
};

const Tooltip = forwardRef( ({ content = '', children }, forwardedRef) => {
  const timeoutRef = useRef(null);
  const childRef = forwardedRef ? forwardedRef : useRef(null);

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
    childRef.current?.addEventListener('click', hideTooltip);
  }, [childRef]);

  useLayoutEffect(() => {
    const childEle = childRef.current;
    const tooltipEle = tooltipRef.current;

    const setTopAndLeft = () => {
      const childRect = childEle.getBoundingClientRect();
      const tooltipRect = tooltipEle.getBoundingClientRect();

      const locationTopLeftMap = {
        bottom: {
          top: childRect.bottom,
          left: childRect.left + childRect.width / 2 - tooltipRect.width / 2,
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
  const shortcutKey = content.slice(content.indexOf('.') + 1);
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
              {hasShortcut && (
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
