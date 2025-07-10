import React from 'react';
import PropTypes from 'prop-types';
import Layer from 'components/Layer';

import './LayersPanel.scss';
import DataElementWrapper from '../DataElementWrapper';
import Icon from 'components/Icon';
import { useTranslation } from 'react-i18next';
import { panelData, panelNames } from 'constants/panel';
import Spinner from 'components/Spinner';

const propTypes = {
  layers: PropTypes.arrayOf(PropTypes.object),
  setLayers: PropTypes.func,
  layersNotFetched: PropTypes.bool,
};

function LayersPanel(props) {
  const {
    layers = [],
    setLayers,
    layersNotFetched,
  } = props;
  const { t } = useTranslation();

  function onLayerUpdated(updatedLayer, index) {
    // new references for redux state
    const newLayers = [...layers];
    newLayers[index] = updatedLayer;
    if (setLayers) {
      setLayers(newLayers);
    }
  }

  const emptyPanelState = (
    <div className="empty-panel-container">
      <Icon className="empty-icon" glyph={panelData[panelNames.LAYERS].icon}/>
      {layersNotFetched ? <Spinner inPanel width={'40px'} height={'40px'}/> :
        (<div className="empty-message">
          {t('message.noLayers')}
        </div>)}
    </div>
  );

  return (
    <DataElementWrapper className="Panel LayersPanel" dataElement="layersPanel">
      {!layers?.length ? emptyPanelState : layers.map((layer, i) => (
        <Layer
          key={layer.id}
          layer={layer}
          layerUpdated={(updatedLayer) => onLayerUpdated(updatedLayer, i)}
        />))}
    </DataElementWrapper>
  );
}

LayersPanel.propTypes = propTypes;

export default LayersPanel;
