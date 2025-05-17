import React, { forwardRef } from 'react';
import ActionButton from 'components/ActionButton';
import core from 'core';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import PropTypes from 'prop-types';
import { JUSTIFICATION_OPTIONS } from 'constants/officeEditor';
import FlyoutItemContainer from '../../../FlyoutItemContainer';
import { menuItems } from '../../../Helpers/menuItems';

const propTypes = {
  alignment: PropTypes.oneOf(Object.values(JUSTIFICATION_OPTIONS)).isRequired,
  isFlyoutItem: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
  buttonType: PropTypes.string.isRequired,
};

const AlignmentButton = forwardRef((props, ref) => {
  const { isFlyoutItem, alignment, style, className, buttonType } = props;
  const isActive = useSelector((state) => selectors.isJustificationButtonActive(state, alignment));

  const { dataElement, icon, title } = menuItems[buttonType];

  const handleClick = () => {
    core.getOfficeEditor().updateParagraphStyle({
      justification: alignment
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