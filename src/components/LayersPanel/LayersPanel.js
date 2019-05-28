import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import Layer from 'components/Layer';

import getClassName from 'helpers/getClassName';
import selectors from 'selectors';

import './LayersPanel.scss';

class LayersPanel extends React.PureComponent {
  static propTypes = {
    layers: PropTypes.arrayOf(PropTypes.object),
    display: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool,
    t: PropTypes.func.isRequired
  }

  render() {
    const { isDisabled, layers, display } = this.props;

    if (isDisabled) {
      return null;
    }

    // TODO???
    const className = getClassName('Panel LayersPanel', this.props);

    return (
      <div className={className} style={{ display }} data-element="layersPanel">
        {layers.map((layer, i) => (
          <Layer key={i} layer={layer} />
        ))}
      </div>
    );

  }
}

const mapStateToProps = state => ({
  layers: selectors.getLayers(state),
  isDisabled: selectors.isElementDisabled(state, 'layersPanel')
});

export default connect(mapStateToProps)(translate()(LayersPanel));
