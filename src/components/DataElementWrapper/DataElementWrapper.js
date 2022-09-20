import PropTypes, { oneOfType } from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';

const propTypes = {
  children: PropTypes.node,
  dataElement: PropTypes.string,
  type: PropTypes.string,
  /** Set tab index if type != "button" */
  tabbable: oneOfType([PropTypes.bool, PropTypes.number]),
  onClick: PropTypes.func,
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
      throw e;
    }
  }
  return defaultValue;
}

const DataElementWrapper = React.forwardRef(({ tabbable = false, type = "div", children, dataElement, ...props }, ref) => {
  const isDisabled = useIsDisabledWithDefaultValue(state => selectors.isElementDisabled(state, dataElement));
  if (isDisabled) {
    return null;
  }

  const tabIndex = tabbable ? (typeof tabbable === "number" ? tabbable : 0) : undefined;

  if (type === 'button') {
    return (
      <button tabIndex={tabIndex} ref={ref} data-element={dataElement} {...props}>
        {children}
      </button>
    );
  }

  const onKeyPress = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      props.onClick(e);
    }
  };
  
  return (
    <div
      tabIndex={tabIndex}
      ref={ref}
      data-element={dataElement}
      role="button"
      onKeyDown={tabbable ? onKeyPress : undefined}
      {...props}
    >
      {children}
    </div>
  );
});

DataElementWrapper.propTypes = propTypes;
export default DataElementWrapper;
