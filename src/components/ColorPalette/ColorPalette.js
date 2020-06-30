import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import selectors from 'selectors';

import './ColorPalette.scss';

const dataElement = 'colorPalette';

class ColorPalette extends React.PureComponent {
  static propTypes = {
    property: PropTypes.string.isRequired,
    color: PropTypes.object,
    onStyleChange: PropTypes.func.isRequired,
    overridePalette: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    colorMapKey: PropTypes.string
  }

  constructor(props) {
    super(props);

    this.palette = [
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
      '#FFFFFF',
      '#CDCDCD',
      '#9C9C9C',
      '#696969',
      '#272727',
      '#000000',
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

  render() {
    const {
      hasPadding,
      style = {},
      property,
      color,
      overridePalette,
      overridePalette2,
      colorMapKey
    } = this.props;

    const allowTransparent = !(property === 'TextColor' || property === 'StrokeColor');

    const palette = overridePalette2 ||  overridePalette?.[colorMapKey] || overridePalette?.global || this.palette;

    return (
      <div
        data-element="colorPalette"
        className={classNames({
          'ColorPalette': true,
          padding: hasPadding,
        })}
        style={style}
      >
        {palette.map((bg, i) => (
          <button
            key={i}
            className="cell-container"
            onClick={() => {
              this.setColor(bg);
            }}
          >
            <div
              className={classNames({
                'cell-outer': true,
                active: color?.toHexString()?.toLowerCase() === bg?.toLowerCase(),
              })}
            >
              <div
                className={classNames({
                  cell: true,
                  border: bg.toLowerCase() === '#ffffff',
                })}
                style={{ backgroundColor: bg }}
              />
            </div>
          </button>
        ))}
        {allowTransparent && (
          <button
            className="cell-container"
            onClick={() => this.setColor(null)}
          >
            <div
              className={classNames({
                'cell-outer': true,
                active: color.toHexString() === null,
              })}
            >
              <div
                className={classNames({
                  cell: true,
                })}
              >
                <svg
                  width="100%"
                  height="100%"
                  className={classNames({
                    transparent: true,
                  })}
                >
                  <line stroke="#d82e28" x1="0" y1="100%" x2="100%" y2="0" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </button>)}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  overridePalette: selectors.getCustomElementOverrides(state, dataElement),
});

export default connect(mapStateToProps)(ColorPalette);
