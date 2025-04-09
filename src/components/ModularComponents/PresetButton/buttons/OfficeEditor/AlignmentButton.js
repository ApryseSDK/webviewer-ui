import React, { forwardRef } from 'react';
import ActionButton from 'components/ActionButton';
import core from 'core';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import PropTypes from 'prop-types';
import { JUSTIFICATION_OPTIONS } from 'constants/officeEditor';
import FlyoutItemContainer from '../../../FlyoutItemContainer';
import { menuItems } from '../../../Helpers/menuItems';
import { PRESET_BUTTON_TYPES } from 'src/constants/customizationVariables';

const propTypes = {
  alignmentType: PropTypes.oneOf(Object.values(JUSTIFICATION_OPTIONS)).isRequired,
  isFlyoutItem: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
};

const AlignmentButton = forwardRef((props, ref) => {
  const { isFlyoutItem, alignmentType, style, className } = props;
  const isActive = useSelector((state) => selectors.isJustificationButtonActive(state, alignmentType));

  const capitalizedJustificationType = alignmentType.charAt(0).toUpperCase() + alignmentType.slice(1);
  let key = `align${capitalizedJustificationType}Button`;
  if (alignmentType === JUSTIFICATION_OPTIONS.Both) {
    key = PRESET_BUTTON_TYPES.JUSTIFY_BOTH;
  }
  const { dataElement, icon, title } = menuItems[key];

  const handleClick = () => {
    core.getOfficeEditor().updateParagraphStyle({
      justification: alignmentType
    });
  };

  return (
    isFlyoutItem ?
      <FlyoutItemContainer
        {...props}
        ref={ref}
        onClick={handleClick}
        additionalClass={isActive ? 'active' : ''}
      />
      : (
        <ActionButton
          ariaCurrent={isActive}
          isActive={isActive}
          dataElement={dataElement}
          title={title}
          img={icon}
          onClick={handleClick}
          style={style}
          className={className}
        />
      )
  );
});

AlignmentButton.propTypes = propTypes;
AlignmentButton.displayName = 'AlignmentButton';

export default AlignmentButton;