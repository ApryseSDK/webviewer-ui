import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import Tooltip from 'components/Tooltip';
import selectors from 'selectors';

import './CustomElement.scss';
import { css } from '@emotion/react';

const propTypes = {
  className: PropTypes.string,
  dataElement: PropTypes.string,
  display: PropTypes.string,
  render: PropTypes.func.isRequired,
  renderArguments: PropTypes.array,
  mediaQueryClassName: PropTypes.string,
  title: PropTypes.string,
  style: PropTypes.object,
};

const CustomElement = ({
  className = 'CustomElement',
  dataElement,
  display,
  render,
  renderArguments,
  mediaQueryClassName,
  title,
  style,
}) => {
  const [reactComponent, setReactComponent] = useState(null);
  const wrapperRef = useRef();
  const toolTipWrapperRef = useRef();
  const isDisabled = useSelector((state) => selectors.isElementDisabled(state, dataElement));

  useEffect(() => {
    const isDOMElement = (element) => {
      try {
        return (
          element instanceof window.Element ||
          element instanceof window.parent.Element
        );
      } catch (e) {
        return false;
      }
    };

    const isReactElement = (element) => React.isValidElement(element);

    if (!isDisabled) {
      const element = (renderArguments) ? render(...renderArguments) : render();
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
  }, [isDisabled, render, renderArguments]);

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
      css={css({ display, ...style })}
    >
      {reactComponent}
    </div>
  );

  return title ? (<Tooltip content={title} ref={toolTipWrapperRef}>{children}</Tooltip>) : children;
};

CustomElement.propTypes = propTypes;

export default CustomElement;
