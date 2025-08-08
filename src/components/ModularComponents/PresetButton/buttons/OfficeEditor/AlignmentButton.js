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
  dataElement: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  buttonType: PropTypes.string.isRequired,
  img: PropTypes.string,
  title: PropTypes.string,
};

const AlignmentButton = forwardRef((props, ref) => {
  const {
    isFlyoutItem,
    alignment,
    style,
    className,
    buttonType,
    dataElement = menuItems[buttonType].dataElement,
    img: icon = menuItems[buttonType].icon,
    title = menuItems[buttonType].title,
  } = props;
  const isActive = useSelector((state) => selectors.isJustificationButtonActive(state, alignment));

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