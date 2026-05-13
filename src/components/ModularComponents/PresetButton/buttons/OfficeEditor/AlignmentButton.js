import React, { forwardRef } from 'react';
import ActionButton from 'components/ActionButton';
import useCore from 'hooks/useCore';
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
  buttonStyle: PropTypes.object,
  /** @deprecated Use buttonStyle instead. */
  style: PropTypes.object,
  className: PropTypes.string,
  buttonType: PropTypes.string.isRequired,
  img: PropTypes.string,
  title: PropTypes.string,
};

const AlignmentButton = forwardRef((props, ref) => {
  const { core } = useCore();
  const {
    isFlyoutItem,
    alignment,
    buttonStyle,
    className,
    buttonType,
    dataElement = menuItems[buttonType].dataElement,
    img: icon = menuItems[buttonType].icon,
    title = menuItems[buttonType].title,
  } = props;
  const resolvedButtonStyle = buttonStyle ?? props.style;
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
          buttonStyle={resolvedButtonStyle}
          className={className}
        />
      )
  );
});

AlignmentButton.propTypes = propTypes;
AlignmentButton.displayName = 'AlignmentButton';

export default AlignmentButton;