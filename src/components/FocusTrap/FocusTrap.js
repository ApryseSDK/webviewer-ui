import React, { cloneElement, forwardRef } from 'react';
import PropTypes from 'prop-types';
import useFocusTrap from '../../hooks/useFocusTrap';

const propTypes = {
  locked: PropTypes.bool,
  focusLastOnUnlock: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  children: PropTypes.element.isRequired,
};

const FocusTrap = forwardRef(({ locked, focusLastOnUnlock, children }, ref) => {
  const internalRef = useFocusTrap(locked, { focusLastOnUnlock, overrideRef: ref });
  if (!React.isValidElement(children)) {
    console.warn('FocusTrap expects a single valid React element as its child.');
    return null;
  }
  return cloneElement(children, { ref: internalRef });
});

FocusTrap.propTypes = propTypes;
FocusTrap.displayName = 'FocusTrap';
export default FocusTrap;