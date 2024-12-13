import React from 'react';
import { useSelector } from 'react-redux';
import { ITEM_TYPE } from 'src/constants/customizationVariables';
import InnerItem from '../ModularComponents/InnerItem';
import { panelNames, panelData } from 'constants/panel';
import { useTranslation } from 'react-i18next';
import { defaultPanels } from 'src/redux/modularComponents';
import Icon from '../Icon';


const PanelsSection = () => {
  const [t] = useTranslation();
  const modularComponents = useSelector((state) => state.viewer.modularComponents);
  const modularComponentsKeys = Object.keys(modularComponents);

  const panels = defaultPanels.filter((panel) => Object.values(panelNames).includes(panel.dataElement));

  return panels.map((item, index) => {
    return (panelData[item.dataElement] &&
      <div className='DraggableContainer panel-item'>
        <div
          className="DraggableContainer__handle"
        >
          <Icon glyph="icon-drag-handle" />
        </div>
        <div className="DraggableContainer__content" key={index}>{t(`${panelData[item.dataElement].title}`)}</div>
      </div>
    );
  });
};

export default PanelsSection;