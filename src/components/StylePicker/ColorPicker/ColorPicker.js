import React, { useState, useCallback, useEffect } from 'react';
import classNames from 'classnames';
import './ColorPicker.scss';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import actions from 'actions';
import { useDispatch, useStore, useSelector } from 'react-redux';
import Events from 'constants/events';
import { getInstanceNode } from 'helpers/getRootNode';
import selectors from 'selectors';

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
  color
}) => {
  const store = useStore();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [colors] = useSelector((state) => [
    selectors.getColors(state),
  ]);
  const [selectedColor, setSelectedColor] = useState();
  const [isExpanded, setIsExpanded] = useState(false);

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
            const newColors = [color, ...colors];
            dispatch(actions.setColors(newColors));
            setSelectedColor(color);
            onColorChange(color);
          }
        }
      }
      getInstanceNode().removeEventListener(Events.VISIBILITY_CHANGED, onVisibilityChanged);
    };
    getInstanceNode().addEventListener(Events.VISIBILITY_CHANGED, onVisibilityChanged);
  }, [colors?.length, dispatch, setSelectedColor, onColorChange, getCustomColorAndRemove]);

  const handleDelete = () => {
    const color = parseColor(selectedColor);
    const newColors = [...colors];
    const indexToDelete = newColors.indexOf(color);
    if (indexToDelete > -1) {
      const nextIndex = indexToDelete === newColors.length - 1 ? 0 : indexToDelete + 1;
      setSelectedColor(colors[nextIndex]);
      onColorChange(colors[nextIndex]);
      newColors.splice(indexToDelete, 1);
      dispatch(actions.setColors(newColors));
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  let palette = [
    ...colors
  ];
  if (hasTransparentColor) {
    palette.unshift(TRANSPARENT_COLOR);
  }
  if (selectedColor && !palette.includes(selectedColor)) {
    palette.unshift(selectedColor);
  }

  if (!selectedColor) {
    setSelectedColor(palette[0]);
  }

  const shouldHideShowMoreButton = palette.length <= 7;
  const isAddDisabled = palette.length >= 21;
  const isDeleteDisabled = palette.length <= 1;

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
          <button
            className="control-button"
            data-element="addCustomColor"
            onClick={handleAddColor}
            disabled={isAddDisabled}
          >
            <Icon glyph="icon-header-zoom-in-line"/>
          </button>
          <button
            className="control-button"
            data-element="removeCustomColor"
            disabled={isDeleteDisabled}
            onClick={handleDelete}
          >
            <Icon glyph="icon-delete-line"/>
          </button>
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