import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withTranslation } from 'react-i18next';
import selectors from 'selectors';
import { BASIC_PALETTE } from 'constants/commonColors';

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

    this.palette = BASIC_PALETTE;
  }

  setColor = (bg) => {
    const { property, onStyleChange } = this.props;
    if (!bg) {
      onStyleChange(property, new window.Core.Annotations.Color(0, 0, 0, 0));
    } else {
      const color = new window.Core.Annotations.Color(bg);
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
      colorMapKey,
      t,
      isDisabled,
    } = this.props;

    if (isDisabled) {
      return null;
    }

    const allowTransparent = !(property === 'TextColor' || property === 'StrokeColor');

    let palette = overridePalette2 || overridePalette?.[colorMapKey] || overridePalette?.global || this.palette;
    if (!allowTransparent) {
      palette = palette.filter((p) => p?.toLowerCase() !== 'transparency');
    }
    /* eslint-disable custom/no-hex-colors */
    const transparentIcon = (
      <svg
        width="100%"
        height="100%"
        className={classNames({
          transparent: true,
        })}
      >
        <line stroke="#d82e28" x1="0" y1="100%" x2="100%" y2="0" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
    /* eslint-enable custom/no-hex-colors */

    return (
      <div
        data-element="colorPalette"
        className={classNames({
          'ColorPalette': true,
          padding: hasPadding,
        })}
        style={style}
      >
        {palette.map((bg) => bg?.toLowerCase()).map((bg, i) => (
          !bg
            ? <div key={i} className="dummy-cell" />
            : <button
              key={i}
              className="cell-container"
              onClick={() => {
                this.setColor(bg === 'transparency' ? null : bg);
              }}
              aria-label={`${t('option.colorPalette.colorLabel')} ${i + 1}`}
            >
              <div
                className={classNames({
                  'cell-outer': true,
                  active: color?.toHexString?.()?.toLowerCase() === bg || (!color?.toHexString?.() && bg === 'transparency'),
                })}
              >
                <div
                  className={classNames({
                    cell: true,
                    border: true,
                  })}
                  style={{ backgroundColor: bg }}
                >
                  {bg === 'transparency' && transparentIcon}
                </div>
              </div>
            </button>
        ))}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  overridePalette: selectors.getCustomElementOverrides(state, dataElement),
  isDisabled: selectors.isElementDisabled(state, 'colorPalette'),
});

export default connect(mapStateToProps)(withTranslation()(ColorPalette));
