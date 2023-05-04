import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import Tooltip from 'components/Tooltip';
import selectors from 'selectors';

const propTypes = {
  className: PropTypes.string,
  dataElement: PropTypes.string,
  display: PropTypes.string,
  render: PropTypes.func.isRequired,
  getProps: PropTypes.func,
  mount: PropTypes.func,
  unmount: PropTypes.func,
  mediaQueryClassName: PropTypes.string,
  title: PropTypes.string,
  renderTitle: PropTypes.func,
  dataElementDivProps: PropTypes.object,
};

const isReactElement = element => React.isValidElement(element);

const isDOMElement = element => {
  try {
    return element instanceof window.Element || element instanceof window.parent.Element;
  } catch (e) {
    return false;
  }
};

const CustomElement = ({
  className = 'CustomStatefulElement',
  dataElement,
  display,
  render,
  mount,
  unmount,
  mediaQueryClassName,
  title,
  renderTitle,
  dataElementDivProps,
}) => {
  const [reactComponent, setReactComponent] = useState(null);
  const [tooltip, setTooltip] = useState(title);
  const wrapperRef = useRef();
  const toolTipWrapperRef = useRef();

  const isDisabled = useSelector(state => selectors.isElementDisabled(state, dataElement));
  const isDisabledRef = useRef(isDisabled ?? true);
  useEffect(() => {
    isDisabledRef.current = isDisabled ?? true;
  }, [isDisabled]);

  const onRender = useCallback(
    (isDisabled, props) => {
      if (!isDisabled) {
        return;
      }

      const element = render(props);
      if (renderTitle && props) {
        setTooltip(renderTitle(props));
      } else {
        setTooltip(title);
      }

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
    },
    [render, renderTitle],
  );

  const update = useCallback(
    props => {
      onRender(isDisabledRef.current, props);
    },
    [onRender],
  );

  useEffect(() => {
    update();
  }, [update]);

  useEffect(() => {
    unmount && unmount();
    mount && mount(update);
    return () => {
      unmount && unmount();
    };
  }, [update, mount, unmount]);

  if (isDisabled || !reactComponent) {
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
      {...dataElementDivProps}
    >
      {reactComponent}
    </div>
  );

  return tooltip ? (
    <Tooltip content={tooltip} ref={toolTipWrapperRef} showOnKeyboardFocus>
      {children}
    </Tooltip>
  ) : (
    children
  );
};

CustomElement.propTypes = propTypes;

export default CustomElement;
