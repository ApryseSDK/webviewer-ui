import React, { useEffect } from 'react';
import Dropdown from 'components/Dropdown';
import core from 'core';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';

const FontFaceDropdown = () => {
  const dispatch = useDispatch();
  const [
    cursorProperties,
    availableFontFaces,
    cssFontValues,
    currentFontFace,
  ] = useSelector(
    (state) => [
      selectors.getOfficeEditorCursorProperties(state),
      selectors.getAvailableFontFaces(state),
      selectors.getCSSFontValues(state),
      selectors.getCurrentFontFace(state),
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
      className="text-left"
      items={availableFontFaces}
      onClickItem={async (fontFace) => {
        if (typeof fontFace === 'string') {
          await core.getOfficeEditor().updateSelectionAndCursorStyle({ fontFace });
        }
      }}
      getCustomItemStyle={(item) => ({ ...cssFontValues[item] })}
      maxHeight={500}
      customDataValidator={(font) => availableFontFaces.includes(font)}
      width={160}
      dataElement="office-editor-font"
      currentSelectionKey={currentFontFace}
      hasInput
      showLabelInList={true}
      translationPrefix="officeEditor.fontFamily"
    />
  );
};

export default FontFaceDropdown;