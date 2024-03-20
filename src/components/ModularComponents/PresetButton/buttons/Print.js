import { useDispatch, shallowEqual, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { getPresetButtonDOM, menuItems } from '../../Helpers/menuItems';
import { print } from 'helpers/print';
import selectors from 'selectors';
import core from 'core';
import { innerItemToFlyoutItem } from 'helpers/itemToFlyoutHelper';
import { useTranslation } from 'react-i18next';
import { PRESET_BUTTON_TYPES } from 'constants/customizationVariables';

/**
 * A button that prints the document.
 * @name printButton
 * @memberof UI.Components.PresetButton
 */
const PrintButton = (props) => {
  const { isFlyoutItem, iconDOMElement } = props;
  const { label } = menuItems.printButton;
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [
    isEmbedPrintSupported,
    sortStrategy,
    colorMap,
    timezone,
  ] = useSelector(
    (state) => [
      selectors.isEmbedPrintSupported(state),
      selectors.getSortStrategy(state),
      selectors.getColorMap(state),
      selectors.getTimezone(state),
    ],
    shallowEqual,
  );

  const handlePrintButtonClick = () => {
    print(dispatch, isEmbedPrintSupported, sortStrategy, colorMap, { isGrayscale: core.getDocumentViewer().isGrayscaleModeEnabled(), timezone });
  };

  return (
    isFlyoutItem ?
      innerItemToFlyoutItem({
        isDisabled: false,
        icon: iconDOMElement,
        label: t(label),
      }, handlePrintButtonClick)
      :
      getPresetButtonDOM(
        PRESET_BUTTON_TYPES.PRINT,
        false,
        handlePrintButtonClick
      )
  );
};

PrintButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
  iconDOMElement: PropTypes.object,
};

export default PrintButton;