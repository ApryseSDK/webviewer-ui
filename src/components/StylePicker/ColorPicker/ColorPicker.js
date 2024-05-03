import React, { useState, useCallback, useEffect, useRef } from 'react';
import classNames from 'classnames';
import './ColorPicker.scss';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import actions from 'actions';
import { useDispatch, useStore, useSelector } from 'react-redux';
import Events from 'constants/events';
import { getInstanceNode } from 'helpers/getRootNode';
import selectors from 'selectors';
import Button from 'components/Button';

const parseColor = (color) => {
  if (!color) {
    return color;
  }
  let parsedColor = color;
  if (parsedColor?.toHexString) {
    parsedColor = parsedColor.toHexString();
  }
  if (parsedColor?.toLowerCase) {
    parsedColor = parsedColor.toLowerCase();
  }

  return parsedColor;
};

const TRANSPARENT_COLOR = 'transparent';

const transparentIcon = (
  <svg
    width="100%"
    height="100%"
    className={classNames('transparent')}
  >
    <line stroke="#d82e28" x1="0" y1="100%" x2="100%" y2="0" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);


const propTypes = {
  color: PropTypes.any
};

const ColorPicker = ({
  onColorChange,
  hasTransparentColor = false,
  color,
  activeTool,
  type,
}) => {
  const activeToolName = Object.values(window.Core.Tools.ToolNames).includes(activeTool) ? activeTool : window.Core.Tools.ToolNames.EDIT;
  const store = useStore();
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

  const getCustomColorAndRemove = () => {
    const customColor = selectors.getCustomColor(store.getState());
    dispatch(actions.setCustomColor(null));
    return customColor;
  };

  const handleAddColor = useCallback(() => {
    dispatch(actions.openElement('ColorPickerModal'));
    const onVisibilityChanged = (e) => {
      const { element, isVisible } = e.detail;
      if (element === 'ColorPickerModal' && !isVisible) {
        const color = parseColor(getCustomColorAndRemove());
        if (color) {
          if (colors.includes(color)) {
            setSelectedColor(color);
            onColorChange(color);
          } else {
            const newColors = [...colors, color];
            dispatch(actions.setColors(newColors, activeToolName, type, true));
            setSelectedColor(color);
            onColorChange(color);
          }
        }
      }
      getInstanceNode().removeEventListener(Events.VISIBILITY_CHANGED, onVisibilityChanged);
    };
    getInstanceNode().addEventListener(Events.VISIBILITY_CHANGED, onVisibilityChanged);
  }, [colors?.length, dispatch, setSelectedColor, onColorChange, getCustomColorAndRemove, type, activeToolName]);

  const handleDelete = () => {
    const color = parseColor(selectedColor);
    const newColors = [...colors];
    const indexToDelete = newColors.indexOf(color);
    if (indexToDelete > -1) {
      const nextIndex = indexToDelete === newColors.length - 1 ? 0 : indexToDelete + 1;
      setSelectedColor(colors[nextIndex]);
      onColorChange(colors[nextIndex]);
      newColors.splice(indexToDelete, 1);
      dispatch(actions.setColors(newColors, activeToolName, type, true));
    }
  };

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
    <>
      <div className={classNames('ColorPalette')}>
        {palette.map((color) => parseColor(color)).map((color, i) => (
          !color
            ? <div key={i} className="dummy-cell"/>
            : <button
              key={i}
              className="cell-container"
              onClick={() => {
                setSelectedColor(color);
                onColorChange(color);
              }}
              aria-label={`${t('option.colorPalette.colorLabel')} ${i + 1}`}
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
                    border: color === '#ffffff' || color === TRANSPARENT_COLOR,
                  })}
                  style={{ backgroundColor: color }}
                >
                  {color === TRANSPARENT_COLOR && transparentIcon}
                </div>
              </div>
            </button>
        ))}
      </div>
      <div className="palette-controls">
        <div className="button-container">
          <Button
            img="icon-header-zoom-in-line"
            title={t('action.addNewColor')}
            onClick={handleAddColor}
            className="control-button"
            dataElement="addCustomColor"
          />
          <Button
            img="icon-delete-line"
            title={t('action.deleteColor')}
            onClick={handleDelete}
            disabled={isDeleteDisabled}
            className="control-button"
            dataElement="deleteSelectedColor"
          />
          <Button
            img="icon-copy2"
            title={t('action.copySelectedColor')}
            onClick={handleCopyColor}
            disabled={showCopyButtonDisabled}
            className="control-button"
            dataElement="copySelectedColor"
          />
        </div>
        <button className={classNames('show-more-button control-button', {
          hidden: shouldHideShowMoreButton,
        })} onClick={toggleExpanded}>
          {t(isExpanded ? 'message.showLess' : 'message.showMore')}
        </button>
      </div>
    </>
  );
};

ColorPicker.propTypes = propTypes;

export default ColorPicker;