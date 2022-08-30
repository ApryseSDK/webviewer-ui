import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Icon.scss';

class Icon extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    color: PropTypes.string,
    glyph: PropTypes.string.isRequired,
    fillColor: PropTypes.string,
    strokeColor: PropTypes.string,
    disabled: PropTypes.bool
  }

  constructor() {
    super();
    this.icon = React.createRef();
  }

  componentDidMount() {
    this.updateSvg();
  }

  componentDidUpdate(prevProps) {
    if (this.props.glyph !== prevProps.glyph) {
      this.updateSvg();
    }
  }

  updateSvg() {
    if (this.isInlineSvg()) {
      const domElement = this.icon.current;

      // remove existing svg
      while (domElement.firstChild) {
        domElement.removeChild(domElement.firstChild);
      }

      // innerHTML also works, but not in IE...
      const svg = (new DOMParser()).parseFromString(this.props.glyph, 'image/svg+xml').querySelector('svg');
      domElement.appendChild(svg);
    }
  }

  isInlineSvg() {
    const { glyph } = this.props;
    return glyph && glyph.indexOf('<svg') === 0;
  }

  render() {
    const { className = '', color, glyph, fillColor = '', strokeColor = '', disabled } = this.props;
    const filter = (color && (color === 'rgba(255, 255, 255, 1)' || color === 'rgb(255, 255, 255)')) ? 'drop-shadow(0 0 .5px #333)' : undefined;
    let svgElement;

    try {
      // eslint-disable-next-line global-require,import/no-dynamic-require
      svgElement = this.isInlineSvg() ? glyph : require(`../../../assets/icons/${this.props.glyph}.svg`);
    } catch {
      svgElement = undefined;
    }

    const style = {
      filter
    };

    if (!disabled) {
      style.color = (color === 'rgba(0, 0, 0, 0)') ? '#808080' : color;
      if (fillColor) {
        svgElement = svgElement.replace('fill="none"', `fill="#${fillColor}"`);
      }
      if (strokeColor) {
        svgElement = svgElement.replace('fill="stroke"', `fill="#${strokeColor}"`);
      }
    }

    return (
      <div
        ref={this.icon}
        className={classNames({
          Icon: true,
          [className]: true,
          [fillColor]: true,
          disabled,
        })}
        style={style}
        dangerouslySetInnerHTML={{ __html: svgElement }}
      />
    );
  }
}

export default Icon;
