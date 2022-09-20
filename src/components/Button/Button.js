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

const NOOP = e => {
  e?.stopPropagation();
  e?.preventDefault();
};

const propTypes = {
  isActive: PropTypes.bool,
  mediaQueryClassName: PropTypes.string,
  img: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string,
  color: PropTypes.string,
  dataElement: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onMouseUp: PropTypes.func,
  isSubmitType: PropTypes.bool,
  /** Will override translated title if both given. */
  ariaLabel: PropTypes.string,
  role: PropTypes.string,
  hideTooltipShortcut: PropTypes.bool,
  useI18String: PropTypes.bool,
};

const Button = props => {
  const [removeElement, customOverrides = {}] = useSelector(
    state => [
      selectors.isElementDisabled(state, props.dataElement),
      selectors.getCustomElementOverrides(state, props.dataElement),
    ],
    shallowEqual,
  );

  const {
    // old name for disabled. We are keeping it for backwards compatibility
    // should remove in the future .
    disable,
    disabled,
    isActive,
    mediaQueryClassName,
    img,
    tabIndex,
    label,
    useI18String = true,
    color,
    dataElement,
    onClick,
    onDoubleClick,
    onMouseUp,
    className,
    title,
    style,
    ariaLabel,
    role,
    strokeColor,
    fillColor,
    hideTooltipShortcut,
    iconClassName,
    forceTooltipPosition,
    isSubmitType,
    hideOnClick,
  } = { ...props, ...customOverrides };
  const [t] = useTranslation();

  const aLabel = ariaLabel || (title ? t(title) : undefined);

  const shortcutKey = title ? title.slice(title.indexOf('.') + 1) : undefined;
  const ariaKeyshortcuts = shortcutKey ? shortcutAria(shortcutKey) : undefined;

  const isBase64 = img?.trim().startsWith('data:');

  const imgToShow = img;

  // for backwards compatibility
  const actuallyDisabled = disable || disabled;

  // if there is no file extension then assume that this is a glyph
  const isGlyph =
    img && !isBase64 && (!img.includes('.') || img.startsWith('<svg'));
  const shouldRenderTooltip = !!title;
  const children = (
    <button
      className={classNames({
        Button: true,
        active: isActive && !actuallyDisabled,
        disabled: actuallyDisabled,
        [mediaQueryClassName]: mediaQueryClassName,
        [className]: className,
      })}
      style={style}
      data-element={dataElement}
      // Can't use button disabled property here.
      // Because mouse events won't fire and we want them to
      // so that we can show the button tooltip
      onClick={actuallyDisabled ? NOOP : onClick}
      onDoubleClick={actuallyDisabled ? NOOP : onDoubleClick}
      onMouseUp={actuallyDisabled ? NOOP : onMouseUp}
      aria-label={aLabel}
      role={role}
      tabIndex={tabIndex}
      aria-keyshortcuts={ariaKeyshortcuts}
      type={isSubmitType ? 'submit' : 'button'}
      disabled={actuallyDisabled}
    >
      {isGlyph && (
        <Icon
          disabled={actuallyDisabled}
          glyph={imgToShow}
          color={color}
          fillColor={fillColor}
          strokeColor={strokeColor}
          className={iconClassName}
        />
      )}
      {imgToShow && !isGlyph && <img src={imgToShow} />}
      {
        label && (useI18String ?
          <span>{t(label)}</span> :
          <span>{label}</span>)
      }
    </button>
  );

  return removeElement ? null : shouldRenderTooltip ? (
    <Tooltip
      content={title}
      hideShortcut={hideTooltipShortcut || actuallyDisabled}
      forcePosition={forceTooltipPosition}
      hideOnClick={hideOnClick}
      showOnKeyboardFocus
    >
      {children}
    </Tooltip>
  ) : (
    children
  );
};

Button.propTypes = propTypes;

export default React.memo(Button);
