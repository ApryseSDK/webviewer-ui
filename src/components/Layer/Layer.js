import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import core from 'core';

import Input from 'components/Input';

import './Layer.scss';

class Layer extends React.PureComponent {
  static propTypes = {
    layer: PropTypes.object.isRequired,
    layers: PropTypes.arrayOf(PropTypes.object).isRequired,
    index: PropTypes.number.isRequired,
  }


  onChange = e => {
    const { index, layers } = this.props;

    layers[index].visible = e.target.checked;
    const doc = core.getDocument();
    doc.setLayersArray(layers);

    window.docViewer.refreshAll();
    window.docViewer.updateView();
  }

  render() {
    const { layer } = this.props;

    return (
      <div className="Layer">
        <Input id={layer.name} type="checkbox" label={layer.name} onChange={this.onChange} defaultChecked={layer.visible} />
      </div>
    );
  }
}

export default Layer;
