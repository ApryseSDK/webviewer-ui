import React, { useEffect } from 'react';
import classNames from 'classnames';
import Icon from 'components/Icon';
import { useTranslation } from 'react-i18next';
import useFocusHandler from 'hooks/useFocusHandler';

import './ColorPalettePicker.scss';
import '../ColorPalette/ColorPalette.scss';

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
}) => {
  const [t] = useTranslation();

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

  return (
    <div className="color-picker-container">
      <div className="colorPicker">
        {!disableTitle && <div className="colorPickerController">
          <span>{t('annotation.custom')}</span>
        </div>}
        <div className="colorPickerColors ColorPalette">
          {customColors.map((bg) => (
            <button
              key={bg}
              title={t('option.colorPalettePicker.selectColor')}
              className="cell-container"
              onClick={() => handleColorOnClick(bg)}
              aria-label={`${t('option.colorPalette.colorLabel')} ${bg?.toUpperCase?.()}`}
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
          ),
          )}
          {enableEdit && (
            <button
              className="cell-container cell-tool"
              title={t('option.colorPalettePicker.addColor')}
              onClick={handleAddColor}
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
              disabled={!colorToBeDeleted}
              onClick={openDeleteModal}
              title={t('warning.colorPalettePicker.deleteTitle')}
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

export default ColorPalettePicker;
