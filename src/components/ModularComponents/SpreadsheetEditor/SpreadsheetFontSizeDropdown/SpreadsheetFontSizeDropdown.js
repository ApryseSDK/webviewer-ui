import React from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Dropdown from 'components/Dropdown';
import { AVAILABLE_FONT_SIZES } from 'constants/spreadsheetEditor';
import setCellFontStyle from 'src/helpers/setCellFontStyle';
import './SpreadsheetFontSizeDropdown.scss';

const SpreadsheetFontSizeDropdown = (props) => {
  const { isFlyoutItem, onKeyDownHandler } = props;
  const fontSize = useSelector((state) => selectors.getActiveCellRangeFontStyle(state, 'pointSize'));

  const handleFontSizeChange = (size) => {
    setCellFontStyle({ pointSize: parseInt(size) });
  };

  return (
    <Dropdown
      id="spreadsheet-editor-font-size-dropdown"
      className={classNames({
        'SpreadsheetEditorFontSizeDropdown': true,
        'text-left': true,
        'flyout-item': isFlyoutItem,
      })}
      items={AVAILABLE_FONT_SIZES}
      onClickItem={handleFontSizeChange}
      currentSelectionKey={fontSize?.toString()}
      width={100}
      dataElement="spreadsheet-editor-font-size"
      hasInput
      isSearchEnabled={false}
      showLabelInList={true}
      translationPrefix="spreadsheetEditor.fontSize"
      isFlyoutItem={isFlyoutItem}
      onKeyDownHandler={onKeyDownHandler}
    />
  );
};

SpreadsheetFontSizeDropdown.propTypes = {
  isFlyoutItem: PropTypes.bool,
  onKeyDownHandler: PropTypes.func,
};

export default SpreadsheetFontSizeDropdown;