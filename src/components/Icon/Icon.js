import React from 'react';
import PropTypes from 'prop-types';

import './Icon.scss';

class Icon extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    color: PropTypes.string,
    glyph: PropTypes.string.isRequired
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
      var domElement = this.icon.current;

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
    const { className = '', color, glyph } = this.props;
    const filter = (color && (color === 'rgba(255, 255, 255, 1)' || color === 'rgb(255, 255, 255)')) ? 'drop-shadow(0 0 .5px #333)' : undefined;
    const svgElement = this.isInlineSvg() ? glyph : require(`../../../assets/${this.props.glyph}.svg`);

    return (
      <div ref={this.icon} className={`Icon ${className}`} style={{ color: (color === 'rgba(0, 0, 0, 0)') ? '#808080' : color, filter }} dangerouslySetInnerHTML={{__html: svgElement}}></div>
    );
  }
}

export default Icon;