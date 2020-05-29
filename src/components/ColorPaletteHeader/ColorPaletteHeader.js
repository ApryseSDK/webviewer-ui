import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { getDataWithKey } from 'constants/map';
import classNames from 'classnames';
import actions from 'actions';
import selectors from 'selectors';

import './ColorPaletteHeader.scss';

class ColorPaletteHeader extends React.PureComponent {
  static propTypes = {
    style: PropTypes.object.isRequired,
    colorPalette: PropTypes.oneOf(['TextColor', 'StrokeColor', 'FillColor']),
    colorMapKey: PropTypes.string.isRequired,
    setActivePalette: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    isTextColorPaletteDisabled: PropTypes.bool,
    isFillColorPaletteDisabled: PropTypes.bool,
    isBorderColorPaletteDisabled: PropTypes.bool,
  }

  setActivePalette = newPalette => {
    const { setActivePalette, colorMapKey } = this.props;

    setActivePalette(colorMapKey, newPalette);
  }

  render() {
    const {
      t,
      colorPalette,
      colorMapKey,
      toolName,
      isTextColorPaletteDisabled,
      isBorderColorPaletteDisabled,
      isFillColorPaletteDisabled,
    } = this.props;
    const { availablePalettes } = getDataWithKey(colorMapKey);

    if (toolName && (toolName.includes('Line') || toolName.includes('Arrow') || toolName.includes('Polyline'))) {
      return (
        <div className="palette-options">
          {["StrokeColor", "FillColor"].map((palette, i) =>
            <React.Fragment key={i}>
              <div
                className={classNames({
                  'palette-options-button': true,
                  active: colorPalette === palette,
                  disabled: palette === 'FillColor',
                })}
              >
                {t(`option.annotationColor.${palette}`)}
              </div>
              {i < 1 && <div className="palette-options-divider" />}
            </React.Fragment>,
          )}
        </div>
      );
    }


    if (availablePalettes.length < 2) {
      return null;
    }

    // TODO: Actually disable these elements
    // isTextColorPaletteDisabled, isBorderColorPaletteDisabled, isFillColorPaletteDisabled
    // TextColor, StrokeColor, FillColor

    return (
      <div className="palette-options">
        {availablePalettes.map((pallette, i) =>
          <React.Fragment key={i}>
            <div
              className={classNames({
                'palette-options-button': true,
                active: colorPalette === pallette,
              })}
              onClick={() => this.setActivePalette(pallette)}
            >
              {t(`option.annotationColor.${pallette}`)}
            </div>
            {i < availablePalettes.length - 1 && <div className="palette-options-divider" />}
          </React.Fragment>,
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isTextColorPaletteDisabled: selectors.isElementDisabled(state, 'textColorPalette'),
  isFillColorPaletteDisabled: selectors.isElementDisabled(state, 'fillColorPalette'),
  isBorderColorPaletteDisabled: selectors.isElementDisabled(state, 'borderColorPalette'),
});

const mapDispatchToProps = {
  setActivePalette: actions.setActivePalette,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation(null, { wait: false })(ColorPaletteHeader));
