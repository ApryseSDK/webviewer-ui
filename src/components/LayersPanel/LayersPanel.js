import React from 'react';
import PropTypes from 'prop-types';

import Layer from 'components/Layer';

import './LayersPanel.scss';
import DataElementWrapper from '../DataElementWrapper';

const propTypes = {
  layers: PropTypes.arrayOf(PropTypes.object),
  setLayers: PropTypes.func,
};

function LayersPanel(props) {

  const { layers = [], setLayers } = props;

  function onLayerUpdated(updatedLayer, index) {
    // new references for redux state
    const newLayers = [...layers];
    newLayers[index] = updatedLayer;
    if (setLayers) {
      setLayers(newLayers);
    }
  }

  return (
    <DataElementWrapper className="Panel LayersPanel" dataElement="layersPanel">
      {layers.map((layer, i) => (
        <Layer
          key={layer.id}
          layer={layer}
          layerUpdated={updatedLayer => onLayerUpdated(updatedLayer, i)}
        />
      ))}
    </DataElementWrapper>
  );
}

LayersPanel.propTypes = propTypes;

export default LayersPanel;
