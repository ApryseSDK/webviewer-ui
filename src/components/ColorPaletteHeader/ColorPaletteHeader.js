import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import Tooltip from 'components/Tooltip';

import getBrightness from 'helpers/getBrightness';
import { getDataWithKey } from 'constants/map';
import actions from 'actions';

import './ColorPaletteHeader.scss';

class ColorPaletteHeader extends React.PureComponent {
  static propTypes = {
    style: PropTypes.object.isRequired,
    colorPalette: PropTypes.oneOf(['TextColor', 'StrokeColor', 'FillColor']),
    colorMapKey: PropTypes.string.isRequired,
    setColorPalette: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  }

  setColorPalette = newPalette => {
    const { setColorPalette, colorMapKey } = this.props;
    
    setColorPalette(colorMapKey, newPalette);
  }

  renderTextColorIcon = () => {
    const { style: { TextColor }, colorPalette } = this.props;

    return (
      <Tooltip content="option.annotationColor.text">
        <div
          className={colorPalette === 'TextColor' ? 'text selected' : 'text'}
          style={{ color: TextColor.toHexString() }}
          onClick={() => this.setColorPalette('TextColor')}
        >
          Aa
        </div>
      </Tooltip>
    );
  }

  renderBorderColorIcon = () => {
    const { style: { StrokeColor }, colorPalette } = this.props;

    const renderInnerCircle = () => {
      const borderColor = getBrightness(StrokeColor) === 'dark' ? '#bfbfbf' : 'none';

      return (
        <svg height="100%" width="100%">
          <circle
            cx="50%"
            cy="50%"
            r="4.5"
            strokeWidth="1"
            stroke={borderColor}
            fill="#fafafa"
          />
        </svg>
      );
    };

    return (
      <Tooltip content="option.annotationColor.border">
        <div
          className={colorPalette === 'StrokeColor' ? 'border selected' : 'border'}
          onClick={() => this.setColorPalette('StrokeColor')}
        >
          <div
            className={`border-icon ${getBrightness(StrokeColor)}}`}
            style={{ backgroundColor: StrokeColor.toHexString() }}
          >
            {renderInnerCircle()}
          </div>
        </div>
      </Tooltip>
    );
  }

  renderFillColorIcon = () => {
    const { style: { FillColor }, colorPalette } = this.props;
    const isTransparency = FillColor.toHexString() === null;

    return (
      <Tooltip content="option.annotationColor.fill">
        <div
          className={colorPalette === 'FillColor' ? 'fill selected' : 'fill'}
          onClick={() => this.setColorPalette('FillColor')}
        >
          <div
            className={`fill-icon ${getBrightness(FillColor)} ${isTransparency ? 'transparency' : ''}`}
            style={{ backgroundColor: FillColor.toHexString() }}
          >
            {isTransparency &&
              <svg width="100%" height="100%">
                <line x1="0%" y1="100%" x2="100%" y2="0%" strokeWidth="1" stroke="#e44234" strokeLinecap="square" />
              </svg>
            }
          </div>
        </div>
      </Tooltip>
    );
  }

  render() {
    const { t, colorPalette, colorMapKey } = this.props;
    const { availablePalettes } = getDataWithKey(colorMapKey);

    if (availablePalettes.length < 2) {
      return null;
    }

    return (
      <div className="stylePopup-title">
        <div className="palette-title">
          {t(`option.annotationColor.${colorPalette}`)}
        </div>
        <div className="palette">
          {availablePalettes.includes('TextColor') &&
            this.renderTextColorIcon()
          }
          {availablePalettes.includes('StrokeColor') &&
            this.renderBorderColorIcon()
          }
          {availablePalettes.includes('FillColor') &&
            this.renderFillColorIcon()
          }
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  setColorPalette: actions.setColorPalette
};

export default connect(null, mapDispatchToProps)(translate(null, { wait: false })(ColorPaletteHeader));