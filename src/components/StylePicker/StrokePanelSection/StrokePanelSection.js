import { useTranslation } from 'react-i18next';
import React from 'react';
import ColorPicker from '../ColorPicker';
import Dropdown from '../../Dropdown';
import CollapsibleSection from 'src/components/CollapsibleSection';
import PropTypes from 'prop-types';
import {
  defaultStartLineStyles,
  defaultStrokeStyles,
  defaultEndLineStyles,
  cloudyStrokeStyle,
} from 'constants/strokeStyleIcons';
import { stylePanelSectionTitles } from 'helpers/stylePanelHelper';
import DataElementWrapper from 'src/components/DataElementWrapper';
import DataElements from 'src/constants/dataElement';

const withCloudyStyle = defaultStrokeStyles.concat(cloudyStrokeStyle);

const StrokePanelSection = ({
  showFillColorAndCollapsablePanelSections,
  isStamp,
  onStrokeColorChange,
  onStyleChange,
  strokeColor,
  activeTool,
  hideStrokeDropdowns,
  hideStrokeSlider,
  strokethicknessComponent,
  showLineStyleOptions,
  renderSlider,
  strokeStyle,
  isInFormFieldCreationMode,
  isFreeText,
  onStartLineStyleChange,
  startingLineStyle,
  isStyleOptionDisabled,
  onStrokeStyleChange,
  strokeLineStyle,
  onEndLineStyleChange,
  endingLineStyle,
  openStrokeStyleContainer,
  isStrokeStyleContainerActive,
  hideCloudyLineStyle,
}) => {
  const [t] = useTranslation();

  const middleLineSegmentLabel = showLineStyleOptions ? 'stylePanel.lineEnding.middle' : 'stylePanel.borderStyle';

  const sectionContent = (
    <div className="panel-section-wrapper">
      {!isStamp && (
        <>
          <div className="menu-items">
            <ColorPicker
              dataElement={DataElements.StylePanel.STROKE_COLOR_PICKER}
              onColorChange={onStrokeColorChange}
              onStyleChange={onStyleChange}
              color={strokeColor}
              activeTool={activeTool}
              type={'Stroke'}
              ariaTypeLabel={t('option.annotationColor.StrokeColor')}
            />
          </div>
          {!hideStrokeSlider && strokethicknessComponent && (strokethicknessComponent)}
          {/*
            When showLineStyleOptions is true, we want to show the opacity slider together with the stroke slider
          */}
          {showLineStyleOptions && <div className="StyleOption">{renderSlider('opacity')}</div>}
          {!!strokeStyle && !(isInFormFieldCreationMode && !isFreeText) && !hideStrokeDropdowns && (
            <div className="StyleOption">
              <DataElementWrapper dataElement={DataElements.StylePanel.LINE_STYLE_PICKER_CONTAINER} className="styles-container lineStyleContainer">
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
                      className={`StylePicker-StrokeLineStyleDropdown${!!strokeStyle && !showLineStyleOptions ? ' StyleOptions' : ''}`}
                      dataElement="middleLineStyleDropdown"
                      images={showLineStyleOptions || hideCloudyLineStyle ? defaultStrokeStyles : withCloudyStyle}
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
              </DataElementWrapper>
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
  hideStrokeDropdowns: PropTypes.bool,
  hideStrokeSlider: PropTypes.bool,
  strokethicknessComponent: PropTypes.node,
  showLineStyleOptions: PropTypes.bool,
  renderSlider: PropTypes.func,
  strokeStyle: PropTypes.string,
  isInFormFieldCreationMode: PropTypes.bool,
  isFreeText: PropTypes.bool,
  onStartLineStyleChange: PropTypes.func,
  startingLineStyle: PropTypes.string,
  isStyleOptionDisabled: PropTypes.bool,
  onStrokeStyleChange: PropTypes.func,
  strokeLineStyle: PropTypes.string,
  onEndLineStyleChange: PropTypes.func,
  endingLineStyle: PropTypes.string,
  openStrokeStyleContainer: PropTypes.func,
  isStrokeStyleContainerActive: PropTypes.bool,
  hideCloudyLineStyle: PropTypes.bool,
};