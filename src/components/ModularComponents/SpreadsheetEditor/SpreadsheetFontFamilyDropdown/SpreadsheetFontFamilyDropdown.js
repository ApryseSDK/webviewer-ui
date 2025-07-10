import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector, shallowEqual } from 'react-redux';
import selectors from 'selectors';
import Dropdown from 'components/Dropdown';
import setCellFontStyle from 'src/helpers/setCellFontStyle';
import './SpreadsheetFontFamilyDropdown.scss';

const propTypes = {
  isFlyoutItem: PropTypes.bool,
  onKeyDownHandler: PropTypes.func,
};

const SpreadsheetFontFamilyDropdown = (props) => {
  const { isFlyoutItem, onKeyDownHandler } = props;

  const [
    availableFontFaces,
    cssFontValues,
    fontName,
  ] = useSelector(
    (state) => [
      selectors.getAvailableSpreadsheetEditorFontFaces(state),
      selectors.getSpreadsheetEditorCSSFontValues(state),
      selectors.getActiveCellRangeFontStyle(state, 'fontFace'),
    ],
    shallowEqual
  );

  const handleFontChange = (fontFace) => {
    setCellFontStyle({ fontFace });
  };

  return (
    <Dropdown
      id="spreadsheet-editor-font-family-dropdown"
      className={classNames({
        'SpreadsheetEditorFontFamilyDropdown': true,
        'flyout-item': isFlyoutItem,
      })}
      getCustomItemStyle={(item) => ({ ...cssFontValues[item] })}
      items={availableFontFaces}
      onClickItem={handleFontChange}
      maxHeight={500}
      width={180}
      dataElement="spreadsheet-editor-font"
      currentSelectionKey={fontName}
      hasInput
      showLabelInList={true}
      translationPrefix="spreadsheetEditor.fontFamily"
      isFlyoutItem={isFlyoutItem}
      onKeyDownHandler={onKeyDownHandler}
    />
  );
};

SpreadsheetFontFamilyDropdown.propTypes = propTypes;

export default SpreadsheetFontFamilyDropdown;