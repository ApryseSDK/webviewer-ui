import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'components/Dropdown';
import core from 'core';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import classNames from 'classnames';
import selectors from 'selectors';
import actions from 'actions';

import './FontFaceDropdown.scss';

const propTypes = {
  isFlyoutItem: PropTypes.bool,
  activeFlyout: PropTypes.string,
  onKeyDownHandler: PropTypes.func,
};

const FontFaceDropdown = (props) => {
  const { isFlyoutItem, activeFlyout } = props;
  const dispatch = useDispatch(props);
  const [
    cursorProperties,
    availableFontFaces,
    cssFontValues,
    currentFontFace,
    customizableUI,
  ] = useSelector(
    (state) => [
      selectors.getOfficeEditorCursorProperties(state),
      selectors.getAvailableFontFaces(state),
      selectors.getCSSFontValues(state),
      selectors.getCurrentFontFace(state),
      selectors.getFeatureFlags(state)?.customizableUI,
    ],
    shallowEqual
  );

  useEffect(() => {
    if (cursorProperties.fontFace && !availableFontFaces.includes(cursorProperties.fontFace)) {
      dispatch(actions.addOfficeEditorAvailableFontFace(cursorProperties.fontFace));
    }
  }, [availableFontFaces, cursorProperties]);

  return (
    <Dropdown
      id="office-editor-font-face-dropdown"
      className={classNames({
        'OfficeEditorFontFaceDropdown': true,
        'text-left': true,
        'flyout-item': isFlyoutItem,
        'modular-ui': customizableUI,
      })}
      items={availableFontFaces}
      onClickItem={async (fontFace) => {
        if (typeof fontFace === 'string') {
          await core.getOfficeEditor().updateSelectionAndCursorStyle({ fontFace });
        }
        if (activeFlyout) {
          dispatch(actions.closeElement(activeFlyout));
        }
      }}
      getCustomItemStyle={(item) => ({ ...cssFontValues[item] })}
      maxHeight={500}
      customDataValidator={(font) => availableFontFaces.includes(font)}
      width={180}
      dataElement="office-editor-font"
      currentSelectionKey={currentFontFace}
      hasInput
      showLabelInList={true}
      translationPrefix="officeEditor.fontFamily"
      isFlyoutItem={isFlyoutItem}
      onKeyDownHandler={props.onKeyDownHandler}
    />
  );
};

FontFaceDropdown.propTypes = propTypes;

export default FontFaceDropdown;