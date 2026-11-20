import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Icon from 'components/Icon';
import actions from 'actions';
import selectors from 'selectors';
import DataElements from 'constants/dataElement';

const OfficeActionItem = ({
  className,
  dataElement,
  disabled = false,
  img,
  isNotClickableSelector,
  label,
  mediaQueryClassName,
  onClick,
  shouldPassActiveDocumentViewerKeyToOnClickHandler,
  shortcut = '',
  title,
}) => {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const { isElementDisabled, isSelectorDisabled, activeDocumentViewerKey, customOverrides = {} } = useSelector((state) => ({
    isElementDisabled: selectors.isElementDisabled(state, dataElement),
    isSelectorDisabled: isNotClickableSelector?.(state),
    activeDocumentViewerKey: selectors.getActiveDocumentViewerKey(state),
    customOverrides: selectors.getCustomElementOverrides(state, dataElement),
  }), shallowEqual);

  const {
    className: mergedClassName,
    disable,
    disabled: mergedDisabled,
    img: mergedImg,
    label: mergedLabel,
    mediaQueryClassName: mergedMediaQueryClassName,
    onClick: mergedOnClick,
    shortcut: mergedShortcut = '',
    title: mergedTitle,
  } = {
    className,
    dataElement,
    disabled,
    img,
    isNotClickableSelector,
    label,
    mediaQueryClassName,
    onClick,
    shortcut,
    title,
    ...customOverrides,
  };

  const isBase64 = typeof mergedImg === 'string' && mergedImg.trim().startsWith('data:');
  const isGlyph = mergedImg && !isBase64 && (!mergedImg.includes('.') || mergedImg.startsWith('<svg'));
  const actualDisabled = disable || mergedDisabled || !!isSelectorDisabled;
  const visibleText = mergedLabel ?? mergedTitle;

  if (isElementDisabled) {
    return null;
  }

  return (
    <button
      type="button"
      className={classNames('office-action-item', mergedClassName, mergedMediaQueryClassName, { disabled: actualDisabled })}
      disabled={actualDisabled}
      onClick={(e) => {
        if (!actualDisabled && mergedOnClick) {
          if (shouldPassActiveDocumentViewerKeyToOnClickHandler) {
            mergedOnClick(activeDocumentViewerKey);
          } else {
            mergedOnClick(dispatch);
          }
          dispatch(actions.closeElement(DataElements.CONTEXT_MENU_POPUP));
        }
        // prevent bubbling up click event to control when context menu is closed within this component
        e.stopPropagation();
      }}
      data-element={dataElement}
    >
      <div className="icon-title">
        {mergedImg && isGlyph && <Icon glyph={mergedImg} disabled={actualDisabled} />}
        {mergedImg && !isGlyph && <img src={mergedImg} alt="" />}
        {!mergedImg && <span className="Icon"></span>}
        <div>{visibleText ? t(visibleText) : ''}</div>
      </div>
      <div className="shortcut">{mergedShortcut}</div>
    </button>
  );
};

OfficeActionItem.propTypes = {
  className: PropTypes.string,
  dataElement: PropTypes.string,
  disabled: PropTypes.bool,
  img: PropTypes.string,
  isNotClickableSelector: PropTypes.func,
  label: PropTypes.string,
  mediaQueryClassName: PropTypes.string,
  onClick: PropTypes.func,
  shouldPassActiveDocumentViewerKeyToOnClickHandler: PropTypes.bool,
  shortcut: PropTypes.string,
  title: PropTypes.string,
};

export default React.memo(OfficeActionItem);
