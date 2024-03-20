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
import {
  defaultStartLineStyles,
  defaultStrokeStyles,
  defaultEndLineStyles,
  cloudyStrokeStyle
} from 'constants/strokeStyleIcons';
import Icon from 'components/Icon';
import SnapModeToggle from './SnapModeToggle';
import selectors from 'selectors';
import actions from 'actions';
import {
  hasFillColorAndCollapsablePanelSections,
  stylePanelSectionTitles,
  shouldHideStrokeSlider,
  shouldHideOpacitySlider,
  hasSnapModeCheckbox,
  shouldShowTextStyle,
  shouldHideTransparentFillColor,
  shouldHideStrokeStyle,
  shouldHideFillColorAndCollapsablePanelSections,
} from 'helpers/stylePanelHelper';
import useOnFreeTextEdit from 'hooks/useOnFreeTextEdit';
import RichTextStyleEditor from '../RichTextStyleEditor';
import LabelTextEditor from 'components/LabelTextEditor';

const withCloudyStyle = defaultStrokeStyles.concat(cloudyStrokeStyle);

const propTypes = {
  onStyleChange: PropTypes.func.isRequired,
  style: PropTypes.object.isRequired,
  sliderProperties: PropTypes.arrayOf(PropTypes.string),
  isFreeText: PropTypes.bool,
  isEllipse: PropTypes.bool,
  isRedaction: PropTypes.bool,
  isTextStylePickerHidden: PropTypes.bool,
  redactionLabelProperties: PropTypes.object,
  isFreeHand: PropTypes.bool,
  showLineStyleOptions: PropTypes.bool,
  isArc: PropTypes.bool,
  isStamp: PropTypes.bool,
  isInFormFieldCreationMode: PropTypes.bool,
  startLineStyle: PropTypes.string,
  endLineStyle: PropTypes.string,
  strokeStyle: PropTypes.string,
  onLineStyleChange: PropTypes.func,
  toolName: PropTypes.string,
  onFreeTextSizeToggle: PropTypes.func,
  isFreeTextAutoSize: PropTypes.bool,
  handleRichTextStyleChange: PropTypes.func,
  activeType: PropTypes.string,
};

const MAX_STROKE_THICKNESS = 20;

const StylePicker = ({
  onStyleChange,
  style,
  isFreeText,
  isEllipse,
  isRedaction,
  isTextStylePickerHidden,
  isFreeHand,
  showLineStyleOptions,
  isArc,
  isStamp,
  isInFormFieldCreationMode,
  startLineStyle,
  endLineStyle,
  strokeStyle,
  onLineStyleChange,
  onFreeTextSizeToggle,
  isFreeTextAutoSize,
  handleRichTextStyleChange,
  activeTool,
  saveEditorInstance,
}) => {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const [isRichTextEditMode, setIsRichTextEditMode] = useState(false);
  const [strokeColor, setStrokeColor] = useState(style.StrokeColor);
  const [startingLineStyle, setStartingLineStyle] = useState(startLineStyle);
  const [endingLineStyle, setEndingLineStyle] = useState(endLineStyle);
  const [strokeLineStyle, setStrokeLineStyle] = useState(strokeStyle);
  const [fillColor, setFillColor] = useState(style.FillColor);

  const hideStrokeStyle = shouldHideStrokeStyle(activeTool);
  const showFillColorAndCollapsablePanelSections = hasFillColorAndCollapsablePanelSections(activeTool);
  const hideFillColorAndCollapsablePanelSections = shouldHideFillColorAndCollapsablePanelSections(activeTool);
  const hideStrokeSlider = shouldHideStrokeSlider(activeTool);
  const showSnapModeCheckbox = hasSnapModeCheckbox(activeTool);
  const showTextStyle = shouldShowTextStyle(activeTool);

  useEffect(() => {
    if (showFillColorAndCollapsablePanelSections) {
      if (showTextStyle) {
        dispatch(actions.openElement(DataElements.RICH_TEXT_STYLE_CONTAINER));
      } else {
        dispatch(actions.openElement(DataElements.STROKE_STYLE_CONTAINER));
      }
    }
  }, [activeTool]);

  useEffect(() => {
    if (isRichTextEditMode) {
      dispatch(actions.closeElement(DataElements.ANNOTATION_POPUP));
    }
  }, [isRichTextEditMode]);

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
    isTextStyleContainerActive,
  ] = useSelector((state) => [
    selectors.isSnapModeEnabled(state),
    selectors.isElementDisabled(state, DataElements.STYLE_OPTION),
    selectors.isElementOpen(state, DataElements.STROKE_STYLE_CONTAINER),
    selectors.isElementOpen(state, DataElements.FILL_COLOR_CONTAINER),
    selectors.isElementOpen(state, DataElements.OPACITY_CONTAINER),
    selectors.isElementOpen(state, DataElements.RICH_TEXT_STYLE_CONTAINER),
  ]);

  const panelItems = {
    [DataElements.STROKE_STYLE_CONTAINER]: isStrokeStyleContainerActive,
    [DataElements.FILL_COLOR_CONTAINER]: isFillColorContainerActive,
    [DataElements.OPACITY_CONTAINER]: isOpacityContainerActive,
    [DataElements.RICH_TEXT_STYLE_CONTAINER]: isTextStyleContainerActive,
  };

  const togglePanelItem = (dataElement) => {
    if (!panelItems[dataElement]) {
      dispatch(actions.openElement(dataElement));
    } else {
      dispatch(actions.closeElement(dataElement));
    }
  };
  const openTextStyleContainer = () => {
    dispatch(actions.openElements(DataElements.RICH_TEXT_EDITOR));
    togglePanelItem(DataElements.RICH_TEXT_STYLE_CONTAINER);
  };
  const openStrokeStyleContainer = () => togglePanelItem(DataElements.STROKE_STYLE_CONTAINER);
  const openFillColorContainer = () => togglePanelItem(DataElements.FILL_COLOR_CONTAINER);
  const openOpacityContainer = () => togglePanelItem(DataElements.OPACITY_CONTAINER);

  const getSliderProps = (type) => {
    const { Opacity, StrokeThickness, FontSize } = style;

    const lineStart = circleRadius;
    switch (type.toLowerCase()) {
      case 'opacity':
        if (Opacity === null) {
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
        if (StrokeThickness === null) {
          return null;
        }
        return {
          property: 'StrokeThickness',
          displayProperty: 'thickness',
          value: StrokeThickness,
          getDisplayValue: (strokeThickness) => {
            const placeOfDecimal =
              Math.floor(strokeThickness) !== strokeThickness
                ? strokeThickness?.toString().split('.')[1].length || 0
                : 0;
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
      case 'fontsize':
        if (FontSize === null) {
          return null;
        }
        return {
          property: 'FontSize',
          displayProperty: 'text',
          value: FontSize,
          getDisplayValue: (FontSize) => `${Math.round(parseInt(FontSize, 10))}pt`,
          dataElement: DataElements.FONT_SIZE_SLIDER,
          getCirclePosition: (lineLength, FontSize) => ((parseInt(FontSize, 10) - 5) / 40) * lineLength + lineStart,
          convertRelativeCirclePositionToValue: (circlePosition) => `${circlePosition * 40 + 5}pt`,
          min: 5,
          max: 45,
          step: 1,
          withInputField: true,
          inputFieldType: 'number',
          getLocalValue: (FontSize) => `${parseFloat(FontSize).toFixed(2)}pt`,
        };
    }
  };

  const renderSlider = (property, shouldHideSliderTitle) => {
    const sliderProps = getSliderProps(property);
    if (!sliderProps) {
      return null;
    }
    return (
      <Slider
        key={property}
        {...sliderProps}
        onStyleChange={onSliderChange}
        onSliderChange={onSliderChange}
        shouldHideSliderTitle={shouldHideSliderTitle}
      />
    );
  };

  const renderDivider = () => {
    if (showFillColorAndCollapsablePanelSections) {
      return <div className="divider" />;
    }
  };

  const onOpenProps = useOnFreeTextEdit(saveEditorInstance);
  const textSizeSlider = (isTextStylePickerHidden) ? <div className="StyleOption text-size-slider">{renderSlider('fontsize')}</div> : null;
  const strokethicknessComponent = renderSlider('strokethickness');

  return (
    <div
      className="StylePicker"
      onMouseDown={(e) => {
        if (e.type !== 'touchstart' && e.target.tagName.toUpperCase() !== 'INPUT') {
          e.preventDefault();
        }
      }}
    >
      {showTextStyle && (
        <div className="PanelSection TextStyle">
          <div
            className="collapsible-menu"
            onClick={openTextStyleContainer}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && openTextStyleContainer()}
            role={'toolbar'}
          >
            <div
              className="menu-title">{t(stylePanelSectionTitles(activeTool, 'OverlayText') || 'option.stylePopup.textStyle')}</div>
            <div className="icon-container">
              <Icon glyph={`icon-chevron-${isTextStyleContainerActive ? 'up' : 'down'}`} />
            </div>
          </div>
          {isTextStyleContainerActive && isRedaction && (
            <div className="PanelSubsection RedactionTextLabel">
              <div className="menu-subtitle">{t('stylePanel.headings.redactionTextLabel')}</div>
              <LabelTextEditor properties={style} onPropertyChange={onStyleChange} placeholderText={t('stylePanel.headings.redactionTextPlaceholder')} />
            </div>
          )}
          {isTextStyleContainerActive && (
            <RichTextStyleEditor
              style={style}
              {...onOpenProps}
              property={'TextColor'}
              colorMapKey={'freeText'}
              isFreeTextAutoSize={isFreeTextAutoSize}
              onFreeTextSizeToggle={onFreeTextSizeToggle}
              onPropertyChange={onStyleChange}
              onRichTextStyleChange={handleRichTextStyleChange}
              isRichTextEditMode={isRichTextEditMode}
              setIsRichTextEditMode={setIsRichTextEditMode}
              isRedaction={isRedaction}
              activeTool={activeTool}
              isTextStylePickerHidden={isTextStylePickerHidden}
              textSizeSliderComponent={textSizeSlider}
            />
          )}
          {renderDivider()}
        </div>
      )}

      {!hideStrokeStyle && (
        <div className="PanelSection">
          {showFillColorAndCollapsablePanelSections && (
            <div
              className="collapsible-menu StrokeColorPicker"
              onClick={openStrokeStyleContainer}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && openStrokeStyleContainer()}
              role={'toolbar'}
            >
              <div className="menu-title">
                {t(stylePanelSectionTitles(activeTool, 'StrokeColor') || 'option.annotationColor.StrokeColor')}
              </div>
              <div className="icon-container">
                <Icon glyph={`icon-chevron-${isStrokeStyleContainerActive ? 'up' : 'down'}`} />
              </div>
            </div>
          )}
          {(isStrokeStyleContainerActive || !showFillColorAndCollapsablePanelSections) && !isStamp && (
            <>
              <div className="menu-items">
                <ColorPicker onColorChange={onStrokeColorChange} onStyleChange={onStyleChange} color={strokeColor}
                  activeTool={activeTool} type={'Stroke'}/>
              </div>
              {!hideStrokeSlider && strokethicknessComponent && (strokethicknessComponent)}
              {/*
                When showLineStyleOptions is true, we want to show the opacity slider together with the stroke slider
              */}
              {showLineStyleOptions && <div className="StyleOption">{renderSlider('opacity')}</div>}
              {!!strokeStyle && !(isInFormFieldCreationMode && !isFreeText) && !isFreeHand && !isArc && (
                <div className="StyleOption">
                  <div className="styles-container lineStyleContainer">
                    <div className="styles-title">Style</div>
                    <div className="StylePicker-LineStyle">
                      {showLineStyleOptions && (
                        <Dropdown
                          className="StylePicker-StartLineStyleDropdown"
                          dataElement="startLineStyleDropdown"
                          images={defaultStartLineStyles}
                          onClickItem={onStartLineStyleChange}
                          currentSelectionKey={startingLineStyle}
                        />
                      )}
                      {!isStyleOptionDisabled && (
                        <Dropdown
                          className={`StylePicker-StrokeLineStyleDropdown${
                            !!strokeStyle && !showLineStyleOptions ? ' StyleOptions' : ''
                          }`}
                          dataElement="middleLineStyleDropdown"
                          images={isEllipse || showLineStyleOptions ? defaultStrokeStyles : withCloudyStyle}
                          onClickItem={onStrokeStyleChange}
                          currentSelectionKey={strokeLineStyle}
                        />
                      )}
                      {showLineStyleOptions && (
                        <Dropdown
                          className="StylePicker-EndLineStyleDropdown"
                          dataElement="endLineStyleDropdown"
                          images={defaultEndLineStyles}
                          onClickItem={onEndLineStyleChange}
                          currentSelectionKey={endingLineStyle}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          {renderDivider()}
        </div>
      )}
      {hideStrokeStyle && !hideStrokeSlider && strokethicknessComponent && (strokethicknessComponent)}
      {showFillColorAndCollapsablePanelSections && !hideFillColorAndCollapsablePanelSections && (
        <div className="PanelSection">
          <div
            className="collapsible-menu FillColorPicker"
            onClick={openFillColorContainer}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && openFillColorContainer()}
            role={'toolbar'}
          >
            <div className="menu-title">
              {t(stylePanelSectionTitles(activeTool, 'FillColor') || 'option.annotationColor.FillColor')}
            </div>
            <div className="icon-container">
              <Icon glyph={`icon-chevron-${isFillColorContainerActive ? 'up' : 'down'}`} />
            </div>
          </div>
          {isFillColorContainerActive && (
            <div className="menu-items">
              <ColorPicker
                onColorChange={onFillColorChange}
                onStyleChange={onStyleChange}
                color={fillColor}
                hasTransparentColor={!shouldHideTransparentFillColor(activeTool)}
                activeTool={activeTool}
                type={'Fill'}
              />
            </div>
          )}
          {!shouldHideOpacitySlider(activeTool) && renderDivider()}
        </div>
      )}

      <div className="PanelSection">
        {showFillColorAndCollapsablePanelSections && !shouldHideOpacitySlider(activeTool) && (
          <div
            className="collapsible-menu StrokeColorPicker"
            onClick={openOpacityContainer}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && openOpacityContainer()}
            role={'toolbar'}
          >
            <div className="menu-title">{t('option.slider.opacity')}</div>
            <div className="icon-container">
              <Icon glyph={`icon-chevron-${isOpacityContainerActive ? 'up' : 'down'}`} />
            </div>
          </div>
        )}
        {/*
          If showLineStyleOptions is true, then we don't want to show the opacity slider
          in the bottom because it is already shown before together with the stroke slider
        */}
        {!showLineStyleOptions && !shouldHideOpacitySlider(activeTool) && (isOpacityContainerActive || !showFillColorAndCollapsablePanelSections) && (
          <div className="StyleOption">{renderSlider('opacity', showFillColorAndCollapsablePanelSections)}</div>
        )}
        {showSnapModeCheckbox && renderDivider()}
      </div>
      {showSnapModeCheckbox && (
        <>
          {/* to avoid inline styling when there's no divider */}
          {!showFillColorAndCollapsablePanelSections && <div className="spacer" />}
          <div className="PanelSection">
            <SnapModeToggle Scale={style.Scale} Precision={style.Precision} isSnapModeEnabled={isSnapModeEnabled} />
          </div>
        </>
      )}
    </div>
  );
};

StylePicker.propTypes = propTypes;

export default StylePicker;