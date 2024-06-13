import React from 'react';
import '../../Button/Button.scss';
import './CustomButton.scss';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import { PLACEMENT } from 'constants/customizationVariables';

const CustomButton = (props) => {
  const { title, dataElement, label, img, onClick, disabled, className, preset, headerPlacement, ariaLabel } = props;
  let forceTooltipPosition;
  if ([PLACEMENT.LEFT, PLACEMENT.RIGHT].includes(headerPlacement)) {
    forceTooltipPosition = headerPlacement === PLACEMENT.LEFT ? PLACEMENT.RIGHT : PLACEMENT.LEFT;
  } else if ([PLACEMENT.TOP, PLACEMENT.BOTTOM].includes(headerPlacement)) {
    forceTooltipPosition = headerPlacement === PLACEMENT.TOP ? PLACEMENT.BOTTOM : PLACEMENT.TOP;
  }
  return (
    <Button
      className={classNames({
        'CustomButton': true,
        'Button': true,
        [className]: className,
        'confirm-button': preset === 'confirm',
        'cancel-button': preset === 'cancel'
      })}
      img={img}
      label={label}
      title={title}
      dataElement={dataElement}
      onClick={onClick}
      disabled={disabled}
      forceTooltipPosition={forceTooltipPosition}
      ariaLabel={ariaLabel}
    ></Button>
  );
};

CustomButton.propTypes = {
  dataElement: PropTypes.string,
  title: PropTypes.string,
  label: PropTypes.string,
  img: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export default CustomButton;
