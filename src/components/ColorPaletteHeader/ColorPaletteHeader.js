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
    overrideAvailablePalettes: PropTypes.object,
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
      overrideAvailablePalettes,
    } = this.props;
    const { availablePalettes } = getDataWithKey(colorMapKey);
    const localAvailablePalettes = overrideAvailablePalettes?.[colorMapKey] || overrideAvailablePalettes?.global || availablePalettes;

    if (toolName && (toolName.includes('Line') || toolName.includes('Arrow') || toolName.includes('Polyline'))) {
      return (
        <div className="palette-options">
          {["StrokeColor", "FillColor"].map((pallette, i) =>
            <React.Fragment key={i}>
              <div
                className={classNames({
                  'palette-options-button': true,
                  active: colorPalette === pallette,
                  disabled: pallette === 'FillColor',
                })}
              >
                {t(`option.annotationColor.${pallette}`)}
              </div>
              {i < 1 && <div className="palette-options-divider" />}
            </React.Fragment>,
          )}
        </div>
      );
    }


    if (localAvailablePalettes.length < 2) {
      return null;
    }

    // TODO: Actually disable these elements
    // isTextColorPaletteDisabled, isBorderColorPaletteDisabled, isFillColorPaletteDisabled
    // TextColor, StrokeColor, FillColor

    return (
      <div className="palette-options">
        {localAvailablePalettes.map((pallette, i) =>
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
            {i < localAvailablePalettes.length - 1 && <div className="palette-options-divider" />}
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
  overrideAvailablePalettes: selectors.getCustomElementOverrides(state, 'availablePalettes'),
});

const mapDispatchToProps = {
  setActivePalette: actions.setActivePalette,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation(null, { wait: false })(ColorPaletteHeader));
