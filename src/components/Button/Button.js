import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Tooltip from 'components/Tooltip';
import Icon from 'components/Icon';

import selectors from 'selectors';

import './Button.scss';

const propTypes = {
  isActive: PropTypes.bool,
  mediaQueryClassName: PropTypes.string,
  img: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string,
  color: PropTypes.string,
  dataElement: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

const Button = props => {
  const [isElementDisabled, customOverrides = {}] = useSelector(state => [
    selectors.isElementDisabled(state, props.dataElement),
    selectors.getCustomElementOverrides(state, props.dataElement),
  ], shallowEqual);

  props = { ...props, ...customOverrides };
  const {
    isActive,
    mediaQueryClassName,
    img,
    label,
    color,
    dataElement,
    onClick = () => {},
    className,
    title,
  } = props;

  const buttonClass = classNames({
    Button: true,
    active: isActive,
    [mediaQueryClassName]: mediaQueryClassName,
    [className]: className,
  });
  const isBase64 = img && img.trim().indexOf('data:') === 0;
  // if there is no file extension then assume that this is a glyph
  const isGlyph =
    img && !isBase64 && (img.indexOf('.') === -1 || img.indexOf('<svg') === 0);

  let content;
  if (isGlyph) {
    content = <Icon glyph={img} color={color} />;
  } else if (img) {
    content = <img src={img} />;
  } else if (label) {
    content = <div>{label}</div>;
  }


  const children = (
    <div
      className={buttonClass}
      data-element={dataElement}
      onClick={onClick}
    >
      {content}
    </div>
  );

  return isElementDisabled ? null : title ? (
    <Tooltip content={title}>{children}</Tooltip>
  ) : (
    children
  );
};

Button.propTypes = propTypes;

export default React.memo(Button);
