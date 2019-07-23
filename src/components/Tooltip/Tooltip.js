import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { isMac, isIOS, isAndroid } from 'helpers/device';

import './Tooltip.scss';

const Tooltip = props => {
  const {
    t,
    content,
    children
  } = props; 
  const timeoutRef = useRef(null);
  const childRef = useRef(null);
  const tooltipRef = useRef(null);
  const [ show, setShow ] = useState(false);
  const [ opacity, setOpacity ] = useState(0);
  const [ position, setPosition ] = useState({
    top: 0,
    left: 0
  });
  const [ location, setLocation ] = useState('bottom');
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

    if (childRef.current) {
      childRef.current.addEventListener('mouseenter', showToolTip);
      childRef.current.addEventListener('mouseleave', hideTooltip);
      childRef.current.addEventListener('click', hideTooltip);
    }
  }, []);

  useEffect(() => {
    const setTopAndLeft = (childEle, tooltipEle) => {
      const childRect = childEle.getBoundingClientRect();
      const tooltipRect = tooltipEle.getBoundingClientRect();

      const locationTopLeftMap = {
        'bottom': {
          top: childRect.bottom,
          left: childRect.left + childRect.width / 2 - tooltipRect.width / 2
        },
        'left': {
          top: childRect.top + childRect.height / 2 - tooltipRect.height / 2,
          left: childRect.left - tooltipRect.width
        },
        'right': {
          top: childRect.top + childRect.height / 2 - tooltipRect.height / 2,
          left: childRect.right
        },
        'top': {
          top: childRect.top - tooltipRect.height,
          left: childRect.left + childRect.width / 2 - tooltipRect.width / 2
        }
      };

      const bestLocation = Object.keys(locationTopLeftMap).find(location => {
        const { top: newTop, left: newLeft } = locationTopLeftMap[location];

        return newTop > 0 && newTop + tooltipRect.height < window.innerHeight && newLeft > 0 && newLeft + tooltipRect.width < window.innerWidth;
      });

      const { top: tooltipTop, left: tooltipLeft } = locationTopLeftMap[bestLocation];

      setPosition({
        top: tooltipTop,
        left: tooltipLeft
      });
      setLocation(bestLocation);
    };

    if (show) {
      setTopAndLeft(childRef.current, tooltipRef.current);
      setTimeout(() => {
        setOpacity(1);
      }, opacityTimeout);
    } else {
      setOpacity(0);
    }
  }, [ show ]);

  const isUsingMobileDevices = isIOS || isAndroid;
  const child = React.cloneElement(
    children, 
    {
      ref: childRef
    }
  );
  const translatedContent = t(content);
  // If shortcut.xxx exists in translation-en.json file 
  // method t will return the shortcut, otherwise it will return shortcut.xxx
  const hasShortcut = t(`shortcut.${content.split('.')[1]}`).indexOf('.') === -1;
  let shortcut = t(`shortcut.${content.split('.')[1]}`);
  if (isMac) {
    shortcut = shortcut.replace('Ctrl', 'Cmd');
  }

  return (
    <React.Fragment>
      {child}
      {
        show && translatedContent && !isUsingMobileDevices &&
        ReactDOM.createPortal(
          <div className={`tooltip--${location}`} style={{ opacity, ...position }} ref={tooltipRef}>
            <div className={`tooltip__content`}>
              {translatedContent}
              {hasShortcut &&
                <span className="tooltip__shortcut">{shortcut}</span>
              }
            </div>
          </div>,
          document.getElementById('app')
        )
      }
    </React.Fragment>
  );
};

Tooltip.propTypes = {
  children: PropTypes.element.isRequired,
  content: PropTypes.string,
  t: PropTypes.func.isRequired
};

Tooltip.defaultProps = {
  content: '',
};

export default translate(null, { wait: false })(Tooltip);

