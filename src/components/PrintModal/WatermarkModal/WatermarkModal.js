/* eslint-disable class-methods-use-this */
import React from 'react';
import core from 'core';
import PropTypes from 'prop-types';
import ColorPalette from 'components/ColorPalette';
import './WatermarkModal.scss';

// numbers were taken from font dropdown menu in google docs
const FONT_SIZES = [
  8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48,
];

const WATERMARK_LOCATIONS = {
  CENTER: 'Center',
  TOP_LEFT: 'Top Left',
  TOP_RIGHT: 'Top Right',
  TOP_CENTER: 'Top Center',
  BOT_LEFT: 'Bottom Left',
  BOT_RIGHT: 'Bottom Right',
  BOT_CENTER: 'Bottom Center',
};

const FORM_FIELD_KEYS = {
  location: 'location',
  fontSize: 'fontSize',
  text: 'text',
  color: 'color',
  opacity: 'opacity',
};

const DEFAULT_VALS = {
  [FORM_FIELD_KEYS.location]: WATERMARK_LOCATIONS.CENTER,
  [FORM_FIELD_KEYS.fontSize]: FONT_SIZES[FONT_SIZES.length / 2],
  [FORM_FIELD_KEYS.text]: '',
  [FORM_FIELD_KEYS.color]: new window.Annotations.Color(0, 0, 0, 1),
  [FORM_FIELD_KEYS.opacity]: 100,
};

export default class WatermarkModal extends React.PureComponent {
  handleWatermarkRenderFxn;

  static propTypes = {
    isVisible: PropTypes.bool,
    pageIndexToView: PropTypes.number,
    modalClosed: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      ...DEFAULT_VALS,
    };
    this.canvasContainerRef = React.createRef();
    this.handleWatermarkRenderFxn = () => {
      if (this.props.isVisible) {
        this.addWatermark(this.state);
      } else {
        this.removeWatermark();
      }
    };
  }

  componentDidMount() {
    if (this.props.isVisible !== undefined) {
      this.setState({
        isVisible: this.props.isVisible,
        ...DEFAULT_VALS,
      }, core.addEventListener('documentLoaded', this.handleWatermarkRenderFxn));
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.isVisible !== prevProps.isVisible) {
      this.setState({
        isVisible: this.props.isVisible,
        ...DEFAULT_VALS,
      }, this.handleWatermarkRenderFxn);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  addWatermark(state) {
    const positionTop = WATERMARK_LOCATIONS.TOP_CENTER === state.location || WATERMARK_LOCATIONS.TOP_LEFT === state.location || WATERMARK_LOCATIONS.TOP_RIGHT === state.location;
    const positionBot = WATERMARK_LOCATIONS.BOT_CENTER === state.location || WATERMARK_LOCATIONS.BOT_LEFT === state.location || WATERMARK_LOCATIONS.BOT_RIGHT === state.location;

    const positionLeft = WATERMARK_LOCATIONS.TOP_LEFT === state.location || WATERMARK_LOCATIONS.BOT_LEFT === state.location;
    const positionRight = WATERMARK_LOCATIONS.TOP_RIGHT === state.location || WATERMARK_LOCATIONS.BOT_RIGHT === state.location;
    const positionTopOrBotCenter = WATERMARK_LOCATIONS.TOP_CENTER === state.location || WATERMARK_LOCATIONS.BOT_CENTER === state.location;
    const positionCenter = WATERMARK_LOCATIONS.CENTER === state.location;

    const watermarkOption = {
      fontSize: state.fontSize,
      fontFamily: 'sans-serif',
      color: state.color.toString(),
      opacity: state.opacity,
      text: positionCenter ? state.text : null,
      left: positionLeft ? state.text : null,
      center: positionTopOrBotCenter ? state.text : null,
      right: positionRight ? state.text : null,
    };

    window.docViewer.setWatermark({
      diagonal: positionCenter ? watermarkOption : null,
      header: positionTop ? watermarkOption : null,
      footer: positionBot ? watermarkOption : null,
    });

    core.getDocument().loadCanvasAsync({
      pageIndex: this.props.pageIndexToView,
      drawComplete: canvas => {
        const nodes = this.canvasContainerRef.current.childNodes;
        if (nodes && nodes.length > 0) {
          this.canvasContainerRef.current.removeChild(nodes[0]);
        }
        this.canvasContainerRef.current.appendChild(canvas);
      },
    });

    // Note: do not update and refresh the doc else it may affect other docs as well
  }

  removeWatermark() {
    window.docViewer.setWatermark({});
  }

  closeModal() {
    this.setState({
      isVisible: false,
    });
    this.props.modalClosed();
  }

  handleInputChange(key, value) {
    this.setState({
      [key]: value,
    }, () => this.addWatermark(this.state));
  }

  componentWillUnmount() {
    core.removeEventListener('documentLoaded', this.handleWatermarkRenderFxn);
  }

  render() {
    const { isVisible } = this.props;
    if (!isVisible) {
      return null;
    }
    return (
      <>
        <div className={'Modal Watermark'} data-element="waterMarkModal" onClick={() => this.closeModal()}>
          <div onClick={e => e.stopPropagation()}>
            {/* TODO pass in t */}
            <form>
              <label>
                Size
              </label>
              <select
                value={this.state[FORM_FIELD_KEYS.fontSize]}
                onChange={event => this.handleInputChange(FORM_FIELD_KEYS.fontSize, +event.target.value)}>
                { FONT_SIZES.map(fontSize => <option key={fontSize}>{fontSize}</option>) }
              </select>

              <label>
                Location
              </label>
              <select
                value={this.state[FORM_FIELD_KEYS.location]}
                onChange={event => this.handleInputChange(FORM_FIELD_KEYS.location, event.target.value)}>
                { Object.keys(WATERMARK_LOCATIONS).map(key => <option key={key}>{WATERMARK_LOCATIONS[key]}</option>) }
              </select>

              <label>
                Text
              </label>
              <input
                value={this.state[FORM_FIELD_KEYS.text]}
                onChange={event => this.handleInputChange(FORM_FIELD_KEYS.text, event.target.value)}
                type="text" />

              <label>Opacity</label>
              {/* TODO style this like the stylepop up slider */}
              <input
                type="range"
                min="0"
                max="100"
                value={this.state[FORM_FIELD_KEYS.opacity]}
                onChange={event => this.handleInputChange(FORM_FIELD_KEYS.opacity, +event.target.value)}>
              </input>

              <label>Style</label>
              {/* TODO style this to be just a div with the curr color. on click, show color palette */}
              <ColorPalette
                color={this.state.color}
                property={'TextColor'}
                onStyleChange = {(property, color) => this.handleInputChange(FORM_FIELD_KEYS.color, color)}
              />

            </form>

            <div ref={this.canvasContainerRef}>

            </div>
          </div>
          <div onClick={e => e.stopPropagation()}>
            {/* TODO implement button functionality */}
            <button>Reset</button>
            <button>Ok</button>
          </div>
        </div>
      </>
    );
  }
}