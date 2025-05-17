import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import StylePicker from 'components/StylePicker';
import useStylePanel from 'hooks/useStylePanel';
import {
  parseToolType,
  stylePanelSectionTitles,
  useStylePanelSections,
  hasFillColorAndCollapsablePanelSections
} from 'helpers/stylePanelHelper';
import CollapsibleSection from 'components/CollapsibleSection';
import LabelTextEditor from 'components/LabelTextEditor';
import RichTextStyleEditor from 'components/RichTextStyleEditor';
import { useTranslation } from 'react-i18next';
import DataElements from 'constants/dataElement';
import { useDispatch } from 'react-redux';
import useOnFreeTextEdit from 'hooks/useOnFreeTextEdit';
import actions from 'actions';

const TextStylePanel = ({ selectedAnnotations, currentTool }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isRichTextEditMode, setIsRichTextEditMode] = useState(false);

  useEffect(() => {
    if (isRichTextEditMode) {
      dispatch(actions.closeElement(DataElements.ANNOTATION_POPUP));
    }
  }, [isRichTextEditMode]);

  const {
    panelTitle,
    style,
    strokeStyle,
    onStyleChange,
    onLineStyleChange,
    isAutoSizeFont,
    handleAutoSize,
    handleRichTextStyleChange,
    saveEditorInstance,
    showLineStyleOptions,
    startLineStyle,
    endLineStyle,
  } = useStylePanel({ selectedAnnotations, currentTool });

  const toolTypeProps = parseToolType(selectedAnnotations, currentTool);
  const {
    isRedaction,
    isWidget,
    activeTool,
  } = toolTypeProps;

  const {
    openTextStyleContainer,
    isTextStyleContainerActive,
  } = useStylePanelSections();

  const showFillColorAndCollapsablePanelSections = hasFillColorAndCollapsablePanelSections(activeTool);
  useEffect(() => {
    if (showFillColorAndCollapsablePanelSections) {
      dispatch(actions.openElement(DataElements.RICH_TEXT_STYLE_CONTAINER));
    }
  }, [activeTool]);

  const onOpenProps = useOnFreeTextEdit(saveEditorInstance);

  return (
    <>
      <h2 className="style-panel-header">{panelTitle}</h2>
      <div className="StylePicker"
        onMouseDown={(e) => {
          if (e.type !== 'touchstart' && e.target.tagName.toUpperCase() !== 'INPUT') {
            e.preventDefault();
          }
        }}
      >
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
                  <LabelTextEditor properties={style} onPropertyChange={onStyleChange} placeholderText={' '}/>
                </div>
              )}
              <RichTextStyleEditor
                style={style}
                {...onOpenProps}
                property={'TextColor'}
                colorMapKey={'freeText'}
                isFreeTextAutoSize={isAutoSizeFont}
                onFreeTextSizeToggle={handleAutoSize}
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
          <div className="divider"/>
        </div>
        <StylePicker
          {...toolTypeProps}
          hasParentPicker
          sliderProperties={['Opacity', 'StrokeThickness']}
          style={style}
          onStyleChange={onStyleChange}
          strokeStyle={strokeStyle}
          onLineStyleChange={onLineStyleChange}
          activeTool={activeTool}
          showLineStyleOptions={showLineStyleOptions}
          startLineStyle={startLineStyle}
          endLineStyle={endLineStyle}
        />
      </div>
    </>
  );
};

TextStylePanel.propTypes = {
  selectedAnnotations: PropTypes.arrayOf(PropTypes.object),
  currentTool: PropTypes.object,
};

export default TextStylePanel;