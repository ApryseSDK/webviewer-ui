import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Icon from 'components/Icon';

import getBrightness from 'helpers/getBrightness';
import selectors from 'selectors';

import './ColorPalette.scss';

const dataElement = 'colorPalette';

class ColorPalette extends React.PureComponent {
  static propTypes = {
    property: PropTypes.string.isRequired,
    color: PropTypes.object.isRequired,
    onStyleChange: PropTypes.func.isRequired,
    colorMapKey: PropTypes.string.isRequired,
    overridePalette: PropTypes.object,
  };

  defaultPalette = [
    '#F1A099',
    '#FFC67B',
    '#FFE6A2',
    '#80E5B1',
    '#92E8E8',
    '#A6A1E6',
    '#E2A1E6',
    '#E44234',
    '#FF8D00',
    '#FFCD45',
    '#00CC63',
    '#25D2D1',
    '#4E7DE9',
    '#C544CE',
    '#88271F',
    '#B54800',
    '#F69A00',
    '#007A3B',
    '#167E7D',
    '#2E4B8B',
    '#76287B',
    'transparency',
    '#FFFFFF',
    '#CDCDCD',
    '#9C9C9C',
    '#696969',
    '#373737',
    '#000000',
  ];

  setColor = e => {
    const { property, onStyleChange } = this.props;
    const bg = e.target.style.backgroundColor; // rgb(r, g, b);
    const rgba = bg ? bg.slice(bg.indexOf('(') + 1, -1).split(',') : [0, 0, 0, 0];
    const color = new window.Annotations.Color(rgba[0], rgba[1], rgba[2], rgba[3]);
    onStyleChange(property, color);
  };

  renderTransparencyCell = bg => {
    const { property } = this.props;
    const shouldRenderDummyCell = property === 'TextColor' || property === 'StrokeColor';

    if (shouldRenderDummyCell) {
      return <div className="dummy-cell" />;
    }

    const diagonalLine = (
      <svg width="100%" height="100%" style={{ position: 'absolute', top: '0px', left: '0px' }}>
        <line
          x1="0%"
          y1="100%"
          x2="100%"
          y2="0%"
          strokeWidth="1"
          stroke="#e44234"
          strokeLinecap="square"
        />
      </svg>
    );

    return (
      <div
        className="cell"
        onClick={this.setColor}
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0' }}
      >
        {this.renderCheckMark(bg)}
        {diagonalLine}
      </div>
    );
  };

  renderColorCell = bg => {
    let style = { backgroundColor: bg };

    if (bg === '#FFFFFF') {
      style = Object.assign(style, {
        border: '1px solid #e0e0e0',
      });
    }

    return (
      <div className="cell" style={style} onClick={this.setColor}>
        {this.renderCheckMark(bg)}
      </div>
    );
  };

  renderCheckMark = bg => {
    const { color } = this.props;
    const hexColor = color.toHexString();

    let isColorPicked;
    if (hexColor === null) {
      isColorPicked = bg === 'transparency';
    } else {
      isColorPicked = hexColor.toLowerCase() === bg.toLowerCase();
    }

    return isColorPicked ? (
      <Icon className={`check-mark ${getBrightness(color)}`} glyph="ic_check_black_24px" />
    ) : null;
  };

  render() {
    const { overridePalette, colorMapKey } = this.props;
    const palette = overridePalette?.[colorMapKey] || overridePalette?.global || this.defaultPalette;

    return (
      <div className="ColorPalette" data-element={dataElement}>
        {palette.map(bg => (
          <React.Fragment key={bg}>
            {bg === 'transparency' ? this.renderTransparencyCell(bg) : this.renderColorCell(bg)}
          </React.Fragment>
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  overridePalette: selectors.getCustomElementOverrides(state, dataElement),
});

export default connect(mapStateToProps)(ColorPalette);
