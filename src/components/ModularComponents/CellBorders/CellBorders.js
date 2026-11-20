import React, { useMemo } from 'react';
import Button from 'components/Button';
import DataElements from 'constants/dataElement';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { menuItems } from '../Helpers/menuItems';
import ToggleElementButton from '../ToggleElementButton';
import getButtonDisplay from 'src/helpers/spreadsheetEditor/getButtonDisplay';
import setCellBorder from 'src/helpers/spreadsheetEditor/setCellBorder';
import calculateActiveBorderButtons from 'src/helpers/calculateActiveBorderButtons';
import getUpdatedBorderStyles from 'src/helpers/getUpdatedBorderStyles';
import { getButtonPressedAnnouncement } from 'helpers/accessibility';
import selectors from 'selectors';
import actions from 'actions';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import './CellBorders.scss';

const CellBorders = (props) => {
  const { isFlyoutItem, dataElement, disabled } = props;
  const dispatch = useDispatch();
  const selectedBorderStyleListOption = useSelector((state) => selectors.getSelectedBorderStyleListOption(state));
  const selectedBorderColorOption = useSelector((state) => selectors.getSelectedBorderColorOption(state));
  const isSingleCell = useSelector((state) => selectors.getIsSingleCell(state));
  const activeCellBorderStyle = useSelector((state) => selectors.getActiveCellBorderStyle(state));

  const { t } = useTranslation();

  const activeBorderButtons = useMemo(() => {
    return calculateActiveBorderButtons(activeCellBorderStyle);
  }, [activeCellBorderStyle]);

  const onClick = (e) => {
    const borderType = e.target.dataset.element;
    const border = {
      type: borderType,
      style: selectedBorderStyleListOption,
      color: selectedBorderColorOption
    };

    const singleSideButtons = ['Top', 'Left', 'Right', 'Bottom'];
    const isClickingSingleSide = singleSideButtons.includes(borderType);

    if (isClickingSingleSide && isSingleCell) {
      const { top, left, bottom, right } = activeCellBorderStyle || {};
      const hasBorderStyle = (border) => border && border.style && border.style !== 'None';
      const allBordersActive = [top, left, bottom, right].every(hasBorderStyle);

      if (allBordersActive) {
        setCellBorder({ type: 'All', style: 'None', color: null });
      }
    }

    if (isSingleCell) {
      const updatedBorderStyles = getUpdatedBorderStyles(
        activeCellBorderStyle,
        borderType,
        selectedBorderStyleListOption,
        selectedBorderColorOption
      );
      dispatch(actions.setActiveCellRangeStyle({ border: updatedBorderStyles }));
    }
    setCellBorder(border);
  };

  const onClearBorders = () => {
    // Optimistic update for clearing borders
    if (isSingleCell) {
      const clearedBorderStyles = {
        top: { color: null, style: 'None' },
        right: { color: null, style: 'None' },
        bottom: { color: null, style: 'None' },
        left: { color: null, style: 'None' },
      };
      dispatch(actions.setActiveCellRangeStyle({ border: clearedBorderStyles }));
    }

    setCellBorder({ type: 'All', style: 'None', color: null });
  };

  const buttonDisplay = getButtonDisplay();
  // Rendered directly (not via getPresetButtonDOM) so these buttons don't pick up the
  // PresetButton class and its hover styling, which border buttons never had.
  const renderedBorderButtons = Object.keys(buttonDisplay)
    .filter((borderType) => buttonDisplay[borderType])
    .map((borderType) => {
      const { icon, title } = menuItems[borderType] || {};
      return (
        <Button
          key={borderType}
          className="border-button"
          dataElement={borderType}
          img={icon}
          title={title}
          onClick={onClick}
          isActive={isSingleCell ? activeBorderButtons.includes(borderType) : false}
          onClickAnnouncement={getButtonPressedAnnouncement(title, t)}
        />
      );
    });

  return (isFlyoutItem ?
    <div data-element={dataElement} className={classNames({
      'CellBorders': true,
      'flyout-item': isFlyoutItem
    })}>
      <Button
        onClick={onClearBorders}
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
          {renderedBorderButtons}
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
