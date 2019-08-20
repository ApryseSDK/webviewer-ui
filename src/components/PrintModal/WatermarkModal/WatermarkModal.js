import React from 'react';

import PropTypes from 'prop-types';
import ColorPalette from 'components/ColorPalette';
import './WatermarkModal.scss';

// numbers were taken from font dropdown menu in google docs
const FONT_SIZES = [
  8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48,
];
// TODO maybe turn this into a map
const WATERMARK_LOCATIONS = [
  'Center', 'Top Left', 'Top Right', 'Top Center',
  'Bottom Left', 'Bottom Right', 'Bottom Center',
];

const FORM_FIELD_KEYS = {
  location: 'location',
  fontSize: 'fontSize',
  text: 'text',
  color: 'color',
  opacity: 'opacity',
};

const DEFAULT_VALS = {
  [FORM_FIELD_KEYS.location]: WATERMARK_LOCATIONS[0],
  [FORM_FIELD_KEYS.fontSize]: FONT_SIZES[0],
  [FORM_FIELD_KEYS.text]: '',
  [FORM_FIELD_KEYS.color]: new window.Annotations.Color(255, 255, 255, 1),
  [FORM_FIELD_KEYS.opacity]: 100,
};

export default class WatermarkModal extends React.PureComponent {
  static propTypes = {
    isVisible: PropTypes.bool,
    modalClosed: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      ...DEFAULT_VALS,
    };
    this.canvasContainerRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.isVisible !== undefined) {
      this.setState({
        isVisible: this.props.isVisible,
      });
    }
  }

  componentDidUpdate(prevProps) {
    // Typical usage, don't forget to compare the props
    if (this.props.isVisible !== prevProps.isVisible) {
      this.setState({
        isVisible: this.props.isVisible,
      });

      if (this.props.isVisible) {
        // window.docViewer.setWatermark({
        //   // Draw diagonal watermark in middle of the document
        //   diagonal: {
        //     fontSize: 25, // or even smaller size
        //     fontFamily: 'sans-serif',
        //     color: 'red',
        //     opacity: 50, // from 0 to 100
        //     text: 'Watermark',
        //   },

        //   // Draw header watermark
        //   header: {
        //     fontSize: 10,
        //     fontFamily: 'sans-serif',
        //     color: 'red',
        //     opacity: 70,
        //     left: 'left watermark',
        //     center: 'center watermark',
        //     right: '',
        //   },
        // });

        // window.docViewer.refreshAll();
        // window.docViewer.updateView();

        // https://www.pdftron.com/documentation/web/guides/watermarks/#draw-watermark-without-documentviewer

        window.docViewer.getDocument().loadCanvasAsync({
          pageIndex: 0,
          drawComplete: canvas => {
            this.canvasContainerRef.current.appendChild(canvas);
          },
        });
      } else {
        window.docViewer.setWatermark({});
        // window.docViewer.refreshAll();
        // window.docViewer.updateView();
      }
    }
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
    });
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
                { WATERMARK_LOCATIONS.map(location => <option key={location}>{location}</option>) }
              </select>

              <label>
                Text
              </label>
              <input
                value={this.state[FORM_FIELD_KEYS.text]}
                onChange={event => this.handleInputChange(FORM_FIELD_KEYS.text, event.target.value)}
                type="text"/>

              <label>Opacity</label>
              {/* TODO style this like the stylepop up slider */}
              <input
                type="range"
                min="1"
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
            <button>Reset</button>
            <button>Ok</button>
          </div>
        </div>
      </>
    );
  }
}