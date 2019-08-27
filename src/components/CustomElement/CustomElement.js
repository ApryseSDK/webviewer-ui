import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import selectors from 'selectors';

import './CustomElement.scss';

const propTypes = {
  className: PropTypes.string,
  dataElement: PropTypes.string,
  display: PropTypes.string,
  render: PropTypes.func.isRequired,
  mediaQueryClassName: PropTypes.string,
};

const CustomElement = ({
  className = 'CustomElement',
  dataElement,
  display,
  render,
  mediaQueryClassName,
}) => {
  const [reactComponent, setReactComponent] = useState(null);
  const wrapperRef = useRef();
  const isDisabled = useSelector(state => selectors.isElementDisabled(state, dataElement));

  useEffect(() => {
    // currently UI is running in an iframe, and there are two ways a user can add a CustomElement component to the header using setHeaderItems.
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
        wrapperRef.current.appendChild(element);
      } else if (isReactElement(element)) {
        setReactComponent(element);
      } else {
        console.warn(
          'The object returned by the render function does not seem to be either a DOM element or a React Component',
        );
      }
    }
  }, [isDisabled, render]);

  return isDisabled ? null : (
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
};

CustomElement.propTypes = propTypes;

export default CustomElement;
