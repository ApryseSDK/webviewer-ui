import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from 'components/Icon';
import Tooltip from 'components/Tooltip';
import { useTranslation } from 'react-i18next';
import useFocusHandler from 'hooks/useFocusHandler';

import './ColorPalettePicker.scss';
import '../ColorPalette/ColorPalette.scss';


const propTypes = {
  color: PropTypes.any,
  toolTipXOffset: PropTypes.number,
  disabled: PropTypes.bool,
  customColors: PropTypes.array,
  getHexColor: PropTypes.func,
  openColorPicker: PropTypes.func,
  handleColorOnClick: PropTypes.func,
  openDeleteModal: PropTypes.func,
  colorToBeDeleted: PropTypes.string,
  setColorToBeDeleted: PropTypes.func,
  enableEdit: PropTypes.bool,
  disableTitle: PropTypes.bool,
  colorsAreHex: PropTypes.bool,
  ariaLabelledBy: PropTypes.string,
};

const ColorPalettePicker = ({
  color,
  customColors = [],
  getHexColor,
  openColorPicker,
  handleColorOnClick,
  openDeleteModal,
  colorToBeDeleted,
  setColorToBeDeleted,
  enableEdit,
  disableTitle = false,
  colorsAreHex = false,
  ariaLabelledBy,
  toolTipXOffset = 0,
  disabled = false,
}) => {
  const [t] = useTranslation();
  const addCustomColorRef = useRef(null);

  useEffect(() => {
    const isNotInCustomColors = !customColors.includes(colorsAreHex ? color : getHexColor(color));
    if (isNotInCustomColors) {
      setColorToBeDeleted('');
    } else {
      setColorToBeDeleted(colorsAreHex ? color : getHexColor(color));
    }
  }, [color]);

  const handleAddColor = useFocusHandler(() => {
    if (openColorPicker) {
      openColorPicker(true);
    }
  });

  const handleOpenDeleteModal = useFocusHandler(() => {
    if (openDeleteModal) {
      openDeleteModal(() => {
        // After deleting, focus is transfered to plus sign icon
        addCustomColorRef.current.focus();
      });
    }
  });


  return (
    <div className="color-picker-container">
      <div className="colorPicker">
        {!disableTitle && <div className="colorPickerController">
          <span>{t('annotation.custom')}</span>
        </div>}
        <div className="colorPickerColors ColorPalette" role="group" aria-labelledby={ariaLabelledBy}>
          {customColors.map((bg, i) => (
            <Tooltip content={`${t('option.colorPalette.colorLabel')} ${bg?.toUpperCase?.()}`} xOffset={toolTipXOffset} key={`color-${i}`}>
              <button
                className="cell-container cell-color"
                onClick={() => handleColorOnClick(bg)}
                aria-label={`${t('option.colorPalette.colorLabel')} ${bg?.toUpperCase?.()}`}
                aria-current={colorsAreHex ? color?.toLowerCase() === bg.toLowerCase() :
                  color?.toHexString?.()?.toLowerCase() === bg.toLowerCase()}
                disabled={disabled}
              >
                <div
                  className={classNames({
                    'cell-outer': true,
                    active: colorsAreHex ? color?.toLowerCase() === bg.toLowerCase() :
                      color?.toHexString?.()?.toLowerCase() === bg.toLowerCase(),
                  })}
                >
                  <div
                    className={classNames({
                      cell: true,
                      border: true,
                    })}
                    style={{ backgroundColor: bg }}
                  >
                    {bg === 'transparency' && undefined}
                  </div>
                </div>
              </button>
            </Tooltip>
          ),
          )}
          {enableEdit && (
            <button
              data-element="addCustomColor"
              className="cell-container cell-tool"
              title={t('option.colorPalettePicker.addColor')}
              onClick={handleAddColor}
              ref={addCustomColorRef}
              disabled={disabled}
            >
              <div className="cell-outer">
                <div className="cellIcon" id="addCustomColor">
                  <Icon glyph="icon-header-zoom-in-line" />
                </div>
              </div>
            </button>
          )}
          {enableEdit && customColors.length > 0 && (
            <button
              className="cell-container cell-tool"
              id="removeCustomColor"
              disabled={disabled || !colorToBeDeleted}
              onClick={handleOpenDeleteModal}
              title={t('warning.colorPalettePicker.deleteTitle')}
              data-element="removeCustomColor"
            >
              <div className="cell-outer">
                <div className="cellIcon">
                  <Icon glyph="icon-delete-line" />
                </div>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

ColorPalettePicker.propTypes = propTypes;

export default ColorPalettePicker;