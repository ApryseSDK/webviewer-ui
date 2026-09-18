import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Icon.scss';
import { css } from '@emotion/react';
import { transformSvgMarkup, sanitizeSvgMarkup, isGlyphSource, isExternalSvgSource, isInlineSvgMarkup, fetchSvgMarkup } from './iconHelper';

const getIconFilter = (color) => {
  // eslint-disable-next-line custom/no-hex-colors
  return color && (color === 'rgba(255, 255, 255, 1)' || color === 'rgb(255, 255, 255)') ? 'drop-shadow(0 0 .5px #333)' : undefined;
};

const getFetchedMarkup = (glyph, fetchedFor, fetchedMarkup) => (
  isExternalSvgSource(glyph) && fetchedFor === glyph && fetchedMarkup
);

const hasDefaultMarkers = (svgElement) => !!svgElement && (
  /\bfill\s*=\s*(['"])default\1/i.test(svgElement)
  || /\bstroke\s*=\s*(['"])default\1/i.test(svgElement)
  || /\bclass=(['"])[^'"]*\bicon-default\b[^'"]*\1/i.test(svgElement)
  || /\bclass=(['"])[^'"]*\bicon-default-stroke\b[^'"]*\1/i.test(svgElement)
);

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

  state = {
    fetchedMarkup: null,
    fetchedFor: null,
  };

  componentDidMount() {
    this._mounted = true;
    this.fetchExternalSvgIfNeeded();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.glyph !== this.props.glyph) {
      this.fetchExternalSvgIfNeeded();
    }
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  getSvgElement = (glyph, fetchedMarkup) => {
    if (fetchedMarkup) {
      return fetchedMarkup;
    }

    try {
      // eslint-disable-next-line global-require,import/no-dynamic-require
      const result = isInlineSvgMarkup(glyph) ? glyph : require(`../../../assets/icons/${glyph}.svg`);
      // Vite/ESM shim returns an object with a 'default' property.
      // Webpack (depending on config) often returned just the string.
      return (result && typeof result === 'object' && result.default) ? result.default : result;
    } catch {
      console.warn(`Icon not found: ${glyph}`);
      return undefined;
    }
  };

  fetchExternalSvgIfNeeded() {
    const { glyph } = this.props;
    if (!isExternalSvgSource(glyph)) {
      return;
    }
    fetchSvgMarkup(glyph).then((markup) => {
      if (this._mounted && this.props.glyph === glyph) {
        this.setState({ fetchedMarkup: markup, fetchedFor: glyph });
      }
    });
  }

  render() {
    const { className = '', color, glyph, fillColor = '', strokeColor = '', disabled, dataElement, ariaHidden, ariaLabel } = this.props;
    const filter = getIconFilter(color);
    const fetchedMarkup = getFetchedMarkup(glyph, this.state.fetchedFor, this.state.fetchedMarkup);

    // File paths, URLs, and data URIs aren't bundled/inline glyphs. Render them as an image unless
    // we've already fetched their SVG markup, so currentColor and icon-sizing CSS keep working.
    if (glyph && !isGlyphSource(glyph) && !fetchedMarkup) {
      return (
        <div
          className={classNames({
            Icon: true,
            [className]: true,
            [fillColor]: true,
            disabled,
          })}
          css={css({ '&&&&&&': {
            ...(filter && { filter }),
          } })}
          data-element={dataElement}
        >
          <img src={glyph} alt={ariaLabel || ''} aria-hidden={ariaHidden} />
        </div>
      );
    }

    let svgElement = this.getSvgElement(glyph, fetchedMarkup);

    const isUntrustedMarkup = !!fetchedMarkup || isInlineSvgMarkup(glyph);
    if (isUntrustedMarkup) {
      svgElement = sanitizeSvgMarkup(svgElement);
    }

    svgElement = transformSvgMarkup(svgElement, {
      color,
      fillColor,
      strokeColor,
      disabled,
      ariaLabel,
    });

    return (
      <div
        className={classNames({
          Icon: true,
          'has-default-markers': hasDefaultMarkers(svgElement),
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