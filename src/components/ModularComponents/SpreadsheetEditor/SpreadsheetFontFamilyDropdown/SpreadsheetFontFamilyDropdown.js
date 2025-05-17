import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'components/Dropdown';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import selectors from 'selectors';
import './SpreadsheetFontFamilyDropdown.scss';

const propTypes = {
  isFlyoutItem: PropTypes.bool,
  onKeyDownHandler: PropTypes.func,
};

const SpreadsheetFontFamilyDropdown = (props) => {
  const { isFlyoutItem, onKeyDownHandler } = props;

  const availableFontFaces = useSelector(selectors.getAvailableFontFaces);

  return (
    <Dropdown
      id="spreadsheet-editor-font-family-dropdown"
      className={classNames({
        'SpreadsheetEditorFontFamilyDropdown': true,
        'flyout-item': isFlyoutItem,
      })}
      items={availableFontFaces}
      onClickItem={() => {}}
      maxHeight={500}
      width={180}
      dataElement="spreadsheet-editor-font"
      currentSelectionKey={'Arial'}
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