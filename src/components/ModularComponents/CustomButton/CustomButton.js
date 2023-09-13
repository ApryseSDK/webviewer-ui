import React from 'react';
import '../../Button/Button.scss';
import './CustomButton.scss';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Button from 'components/Button';

const CustomButton = (props) => {
  const { title, dataElement, label, img, onClick, disabled, className, preset } = props;

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
      data-element={dataElement}
      onClick={onClick}
      disabled={disabled}
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
