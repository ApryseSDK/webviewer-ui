import React from 'react';
import Dropdown from 'components/Dropdown';
import core from 'core';
import { DEFAULT_POINT_SIZE, FONT_SIZE, AVAILABLE_POINT_SIZES } from 'constants/officeEditor';
import { useSelector, shallowEqual } from 'react-redux';
import selectors from 'selectors';

const FontSizeDropdown = () => {
  const [
    pointSizeSelectionKey,
  ] = useSelector(
    (state) => [
      selectors.getPointSizeSelectionKey(state),
    ],
    shallowEqual
  );

  return (
    <Dropdown
      className="text-left"
      items={AVAILABLE_POINT_SIZES}
      onClickItem={(pointSize) => {
        let fontPointSize = parseInt(pointSize, 10);

        if (isNaN(fontPointSize)) {
          fontPointSize = DEFAULT_POINT_SIZE;
        }

        if (fontPointSize > FONT_SIZE.MAX) {
          fontPointSize = FONT_SIZE.MAX;
        } else if (fontPointSize < FONT_SIZE.MIN) {
          fontPointSize = FONT_SIZE.MIN;
        }
        core.getOfficeEditor().updateSelectionAndCursorStyle({ pointSize: fontPointSize });
      }}
      currentSelectionKey={pointSizeSelectionKey}
      width={80}
      dataElement="office-editor-font-size"
      hasInput
      isSearchEnabled={false}
      showLabelInList={true}
      translationPrefix="officeEditor.fontSize"
    />
  );
};

export default FontSizeDropdown;