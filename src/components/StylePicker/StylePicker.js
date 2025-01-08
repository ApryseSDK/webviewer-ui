import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import './StylePicker.scss';
import ColorPicker from './ColorPicker';
import Slider from 'components/Slider';
import DataElements from 'constants/dataElement';
import { strokeSliderSteps, getStrokeDisplayValue } from 'constants/slider';
import {
  defaultStartLineStyles,
  defaultStrokeStyles,
  defaultEndLineStyles,
  cloudyStrokeStyle
} from 'constants/strokeStyleIcons';
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
import CollapsibleSection from '../CollapsibleSection';
import StrokePanelSection from './StrokePanelSection/StrokePanelSection';
import OpacityPanelSection from './OpacityPanelSection';

const withCloudyStyle = defaultStrokeStyles.concat(cloudyStrokeStyle);

const propTypes = {
  activeType: PropTypes.string,
  endLineStyle: PropTypes.string,
  handleRichTextStyleChange: PropTypes.func,
  isArc: PropTypes.bool,
  isEllipse: PropTypes.bool,
  isFreeHand: PropTypes.bool,
  isFreeText: PropTypes.bool,
  isFreeTextAutoSize: PropTypes.bool,
  isInFormFieldCreationMode: PropTypes.bool,
  isRedaction: PropTypes.bool,
  isStamp: PropTypes.bool,
  isTextStylePickerHidden: PropTypes.bool,
  isWidget: PropTypes.bool,
  onFreeTextSizeToggle: PropTypes.func,
  onLineStyleChange: PropTypes.func,
  onStyleChange: PropTypes.func.isRequired,
  redactionLabelProperties: PropTypes.object,
  showLineStyleOptions: PropTypes.bool,
  sliderProperties: PropTypes.arrayOf(PropTypes.string),
  startLineStyle: PropTypes.string,
  strokeStyle: PropTypes.string,
  style: PropTypes.object.isRequired,
  toolName: PropTypes.string,
};

const MAX_STROKE_THICKNESS = 23;

const StylePicker = ({
  onStyleChange,
  style,
  isFreeText,
  isEllipse,
  isRedaction,
  isWidget,
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

  const onStrokeStyleChange = (style) => {
    onLineStyleChange?.('middle', style);
    setStrokeLineStyle(style);
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

    switch (type.toLowerCase()) {
      case 'opacity':
        if (Opacity === null) {
          return null;
        }
        return {
          property: 'Opacity',
          displayProperty: 'opacity',
          value: Opacity * 100,
          getDisplayValue: (Opacity) => `${Math.round(Opacity)}%`,
          dataElement: DataElements.OPACITY_SLIDER,
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
          getDisplayValue: getStrokeDisplayValue,
          dataElement: DataElements.STROKE_THICKNESS_SLIDER,
          withInputField: true,
          inputFieldType: 'number',
          min: 0,
          max: MAX_STROKE_THICKNESS,
          step: 1,
          steps: strokeSliderSteps,
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
        customCircleRadius={8}
        customLineStrokeWidth={5}
      />
    );
  };

  const renderDivider = () => {
    if (showFillColorAndCollapsablePanelSections) {
      return <div className="divider" />;
    }
  };

  const onOpenProps = useOnFreeTextEdit(saveEditorInstance);
  const strokethicknessComponent = renderSlider('strokethickness');
  const middleLineSegmentLabel = showLineStyleOptions ? 'stylePanel.lineEnding.middle' : 'stylePanel.borderStyle';

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
          <CollapsibleSection
            header={t(stylePanelSectionTitles(activeTool, 'OverlayText') || 'option.stylePopup.textStyle')}
            headingLevel={2}
            isInitiallyExpanded={false}
            isExpanded={isTextStyleContainerActive}
            onToggle={openTextStyleContainer}>
            <div className="panel-section-wrapper">
              {isRedaction && (
                <div className="PanelSubsection RedactionTextLabel">
                  <div className="menu-subtitle">{t('stylePanel.headings.redactionTextLabel')}</div>
                  <LabelTextEditor properties={style} onPropertyChange={onStyleChange} placeholderText={' '} />
                </div>
              )}
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
                isWidget={isWidget}
              />
            </div>
          </CollapsibleSection>
          {renderDivider()}
        </div>
      )}

      {!hideStrokeStyle && (
        <div className="PanelSection">
          <StrokePanelSection
            showFillColorAndCollapsablePanelSections={showFillColorAndCollapsablePanelSections}
            isStamp={isStamp}
            onStrokeColorChange={onStrokeColorChange}
            onStyleChange={onStyleChange}
            strokeColor={strokeColor}
            activeTool={activeTool}
            hideStrokeSlider={hideStrokeSlider}
            strokethicknessComponent={strokethicknessComponent}
            showLineStyleOptions={showLineStyleOptions}
            renderSlider={renderSlider}
            strokeStyle={strokeLineStyle}
            isInFormFieldCreationMode={isInFormFieldCreationMode}
            isFreeText={isFreeText}
            isFreeHand={isFreeHand}
            isArc={isArc}
            onStartLineStyleChange={onStartLineStyleChange}
            startingLineStyle={startingLineStyle}
            isStyleOptionDisabled={isStyleOptionDisabled}
            onStrokeStyleChange={onStrokeStyleChange}
            strokeLineStyle={strokeLineStyle}
            middleLineSegmentLabel={middleLineSegmentLabel}
            isEllipse={isEllipse}
            withCloudyStyle={withCloudyStyle}
            onEndLineStyleChange={onEndLineStyleChange}
            endingLineStyle={endingLineStyle}
            defaultStartLineStyles={defaultStartLineStyles}
            defaultStrokeStyles={defaultStrokeStyles}
            defaultEndLineStyles={defaultEndLineStyles}
            openStrokeStyleContainer={openStrokeStyleContainer}
            isStrokeStyleContainerActive={isStrokeStyleContainerActive}
            stylePanelSectionTitles={stylePanelSectionTitles}
          />
          {renderDivider()}
        </div>
      )}

      {hideStrokeStyle && !hideStrokeSlider && strokethicknessComponent && (strokethicknessComponent)}
      {showFillColorAndCollapsablePanelSections && !hideFillColorAndCollapsablePanelSections && (
        <div className="PanelSection">
          <CollapsibleSection
            header={t(stylePanelSectionTitles(activeTool, 'FillColor') || 'option.annotationColor.FillColor')}
            headingLevel={2}
            isInitiallyExpanded={false}
            isExpanded={isFillColorContainerActive}
            onToggle={openFillColorContainer}>
            <div className="panel-section-wrapper">
              <div className="menu-items">
                <ColorPicker
                  onColorChange={onFillColorChange}
                  onStyleChange={onStyleChange}
                  color={fillColor}
                  hasTransparentColor={!shouldHideTransparentFillColor(activeTool)}
                  activeTool={activeTool}
                  type={'Fill'}
                  ariaTypeLabel={t('option.annotationColor.FillColor')}
                />
              </div>
            </div>
          </CollapsibleSection>
          {!shouldHideOpacitySlider(activeTool) && renderDivider()}
        </div>
      )}

      <div className="PanelSection">
        <OpacityPanelSection
          showFillColorAndCollapsablePanelSections={showFillColorAndCollapsablePanelSections}
          shouldHideOpacitySlider={shouldHideOpacitySlider}
          activeTool={activeTool}
          showLineStyleOptions={showLineStyleOptions}
          renderSlider={renderSlider}
          isOpacityContainerActive={isOpacityContainerActive}
          openOpacityContainer={openOpacityContainer}
        />
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