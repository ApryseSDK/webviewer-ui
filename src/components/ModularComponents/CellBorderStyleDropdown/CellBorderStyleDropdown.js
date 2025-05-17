import React, { useState } from 'react';
import Dropdown from 'components/Dropdown';
import { defaultCellBorderStyles } from 'constants/cellBorderStyleIcons';
import Icon from 'components/Icon';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import DataElements from 'constants/dataElement';

import './CellBorderStyleDropdown.scss';

const CellBorderStyleDropdown = (props) => {
  const { isFlyoutItem, onKeyDownHandler, disabled = false, labelledById } = props;
  const [t] = useTranslation();
  const [borderStyle, setBorderStyle] = useState(defaultCellBorderStyles[0].key);

  const onClickBorderStyle = (key) => {
    setBorderStyle(key);
  };

  const translationPrefix = 'option.cellBorderStyle.';

  const renderItem = (item) => {
    return (
      <div
        className='cellBorderStyleDropdownItem'
        aria-label={t(`${translationPrefix}${item.key}`)}
      >
        {item.src ? <Icon className='cellBorderStyle-image' glyph={item.src} /> : t(`${translationPrefix}${item.key}`)}
      </div>
    );
  };

  return (
    <Dropdown
      className={classNames({
        'CellBorderStyleDropdown': true,
        'flyout-item': isFlyoutItem,
      })}
      disabled={disabled}
      dataElement={DataElements.BORDER_STYLE_DROPDOWN}
      id='cellBorderStyleDropdown'
      items={defaultCellBorderStyles}
      getKey = {(item) => item.key}
      getDisplayValue={(item) => t(`${translationPrefix}${item.key}`)}
      renderItem={renderItem}
      renderSelectedItem={renderItem}
      onClickItem={onClickBorderStyle}
      currentSelectionKey={borderStyle}
      isFlyoutItem={isFlyoutItem}
      onKeyDownHandler={onKeyDownHandler}
      labelledById={labelledById}
      width={isFlyoutItem ? 232 : 100}
    />
  );
};

CellBorderStyleDropdown.propTypes = {
  isFlyoutItem: PropTypes.bool,
  onKeyDownHandler: PropTypes.func,
  disabled: PropTypes.bool,
  labelledById: PropTypes.string,
};

export default CellBorderStyleDropdown;