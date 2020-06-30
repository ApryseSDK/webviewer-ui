import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import Tooltip from 'components/Tooltip';
import selectors from 'selectors';

import './CustomElement.scss';

const propTypes = {
  className: PropTypes.string,
  dataElement: PropTypes.string,
  display: PropTypes.string,
  render: PropTypes.func.isRequired,
  mediaQueryClassName: PropTypes.string,
  title: PropTypes.string,
};

const CustomElement = ({
  className = 'CustomElement',
  dataElement,
  display,
  render,
  mediaQueryClassName,
  title,
}) => {
  const [reactComponent, setReactComponent] = useState(null);
  const wrapperRef = useRef();
  const toolTipWrapperRef = useRef();
  const isDisabled = useSelector(state => selectors.isElementDisabled(state, dataElement));

  useEffect(() => {
    // currently UI is running in an iframe, and there are two ways an user can add a CustomElement component to the header using setHeaderItems.
    // one way is in a config file. This way the element created by document.createElement() is an instanceof window.Element but not window.parent.Element since
    // code inside the config is running inside the iframe and window.parent is the iframe
    // the other way is calling setHeaderItems and creating elements outside the iframe. This way the element is an instanceof window.parent.Element, not window.Element
    const isDOMElement = element => {
      try {
        return (
          element instanceof window.Element ||
          element instanceof window.parent.Element
        );
      } catch (e) {
        return false;
      }
    };

    const isReactElement = element => React.isValidElement(element);

    if (!isDisabled) {
      const element = render();

      if (isDOMElement(element)) {
        const wrapperElement = toolTipWrapperRef.current ? toolTipWrapperRef.current : wrapperRef.current;

        while (wrapperElement.firstChild) {
          wrapperElement.removeChild(wrapperElement.firstChild);
        }
        wrapperElement.appendChild(element);
      } else if (isReactElement(element)) {
        setReactComponent(element);
      } else {
        console.warn(
          'The object returned by the render function does not seem to be either a DOM element or a React Component',
        );
      }
    }
  }, [isDisabled, render]);

  if (isDisabled) {
    return null;
  }

  const children = (
    <div
      className={classNames({
        [className]: !!className,
        [mediaQueryClassName]: !!mediaQueryClassName,
      })}
      ref={wrapperRef}
      data-element={dataElement}
      style={{ display }}
    >
      {reactComponent}
    </div>
  );

  return title ? (<Tooltip content={title} ref={toolTipWrapperRef}>{children}</Tooltip>) : children;
};

CustomElement.propTypes = propTypes;

export default CustomElement;
