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
    this.svg = React.createRef();
  }

  updateSvg() {
    if (this.isInlineSvg()) {
      var domElement = this.svg.current;
      // remove existing svg
      while (domElement.firstChild) {
        domElement.removeChild(domElement.firstChild);
      }

      // innerHTML also works, but not in IE...
      const svg = (new DOMParser()).parseFromString(this.props.glyph, 'image/svg+xml').querySelector('svg');
      domElement.appendChild(svg);
    }
  }

  componentDidMount() {
    this.updateSvg();
  }

  componentDidUpdate(prevProps) {
    if (this.props.glyph !== prevProps.glyph) {
      this.updateSvg();
    }
  }

  isInlineSvg() {
    const { glyph } = this.props;

    return glyph && glyph.indexOf('<svg') === 0;
  }

  render() {
    const { className = '', color } = this.props;
    const filter = (color && (color === 'rgba(255, 255, 255, 1)' || color === 'rgb(255, 255, 255)')) ? 'drop-shadow(0 0 .5px #333)' : undefined;
    const isInlineSvg = this.isInlineSvg();
    let viewBox, child;

    if (!isInlineSvg) {
      const svg = require(`../../../assets/${this.props.glyph}.svg`).default;
      viewBox = svg.viewBox;
      child = (<use xlinkHref={`#${svg.id}`} />);
    }

    return (
      <svg ref={this.svg} className={`Icon ${className}`} viewBox={viewBox} style={{ color: (color === 'rgba(0, 0, 0, 0)') ? '#808080' : color, filter }}>
        {child}
      </svg>
    );
  }
}

export default Icon;