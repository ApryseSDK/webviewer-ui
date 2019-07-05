import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Icon from 'components/Icon';

import './Button.scss';

const Button = props => {
  const {
    isDisabled, 
    isActive, 
    mediaQueryClassName, 
    img, 
    label, 
    color, 
    dataElement,
    onClick,
    className
  } = props;

  
  if (isDisabled) {
    return null;
  }
  
  const handleClick = e => onClick(e);
  const buttonClass = classNames({
    Button: true,
    active: isActive,
    inactive: !isActive,
    label,
    icon: !label,
    [mediaQueryClassName]: mediaQueryClassName,
    [className]: className
  });
  const isBase64 = img && img.trim().indexOf('data:') === 0;
  // if there is no file extension then assume that this is a glyph
  const isGlyph = img && (img.indexOf('.') === -1 || img.indexOf('<svg') === 0) && !isBase64;

  return (
    <div className={buttonClass} data-element={dataElement} onClick={handleClick}>
      {isGlyph &&
        <Icon glyph={img} color={color} />
      }
      {img && !isGlyph &&
        <img src={img} />
      }
      {label &&
        <p>{label}</p>
      }
    </div>
  );
};

Button.propTypes = {
  isDisabled: PropTypes.bool,
  isActive: PropTypes.bool,
  mediaQueryClassName: PropTypes.string,
  img: PropTypes.string,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  title: PropTypes.string,
  color: PropTypes.string,
  dataElement: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

export default Button;