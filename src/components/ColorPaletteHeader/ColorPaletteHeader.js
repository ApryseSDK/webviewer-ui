import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import { translate } from 'react-i18next';

import getBrightness from 'helpers/getBrightness';

import './ColorPaletteHeader.scss';

class ColorPaletteHeader extends React.PureComponent {
  static propTypes = {
    style: PropTypes.object.isRequired,
    colorPalette: PropTypes.string.isRequired,
    onHeaderChange: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  countColorPalette = () => {
    const { FillColor, StrokeColor, TextColor } = this.props.style;

    return [FillColor, StrokeColor, TextColor].reduce((numberOfPalette, colorProperty) => {
      if (colorProperty) {
        numberOfPalette += 1;
      }
      return numberOfPalette;
    }, 0);
  }

  renderTextColorIcon = () => {
    const { style: { TextColor }, colorPalette, onHeaderChange, t } = this.props;
    
    if (!TextColor) {
      return null;
    }

    return (
      <div
        className={colorPalette === 'text' ? 'text selected' : 'text'}
        style={{ color: TextColor.toHexString() }}
        onClick={() => onHeaderChange('text')}
        data-tip={t('option.annotationColor.text')}
      >
        Aa
      </div>
    );
  }

  renderBorderColorIcon = () => {
    const { style: { StrokeColor }, colorPalette, onHeaderChange, t } = this.props;
    
    if (!StrokeColor) {
      return null;
    }

    const renderInnerCircle = () => {
      const borderColor = getBrightness(StrokeColor) === 'dark' ? '#bfbfbf' : 'none';

      return(
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
      <div
        className={colorPalette === 'border' ? 'border selected' : 'border'}
        onClick={() => onHeaderChange('border')}
        data-tip={t('option.annotationColor.border')}
      >
        <div
          className={`border-icon ${getBrightness(StrokeColor)}}`}
          style={{ backgroundColor: StrokeColor.toHexString() }}
        >
          {renderInnerCircle()}
        </div>
      </div>
    );
  }

  renderFillColorIcon = () => {
    const { style: { FillColor }, colorPalette, onHeaderChange, t } = this.props;

    if (!FillColor) {
      return null;
    }

    const isTransparency = FillColor.toHexString() === null;

    return(
      <div
        className={colorPalette === 'fill' ? 'fill selected' : 'fill'}
        onClick={() => onHeaderChange('fill')}
        data-tip={t('option.annotationColor.fill')}
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
    );
  }

  render() {
    const { t, colorPalette } = this.props;
    const numberOfPalette = this.countColorPalette();

    if (numberOfPalette < 2) {
      return null;
    }

    return (
      <div className="stylePopup-title">
        <div className="palette-title">
          {t(`option.annotationColor.${colorPalette}`)}
        </div>
        <div className="palette">
          {this.renderTextColorIcon()}
          {this.renderBorderColorIcon()}
          {this.renderFillColorIcon()}
        </div>
      </div>
    );
  }
}

export default translate(null, { wait: false })(ColorPaletteHeader);