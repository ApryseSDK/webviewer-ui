import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Icon.scss';
import { css } from '@emotion/react';
import { transformSvgMarkup } from './iconHelper';

class Icon extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    color: PropTypes.string,
    glyph: PropTypes.string.isRequired,
    fillColor: PropTypes.string,
    strokeColor: PropTypes.string,
    disabled: PropTypes.bool,
    dataElement: PropTypes.string,
    ariaHidden: PropTypes.bool,
    ariaLabel: PropTypes.string,
  };

  isInlineSvg() {
    const { glyph } = this.props;
    return glyph && glyph.indexOf('<svg') === 0;
  }

  render() {
    const { className = '', color, glyph, fillColor = '', strokeColor = '', disabled, dataElement, ariaHidden, ariaLabel } = this.props;
    // eslint-disable-next-line custom/no-hex-colors
    const filter = (color && (color === 'rgba(255, 255, 255, 1)' || color === 'rgb(255, 255, 255)')) ? 'drop-shadow(0 0 .5px #333)' : undefined;
    let svgElement;

    try {
      // eslint-disable-next-line global-require,import/no-dynamic-require
      const result = this.isInlineSvg() ? glyph : require(`../../../assets/icons/${this.props.glyph}.svg`);
      // Vite/ESM shim returns an object with a 'default' property.
      // Webpack (depending on config) often returned just the string.
      svgElement = (result && typeof result === 'object' && result.default) ? result.default : result;
    } catch {
      svgElement = undefined;
      console.warn(`Icon not found: ${this.props.glyph}`);
    }

    svgElement = transformSvgMarkup(svgElement, {
      color,
      fillColor,
      strokeColor,
      disabled,
      ariaLabel,
    });

    const hasDefaultMarkers = !!svgElement && (
      /\bfill\s*=\s*(['"])default\1/i.test(svgElement)
      || /\bstroke\s*=\s*(['"])default\1/i.test(svgElement)
      || /\bclass=(['"])[^'"]*\bicon-default\b[^'"]*\1/i.test(svgElement)
      || /\bclass=(['"])[^'"]*\bicon-default-stroke\b[^'"]*\1/i.test(svgElement)
    );

    return (
      <div
        className={classNames({
          Icon: true,
          'has-default-markers': hasDefaultMarkers,
          [className]: true,
          [fillColor]: true,
          disabled,
        })}
        css={css({ '&&&&&&': {
          ...(filter && { filter }),
          // eslint-disable-next-line custom/no-hex-colors
          ...(!disabled && { color: color === 'rgba(0, 0, 0, 0)' ? '#808080' : color }),
        } })}
        data-element={dataElement}
        aria-hidden={ariaHidden}
        /* eslint-disable react/no-danger */
        dangerouslySetInnerHTML={{ __html: svgElement }}
      />
    );
  }
}

Icon.defaultProps = {
  ariaHidden: true
};

export default Icon;