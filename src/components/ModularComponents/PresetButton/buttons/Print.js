import React, { forwardRef } from 'react';
import { useDispatch, shallowEqual, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { getPresetButtonDOM } from '../../Helpers/menuItems';
import { print } from 'helpers/print';
import selectors from 'selectors';
import core from 'core';
import { PRESET_BUTTON_TYPES } from 'constants/customizationVariables';
import useFocusHandler from 'hooks/useFocusHandler';
import FlyoutItemContainer from '../../FlyoutItemContainer';

/**
 * A button that prints the document.
 * @name printButton
 * @memberof UI.Components.PresetButton
 */
const PrintButton = forwardRef((props, ref) => {
  const { isFlyoutItem } = props;
  const dispatch = useDispatch();

  const [
    useClientSidePrint,
    isEmbedPrintSupported,
    sortStrategy,
    colorMap,
    timezone,
  ] = useSelector(
    (state) => [
      selectors.useClientSidePrint(state),
      selectors.isEmbedPrintSupported(state),
      selectors.getSortStrategy(state),
      selectors.getColorMap(state),
      selectors.getTimezone(state),
    ],
    shallowEqual,
  );

  const handlePrint = () => {
    print(dispatch, useClientSidePrint, isEmbedPrintSupported, sortStrategy, colorMap, { isGrayscale: core.getDocumentViewer().isGrayscaleModeEnabled(), timezone });
  };

  const handlePrintButtonClick = useFocusHandler(handlePrint);

  return (
    isFlyoutItem ?
      <FlyoutItemContainer {...props} ref={ref} onClick={handlePrintButtonClick} />
      :
      getPresetButtonDOM(
        PRESET_BUTTON_TYPES.PRINT,
        false,
        handlePrintButtonClick
      )
  );
});

PrintButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
};
PrintButton.displayName = 'PrintButton';

export default PrintButton;