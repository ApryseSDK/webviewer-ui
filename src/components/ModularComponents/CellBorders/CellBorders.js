import React from 'react';
import Button from 'components/Button';
import DataElements from 'constants/dataElement';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { getPresetButtonDOM } from '../Helpers/menuItems';
import ToggleElementButton from '../ToggleElementButton';
import setCellBorder from 'src/helpers/setCellBorder';
import getButtonDisplay from 'src/helpers/getBorderDisplayButton';
import selectors from 'selectors';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import './CellBorders.scss';

const CellBorders = (props) => {
  const { isFlyoutItem, dataElement, disabled } = props;
  const selectedBorderStyleListOption = useSelector((state)=> selectors.getSelectedBorderStyleListOption(state));
  const selectedBorderColorOption = useSelector((state)=> selectors.getSelectedBorderColorOption(state));

  const { t } = useTranslation();

  const onClick = (e)=> {
    const borderType = e.target.dataset.element;
    const border = {
      type: borderType,
      style: selectedBorderStyleListOption,
      color: selectedBorderColorOption
    };
    setCellBorder(border);
  };

  const buttonDisplay = getButtonDisplay();
  const borderButtons = Object.keys(buttonDisplay).flatMap((borderType) =>
    buttonDisplay[borderType]
      ? [getPresetButtonDOM({ buttonType: borderType, onClick })]
      : []
  );

  return ( isFlyoutItem ?
    <div data-element={dataElement} className={classNames({
      'CellBorders': true,
      'flyout-item': isFlyoutItem
    })}>
      <Button
        onClick={()=>setCellBorder({ type: 'All', style: 'None', color: null })}
        className={classNames({
          clearBorderButton: true,
        })}
        dataElement={DataElements.CLEAR_BORDERS_BUTTON}
        label={t('spreadsheetEditor.clearBorder')}
        ariaLabel={t('spreadsheetEditor.clearBorder')}
        title={t('spreadsheetEditor.clearBorder')}
      />
      <div className='icon-grid'>
        <div className='row'>
          {borderButtons.map((button) => (
            React.cloneElement(button, {
              key: button.props.dataElement,
              className: 'border-button',
            })
          ))}
        </div>
      </div>
    </div> :
    <div className='CellBorders'>
      <ToggleElementButton
        dataElement={dataElement}
        className="CellBordersButton"
        title={t('spreadsheetEditor.borders')}
        disabled={disabled}
        img={'ic-border-main'}
        toggleElement={DataElements.CELL_BORDER_BUTTONS_FLYOUT}
      />
    </div>
  );
};

CellBorders.propTypes = {
  dataElement: PropTypes.string,
  isFlyoutItem: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default CellBorders;