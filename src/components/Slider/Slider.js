import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { isIE11 } from 'helpers/device';
import { circleRadius, svgHeight } from 'constants/slider';

import './Slider.scss';

class Slider extends React.PureComponent {
  static propTypes = {
    property: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    displayProperty: PropTypes.string.isRequired,
    displayValue: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    getCirclePosition: PropTypes.func.isRequired,
    convertRelativeCirclePositionToValue: PropTypes.func.isRequired,
    onStyleChange: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.isMouseDown = false;
    this.sliderSvg = React.createRef();
    this.lineLength = 0;
  }

  componentDidMount() {
    window.addEventListener('mousemove', this.onMove);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('orientationchange', this.updateSvg);
    window.addEventListener('resize', this.updateSvg);
    this.sliderSvg.current.addEventListener('touchmove', this.onMove, { passive: false });
    this.updateSvg();
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.onMove);
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('orientationchange', this.updateSvg);
    window.removeEventListener('resize', this.updateSvg);
    this.sliderSvg.current.removeEventListener('touchmove', this.onMove, { passive: false });
  }

  updateSvg = () => {
    this.setLineLength();
    this.forceUpdate();
  }

  setLineLength = () => {
    this.lineLength = 0.94 * this.sliderSvg.current.getBoundingClientRect().width - 2 * circleRadius;
    console.log('lineLength', this.lineLength);
  }

  onMouseDown = e => {
    this.isMouseDown = true;
    this.onMove(e.nativeEvent);
  }

  onMouseUp = () => {
    this.isMouseDown = false;
  }

  onTouchStart = e => {
    this.onMove(e);
  }

  onMove = e => {
    const isUsingMouse = !e.touches;
    if (isUsingMouse && !this.isMouseDown) {
      return;
    }

    e.preventDefault();

    const { property, onStyleChange, convertRelativeCirclePositionToValue } = this.props;
    const relativeCirclePosition = this.getRelativeCirclePosition(e);
    const value = convertRelativeCirclePositionToValue(relativeCirclePosition);

    onStyleChange(property, value);
  }

  getRelativeCirclePosition = e => {
    const isUsingMouse = !e.touches;
    const lineStart = circleRadius;
    const lineEnd = lineStart + this.lineLength;
    const svgLeft = this.sliderSvg.current.getBoundingClientRect().left;
    let circlePosition;

    if (isUsingMouse) {
      circlePosition = e.pageX - svgLeft;
    } else {
      circlePosition = e.touches[0].pageX - svgLeft;
    }

    if (circlePosition < lineStart) {
      circlePosition = lineStart;
    } else if (circlePosition > lineEnd) {
      circlePosition = lineEnd;
    }

    return (circlePosition - lineStart) / this.lineLength;
  }

  renderSlider = () => {
    const { displayProperty, displayValue, getCirclePosition, t } = this.props;
    const circleCenter = getCirclePosition(this.lineLength);

    return (
      <div className="slider">
        <div className="slider-property">
          {t(`option.slider.${displayProperty}`)}
        </div>
        <div className="slider-svg-container">
          <svg data-element="slider" onMouseDown={this.onMouseDown} onTouchStart={this.onTouchStart} ref={this.sliderSvg}>
            <line x1={circleRadius} y1="50%" x2={circleCenter} y2="50%" strokeWidth="2" stroke="#00a5e4" strokeLinecap="round" />
            <line x1={circleCenter} y1="50%" x2={this.lineLength + circleRadius} y2="50%" strokeWidth="2" stroke="#e0e0e0" strokeLinecap="round" />
            <circle cx={circleCenter} cy="50%" r={circleRadius} fill="#00a5e4" />
          </svg>
          <div className="slider-value">{displayValue}</div>
        </div>
      </div>
    );
  }

  render() {
    if (isIE11) {
      // We use css Grid to place sliders responsively,
      // since IE11 only supports the old Grid, we use css Flexbox
      return (
        <div className="slider">
          {this.renderSlider()}
        </div>
      );
    }

    return this.renderSlider();
  }
}

export default withTranslation(null, { wait: false })(Slider);
