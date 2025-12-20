import React from 'react';
import Dropdown from 'components/Dropdown';
import { defaultCellBorderStyles } from 'constants/cellBorderStyleIcons';
import Icon from 'components/Icon';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import DataElements from 'constants/dataElement';
import { useDispatch, useSelector } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import calculateActiveBorderButtons from 'src/helpers/calculateActiveBorderButtons';
import applyActiveBorders from 'src/helpers/applyActiveBorders';

import './CellBorderStyleDropdown.scss';

const CellBorderStyleDropdown = (props) => {
  const { isFlyoutItem, onKeyDownHandler, disabled = false, labelledById } = props;
  const [t] = useTranslation();
  const selectedBorderStyleListOption = useSelector((state)=> selectors.getSelectedBorderStyleListOption(state));
  const selectedBorderColorOption = useSelector((state) => selectors.getSelectedBorderColorOption(state));
  const activeCellBorderStyle = useSelector((state) => selectors.getActiveCellBorderStyle(state));
  const isSingleCell = useSelector((state) => selectors.getIsSingleCell(state));
  const dispatch = useDispatch();

  const onClickBorderStyle = (key) => {
    dispatch(actions.setSelectedBorderStyleListOption(key));
    if (!isSingleCell) {
      // changing border stroke style can only be applied immediately
      // if a single cell is selected
      return;
    }
    const activeBorderButtons = calculateActiveBorderButtons(activeCellBorderStyle);
    applyActiveBorders(activeBorderButtons, key, selectedBorderColorOption);
  };

  const translationPrefix = 'option.cellBorderStyle.';

  const renderItem = (item) => {
    return (
      <div
        className='cellBorderStyleDropdownItem'
        aria-label={t(`${translationPrefix}${item.key.toLowerCase()}`)}
      >
        {item.src ? <Icon className='cellBorderStyle-image' glyph={item.src} /> : t(`${translationPrefix}${item.key.toLowerCase()}`)}
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
      currentSelectionKey={selectedBorderStyleListOption}
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