import React from 'react';
import PropTypes from 'prop-types';
import StylePicker from 'components/StylePicker';
import useStylePanel from 'hooks/useStylePanel';

const { ToolNames } = window.Core.Tools;

const FreeTextStylePanel = ({ selectedAnnotations, currentTool }) => {
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
  } = useStylePanel({ selectedAnnotations, currentTool });

  return (
    <>
      <h2 className="style-panel-header">{panelTitle}</h2>
      <StylePicker
        isFreeText
        sliderProperties={['Opacity', 'StrokeThickness']}
        style={style}
        onStyleChange={onStyleChange}
        isFreeTextAutoSize={isAutoSizeFont}
        onFreeTextSizeToggle={handleAutoSize}
        handleRichTextStyleChange={handleRichTextStyleChange}
        strokeStyle={strokeStyle}
        onLineStyleChange={onLineStyleChange}
        saveEditorInstance={saveEditorInstance}
        activeTool={ToolNames.FREETEXT}
      />
    </>
  );
};

FreeTextStylePanel.propTypes = {
  selectedAnnotations: PropTypes.arrayOf(PropTypes.object),
  currentTool: PropTypes.object,
};

export default FreeTextStylePanel;