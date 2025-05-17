import React from 'react';
import PropTypes from 'prop-types';
import StylePicker from 'components/StylePicker';
import useStylePanel from 'hooks/useStylePanel';
import { shouldHideStylePanelOptions, parseToolType, } from 'helpers/stylePanelHelper';
import Icon from 'src/components/Icon';
import { useTranslation } from 'react-i18next';

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
  } = useStylePanel({ currentTool, selectedAnnotations });

  const toolTypeProps = parseToolType(selectedAnnotations, currentTool);
  const { toolName } = toolTypeProps;

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
          {...toolTypeProps}
          sliderProperties={['Opacity', 'StrokeThickness']}
          style={style}
          onStyleChange={onStyleChange}
          showLineStyleOptions={showLineStyleOptions}
          startLineStyle={startLineStyle}
          endLineStyle={endLineStyle}
          strokeStyle={strokeStyle}
          onLineStyleChange={onLineStyleChange}
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