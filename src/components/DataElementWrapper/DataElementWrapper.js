import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';

const propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
  dataElement: PropTypes.string,
  type: PropTypes.string,
  wrapperStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.string,
  ]),
  css: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.func,
    PropTypes.string,
  ]),
  /** @deprecated Use wrapperStyle (or css) instead. */
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.string,
  ]),
  /** Accessibility */
  ariaLabel: PropTypes.string,
};

/*
 * Custom hook that makes sure we can use this component in unit tests and storybook easier. If Redux context is not available, it will
 * return defaultValue given, which is false by default. If redux context is available like in normal case, it will get the value
 * from redux store.
 */
function useIsDisabledWithDefaultValue(selector, defaultValue = false) {
  try {
    return useSelector(selector);
  } catch (e) {
    if (e.message !== 'could not find react-redux context value; please ensure the component is wrapped in a <Provider>') {
      // If error don't throw it, just return default value, or we break chromatic tests
      // throw e;
    }
  }
  return defaultValue;
}

const DataElementWrapper = React.forwardRef(({
  type = 'div',
  children,
  dataElement,
  ariaLabel,
  wrapperStyle,
  style: legacyStyle,
  css: componentCss,
  ...props
}, ref) => {
  const isDisabled = useIsDisabledWithDefaultValue((state) => selectors.isElementDisabled(state, dataElement));
  if (isDisabled) {
    return null;
  }

  // Convert legacy inline style usage into emotion css and keep style off the DOM.
  const cssProps = [legacyStyle, wrapperStyle, componentCss].filter(Boolean);
  const css = cssProps.length <= 1 ? cssProps[0] : cssProps;

  if (type === 'button') {
    return (
      <button ref={ref} data-element={dataElement} aria-label={ariaLabel} css={css} {...props}>
        {children}
      </button>
    );
  }

  return (
    <div ref={ref} data-element={dataElement} css={css} {...props}>
      {children}
    </div>
  );
});

DataElementWrapper.displayName = 'DataElementWrapper';
DataElementWrapper.propTypes = propTypes;

export default DataElementWrapper;
