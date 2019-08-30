import ColorPalette from 'components/ColorPalette';
import Slider from 'components/Slider';
import { circleRadius } from 'constants/slider';
import core from 'core';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';
import './WatermarkModal.scss';

import ActionButton from 'components/ActionButton';

const DESIRED_WIDTH = 300;
const DESIRED_HEIGHT = 300;

// numbers were taken from font dropdown menu in google docs
const FONT_SIZES = [
  8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48,
];

const WATERMARK_LOCATIONS = {
  CENTER: 'Center',
  TOP_LEFT: 'Top Left',
  TOP_RIGHT: 'Top Right',
  // TOP_CENTER: 'Top Center',
  // BOT_LEFT: 'Bottom Left',
  // BOT_RIGHT: 'Bottom Right',
  // BOT_CENTER: 'Bottom Center',
};

const FORM_FIELD_KEYS = {
  location: 'location',
  fontSize: 'fontSize',
  text: 'text',
  color: 'color',
  opacity: 'opacity',
};

const DEFAULT_VALS = {
  [FORM_FIELD_KEYS.fontSize]: FONT_SIZES[FONT_SIZES.length / 2],
  [FORM_FIELD_KEYS.text]: '',
  [FORM_FIELD_KEYS.color]: new window.Annotations.Color(241, 160, 153),
  [FORM_FIELD_KEYS.opacity]: 100,
};

class WatermarkModal extends React.PureComponent {
  handleWatermarkRenderFxn;

  static propTypes = {
    isVisible: PropTypes.bool,
    pageIndexToView: PropTypes.number,
    modalClosed: PropTypes.func,
    formSubmitted: PropTypes.func,
    t: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    const locationSettings = {};
    Object.keys(WATERMARK_LOCATIONS).forEach((key) => {
      const temp = { ...DEFAULT_VALS };
      locationSettings[key] = temp;
    });
    this.state = {
      isVisible: false,
      isColorPaletteVisible: false,
      locationSettings,
      previousLocationSettings: locationSettings,
      currLocation: this.getKeyByValue(WATERMARK_LOCATIONS, WATERMARK_LOCATIONS.CENTER),
    };
    this.canvasContainerRef = React.createRef();

    this.handleWatermarkRenderFxn = () => {
      if (this.props.isVisible) {
        this.setState({
          locationSettings: this.state.previousLocationSettings,
        }, () => {
          this.addWatermark(this.state.locationSettings[this.state.currLocation]);
        });
      } else {
        this.removeWatermark();
      }
    };
  }

  componentDidMount() {
    if (this.props.isVisible !== undefined) {
      this.setState({
        isVisible: this.props.isVisible,
      }, () => core.addEventListener('documentLoaded', this.handleWatermarkRenderFxn));
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.isVisible !== prevProps.isVisible) {
      this.setState({
        isVisible: this.props.isVisible,
      }, () => this.handleWatermarkRenderFxn());
    }
  }

  addWatermark(state) {
    let watermarkOptions = {};
    
    let diagonal = {};
    let header = {};
    let footer = {};

    Object.keys(WATERMARK_LOCATIONS).forEach((key) => {
      const temp = this.constructWatermarkOptions(WATERMARK_LOCATIONS[key], this.state.locationSettings[key]);

      const positionTop = WATERMARK_LOCATIONS.TOP_CENTER === WATERMARK_LOCATIONS[key] || WATERMARK_LOCATIONS.TOP_LEFT === WATERMARK_LOCATIONS[key] || WATERMARK_LOCATIONS.TOP_RIGHT === WATERMARK_LOCATIONS[key];
      const positionBot = WATERMARK_LOCATIONS.BOT_CENTER === WATERMARK_LOCATIONS[key] || WATERMARK_LOCATIONS.BOT_LEFT === WATERMARK_LOCATIONS[key] || WATERMARK_LOCATIONS.BOT_RIGHT === WATERMARK_LOCATIONS[key];
  
      const positionCenter = WATERMARK_LOCATIONS.CENTER === WATERMARK_LOCATIONS[key];
      if (positionCenter) {
        diagonal = {
          ...diagonal,
          ...temp
        };
      }
      else if (positionTop) {
        header = {
          ...header,
          ...temp
        };
      }
      else if (positionBot) {
        footer = {
          ...footer,
          ...temp
        };
      }
    });
    watermarkOptions = {
      diagonal,
      header,
      footer
    };

    core.setWatermark(watermarkOptions);

    const pageHeight = core.getPageHeight(this.props.pageIndexToView);
    const pageWidth = core.getPageWidth(this.props.pageIndexToView);

    const desiredZoomForWidth = DESIRED_WIDTH / pageWidth;
    const desiredZoomForHeight = DESIRED_HEIGHT / pageHeight;

    const desiredZoom = Math.min(desiredZoomForHeight, desiredZoomForWidth);

    core.getDocument().loadCanvasAsync({
      pageIndex: this.props.pageIndexToView,
      zoom: desiredZoom,
      drawComplete: canvas => {
        const nodes = this.canvasContainerRef.current.childNodes;
        if (nodes && nodes.length > 0) {
          this.canvasContainerRef.current.removeChild(nodes[0]);
        }
        canvas.style.border = '1px solid black';
        canvas.style.height = this.canvasContainerRef.current.style.height;
        this.canvasContainerRef.current.appendChild(canvas);
      },
    });

    // Note: do not update and refresh the doc else it may affect other docs as well
  }

  // eslint-disable-next-line class-methods-use-this
  constructWatermarkOptions(location, state) {

    const positionLeft = WATERMARK_LOCATIONS.TOP_LEFT === location || WATERMARK_LOCATIONS.BOT_LEFT === location;
    const positionRight = WATERMARK_LOCATIONS.TOP_RIGHT === location || WATERMARK_LOCATIONS.BOT_RIGHT === location;
    const positionTopOrBotCenter = WATERMARK_LOCATIONS.TOP_CENTER === location || WATERMARK_LOCATIONS.BOT_CENTER === location;
    const positionCenter = WATERMARK_LOCATIONS.CENTER === location;

    const watermarkOption = {
      fontSize: state.fontSize,
      fontFamily: 'sans-serif',
      color: state.color.toString(),
      opacity: state.opacity,
    };

    if (positionCenter) {
      watermarkOption.text = state.text;
    }
    else if (positionLeft) {
      watermarkOption.left = state.text;
    }
    else if (positionTopOrBotCenter) {
      watermarkOption.center = state.text;
    }
    else if (positionRight) {
      watermarkOption.right = state.text;
    }

    return watermarkOption;
  }

  // eslint-disable-next-line class-methods-use-this
  removeWatermark() {
    core.setWatermark({});
  }

  closeModal() {
    this.setState({
      isVisible: false,
    }, () => this.props.modalClosed());
  }

  handleInputChange(key, value) {
    const currLocationSettings = {
      ...this.state.locationSettings,
    };
    currLocationSettings[this.state.currLocation] = {
      ...currLocationSettings[this.state.currLocation],
      [key]: value
    };

    this.setState({
      [key]: value,
      locationSettings: currLocationSettings
    }, () => {
      this.addWatermark(this.state.locationSettings[this.state.currLocation]);
    });

  }

  componentWillUnmount() {
    core.removeEventListener('documentLoaded', this.handleWatermarkRenderFxn);
  }

  resetForm(event) {
    event.preventDefault();
    const locationSettings = {};
    Object.keys(WATERMARK_LOCATIONS).forEach((key) => {
      const temp = { ...DEFAULT_VALS };
      locationSettings[key] = temp;
    });
    this.setState({
      locationSettings: locationSettings,
    }, () => this.addWatermark(this.state.locationSettings[this.state.currLocation]));
  }

  onOkPressed() {
    this.setState({
      isVisible: false,
      previousLocationSettings: this.state.locationSettings
    }, () => {
      // the order of these fxn calls matter
      this.props.modalClosed();
      let watermarkOptions = {};
    
      let diagonal = {};
      let header = {};
      let footer = {};
  
      Object.keys(WATERMARK_LOCATIONS).forEach((key) => {
        const temp = this.constructWatermarkOptions(WATERMARK_LOCATIONS[key], this.state.locationSettings[key]);
  
        const positionTop = WATERMARK_LOCATIONS.TOP_CENTER === WATERMARK_LOCATIONS[key] || WATERMARK_LOCATIONS.TOP_LEFT === WATERMARK_LOCATIONS[key] || WATERMARK_LOCATIONS.TOP_RIGHT === WATERMARK_LOCATIONS[key];
        const positionBot = WATERMARK_LOCATIONS.BOT_CENTER === WATERMARK_LOCATIONS[key] || WATERMARK_LOCATIONS.BOT_LEFT === WATERMARK_LOCATIONS[key] || WATERMARK_LOCATIONS.BOT_RIGHT === WATERMARK_LOCATIONS[key];
    
        const positionCenter = WATERMARK_LOCATIONS.CENTER === WATERMARK_LOCATIONS[key];
        if (positionCenter) {
          diagonal = {
            ...diagonal,
            ...temp
          };
        }
        else if (positionTop) {
          header = {
            ...header,
            ...temp
          };
        }
        else if (positionBot) {
          footer = {
            ...footer,
            ...temp
          };
        }
      });
      watermarkOptions = {
        diagonal,
        header,
        footer
      };
      this.props.formSubmitted(watermarkOptions);
    });
  }

  getCirclePosn(lineLength) {
    const lineStart = circleRadius;
    return (this.state.locationSettings[this.state.currLocation][FORM_FIELD_KEYS.opacity] / 100) * lineLength + lineStart;
  }

  setColorPaletteVisibility(visible) {
    this.setState({ isColorPaletteVisible: visible });
  }

  setLocation(newLocation) {
    const key = this.getKeyByValue(WATERMARK_LOCATIONS, newLocation);
    this.setState({
      currLocation: key,
    }, () => {
      this.addWatermark(this.state.locationSettings[this.state.currLocation]);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }

  render() {
    const { isVisible } = this.props;
    if (!isVisible) {
      return null;
    }

    const { t } = this.props;
    const formInfo = this.state.locationSettings[this.state.currLocation];
    return (
      <>
        <div className={'Modal Watermark'} data-element="watermarkModal" onMouseDown={() => this.closeModal()}>
          <div className="form-container" onMouseDown={e => e.stopPropagation()}>
            <div className="header-container" onMouseDown={e => e.stopPropagation()}>
              <div className="header">{t('option.print.printWatermarkSettings')}</div>
              <ActionButton dataElement="watermarkModalCloseButton" title="action.close" img="ic_close_black_24px" onClick={() => this.closeModal()} /> 
            </div>

            <div className="form-content-container">
              <form>
                <div className="form-field">

                  <label>
                    {t(`watermark.location`)}
                  </label>
                  <select
                    value={WATERMARK_LOCATIONS[this.state.currLocation]}
                    onChange={event => { this.setLocation(event.target.value); } }>
                    { Object.keys(WATERMARK_LOCATIONS).map(key => <option key={key}>{WATERMARK_LOCATIONS[key]}</option>) }
                  </select>

                </div>
                <div className="form-field">

                  <label>
                    {t(`watermark.text`)}
                  </label>
                  <input
                    className="text-input"
                    value={formInfo[FORM_FIELD_KEYS.text]}
                    onChange={event => this.handleInputChange(FORM_FIELD_KEYS.text, event.target.value)}
                    type="text" />

                </div>
                <div className="form-field">

                  <label>
                    {t(`watermark.size`)}
                  </label>
                  <select
                    value={formInfo[FORM_FIELD_KEYS.fontSize]}
                    onChange={event => this.handleInputChange(FORM_FIELD_KEYS.fontSize, +event.target.value)}>
                    { FONT_SIZES.map(fontSize => <option key={fontSize}>{fontSize}</option>) }
                  </select>

                </div>
                <div className="form-field">
                  <Slider
                    property={'opacity'} // arbitrary property name. this property isn't used in this file
                    displayProperty={'opacity'} // arbitrary property name. this property isn't used in this file
                    value={formInfo[FORM_FIELD_KEYS.opacity]}
                    displayValue={`${(formInfo[FORM_FIELD_KEYS.opacity])}%`}
                    getCirclePosition={lineLength => this.getCirclePosn(lineLength)}
                    convertRelativeCirclePositionToValue={circlePosn => circlePosn}
                    onStyleChange={(property, value) => this.handleInputChange(FORM_FIELD_KEYS.opacity, Math.round(value * 100))}
                  />

                </div>
                <div className="form-field">

                  <label>
                    {t(`watermark.colors`)}
                  </label>
                  <div
                    className="cell"
                    style={{ backgroundColor: formInfo[FORM_FIELD_KEYS.color].toHexString() }}
                    onClick={() => this.setColorPaletteVisibility(!this.state.isColorPaletteVisible)}
                  >
                  </div>

                  {
                    this.state.isColorPaletteVisible && <div className={'Popup StylePopup'} data-element="stylePopup" onClick={() => this.setColorPaletteVisibility(false)}>
                      <ColorPalette
                        color={formInfo[FORM_FIELD_KEYS.color]}
                        property={'TextColor'} // arbitrary property name. this property isn't used in this file
                        onStyleChange = {(property, color) => { this.handleInputChange(FORM_FIELD_KEYS.color, color); this.setColorPaletteVisibility(false); }}
                      />
                    </div>
                  }

                </div>

                <button className="reset button" onClick={event => this.resetForm(event)}>{t(`action.reset`)}</button>
              </form>

              <div className="canvas-container" ref={this.canvasContainerRef}>

              </div>
            </div>

            <div className="button-container" onClick={e => e.stopPropagation()}>
              <a className="ok button" onClick={() => this.onOkPressed()}>{t(`action.ok`)}</a>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default withTranslation()(WatermarkModal);