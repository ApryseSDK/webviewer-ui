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
  const {
    isFlyoutItem,
    dataElement,
    className,
    style,
    img: icon,
    title
  } = props;
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
      getPresetButtonDOM({
        buttonType: PRESET_BUTTON_TYPES.CREATE_PORTFOLIO,
        isDisabled: !isCreatePortfolioButtonEnabled,
        onClick: handleCreatePortfolioButtonClick,
        dataElement,
        className,
        style,
        icon,
        title,
      })
  );
});

NewPortfolioButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
  dataElement: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  img: PropTypes.string,
  title: PropTypes.string,
};
NewPortfolioButton.displayName = 'NewPortfolioButton';

export default NewPortfolioButton;