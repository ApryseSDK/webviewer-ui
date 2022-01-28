import React , { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import Tooltip from 'components/Tooltip';
import Choice from 'components/Choice';
import { useTranslation } from 'react-i18next';
import { updateLayerVisibililty } from './updateLayerVisibililty';
import { Label } from '@pdftron/webviewer-react-toolkit';
import DataElementWrapper from '../DataElementWrapper';
import './Layer.scss';

const propTypes = {
  layer: PropTypes.object,
  layerUpdated: PropTypes.func,
};
function Layer(props) {
  const { layer, layerUpdated } = props;
  const [isExpanded, setExpanded] = useState(false);
  const [t] = useTranslation();

  const onChange = isVisible => {
    const newLayer = updateLayerVisibililty(layer, isVisible);
    if (layerUpdated) {
      layerUpdated(newLayer);
    }
  };

  const toggleExpanded = () => {
    setExpanded(!isExpanded);
  };

  if (!layer) {
    return null;
  }
  const hasSubLayers = layer && layer.children && layer.children.length > 0;

  let tooltipContent = '';
  if (layer.locked) {
    tooltipContent = t('message.lockedLayer');
  } else if (layer.disabled) {
    tooltipContent = t('message.layerVisibililtyNoChange');
  }

  return (
    <DataElementWrapper className="Layer" dataElement={`layer-${layer.id}-${layer.name}`}>
      <div className="parent-layer">
        {hasSubLayers ?  (
          <div className="arrow" onClick={toggleExpanded}>
            { isExpanded ? <Icon glyph="ic_chevron_down_black_24px" /> : <Icon glyph="ic_chevron_right_black_24px" />}
          </div>
        ) : (
          // create dummy icon to make aligning easier
          <div> <Icon glyph="" /> </div>
        )}
        <Tooltip content={tooltipContent} hideOnClick={false} forcePosition="bottomLeft">
          {/* this div is mainly to group the choice and lock icon so that tooltip will appear properly  over checkbox*/}
          {
            !layer.isLabel ? (
              <div className="content-container">
                <Choice
                  id={`${layer.id}`}
                  label={layer.name}
                  onChange={() => onChange(!layer.visible)}
                  checked={layer.visible}
                  disabled={layer.locked || layer.disabled}
                  center
                />
                { layer.locked && <Icon className="lock-icon" glyph="icon-lock" />}
              </div>
            ) : (
              <div className="content-container">
                <Label label={layer.name}></Label>
              </div>
            )
          }
        </Tooltip>
      </div>
      {hasSubLayers && isExpanded && (
        <div className="sub-layers">
          {layer.children.map((subLayer, i) => (
            <Layer
              key={subLayer.id}
              layer={subLayer}
              parentLayer={layer}
              layerUpdated={modifiedSubLayer => {
                // new references for redux state
                const children = [...layer.children];
                children[i] = modifiedSubLayer;
                const newLayer = { ...layer };
                newLayer.children = children;
                layerUpdated(newLayer);
              }}
            />
          ))}
        </div>
      )}
    </DataElementWrapper>
  );
}
Layer.propTypes = propTypes;
export default Layer;
