import React from 'react';
import Dropdown from 'components/Dropdown';
import core from 'core';
import { useSelector, shallowEqual } from 'react-redux';
import selectors from 'selectors';
import { AVAILABLE_STYLE_PRESET_MAP } from 'constants/officeEditor';
import { COMMON_COLORS } from 'constants/commonColors';

const StylePresetDropdown = () => {
  const [
    cursorStyleToPreset
  ] = useSelector(
    (state) => [
      selectors.getCursorStyleToPreset(state, AVAILABLE_STYLE_PRESET_MAP, COMMON_COLORS),
    ],
    shallowEqual
  );

  return (
    <Dropdown
      className="text-left"
      items={Object.keys(AVAILABLE_STYLE_PRESET_MAP)}
      onClickItem={async (item) => {
        const stylePreset = AVAILABLE_STYLE_PRESET_MAP[item];
        const fontPointSize = parseInt(stylePreset.fontSize, 10);
        const fontColor = new window.Core.Annotations.Color(stylePreset.color);
        const parsedFontColor = {
          r: fontColor.R,
          g: fontColor.G,
          b: fontColor.B,
          a: 255,
        };

        const newTextStyle = {
          bold: false,
          italic: false,
          underline: false,
          pointSize: fontPointSize,
          color: parsedFontColor
        };

        await core.getOfficeEditor().updateParagraphStylePresets(newTextStyle);
        await core.getOfficeEditor().setMainCursorStyle(newTextStyle);
      }}
      getCustomItemStyle={(item) => ({ ...AVAILABLE_STYLE_PRESET_MAP[item], padding: '20px 10px', color: null })}
      applyCustomStyleToButton={false}
      currentSelectionKey={cursorStyleToPreset}
      width={160}
      dataElement="office-editor-text-format"
      showLabelInList={true}
      translationPrefix="officeEditor.fontStyles"
    />
  );
};

export default StylePresetDropdown;