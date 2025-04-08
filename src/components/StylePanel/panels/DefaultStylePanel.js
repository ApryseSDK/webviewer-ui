import React from 'react';
import PropTypes from 'prop-types';
import StylePicker from 'components/StylePicker';
import useStylePanel from 'hooks/useStylePanel';
import {
  shouldRenderWidgetLayout,
  shouldHideStylePanelOptions,
} from 'helpers/stylePanelHelper';
import core from 'core';
import Icon from 'src/components/Icon';
import { useTranslation } from 'react-i18next';

const { ToolNames } = window.Core.Tools;
const { Annotations } = window.Core;

const DefaultStylePanel = ({ currentTool, selectedAnnotations }) => {
  const [t] = useTranslation();

  const {
    style,
    panelTitle,
    strokeStyle,
    startLineStyle,
    endLineStyle,
    onStyleChange,
    onLineStyleChange,
    showLineStyleOptions,
    isAutoSizeFont,
    handleAutoSize,
    handleRichTextStyleChange,
    saveEditorInstance,
  } = useStylePanel({ currentTool, selectedAnnotations });

  const annotationTool = selectedAnnotations?.length >= 1 ? selectedAnnotations[0].ToolName : null;
  const toolName = annotationTool || currentTool.name;

  const isEllipse = toolName === ToolNames.ELLIPSE;
  const isRedaction = toolName === ToolNames.REDACTION;
  const isFreeHand = toolName === ToolNames.FREEHAND || currentTool.name === ToolNames.FREEHAND_HIGHLIGHT;
  const isArc = toolName === ToolNames.ARC;
  const isStamp = toolName === ToolNames.STAMP;
  const isWidget = selectedAnnotations[0] instanceof Annotations.WidgetAnnotation || shouldRenderWidgetLayout(currentTool.name);
  const isInFormFieldCreationMode = core.getFormFieldCreationManager().isInFormFieldCreationMode();
  const isFreeText = toolName === ToolNames.FREE_TEXT;

  return (
    <>
      <h2 className="style-panel-header">{panelTitle}</h2>
      {shouldHideStylePanelOptions(toolName) ? (
        <div className="no-tool-selected">
          <div>
            <Icon className="empty-icon" glyph="style-panel-no-tool-selected" />
          </div>
          <div className="msg">{t('stylePanel.noToolStyle')}</div>
        </div>
      ) : (
        <StylePicker
          activeTool={toolName}
          sliderProperties={['Opacity', 'StrokeThickness']}
          style={style}
          onStyleChange={onStyleChange}
          isEllipse={isEllipse}
          isRedaction={isRedaction}
          isWidget={isWidget}
          isFreeHand={isFreeHand}
          isArc={isArc}
          isStamp={isStamp}
          isFreeText={isFreeText}
          isInFormFieldCreationMode={isInFormFieldCreationMode}
          showLineStyleOptions={showLineStyleOptions}
          startLineStyle={startLineStyle}
          endLineStyle={endLineStyle}
          strokeStyle={strokeStyle}
          onLineStyleChange={onLineStyleChange}
          onFreeTextSizeToggle={handleAutoSize}
          isFreeTextAutoSize={isAutoSizeFont}
          handleRichTextStyleChange={handleRichTextStyleChange}
          saveEditorInstance={saveEditorInstance}
        />
      )}
    </>
  );
};

DefaultStylePanel.propTypes = {
  selectedAnnotations: PropTypes.arrayOf(PropTypes.object),
  currentTool: PropTypes.object,
};

export default DefaultStylePanel;