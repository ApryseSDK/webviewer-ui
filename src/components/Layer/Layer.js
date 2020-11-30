import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/Icon';
import Input from 'components/Input';

import './Layer.scss';

class Layer extends React.PureComponent {
  static propTypes = {
    layer: PropTypes.object,
    parentLayer: PropTypes.object,
    updateLayer: PropTypes.func,
    layerId: PropTypes.string,
  };

  state = {
    isExpanded: false,
  };

  unCheckChildren = layer => {
    // new references for redux state
    const newLayer = { ...layer };
    layer.children && layer.children.forEach((childLayer, i) => {
      let newChildLayer = { ...childLayer };
      if (!newChildLayer.locked) {
        newChildLayer.visible = false;
      }
      newChildLayer = this.unCheckChildren(newChildLayer);
      newLayer.children[i] = newChildLayer;
    });
    return newLayer;
  }

  onChange = e => {
    const { updateLayer, layer, parentLayer } = this.props;

    if (e.target.checked === true && parentLayer && !parentLayer.visible) {
      window.alert('This layer has been disabled because its parent layer is disabled.');
    } else {
      // new references for redux state
      let newLayer = { ...layer };
      newLayer.visible = e.target.checked;
      if (e.target.checked === false) {
        newLayer = this.unCheckChildren(newLayer);
      }
      updateLayer(newLayer);
    }
  };

  onClickExpand = () => {
    this.setState(prevState => ({
      isExpanded: !prevState.isExpanded,
    }));
  };

  render() {
    const { isExpanded } = this.state;
    const { layer, updateLayer, layerId } = this.props;
    // need unique layer id or else Input will not be toggled correctly if 2 layers have same name
    if (!layer || !updateLayer || !layerId) {
      return null;
    }
    const hasSubLayers = layer && layer.children && layer.children.length > 0;

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
            id={`layer-${layerId}`}
            type="checkbox"
            label={layer.name}
            onChange={this.onChange}
            checked={layer.visible}
            disabled={layer.locked}
            dataElement={`layer-${layerId}-LayerOption`}
          />
        </div>
        {hasSubLayers && isExpanded && (
          <div className="sub-layers">
            {layer.children.map((subLayer, i) => (
              <Layer
                key={i}
                layer={subLayer}
                parentLayer={layer}
                layerId={`${layerId}-${i}`}
                updateLayer={modifiedSubLayer => {
                  // new references for redux state
                  const children = [...layer.children];
                  children[i] = modifiedSubLayer;
                  const newLayer = { ...layer };
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
