import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'components/Dropdown';
import core from 'core';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import selectors from 'selectors';
import { AVAILABLE_STYLE_PRESET_MAP } from 'constants/officeEditor';
import { COMMON_COLORS } from 'constants/commonColors';
import classNames from 'classnames';
import actions from 'actions';

import './StylePresetDropdown.scss';

const propTypes = {
  isFlyoutItem: PropTypes.bool,
  activeFlyout: PropTypes.string,
  onKeyDownHandler: PropTypes.func,
};

const StylePresetDropdown = (props) => {
  const { isFlyoutItem, activeFlyout, onKeyDownHandler } = props;
  const dispatch = useDispatch();
  const [
    cursorStyleToPreset,
    customizableUI,
  ] = useSelector(
    (state) => [
      selectors.getCursorStyleToPreset(state, AVAILABLE_STYLE_PRESET_MAP, COMMON_COLORS),
      selectors.getFeatureFlags(state)?.customizableUI,
    ],
    shallowEqual
  );

  return (
    <Dropdown
      id="office-editor-style-preset-dropdown"
      className={classNames({
        'OfficeEditorStylePresetDropdown': true,
        'text-left': true,
        'flyout-item': isFlyoutItem,
        'modular-ui': customizableUI,
      })}
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
        if (activeFlyout) {
          dispatch(actions.closeElement(activeFlyout));
        }
      }}
      getCustomItemStyle={(item) => ({ ...AVAILABLE_STYLE_PRESET_MAP[item], padding: '20px 10px', color: null })}
      applyCustomStyleToButton={false}
      currentSelectionKey={cursorStyleToPreset}
      width={180}
      dataElement="office-editor-text-format"
      showLabelInList={true}
      translationPrefix="officeEditor.fontStyles"
      isFlyoutItem={isFlyoutItem}
      onKeyDownHandler={onKeyDownHandler}
    />
  );
};

StylePresetDropdown.propTypes = propTypes;

export default StylePresetDropdown;