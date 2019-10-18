import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/Icon';
import Input from 'components/Input';

import core from 'core';

import './Layer.scss';

class Layer extends React.PureComponent {
  static propTypes = {
    layer: PropTypes.object.isRequired,
  };

  state = {
    isExpanded: false,
  };

  unCheckChildren = (layer) => {
    const newLayer = {...layer};
    layer.children && layer.children.forEach((childLayer, i) => {
      let newChildLayer = {...childLayer};
      newChildLayer.visible = false;
      newChildLayer = this.unCheckChildren(newChildLayer);
      newLayer.children[i] = newChildLayer;
    });
    return newLayer;
  }

  onChange = e => {
    const { updateLayer, layer } = this.props;

    let newLayer = {...layer};
    newLayer.visible = e.target.checked;
    if (e.target.checked === false) {
      newLayer = this.unCheckChildren(newLayer);
    }
    updateLayer(newLayer);
  };

  onClickExpand = () => {
    this.setState(prevState => ({
      isExpanded: !prevState.isExpanded,
    }));
  };

  render() {
    const { isExpanded } = this.state;
    const { layer, updateLayer } = this.props;
    const hasSubLayers = layer.children.length > 0;

    return (
      <div className="Layer">
        <div className="layer-wrapper">
          <div className="padding">
            {hasSubLayers && (
              <div
                className={`arrow ${
                  isExpanded ? 'expanded' : 'collapsed'
                }`}
                onClick={this.onClickExpand}
              >
                <Icon glyph="ic_chevron_right_black_24px" />
              </div>
            )}
          </div>
          <Input
            id={layer.name}
            type="checkbox"
            label={layer.name}
            onChange={this.onChange}
            checked={layer.visible}
          />
        </div>
        {hasSubLayers && isExpanded && (
          <div className="sub-layers">
            {layer.children.map((subLayer, i) => (
              <Layer
                key={i}
                index={i}
                layer={subLayer}
                layers={layer.children}
                updateLayer={(modifiedSubLayer) => {
                  const children = [...layer.children];
                  children[i] = modifiedSubLayer;
                  const newLayer = {...layer};
                  newLayer.children = children;

                  updateLayer(newLayer);
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default Layer;
