import React from 'react';
import '../Button.scss';
import './CustomButton.scss';
import PropTypes from 'prop-types';
import Button from 'components/Button';

const CustomButton = (props) => {
  const { title, dataElement, label, img, onClick, disabled } = props;
  return (
    <Button
      className="CustomButton Button"
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
