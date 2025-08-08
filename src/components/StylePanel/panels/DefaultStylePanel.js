import React from 'react';
import PropTypes from 'prop-types';
import StylePicker from 'components/StylePicker';
import useStylePanel from 'hooks/useStylePanel';
import { shouldHideStylePanelOptions, parseToolType, } from 'helpers/stylePanelHelper';
import Icon from 'src/components/Icon';
import { useTranslation } from 'react-i18next';
import DataElementWrapper from 'components/DataElementWrapper';
import DataElements from 'constants/dataElement';
import StylePanelHeader from '../StylePanelHeader/StylePanelHeader';

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
      <StylePanelHeader title={panelTitle} />
      {shouldHideStylePanelOptions(toolName) ? (
        <DataElementWrapper dataElement={DataElements.StylePanel.NO_STYLE_CONTAINER} className="no-tool-selected">
          <DataElementWrapper dataElement={DataElements.StylePanel.NO_STYLE_ICON}>
            <Icon className="empty-icon" glyph="style-panel-no-tool-selected" />
          </DataElementWrapper>
          <DataElementWrapper dataElement={DataElements.StylePanel.NO_STYLE_MESSAGE} className="msg">{t('stylePanel.noToolStyle')}</DataElementWrapper>
        </DataElementWrapper>
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