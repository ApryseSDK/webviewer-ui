import { useTranslation } from 'react-i18next';
import React from 'react';
import ColorPicker from '../ColorPicker';
import Dropdown from '../../Dropdown';
import CollapsibleSection from 'src/components/CollapsibleSection';
import PropTypes from 'prop-types';

const StrokePanelSection = ({
  showFillColorAndCollapsablePanelSections,
  isStamp,
  onStrokeColorChange,
  onStyleChange,
  strokeColor,
  activeTool,
  hideStrokeSlider,
  strokethicknessComponent,
  showLineStyleOptions,
  renderSlider,
  strokeStyle,
  isInFormFieldCreationMode,
  isFreeText,
  isFreeHand,
  isArc,
  onStartLineStyleChange,
  startingLineStyle,
  isStyleOptionDisabled,
  onStrokeStyleChange,
  strokeLineStyle,
  middleLineSegmentLabel,
  isEllipse,
  withCloudyStyle,
  onEndLineStyleChange,
  endingLineStyle,
  defaultStartLineStyles,
  defaultStrokeStyles,
  defaultEndLineStyles,
  openStrokeStyleContainer,
  isStrokeStyleContainerActive,
  stylePanelSectionTitles,
}) => {
  const [t] = useTranslation();

  const sectionContent = (
    <div className="panel-section-wrapper">
      {!isStamp && (
        <>
          <div className="menu-items">
            <ColorPicker onColorChange={onStrokeColorChange} onStyleChange={onStyleChange} color={strokeColor}
              activeTool={activeTool} type={'Stroke'} ariaTypeLabel={t('option.annotationColor.StrokeColor')}/>
          </div>
          {!hideStrokeSlider && strokethicknessComponent && (strokethicknessComponent)}
          {/*
            When showLineStyleOptions is true, we want to show the opacity slider together with the stroke slider
          */}
          {showLineStyleOptions && <div className="StyleOption">{renderSlider('opacity')}</div>}
          {!!strokeStyle && !(isInFormFieldCreationMode && !isFreeText) && !isFreeHand && !isArc && (
            <div className="StyleOption">
              <div className="styles-container lineStyleContainer">
                <div className="styles-title">{t('option.styleOption.style')}</div>
                <div className="StylePicker-LineStyle">
                  {showLineStyleOptions && (
                    <Dropdown
                      id="startLineStyleDropdown"
                      translationPrefix="stylePanel.lineEnding.start"
                      className="StylePicker-StartLineStyleDropdown"
                      dataElement="startLineStyleDropdown"
                      images={defaultStartLineStyles}
                      onClickItem={onStartLineStyleChange}
                      currentSelectionKey={startingLineStyle}
                      showLabelInList
                    />
                  )}
                  {!isStyleOptionDisabled && (
                    <Dropdown
                      id="middleLineStyleDropdown"
                      translationPrefix={middleLineSegmentLabel}
                      className={`StylePicker-StrokeLineStyleDropdown${!!strokeStyle && !showLineStyleOptions ? ' StyleOptions' : ''
                      }`}
                      dataElement="middleLineStyleDropdown"
                      images={isEllipse || showLineStyleOptions ? defaultStrokeStyles : withCloudyStyle}
                      onClickItem={onStrokeStyleChange}
                      currentSelectionKey={strokeLineStyle}
                      showLabelInList
                    />
                  )}
                  {showLineStyleOptions && (
                    <Dropdown
                      id="endLineStyleDropdown"
                      translationPrefix="stylePanel.lineEnding.end"
                      className="StylePicker-EndLineStyleDropdown"
                      dataElement="endLineStyleDropdown"
                      images={defaultEndLineStyles}
                      onClickItem={onEndLineStyleChange}
                      currentSelectionKey={endingLineStyle}
                      showLabelInList
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  if (!showFillColorAndCollapsablePanelSections) {
    return sectionContent;
  }

  return (
    <CollapsibleSection
      header={t(stylePanelSectionTitles(activeTool, 'StrokeColor') || 'option.annotationColor.StrokeColor')}
      headingLevel={2}
      isInitiallyExpanded={false}
      onToggle={openStrokeStyleContainer}
      shouldShowHeading={showFillColorAndCollapsablePanelSections}
      isExpanded={(isStrokeStyleContainerActive || !showFillColorAndCollapsablePanelSections)}>
      { sectionContent }
    </CollapsibleSection>
  );
};

export default StrokePanelSection;

StrokePanelSection.propTypes = {
  showFillColorAndCollapsablePanelSections: PropTypes.bool,
  isStamp: PropTypes.bool,
  onStrokeColorChange: PropTypes.func,
  onStyleChange: PropTypes.func,
  strokeColor: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  activeTool: PropTypes.string,
  hideStrokeSlider: PropTypes.bool,
  strokethicknessComponent: PropTypes.node,
  showLineStyleOptions: PropTypes.bool,
  renderSlider: PropTypes.func,
  strokeStyle: PropTypes.string,
  isInFormFieldCreationMode: PropTypes.bool,
  isFreeText: PropTypes.bool,
  isFreeHand: PropTypes.bool,
  isArc: PropTypes.bool,
  onStartLineStyleChange: PropTypes.func,
  startingLineStyle: PropTypes.string,
  isStyleOptionDisabled: PropTypes.bool,
  onStrokeStyleChange: PropTypes.func,
  strokeLineStyle: PropTypes.string,
  middleLineSegmentLabel: PropTypes.string,
  isEllipse: PropTypes.bool,
  withCloudyStyle: PropTypes.array,
  onEndLineStyleChange: PropTypes.func,
  endingLineStyle: PropTypes.string,
  defaultStartLineStyles: PropTypes.array,
  defaultStrokeStyles: PropTypes.array,
  defaultEndLineStyles: PropTypes.array,
  openStrokeStyleContainer: PropTypes.func,
  isStrokeStyleContainerActive: PropTypes.bool,
  stylePanelSectionTitles: PropTypes.func,
};