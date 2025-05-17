import React from 'react';
import Button from 'components/Button';
import DataElements from 'constants/dataElement';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { CELL_BORDER_BUTTONS } from 'constants/customizationVariables';
import { getPresetButtonDOM } from '../Helpers/menuItems';
import ToggleElementButton from '../ToggleElementButton';
import PropTypes from 'prop-types';

import './CellBorders.scss';

const CellBorders = (props) => {
  const { isFlyoutItem, dataElement, disabled } = props;

  const { t } = useTranslation();

  const borderButtons = CELL_BORDER_BUTTONS.map((button) => {
    return getPresetButtonDOM({
      buttonType: button,
    });
  });

  return ( isFlyoutItem ?
    <div data-element={dataElement} className={classNames({
      'CellBorders': true,
      'flyout-item': isFlyoutItem
    })}>
      <Button
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