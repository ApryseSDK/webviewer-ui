import React, { forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import selectors from 'selectors';
import actions from 'actions';
import DataElements from 'constants/dataElement';
import { getPresetButtonDOM } from '../../Helpers/menuItems';
import core from 'core';
import { PRESET_BUTTON_TYPES } from 'src/constants/customizationVariables';
import FlyoutItemContainer from '../../FlyoutItemContainer';
import useFocusHandler from 'hooks/useFocusHandler';

/**
 * A button that opens the create portfolio modal.
 * @name createPortfolioButton
 * @memberof UI.Components.PresetButton
 */
const NewPortfolioButton = forwardRef((props, ref) => {
  const { isFlyoutItem } = props;
  const dispatch = useDispatch();

  const isCreatePortfolioButtonEnabled = !useSelector((state) => selectors.isElementDisabled(state, DataElements.CREATE_PORTFOLIO_BUTTON)) && core.isFullPDFEnabled();

  const handleCreatePortfolioButtonClick = useFocusHandler(() => {
    dispatch(actions.openElement(DataElements.CREATE_PORTFOLIO_MODAL));
  });

  if (!isCreatePortfolioButtonEnabled) {
    if (isFlyoutItem) {
      return null;
    }
    console.warn('The create portfolio preset button is not available for non-full PDF mode.');
  }

  return (
    isFlyoutItem ?
      <FlyoutItemContainer {...props} ref={ref} onClick={handleCreatePortfolioButtonClick} />
      :
      getPresetButtonDOM(PRESET_BUTTON_TYPES.CREATE_PORTFOLIO, !isCreatePortfolioButtonEnabled, handleCreatePortfolioButtonClick)
  );
});

NewPortfolioButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
};
NewPortfolioButton.displayName = 'NewPortfolioButton';

export default NewPortfolioButton;