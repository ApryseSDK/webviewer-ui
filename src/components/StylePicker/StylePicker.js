import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import './StylePicker.scss';
import ColorPicker from './ColorPicker';
import Slider from 'components/Slider';
import DataElements from 'constants/dataElement';
import { getStrokeSliderSteps, getStrokeDisplayValue } from 'constants/slider';
import SnapModeToggle from './SnapModeToggle';
import actions from 'actions';
import {
  hasFillColorAndCollapsablePanelSections,
  stylePanelSectionTitles,
  shouldHideStrokeDropdowns,
  shouldHideStrokeSlider,
  shouldHideOpacitySlider,
  hasSnapModeCheckbox,
  shouldHideTransparentFillColor,
  shouldHideStrokeStyle,
  shouldHideFillColorAndCollapsablePanelSections,
  useStylePanelSections,
  shouldHideCloudyLineStyle,
} from 'helpers/stylePanelHelper';
import CollapsibleSection from '../CollapsibleSection';
import StrokePanelSection from './StrokePanelSection/StrokePanelSection';
import OpacityPanelSection from './OpacityPanelSection';
import NoSharedStylePanel from '../StylePanel/panels/NoSharedStylePanel';

const propTypes = {
  activeType: PropTypes.string,
  endLineStyle: PropTypes.string,
  isFreeText: PropTypes.bool,
  isInFormFieldCreationMode: PropTypes.bool,
  hasParentPicker: PropTypes.bool,
  isRedaction: PropTypes.bool,
  isStamp: PropTypes.bool,
  isTextStylePickerHidden: PropTypes.bool,
  onLineStyleChange: PropTypes.func,
  onStyleChange: PropTypes.func.isRequired,
  redactionLabelProperties: PropTypes.object,
  showLineStyleOptions: PropTypes.bool,
  sliderProperties: PropTypes.arrayOf(PropTypes.string),
  startLineStyle: PropTypes.string,
  strokeStyle: PropTypes.string,
  style: PropTypes.object.isRequired,
  toolName: PropTypes.string,
  annotationTypes: PropTypes.arrayOf(PropTypes.string),
};

const MAX_STROKE_THICKNESS = 23;

const StylePicker = ({
  onStyleChange,
  style,
  isFreeText,
  isRedaction,
  showLineStyleOptions,
  isStamp,
  isInFormFieldCreationMode,
  startLineStyle,
  endLineStyle,
  strokeStyle,
  onLineStyleChange,
  activeTool,
  hasParentPicker,
  annotationTypes,
}) => {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const [strokeColor, setStrokeColor] = useState(style.StrokeColor);
  const [startingLineStyle, setStartingLineStyle] = useState(startLineStyle);
  const [endingLineStyle, setEndingLineStyle] = useState(endLineStyle);
  const [strokeLineStyle, setStrokeLineStyle] = useState(strokeStyle);
  const [fillColor, setFillColor] = useState(style.FillColor);

  const checkAnyAnnotationTypes = (checkFunction) => {
    if (annotationTypes && annotationTypes.length > 0) {
      return annotationTypes.some(checkFunction);
    }
    return checkFunction(activeTool);
  };

  const checkAllAnnotationTypes = (checkFunction) => {
    if (annotationTypes && annotationTypes.length > 0) {
      return annotationTypes.every(checkFunction);
    }
    return checkFunction(activeTool);
  };

  const hideOpacitySlider = checkAnyAnnotationTypes(shouldHideOpacitySlider);
  const hideStrokeStyle = checkAnyAnnotationTypes(shouldHideStrokeStyle);
  const showFillColorAndCollapsablePanelSections = checkAllAnnotationTypes(hasFillColorAndCollapsablePanelSections);
  const hideFillColorAndCollapsablePanelSections = checkAnyAnnotationTypes(shouldHideFillColorAndCollapsablePanelSections);
  const hideStrokeDropdowns = checkAnyAnnotationTypes(shouldHideStrokeDropdowns);
  const hideStrokeSlider = checkAnyAnnotationTypes(shouldHideStrokeSlider);
  const showSnapModeCheckbox = hasSnapModeCheckbox(activeTool) && !annotationTypes;
  const hideCloudyLineStyle = checkAnyAnnotationTypes(shouldHideCloudyLineStyle);

  useEffect(() => {
    if (showFillColorAndCollapsablePanelSections) {
      dispatch(actions.openElement(DataElements.STROKE_STYLE_CONTAINER));
    }
  }, [activeTool]);

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

  const {
    isSnapModeEnabled,
    isStyleOptionDisabled,
    isStrokeStyleContainerActive,
    isFillColorContainerActive,
    isOpacityContainerActive,
    openStrokeStyleContainer,
    openFillColorContainer,
    openOpacityContainer,
  } = useStylePanelSections();

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
          steps: getStrokeSliderSteps(isFreeText),
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

  const strokethicknessComponent = renderSlider('strokethickness');

  const parentProps = hasParentPicker ? {} : {
    className: 'StylePicker',
    onMouseDown: (e) => {
      if (e.type !== 'touchstart' && e.target.tagName.toUpperCase() !== 'INPUT') {
        e.preventDefault();
      }
    }
  };

  const allOptionsHidden = hideStrokeStyle && hideFillColorAndCollapsablePanelSections && hideOpacitySlider;

  if (allOptionsHidden && annotationTypes?.length > 1) {
    return <NoSharedStylePanel />;
  }

  return (
    <ParentComponent parentProps={parentProps} hasParentPicker={hasParentPicker}>
      {!hideStrokeStyle && (
        <div className="PanelSection">
          <StrokePanelSection
            showFillColorAndCollapsablePanelSections={showFillColorAndCollapsablePanelSections}
            isStamp={isStamp}
            onStrokeColorChange={onStrokeColorChange}
            onStyleChange={onStyleChange}
            strokeColor={strokeColor}
            activeTool={activeTool}
            hideStrokeDropdowns={hideStrokeDropdowns}
            hideStrokeSlider={hideStrokeSlider}
            strokethicknessComponent={strokethicknessComponent}
            showLineStyleOptions={showLineStyleOptions}
            renderSlider={renderSlider}
            strokeStyle={strokeLineStyle}
            isInFormFieldCreationMode={isInFormFieldCreationMode}
            isFreeText={isFreeText}
            onStartLineStyleChange={onStartLineStyleChange}
            startingLineStyle={startingLineStyle}
            isStyleOptionDisabled={isStyleOptionDisabled}
            onStrokeStyleChange={onStrokeStyleChange}
            strokeLineStyle={strokeLineStyle}
            onEndLineStyleChange={onEndLineStyleChange}
            endingLineStyle={endingLineStyle}
            openStrokeStyleContainer={openStrokeStyleContainer}
            isStrokeStyleContainerActive={isStrokeStyleContainerActive}
            hideCloudyLineStyle={hideCloudyLineStyle}
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
          {!hideOpacitySlider && renderDivider()}
        </div>
      )}

      <div className="PanelSection">
        <OpacityPanelSection
          showFillColorAndCollapsablePanelSections={showFillColorAndCollapsablePanelSections}
          shouldHideOpacitySlider={hideOpacitySlider}
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
    </ParentComponent>
  );
};

const ParentComponent = ({ hasParentPicker, children, parentProps }) => {
  if (hasParentPicker) {
    return <>{children}</>;
  }
  return <div {...parentProps}>{children}</div>;
};

ParentComponent.propTypes = {
  hasParentPicker: PropTypes.bool,
  children: PropTypes.any,
  parentProps: PropTypes.object,
};

StylePicker.propTypes = propTypes;

export default StylePicker;