import React, { useEffect } from 'react';
import classNames from 'classnames';
import Icon from 'components/Icon';
import { useTranslation } from 'react-i18next';

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
  useEffect(() => {
    if (!customColors.includes(colorsAreHex ? color : getHexColor(color))) {
      setColorToBeDeleted('');
    } else {
      setColorToBeDeleted(colorsAreHex ? color : getHexColor(color));
    }
  }, [color]);

  const [t] = useTranslation();

  const handleAddColor = () => {
    if (openColorPicker) {
      openColorPicker(true);
    }
  };

  return (
    <div>
      <div className="colorPicker">
        {!disableTitle && <div className="colorPickerController">
          <span>{t('annotation.custom')}</span>
        </div>}
        <div className="colorPickerColors ColorPalette">
          {customColors.map((bg, i) => (
            <button
              key={bg}
              className="cell-container"
              onClick={() => handleColorOnClick(bg)}
              aria-label={`${t('option.colorPalette.colorLabel')} ${i + 1}`}
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
                    border: bg.toLowerCase() === '#ffffff' || bg === 'transparency',
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
            <button className="cell-container">
              <div className="cell-outer">
                <div className="cellIcon" id="addCustomColor" onClick={handleAddColor}>
                  <Icon glyph="icon-header-zoom-in-line" />
                </div>
              </div>
            </button>
          )}
          {enableEdit && customColors.length > 0 && (
            <button
              className="cell-container"
              id="removeCustomColor"
              disabled={!colorToBeDeleted}
              onClick={openDeleteModal}
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
