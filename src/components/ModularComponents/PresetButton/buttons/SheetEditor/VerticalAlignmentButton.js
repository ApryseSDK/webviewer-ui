/**
 * A button that aligns cell content to the top.
 * @name alignTopButton
 * @memberof UI.Components.PresetButton
 */

/**
 * A button that aligns cell content to the middle.
 * @name alignMiddleButton
 * @memberof UI.Components.PresetButton
 */

/**
 * A button that aligns cell content to the bottom.
 * @name alignBottomButton
 * @memberof UI.Components.PresetButton
 */

import React from 'react';
import BaseAlignmentButton from './BaseAlignmentButton';
import selectors from 'selectors';
import PropTypes from 'prop-types';

const propTypes = {
  isFlyoutItem: PropTypes.bool,
  alignment: PropTypes.string,
  dataElement: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  alignmentValue: PropTypes.string,
  img: PropTypes.string,
  title: PropTypes.string,
};

const VerticalAlignmentButton = (props, ref) => (
  <BaseAlignmentButton {...props} ref={ref} selector={selectors.getActiveCellRangeVerticalAlignment} />
);

export default React.forwardRef(VerticalAlignmentButton);
VerticalAlignmentButton.displayName = 'VerticalAlignmentButton';
VerticalAlignmentButton.propTypes = propTypes;