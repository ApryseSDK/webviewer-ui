import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import './ColorPicker.scss';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import actions from 'actions';
import { useDispatch, useSelector } from 'react-redux';
import { parseColor, transparentIcon } from 'helpers/colorPickerHelper';
import selectors from 'selectors';
import Button from 'components/Button';
import Tooltip from 'components/Tooltip';
import useFocusHandler from 'hooks/useFocusHandler';
import useColorPickerAddColor from 'hooks/useColorPickerAddColor';
import useColorPickerDeleteColor from 'hooks/useColorPickerDeleteColor';
import DataElementWrapper from 'components/DataElementWrapper';

const TRANSPARENT_COLOR = 'transparent';

const propTypes = {
  dataElement: PropTypes.string,
  color: PropTypes.any,
  ariaTypeLabel: PropTypes.string,
  activeTool: PropTypes.string,
  type: PropTypes.string,
  onColorChange: PropTypes.func,
  hasTransparentColor: PropTypes.bool,
};

const ColorPicker = ({
  dataElement,
  onColorChange,
  hasTransparentColor = false,
  color,
  activeTool,
  type,
  ariaTypeLabel
}) => {
  const activeToolName = Object.values(window.Core.Tools.ToolNames).includes(activeTool) ? activeTool : window.Core.Tools.ToolNames.EDIT;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [colors] = useSelector((state) => [
    selectors.getColors(state, activeToolName, type),
  ]);
  const [selectedColor, setSelectedColor] = useState();
  const [isExpanded, setIsExpanded] = useState(false);
  const forceExpandRef = useRef(true);

  useEffect(() => {
    forceExpandRef.current = true;
  }, [activeToolName, color]);

  useEffect(() => {
    if (color) {
      setSelectedColor(parseColor(color));
    }
  }, [color]);

  const handleAddColor = useColorPickerAddColor({
    colors: colors,
    setSelectedColor,
    onColorChange,
    setColors: (newColors) => dispatch(actions.setColors(newColors, activeToolName, type, true)),
    useHex: true,
  });

  const openColorPickerModalWithFocus = useFocusHandler(handleAddColor);

  const handleDelete = useColorPickerDeleteColor({
    selectedColor,
    colors,
    setSelectedColor,
    onColorChange,
    updateColorsAction: (newColors) => dispatch(actions.setColors(newColors, activeToolName, type, true)),
  });

  const handleCopyColor = () => {
    const color = parseColor(selectedColor);
    const newColors = [...colors, color];
    dispatch(actions.setColors(newColors, activeToolName, type, true));
  };

  const toggleExpanded = () => {
    const newValue = !isExpanded;
    setIsExpanded(newValue);
  };

  let palette = colors.map((color) => color.toLowerCase());
  if (hasTransparentColor) {
    palette.push(TRANSPARENT_COLOR);
  }

  if (!selectedColor) {
    setSelectedColor('transparent');
  }

  if (palette.indexOf(selectedColor) > 6 && !isExpanded && forceExpandRef.current) {
    setIsExpanded(true);
    forceExpandRef.current = false;
  }

  const shouldHideShowMoreButton = palette.length <= 7;
  const showCopyButtonDisabled = !(selectedColor && !palette.includes(selectedColor));
  const isDeleteDisabled = palette.length <= 1 || !showCopyButtonDisabled;

  if (!isExpanded) {
    palette = palette.slice(0, 7);
  }

  return (
    <DataElementWrapper dataElement={dataElement}>
      <div className={classNames('ColorPalette')}>
        {palette.map((color) => parseColor(color)).map((color, i) => (
          !color
            ? <div key={i} className="dummy-cell"/>
            : <Tooltip content={`${t('option.colorPalette.colorLabel')} ${color?.toUpperCase?.()}`} key={color?.toUpperCase?.()}>
              <button
                className="cell-container"
                onClick={() => {
                  setSelectedColor(color);
                  onColorChange(color);
                }}
                aria-label={`${ariaTypeLabel} ${t('option.colorPalette.colorLabel')} ${color?.toUpperCase?.()}`}
                aria-current={parseColor(selectedColor) === color || (!parseColor(selectedColor) && color === TRANSPARENT_COLOR)}
              >
                <div
                  className={classNames({
                    'cell-outer': true,
                    active: parseColor(selectedColor) === color || (!parseColor(selectedColor) && color === TRANSPARENT_COLOR),
                  })}
                >
                  <div
                    className={classNames({
                      cell: true,
                      border: true,
                    })}
                    style={{ backgroundColor: color }}
                  >
                    {color === TRANSPARENT_COLOR && transparentIcon}
                  </div>
                </div>
              </button>
            </Tooltip>
        ))}
      </div>
      <div className="palette-controls">
        <div className="button-container">
          <Button
            img="icon-header-zoom-in-line"
            title={t('action.addNewColor')}
            onClick={openColorPickerModalWithFocus}
            className="control-button"
            dataElement="addCustomColor"
            ariaLabel={`${ariaTypeLabel} ${t('action.addNewColor')} ${t('action.fromCustomColorPicker')}`}
          />
          <Button
            img="icon-delete-line"
            title={t('action.deleteColor')}
            onClick={handleDelete}
            disabled={isDeleteDisabled}
            className="control-button"
            dataElement="deleteSelectedColor"
            ariaLabel={`${ariaTypeLabel} ${t('action.deleteColor')} ${selectedColor}`}
          />
          <Button
            img="icon-copy2"
            title={t('action.copySelectedColor')}
            onClick={handleCopyColor}
            disabled={showCopyButtonDisabled}
            className="control-button"
            dataElement="copySelectedColor"
            ariaLabel={`${ariaTypeLabel} ${t('action.copySelectedColor')} ${selectedColor}`}
          />
        </div>
        <button
          className={classNames('show-more-button control-button', {
            hidden: shouldHideShowMoreButton,
          })}
          onClick={toggleExpanded}
          aria-label={`${ariaTypeLabel} ${t(isExpanded ? t('action.showLessColors') : t('action.showMoreColors'))}`}
        >
          {t(isExpanded ? 'message.showLess' : 'message.showMore')}
        </button>
      </div>
    </DataElementWrapper>
  );
};

ColorPicker.propTypes = propTypes;

export default ColorPicker;