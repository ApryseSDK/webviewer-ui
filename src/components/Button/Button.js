import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import Tooltip from 'components/Tooltip';
import Icon from 'components/Icon';
import { shortcutAria } from 'helpers/hotkeysManager';

import selectors from 'selectors';

import './Button.scss';

const propTypes = {
  isNotClickable: PropTypes.bool,
  isActive: PropTypes.bool,
  mediaQueryClassName: PropTypes.string,
  img: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string,
  color: PropTypes.string,
  dataElement: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  /** Will override translated title if both given. */
  ariaLabel: PropTypes.string,
};

const NOOP = () => {};

const Button = props => {
  const [removeElement, customOverrides = {}] = useSelector(
    state => [
      selectors.isElementDisabled(state, props.dataElement),
      selectors.getCustomElementOverrides(state, props.dataElement),
    ],
    shallowEqual,
  );

  const {
    disabled,
    isNotClickable,
    isActive,
    mediaQueryClassName,
    img,
    label,
    color,
    dataElement,
    onClick = NOOP,
    className,
    title,
    style,
    ariaLabel,
  } = { ...props, ...customOverrides };
  const [t] = useTranslation();

  const aLabel = ariaLabel || title ? t(title) : undefined;

  const shortcutKey = title ? title.slice(title.indexOf('.') + 1) : undefined;
  const ariaKeyshortcuts = shortcutKey ? shortcutAria(shortcutKey) : undefined;

  const isBase64 = img?.trim().startsWith('data:');

  const imgToShow = img;

  // if there is no file extension then assume that this is a glyph
  const isGlyph =
    img && !isBase64 && (!img.includes('.') || img.startsWith('<svg'));
  const shouldRenderTooltip = title;
  const children = (
    <button
      className={classNames({
        Button: true,
        active: isActive,
        disable: isNotClickable,
        [mediaQueryClassName]: mediaQueryClassName,
        [className]: className,
      })}
      disabled={disabled}
      style={style}
      data-element={dataElement}
      onClick={(!disabled && !isNotClickable) ? onClick : NOOP}
      aria-label={aLabel}
      aria-keyshortcuts={ariaKeyshortcuts}
    >
      {isGlyph && <Icon glyph={imgToShow} color={color} />}
      {imgToShow && !isGlyph && <img src={imgToShow} />}
      {label && <p>{label}</p>}
    </button>
  );

  return removeElement ? null : shouldRenderTooltip ? (
    <Tooltip content={title} hideShortcut={disabled}>{children}</Tooltip>
  ) : (
    children
  );
};

Button.propTypes = propTypes;

export default React.memo(Button);
