import ColorPalette from 'components/ColorPalette';
import Slider from 'components/Slider';
import { circleRadius } from 'constants/slider';
import core from 'core';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';
import './WatermarkModal.scss';

import ActionButton from 'components/ActionButton';

/**
 * TODO refactor this component so that the Print Modal passes in the form fields and it will store the previous form field settings
 */

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
  [FORM_FIELD_KEYS.color]: new window.Annotations.Color(241, 160, 153),
  [FORM_FIELD_KEYS.opacity]: 100,
};
/**
 * Values come from https://www.pdftron.com/api/web/CoreControls.DocumentViewer.html#setWatermark__anchor
 */
const WATERMARK_API_LOCATIONS = {
  [WATERMARK_LOCATIONS.CENTER]: 'diagonal',
  [WATERMARK_LOCATIONS.TOP_LEFT]: 'headerLeft',
  [WATERMARK_LOCATIONS.TOP_RIGHT]: 'headerRight',
  [WATERMARK_LOCATIONS.TOP_CENTER]: 'headerCenter',
  [WATERMARK_LOCATIONS.BOT_LEFT]: 'footerLeft',
  [WATERMARK_LOCATIONS.BOT_RIGHT]: 'footerRight',
  [WATERMARK_LOCATIONS.BOT_CENTER]: 'footerCenter',
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
    const locationSettings = this.initializeLocationSettings();
    this.state = {
      isColorPaletteVisible: false,
      locationSettings,
      previousLocationSettings: locationSettings,
    };
    this.canvasContainerRef = React.createRef();

    this.handleWatermarkRenderFxn = () => {
      if (this.props.isVisible) {
        this.setState({
          locationSettings: this.state.previousLocationSettings,
        }, () => {
          this.addWatermarks();
        });
      } else {
        this.removeAllWatermarks();
      }
    };
  }

  componentDidMount() {
    if (this.props.isVisible !== undefined) {
      core.addEventListener('documentLoaded', this.handleWatermarkRenderFxn);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.isVisible !== prevProps.isVisible) {
      this.setState({
        isColorPaletteVisible: false,
      }, () => this.handleWatermarkRenderFxn());
    }
  }

  addWatermarks = () => {
    const watermarkOptions = this.createWatermarks();

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
  constructWatermarkOption = value => {
    const watermarkOption = {
      fontSize: value.fontSize,
      fontFamily: 'sans-serif',
      color: value.color.toString(),
      opacity: value.opacity,
      text: value.text,
    };

    return watermarkOption;
  }

  createWatermarks = () => {
    const watermarks = {};

    Object.keys(WATERMARK_LOCATIONS).forEach(key => {
      const temp = this.constructWatermarkOption(this.state.locationSettings[key]);
      const value = WATERMARK_LOCATIONS[key];
      watermarks[WATERMARK_API_LOCATIONS[value]] = temp;
    });
    return watermarks;
  }

  // eslint-disable-next-line class-methods-use-this
  removeAllWatermarks = () => {
    core.setWatermark({});
  }

  closeModal = () => {
    this.props.modalClosed();
  }

  handleInputChange = (key, value) => {
    const currLocationSettings = {
      ...this.state.locationSettings,
    };
    const currSelectedLocation = this.getCurrentSelectedLocation();
    currLocationSettings[currSelectedLocation] = {
      ...currLocationSettings[currSelectedLocation],
      [key]: value,
    };

    this.setState({
      locationSettings: currLocationSettings,
    }, () => {
      this.addWatermarks();
    });
  }

  componentWillUnmount() {
    core.removeEventListener('documentLoaded', this.handleWatermarkRenderFxn);
  }

  resetForm = event => {
    event.preventDefault();
    const locationSettings = this.initializeLocationSettings();
    this.setState({
      locationSettings,
    }, () => this.addWatermarks());
  }

  onOkPressed = () => {
    this.setState({
      previousLocationSettings: this.state.locationSettings,
    }, () => {
      // the order of these fxn calls matter
      this.props.modalClosed();
      const watermarkOptions = this.createWatermarks();
      this.props.formSubmitted(watermarkOptions);
    });
  }

  getCirclePosn = lineLength => {
    const lineStart = circleRadius;
    const currSelectedLocation = this.getCurrentSelectedLocation();
    return (this.state.locationSettings[currSelectedLocation][FORM_FIELD_KEYS.opacity] / 100) * lineLength + lineStart;
  }

  setColorPaletteVisibility = visible => {
    this.setState({ isColorPaletteVisible: visible });
  }

  onLocationChanged = newLocation => {
    const key = this.getKeyByValue(WATERMARK_LOCATIONS, newLocation);
    const currLocationSettings = {
      ...this.state.locationSettings,
    };
    Object.keys(currLocationSettings).forEach(locationKey => {
      let locationSetting = currLocationSettings[locationKey];
      locationSetting = {
        ...locationSetting,
        isSelected: key === locationKey,
      };
      currLocationSettings[locationKey] = locationSetting;
    });


    this.setState({
      locationSettings: currLocationSettings,
    }, () => {
      this.addWatermarks();
    });
  }

  // eslint-disable-next-line class-methods-use-this
  initializeLocationSettings = () => {
    const locationSettings = {};
    Object.keys(WATERMARK_LOCATIONS).forEach(key => {
      // ignore location as it is redundant as we already have location key
      const { location, ...others } = DEFAULT_VALS;
      const temp = { ...others, isSelected: WATERMARK_LOCATIONS[key] === DEFAULT_VALS.location };
      locationSettings[key] = temp;
    });
    return locationSettings;
  }

  // eslint-disable-next-line class-methods-use-this
  getKeyByValue = (object, value) => Object.keys(object).find(key => object[key] === value)

  getCurrentSelectedLocation = () => Object.keys(this.state.locationSettings).find(locationKey => {
    const locationSetting = this.state.locationSettings[locationKey];
    return locationSetting.isSelected;
  })

  render() {
    const { isVisible } = this.props;
    if (!isVisible) {
      return null;
    }

    const { t } = this.props;

    const currLocation = this.getCurrentSelectedLocation();
    const formInfo = this.state.locationSettings[currLocation];
    return (
      <div className={'Modal Watermark'} data-element="watermarkModal" onMouseDown={this.closeModal}>
        <div className="form-container" data-element="formContainer" onMouseDown={e => e.stopPropagation()}>
          <div className="header-container" onMouseDown={e => e.stopPropagation()}>
            <div className="header">{t('option.print.addWatermarkSettings')}</div>
            <ActionButton dataElement="watermarkModalCloseButton" title="action.close" img="ic_close_black_24px" onClick={this.closeModal} />
          </div>

          <div className="form-content-container">
            <form data-element="form">
              <div className="form-field">

                <label>
                  {t(`option.watermark.location`)}
                </label>
                <select
                  data-element="location"
                  value={WATERMARK_LOCATIONS[currLocation]}
                  onChange={event => { this.onLocationChanged(event.target.value); }}
                >
                  { Object.keys(WATERMARK_LOCATIONS).map(key => <option key={key}>{WATERMARK_LOCATIONS[key]}</option>) }
                </select>

              </div>

              <div className="form-field separator">

              </div>
              <div className="form-field">

                <label>
                  {t(`option.watermark.text`)}
                </label>
                <input
                  className="text-input"
                  data-element="textInput"
                  value={formInfo[FORM_FIELD_KEYS.text]}
                  onChange={event => this.handleInputChange(FORM_FIELD_KEYS.text, event.target.value)}
                  type="text"
                />

              </div>
              <div className="form-field">

                <label>
                  {t(`option.watermark.size`)}
                </label>
                <select
                  data-element="fontSize"
                  value={formInfo[FORM_FIELD_KEYS.fontSize]}
                  onChange={event => this.handleInputChange(FORM_FIELD_KEYS.fontSize, +event.target.value)}
                >
                  { FONT_SIZES.map(fontSize => <option key={fontSize}>{fontSize}</option>) }
                </select>

              </div>
              <div className="form-field opacity-slider" data-element="opacitySlider">
                <Slider
                  property={'opacity'} // arbitrary property name. this property isn't used in this file
                  displayProperty={'opacity'} // arbitrary property name. this property isn't used in this file
                  value={formInfo[FORM_FIELD_KEYS.opacity]}
                  displayValue={`${(formInfo[FORM_FIELD_KEYS.opacity])}%`}
                  getCirclePosition={this.getCirclePosn}
                  convertRelativeCirclePositionToValue={circlePosn => circlePosn}
                  onStyleChange={(property, value) => this.handleInputChange(FORM_FIELD_KEYS.opacity, Math.round(value * 100))}
                />
              </div>
              <div className="form-field">

                <label>
                  {t(`option.watermark.colors`)}
                </label>
                <div
                  data-element="currentColorCell"
                  className="cell"
                  style={{ backgroundColor: formInfo[FORM_FIELD_KEYS.color].toHexString() }}
                  onClick={() => this.setColorPaletteVisibility(!this.state.isColorPaletteVisible)}
                >
                </div>

                {
                  this.state.isColorPaletteVisible && <div className={'Popup StylePopup'} data-element="stylePopup" onClick={() => this.setColorPaletteVisibility(false)}>
                    <ColorPalette
                      data-element="colorPalette"
                      color={formInfo[FORM_FIELD_KEYS.color]}
                      property={'TextColor'} // arbitrary property name. this property isn't used in this file
                      onStyleChange = {(property, color) => { this.handleInputChange(FORM_FIELD_KEYS.color, color); this.setColorPaletteVisibility(false); }}
                    />
                  </div>
                }

              </div>

            </form>

            <div className="canvas-container" ref={this.canvasContainerRef}>

            </div>
          </div>

          <div className="button-container">
            <a className="reset button" data-element="reset" onClick={this.resetForm}>{t(`option.watermark.resetAllSettings`)}</a>
            <div className="action-button-container">
              <button className="cancel button" data-element="cancel" onClick={this.closeModal}>{t(`action.cancel`)}</button>
              <button className="ok button" data-element="submit" onClick={this.onOkPressed}>{t(`action.ok`)}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(WatermarkModal);