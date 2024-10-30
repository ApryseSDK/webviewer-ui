import React, { forwardRef } from 'react';
import ActionButton from 'components/ActionButton';
import core from 'core';
import { useSelector, shallowEqual } from 'react-redux';
import selectors from 'selectors';
import PropTypes from 'prop-types';
import { JUSTIFICATION_OPTIONS } from 'constants/officeEditor';
import FlyoutItemContainer from '../../../FlyoutItemContainer';
import { menuItems } from '../../../Helpers/menuItems';

const propTypes = {
  justificationType: PropTypes.oneOf(Object.values(JUSTIFICATION_OPTIONS)).isRequired,
  isFlyoutItem: PropTypes.bool,
};

const JustificationButton = forwardRef((props, ref) => {
  const { isFlyoutItem, justificationType } = props;
  const [
    isActive,
  ] = useSelector(
    (state) => [
      selectors.isJustificationButtonActive(state, justificationType),
    ],
    shallowEqual,
  );

  const capitalizedJustificationType = justificationType.charAt(0).toUpperCase() + justificationType.slice(1);
  const { dataElement, icon, title } = menuItems[`justify${capitalizedJustificationType}Button`];

  const handleClick = () => {
    core.getOfficeEditor().updateParagraphStyle({
      justification: justificationType
    });
  };

  return (
    isFlyoutItem ?
      <FlyoutItemContainer {...props} ref={ref} onClick={handleClick} />
      : (
        <ActionButton
          ariaCurrent={isActive}
          isActive={isActive}
          dataElement={dataElement}
          title={title}
          img={icon}
          onClick={handleClick}
        />
      )
  );
});

JustificationButton.propTypes = propTypes;
JustificationButton.displayName = 'JustificationButton';

export default JustificationButton;