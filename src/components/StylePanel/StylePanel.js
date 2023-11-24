import React from 'react';
import { useTranslation } from 'react-i18next';
import Icon from 'components/Icon';
import StylePicker from 'components/StylePicker';

// TODO: Remove once tool selection is implemented for the panel
const isNoToolSelected = true;

const StylePanel = () => {
  const [t] = useTranslation();

  const noToolSelected = (
    <div className="no-tool-selected">
      <div>
        <Icon className="empty-icon" glyph="style-panel-no-tool-selected" />
      </div>
      <div className="msg">{t('stylePanel.noToolSelected')}</div>
    </div>
  );

  // TODO: Remove once tool selection is implemented for the panel
  const style = {
    Opacity: 1,
    StrokeThickness: 1,
    Scale: [
      [1, 'in'],
      [1, 'in']
    ],
    Precision: 0.1,
    Style: 'solid',
  };
  // TODO: Remove once tool selection is implemented for the panel
  const lineStyleProperties = {
    StartLineStyle: 'None',
    EndLineStyle: 'None',
    StrokeStyle: 'solid',
  };

  return (
    <>
      <div className='style-panel-header'>
        {t('stylePanel.headings.styles')}
      </div>
      {isNoToolSelected ? noToolSelected : <>
        <div className="label">{t('option.colorPalette.colorLabel')}</div>
        <StylePicker sliderProperties={['Opacity', 'StrokeThickness']} style={style} lineStyleProperties={lineStyleProperties}/>
      </>}
    </>
  );
};

export default StylePanel;