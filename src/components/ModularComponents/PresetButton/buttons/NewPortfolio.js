import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import selectors from 'selectors';
import actions from 'actions';
import DataElements from 'constants/dataElement';
import { getPresetButtonDOM, menuItems } from '../../Helpers/menuItems';
import core from 'core';
import { innerItemToFlyoutItem } from 'helpers/itemToFlyoutHelper';
import { useTranslation } from 'react-i18next';
import { PRESET_BUTTON_TYPES } from 'src/constants/customizationVariables';

/**
 * A button that opens the create portfolio modal.
 * @name createPortfolioButton
 * @memberof UI.Components.PresetButton
 */
const NewPortfolioButton = (props) => {
  const { isFlyoutItem, iconDOMElement } = props;
  const { label } = menuItems.createPortfolioButton;
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const isCreatePortfolioButtonEnabled = !useSelector((state) => selectors.isElementDisabled(state, DataElements.CREATE_PORTFOLIO_BUTTON)) && core.isFullPDFEnabled();

  if (!isCreatePortfolioButtonEnabled) {
    if (isFlyoutItem) {
      return null;
    }
    console.warn('The create portfolio preset button is not available for non-full PDF mode.');
  }

  const handleCreatePortfolioButtonClick = () => {
    dispatch(actions.openElement(DataElements.CREATE_PORTFOLIO_MODAL));
  };

  return (
    isFlyoutItem ?
      innerItemToFlyoutItem({
        isDisabled: !isCreatePortfolioButtonEnabled,
        icon: iconDOMElement,
        label: t(label),
      }, handleCreatePortfolioButtonClick)
      :
      getPresetButtonDOM(PRESET_BUTTON_TYPES.CREATE_PORTFOLIO, !isCreatePortfolioButtonEnabled, handleCreatePortfolioButtonClick)
  );
};

NewPortfolioButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
  iconDOMElement: PropTypes.object,
};

export default NewPortfolioButton;