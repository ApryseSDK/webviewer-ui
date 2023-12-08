import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import './StylePicker.scss';
import ColorPicker from './ColorPicker';
import Slider from 'components/Slider';
import DataElements from 'constants/dataElement';
import { circleRadius } from 'constants/slider';
import Dropdown from '../Dropdown';
import { defaultStartLineStyles, defaultStrokeStyles, defaultEndLineStyles, cloudyStrokeStyle } from 'constants/strokeStyleIcons';
import Icon from 'components/Icon';
import SnapModeToggle from './SnapModeToggle';
import selectors from 'selectors';
import actions from 'actions';
import { hasFillColorAndCollapsablePanelSections, shouldHideStrokeSlider } from 'helpers/stylePanelHelper';

const withCloudyStyle = defaultStrokeStyles.concat(cloudyStrokeStyle);

const propTypes = {
  onStyleChange: PropTypes.func.isRequired,
  style: PropTypes.object.isRequired,
  sliderProperties: PropTypes.arrayOf(PropTypes.string),
  isFreeText: PropTypes.bool,
  isEllipse: PropTypes.bool,
  isRedaction: PropTypes.bool,
  isFreeHand: PropTypes.bool,
  showLineStyleOptions: PropTypes.bool,
  isArc: PropTypes.bool,
  isInFormBuilderMode: PropTypes.bool,
  hideSnapModeCheckbox: PropTypes.bool,
  startLineStyle: PropTypes.string,
  endLineStyle: PropTypes.string,
  strokeStyle: PropTypes.string,
  onLineStyleChange: PropTypes.func,
  toolName: PropTypes.string,
};

const MAX_STROKE_THICKNESS = 20;

const StylePicker = ({
  onStyleChange,
  style,
  isFreeText,
  isEllipse,
  isRedaction,
  isFreeHand,
  showLineStyleOptions,
  isArc,
  isInFormBuilderMode,
  hideSnapModeCheckbox,
  startLineStyle,
  endLineStyle,
  strokeStyle,
  onLineStyleChange,
  toolName
}) => {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const [strokeColor, setStrokeColor] = useState(style.StrokeColor);
  const [startingLineStyle, setStartingLineStyle] = useState(startLineStyle);
  const [endingLineStyle, setEndingLineStyle] = useState(endLineStyle);
  const [strokeLineStyle, setStrokeLineStyle] = useState(strokeStyle);
  const [fillColor, setFillColor] = useState(style.FillColor);

  useEffect(() => {
    setStrokeColor(style.StrokeColor);
    setFillColor(style.FillColor);
  }, [strokeColor, fillColor, style]);

  useEffect(() => {
    setStrokeColor(style.StrokeColor);
    setStartingLineStyle(startLineStyle);
    setStrokeLineStyle(strokeStyle);
    setEndingLineStyle(endLineStyle);
  }, [startLineStyle, endLineStyle, strokeStyle]);

  const onStrokeColorChange = (color) => {
    onStyleChange?.('StrokeColor', color);
    setStrokeColor(color);
  };

  const onStartLineStyleChange = (style) => {
    onLineStyleChange?.('start', style);
    setStartingLineStyle(style);
  };

  const onStrokeStyleChange = (style, value) => {
    if (value) {
      onLineStyleChange?.(style, value);
      setStrokeLineStyle(value);
    } else {
      onLineStyleChange?.('middle', style);
      setStrokeLineStyle(style);
    }
  };

  const onEndLineStyleChange = (style) => {
    onLineStyleChange?.('end', style);
    setEndingLineStyle(style);
  };

  const onFillColorChange = (color) => {
    onStyleChange?.('FillColor', color);
    setFillColor(color);
  };

  const onSliderChange = (property, value) => {
    onStyleChange?.(property, value);
  };

  // We do not have sliders to show up for redaction annots
  if (isRedaction) {
    style.Opacity = null;
    style.StrokeThickness = null;
  }

  const [
    isSnapModeEnabled,
    isStyleOptionDisabled,
    isStrokeStyleContainerActive,
    isFillColorContainerActive,
    isOpacityContainerActive,
  ] = useSelector((state) => [
    selectors.isSnapModeEnabled(state),
    selectors.isElementDisabled(state, DataElements.STYLE_OPTION),
    selectors.isElementOpen(state, DataElements.STROKE_STYLE_CONTAINER),
    selectors.isElementOpen(state, DataElements.FILL_COLOR_CONTAINER),
    selectors.isElementOpen(state, DataElements.OPACITY_CONTAINER),
  ]);

  const panelItems = {
    [DataElements.STROKE_STYLE_CONTAINER]: isStrokeStyleContainerActive,
    [DataElements.FILL_COLOR_CONTAINER]: isFillColorContainerActive,
    [DataElements.OPACITY_CONTAINER]: isOpacityContainerActive,
  };

  const togglePanelItem = (dataElement) => {
    if (!panelItems[dataElement]) {
      dispatch(actions.openElement(dataElement));
    } else {
      dispatch(actions.closeElement(dataElement));
    }
  };
  const openStrokeStyleContainer = () => togglePanelItem(DataElements.STROKE_STYLE_CONTAINER);
  const openFillColorContainer = () => togglePanelItem(DataElements.FILL_COLOR_CONTAINER);
  const openOpacityContainer = () => togglePanelItem(DataElements.OPACITY_CONTAINER);

  const getSliderProps = (type) => {
    const { Opacity, StrokeThickness } = style;

    const lineStart = circleRadius;
    switch (type.toLowerCase()) {
      case 'opacity':
        if (!Opacity) {
          return null;
        }
        return {
          property: 'Opacity',
          displayProperty: 'opacity',
          value: Opacity,
          getDisplayValue: (Opacity) => `${Math.round(Opacity * 100)}%`,
          dataElement: DataElements.OPACITY_SLIDER,
          getCirclePosition: (lineLength, Opacity) => Opacity * lineLength + lineStart,
          convertRelativeCirclePositionToValue: (circlePosition) => circlePosition,
          withInputField: true,
          inputFieldType: 'number',
          min: 0,
          max: 100,
          step: 1,
          getLocalValue: (opacity) => parseInt(opacity) / 100,
        };
      case 'strokethickness':
        if (!StrokeThickness) {
          return null;
        }
        return {
          property: 'StrokeThickness',
          displayProperty: 'thickness',
          value: StrokeThickness,
          getDisplayValue: (strokeThickness) => {
            const placeOfDecimal =
              Math.floor(strokeThickness) !== strokeThickness ? strokeThickness?.toString().split('.')[1].length || 0 : 0;
            if (StrokeThickness === 0 || (StrokeThickness >= 1 && (placeOfDecimal > 2 || placeOfDecimal === 0))) {
              return `${Math.round(strokeThickness)}pt`;
            }
            return `${parseFloat(strokeThickness).toFixed(2)}pt`;
          },
          dataElement: DataElements.STROKE_THICKNESS_SLIDER,
          getCirclePosition: (lineLength, strokeThickness) => (strokeThickness / MAX_STROKE_THICKNESS) * lineLength + lineStart,
          convertRelativeCirclePositionToValue: (circlePosition) => {
            if (circlePosition >= 1 / MAX_STROKE_THICKNESS) {
              return Math.round(circlePosition * MAX_STROKE_THICKNESS);
            }
            if (circlePosition >= 0.75 / MAX_STROKE_THICKNESS && circlePosition < 1 / MAX_STROKE_THICKNESS) {
              return 0.75;
            }
            if (circlePosition >= 0.5 / MAX_STROKE_THICKNESS && circlePosition < 0.75 / MAX_STROKE_THICKNESS) {
              return 0.5;
            }
            if (circlePosition >= 0.25 / MAX_STROKE_THICKNESS && circlePosition < 0.5 / MAX_STROKE_THICKNESS) {
              return 0.25;
            }
            if (circlePosition >= 0.08 / MAX_STROKE_THICKNESS && circlePosition < 0.25 / MAX_STROKE_THICKNESS) {
              return 0.1;
            }
            return isFreeText ? 0 : 0.1;
          },
          withInputField: true,
          inputFieldType: 'number',
          min: isFreeText ? 0 : 0.1,
          max: MAX_STROKE_THICKNESS,
          step: 1,
          getLocalValue: (strokeThickness) => parseFloat(strokeThickness).toFixed(2),
        };
    }
  };

  const renderSlider = (property, shouldHideSliderTitle) => {
    const sliderProps = getSliderProps(property);
    if (!sliderProps) {
      return null;
    }
    return <Slider key={property} {...sliderProps} onStyleChange={onSliderChange} onSliderChange={onSliderChange} shouldHideSliderTitle={shouldHideSliderTitle} />;
  };

  const renderDivider = () => {
    if (showFillColorAndCollapsablePanelSections) {
      return <div className="divider" />;
    }
  };

  const showStrokeStyle = true;
  const showFillColorAndCollapsablePanelSections = hasFillColorAndCollapsablePanelSections(toolName);
  const hideStrokeSlider = shouldHideStrokeSlider(toolName);

  return (
    <div className="StylePicker">
      {showStrokeStyle && (
        <div className="PanelSection">
          {
            showFillColorAndCollapsablePanelSections &&
            <div className="collapsible-menu StrokeColorPicker" onClick={openStrokeStyleContainer} onTouchStart={openStrokeStyleContainer}
              tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && openStrokeStyleContainer()} role={'toolbar'}>
              <div className="menu-title">
                {t('option.annotationColor.StrokeColor')}
              </div>
              <Icon glyph={`icon-chevron-${isStrokeStyleContainerActive ? 'up' : 'down'}`} />
            </div>
          }
          {(isStrokeStyleContainerActive || !showFillColorAndCollapsablePanelSections) && (
            <>
              <div className="menu-items">
                <ColorPicker
                  onColorChange={onStrokeColorChange}
                  onStyleChange={onStyleChange}
                  color={strokeColor}
                />
              </div>
              {!hideStrokeSlider && (
                <div className="StyleOption" >
                  {renderSlider('strokethickness')}
                </div>
              )}
              {/*
                When showLineStyleOptions is true, we want to show the opacity slider together with the stroke slider
              */}
              {
                showLineStyleOptions &&
                <div className="StyleOption">
                  {renderSlider('opacity')}
                </div>
              }
              {!!strokeStyle && !(isInFormBuilderMode && !isFreeText) && !isFreeHand && !isArc &&
                <div className='StylePicker-LineStyleContainer'>
                  <div className="StylePicker-LineStyleTitle">Style</div>
                  <div className='StylePicker-LineStyle'>
                    {showLineStyleOptions &&
                      <Dropdown
                        className='StylePicker-StartLineStyleDropdown'
                        dataElement="startLineStyleDropdown"
                        images={defaultStartLineStyles}
                        onClickItem={onStartLineStyleChange}
                        currentSelectionKey={startingLineStyle}
                      />
                    }
                    {!isStyleOptionDisabled &&
                      <Dropdown
                        className={`StylePicker-StrokeLineStyleDropdown${(!!strokeStyle && !showLineStyleOptions) ? ' StyleOptions' : ''}`}
                        dataElement="middleLineStyleDropdown"
                        images={ (isEllipse || showLineStyleOptions) ? defaultStrokeStyles : withCloudyStyle }
                        onClickItem={onStrokeStyleChange}
                        currentSelectionKey={strokeLineStyle}
                      />
                    }
                    {showLineStyleOptions &&
                      <Dropdown
                        className='StylePicker-EndLineStyleDropdown'
                        dataElement="endLineStyleDropdown"
                        images={defaultEndLineStyles}
                        onClickItem={onEndLineStyleChange}
                        currentSelectionKey={endingLineStyle}
                      />
                    }
                  </div>
                </div>
              }
            </>
          )}
          {renderDivider()}
        </div>
      )}
      {showFillColorAndCollapsablePanelSections && (
        <div className="PanelSection">
          <div className="collapsible-menu FillColorPicker" onClick={openFillColorContainer} onTouchStart={openFillColorContainer}
            tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && openFillColorContainer()} role={'toolbar'}>
            <div className="menu-title">
              {t('option.annotationColor.FillColor')}
            </div>
            <Icon glyph={`icon-chevron-${isFillColorContainerActive ? 'up' : 'down'}`} />
          </div>
          {isFillColorContainerActive && (
            <div className="menu-items">
              <ColorPicker
                onColorChange={onFillColorChange}
                onStyleChange={onStyleChange}
                color={fillColor}
                hasTransparentColor={true}
              />
            </div>
          )}
          {renderDivider()}
        </div>
      )}

      <div className="PanelSection">
        {
          showFillColorAndCollapsablePanelSections &&
          <div className="collapsible-menu StrokeColorPicker" onClick={openOpacityContainer} onTouchStart={openOpacityContainer}
            tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && openOpacityContainer()} role={'toolbar'}>
            <div className="menu-title">
              {t('option.slider.opacity')}
            </div>
            <Icon glyph={`icon-chevron-${isOpacityContainerActive ? 'up' : 'down'}`} />
          </div>
        }
        {/*
          If showLineStyleOptions is true, then we don't want to show the opacity slider
          in the bottom because it is already shown before together with the stroke slider
        */}
        {(!showLineStyleOptions && (isOpacityContainerActive || !showFillColorAndCollapsablePanelSections)) && (
          <div className="StyleOption">
            {renderSlider('opacity', showFillColorAndCollapsablePanelSections)}
          </div>
        )}
      </div>
      {!hideSnapModeCheckbox &&
        <SnapModeToggle Scale={style.Scale} Precision={style.Precision} isSnapModeEnabled={isSnapModeEnabled} />
      }
    </div>
  );
};

StylePicker.propTypes = propTypes;

export default StylePicker;