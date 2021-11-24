import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { getDataWithKey } from 'constants/map';
import classNames from 'classnames';
import actions from 'actions';
import selectors from 'selectors';
import HorizontalDivider from 'components/HorizontalDivider';
import Tooltip from 'components/Tooltip';

import './ColorPaletteHeader.scss';

class ColorPaletteHeader extends React.PureComponent {
  static propTypes = {
    style: PropTypes.object.isRequired,
    colorPalette: PropTypes.oneOf(['TextColor', 'StrokeColor', 'FillColor']),
    onPaletteChange: PropTypes.func,
    colorMapKey: PropTypes.string.isRequired,
    setActivePalette: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    isTextColorPaletteDisabled: PropTypes.bool,
    isFillColorPaletteDisabled: PropTypes.bool,
    isBorderColorPaletteDisabled: PropTypes.bool,
  }

  setActivePalette = newPalette => {
    const { setActivePalette, colorMapKey, onPaletteChange } = this.props;
    setActivePalette(colorMapKey, newPalette);
    onPaletteChange && onPaletteChange(newPalette);
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
      disableSeparator
    } = this.props;
    const { availablePalettes } = getDataWithKey(colorMapKey);

    if (toolName && (toolName.includes('Line') || toolName.includes('Arrow') || toolName.includes('Polyline'))) {
      return (
        <div className="palette-options">
          {["StrokeColor", "FillColor"].map((palette, i) =>
            <React.Fragment key={i}>
              <Tooltip content={`option.annotationColor.${palette}`}>
                <div
                  className={classNames({
                    'palette-options-button': true,
                    active: colorPalette === palette,
                    disabled: palette === 'FillColor',
                  })}
                >
                  {t(`option.annotationColor.${palette}`)}
                </div>
              </Tooltip>
              {i < 1 && <div className="palette-options-divider" />}
            </React.Fragment>,
          )}
        </div>
      );
    }


    if (availablePalettes.length < 2) {
      if (disableSeparator) {
        return null;
      }
      return <HorizontalDivider/>;
    }


    return (
      <div className="palette-options">
        {availablePalettes.map((pallette, i) =>
          <React.Fragment key={i}>
            <Tooltip content={`option.annotationColor.${pallette}`}>
              <button
                className={classNames({
                  'palette-options-button': true,
                  active: colorPalette === pallette,
                })}
                onClick={() => this.setActivePalette(pallette)}
              >
                {t(`option.annotationColor.${pallette}`)}
              </button>
            </Tooltip>
            {i < availablePalettes.length - 1 && <div className="palette-options-divider" />}
          </React.Fragment>,
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  // TODO: Actually disable these elements
  // isTextColorPaletteDisabled, isBorderColorPaletteDisabled, isFillColorPaletteDisabled
  // TextColor, StrokeColor, FillColor
  isTextColorPaletteDisabled: selectors.isElementDisabled(state, 'textColorPalette'),
  isFillColorPaletteDisabled: selectors.isElementDisabled(state, 'fillColorPalette'),
  isBorderColorPaletteDisabled: selectors.isElementDisabled(state, 'borderColorPalette'),
});

const mapDispatchToProps = {
  setActivePalette: actions.setActivePalette,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation(null, { wait: false })(ColorPaletteHeader));
