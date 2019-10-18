import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';


import Layer from 'components/Layer';

import actions from 'actions';
import selectors from 'selectors';

import './LayersPanel.scss';

class LayersPanel extends React.PureComponent {
  static propTypes = {
    layers: PropTypes.arrayOf(PropTypes.object),
    display: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool,
  }

  render() {
    const { isDisabled, layers, display, setLayers } = this.props;

    if (isDisabled) {
      return null;
    }

    return (
      <div className="Panel LayersPanel" style={{ display }} data-element="layersPanel">
        {layers.map((layer, i) => (
          <Layer
            key={i}
            layer={layer}
            updateLayer={(modifiedSubLayer) => {
              const newLayers = [...layers];
              newLayers[i] = modifiedSubLayer;
              setLayers(newLayers);
            }}
          />
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  layers: selectors.getLayers(state),
  isDisabled: selectors.isElementDisabled(state, 'layersPanel'),
});

export default connect(
  mapStateToProps,
  {
    setLayers: actions.setLayers,
  },
)(withTranslation()(LayersPanel));
