import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import actions from 'actions';
import { useDispatch, useSelector } from 'react-redux';
import selectors from 'selectors';
import Button from 'components/Button';
import ColorPalette from 'components/ColorPalette';
import DataElementWrapper from 'components/DataElementWrapper';
import './ColorPicker.scss';
import { getColorFromHex, parseColor } from 'helpers/colorPickerHelper';
import useColorPickerAddColor from 'hooks/useColorPickerAddColor';
import useColorPickerDeleteColor from 'hooks/useColorPickerDeleteColor';
import useFocusHandler from 'hooks/useFocusHandler';

const propTypes = {
  onColorChange: PropTypes.func,
  property: PropTypes.string,
  color: PropTypes.object,
  dataElement: PropTypes.string,
  ariaTypeLabel: PropTypes.string,
  onKeyDownHandler: PropTypes.func,
};

const SpreadsheetColorPicker = ({
  onColorChange,
  property,
  color: selectedColor,
  dataElement,
  ariaTypeLabel,
  onKeyDownHandler,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const cellStyleColors = useSelector(selectors.getCellStyleColors);

  const [palette, setPalette] = useState(cellStyleColors);
  const [isExpanded, setIsExpanded] = useState(true);

  const isCopyButtonDisabled = !(selectedColor && !palette.includes(parseColor(selectedColor)));
  const isDeleteDisabled = palette.length <= 1 || !isCopyButtonDisabled;

  useEffect(() => {
    const colorsLowercase = cellStyleColors.map((color) => color.toLowerCase());

    if (!isExpanded) {
      setPalette(colorsLowercase.slice(0, 7));
      return;
    }

    setPalette(colorsLowercase);
  }, [cellStyleColors, isExpanded]);

  useEffect(() => {
    // This is for when the users set the default color that does not exist in the palette
    const hexColor = parseColor(selectedColor);
    if (hexColor && !palette.includes(hexColor)) {
      const newColors = [...palette, hexColor];
      dispatch(actions.setCellStyleColors(newColors));
    }
  }, [selectedColor]);

  const toggleExpanded = () => {
    const newValue = !isExpanded;
    setIsExpanded(newValue);
  };

  const handleAddColor = useFocusHandler(useColorPickerAddColor({
    colors: cellStyleColors,
    onColorChange,
    setColors: (newColors) => dispatch(actions.setCellStyleColors(newColors)),
  }));

  const handleColorChange = (property, color) => {
    onColorChange(color);
  };

  const handleDelete = useColorPickerDeleteColor({
    selectedColor,
    colors: palette,
    onColorChange,
    transformFn: getColorFromHex,
    updateColorsAction: actions.setCellStyleColors,
  });

  const handleCopyColor = () => {
    const hexColor = parseColor(selectedColor);
    const newColors = [...palette, hexColor];
    dispatch(actions.setCellStyleColors(newColors));
  };

  return (
    <DataElementWrapper dataElement={dataElement}>
      <ColorPalette
        color={selectedColor}
        property={property}
        onStyleChange={handleColorChange}
        overridePalette2={palette}
        ariaTypeLabel={ariaTypeLabel}
        onKeyDownHandler={onKeyDownHandler}
      />
      <div className="palette-controls">
        <div className="button-container">
          <Button
            img="icon-header-zoom-in-line"
            title={t('action.addNewColor')}
            onClick={handleAddColor}
            className="control-button"
            dataElement="addCustomColor"
            ariaLabel={`${t('action.addNewColor')} ${t('action.fromCustomColorPicker')}`}
            onKeyDownHandler={onKeyDownHandler}
          />
          <Button
            img="icon-delete-line"
            title={t('action.deleteColor')}
            onClick={handleDelete}
            disabled={isDeleteDisabled}
            className="control-button"
            dataElement="deleteSelectedColor"
            ariaLabel={`${t('action.deleteColor')} ${selectedColor}`}
            onKeyDownHandler={onKeyDownHandler}
          />
          <Button
            img="icon-copy2"
            title={t('action.copySelectedColor')}
            onClick={handleCopyColor}
            disabled={isCopyButtonDisabled}
            className="control-button"
            dataElement="copySelectedColor"
            ariaLabel={`${t('action.copySelectedColor')} ${selectedColor}`}
            onKeyDownHandler={onKeyDownHandler}
          />
        </div>
        <button
          className={'show-more-button control-button'}
          onClick={toggleExpanded}
          aria-label={`${t(isExpanded ? t('action.showLessColors') : t('action.showMoreColors'))}`}
          onKeyDown={onKeyDownHandler}
        >
          {t(isExpanded ? 'message.showLess' : 'message.showMore')}
        </button>
      </div>
    </DataElementWrapper>
  );
};

SpreadsheetColorPicker.propTypes = propTypes;

export default SpreadsheetColorPicker;