import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';

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
    overridePalette: PropTypes.array,
  }

  constructor(props) {
    super(props);
    // this.palette = [
    //   ['#F1A099', '#FFC67B', '#FFE6A2', '#80E5B1', '#92E8E8', '#A6A1E6', '#E2A1E6'],
    //   ['#E44234', '#FF8D00', '#FFCD45', '#00CC63', '#25D2D1', '#4E7DE9', '#C544CE'],
    //   ['#88271F', '#B54800', '#F69A00', '#007A3B', '#167E7D', '#2E4B8B', '#76287B'],
    //   ['#FFFFFF', '#CDCDCD', '#9C9C9C', '#696969', '#373737', '#000000'],
    // ];
    this.palette = [
      ['#000000', '#ffffff', '#e6261f', '#eb7532', '#f7d038', '#a3e048'],
      ['#33bbe6', '#4355db', '#d23be7'],
    ];
  }

  setColor = bg => {
    const { property, onStyleChange } = this.props;
    if (!bg) {
      onStyleChange(property, new window.Annotations.Color(0, 0, 0, 0));
    } else {
      const color = new window.Annotations.Color(bg);
      onStyleChange(property, color);
    }
  }

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
      <Icon
        className={`check-mark ${getBrightness(color)}`}
        glyph="ic_check_black_24px"
      />
    ) : null;
  };

  render() {
    const { property, color, overridePalette } = this.props;

    const allowTransparent = !(property === 'TextColor' || property === 'StrokeColor');

    const palette = overridePalette || this.palette;

    return (
      <div className="ColorPalette" data-element="colorPalette">
        {allowTransparent &&
          <div
            className="cell-outer"
            onClick={() => this.setColor(null)}
          >
            <div
              className={classNames({
                cell: true,
                transparent: true,
                active: color.toHexString() === null,
              })}
            >
              <svg width="100%" height="100%">
                <line x1="15%" y1="85%" x2="85%" y2="15%" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>}
        {palette.map((row, i) =>
          row.map((bg, j) =>
            <div
              key={`${i}${j}`}
              className="cell-outer"
              onClick={() => this.setColor(bg)}
            >
              <div
                className={classNames({
                  cell: true,
                  active: color.toHexString() === bg.toLowerCase(),
                })}
                style={{ backgroundColor: bg, border: '1px solid' }}
              />
            </div>,
          ),
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  overridePalette: selectors.getCustomElementOverrides(state, dataElement),
});

export default connect(mapStateToProps)(ColorPalette);
