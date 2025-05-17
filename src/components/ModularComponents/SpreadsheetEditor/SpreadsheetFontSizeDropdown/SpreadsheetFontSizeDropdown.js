import React from 'react';
import Dropdown from 'components/Dropdown';
import { AVAILABLE_FONT_SIZES } from 'constants/spreadsheetEditor';
import classNames from 'classnames';
import './SpreadsheetFontSizeDropdown.scss';
import PropTypes from 'prop-types';

const SpreadsheetFontSizeDropdown = (props) => {

  const { isFlyoutItem, onKeyDownHandler } = props;

  return (
    <Dropdown
      id="spreadsheet-editor-font-size-dropdown"
      className={classNames({
        'SpreadsheetEditorFontSizeDropdown': true,
        'text-left': true,
        'flyout-item': isFlyoutItem,
      })}
      items={AVAILABLE_FONT_SIZES}
      onClickItem={() => {}}
      currentSelectionKey={'8'}
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