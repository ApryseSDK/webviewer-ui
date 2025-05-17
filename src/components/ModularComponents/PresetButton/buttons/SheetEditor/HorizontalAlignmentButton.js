import React from 'react';
import BaseAlignmentButton from './BaseAlignmentButton';
import selectors from 'selectors';

const HorizontalAlignmentButton = (props, ref) => (
  <BaseAlignmentButton {...props} ref={ref} selector={selectors.getActiveCellRangeHorizontalAlignment} />
);

export default React.forwardRef(HorizontalAlignmentButton);