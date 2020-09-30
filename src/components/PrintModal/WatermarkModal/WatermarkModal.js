import ColorPalette from 'components/ColorPalette';
import Slider from 'components/Slider';
import { circleRadius } from 'constants/slider';
import core from 'core';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';
import Button from 'components/Button';
import ActionButton from 'components/ActionButton';
import { FONTS } from './web-fonts';
import './WatermarkModal.scss';

import { FocusTrap } from '@pdftron/webviewer-react-toolkit';
import { Swipeable } from 'react-swipeable';

const DESIRED_WIDTH = 300;
const DESIRED_HEIGHT = 300;

// numbers were taken from font dropdown menu in google docs
const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48];

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
  font: 'font',
  isBolded: 'isBolded',
  isItalic: 'isItalic',
  isUnderlined: 'isUnderlined',
};

const DEFAULT_VALS = {
  [FORM_FIELD_KEYS.location]: WATERMARK_LOCATIONS.CENTER,
  [FORM_FIELD_KEYS.fontSize]: FONT_SIZES[FONT_SIZES.length - 1],
  [FORM_FIELD_KEYS.text]: '',
  // red
  [FORM_FIELD_KEYS.color]: new window.Annotations.Color(228, 66, 52),
  [FORM_FIELD_KEYS.opacity]: 100,
  [FORM_FIELD_KEYS.font]: FONTS[0],
  [FORM_FIELD_KEYS.isBolded]: false,
  [FORM_FIELD_KEYS.isItalic]: false,
  [FORM_FIELD_KEYS.isUnderlined]: false,
};

// Values come from https://www.pdftron.com/api/web/CoreControls.DocumentViewer.html#setWatermark__anchor
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
  static propTypes = {
    isVisible: PropTypes.bool,
    pageIndexToView: PropTypes.number,
    modalClosed: PropTypes.func,
    formSubmitted: PropTypes.func,
    t: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const locationSettings = this.initializeLocationSettings();
    this.preExistingWatermark = undefined;
    this.state = {
      isColorPaletteVisible: false,
      locationSettings,
      previousLocationSettings: locationSettings,
      lockFocus: false,
    };
    this.canvasContainerRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    if (this.props.isVisible !== prevProps.isVisible) {
      // Sets focus with a slight delay after modal becomes visible in order to
      // prevent stack overflow with competing print modal focus lock.
      if (this.props.isVisible) {
        this.setState({ lockFocus: true });
      } else {
        this.setState({ lockFocus: false });
      }

      this.setState(
        {
          isColorPaletteVisible: false,
        },
        () => this.handleWatermarkOnVisibilityChanged(),
      );
    }
  }

  handleWatermarkOnVisibilityChanged = () => {
    if (this.props.isVisible) {
      this.setState(
        {
          locationSettings: this.state.previousLocationSettings,
        },
        async() => {
          // Store the pre-existing watermark (if any) before we overwrite it
          this.preExistingWatermark = await core.getWatermark();
          this.addWatermarks();
        },
      );
    } else {
      this.removeWatermarkCreatedByModal();
      core.setWatermark(this.preExistingWatermarks);
    }
  };

  addWatermarks = () => {
    const watermarkOptions = this.createWatermarks();

    core.setWatermark(watermarkOptions);

    const pageHeight = core.getPageHeight(this.props.pageIndexToView + 1);
    const pageWidth = core.getPageWidth(this.props.pageIndexToView + 1);

    const desiredZoomForWidth = DESIRED_WIDTH / pageWidth;
    const desiredZoomForHeight = DESIRED_HEIGHT / pageHeight;

    const desiredZoom = Math.min(desiredZoomForHeight, desiredZoomForWidth);

    core.getDocument().loadCanvasAsync({
      pageNumber: this.props.pageIndexToView + 1,
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
  };

  // eslint-disable-next-line class-methods-use-this
  constructWatermarkOption = value => {
    const fontStyles = [];
    if (value.isBolded) {
      fontStyles.push(core.getFontStyles().BOLD);
    }
    if (value.isItalic) {
      fontStyles.push(core.getFontStyles().ITALIC);
    }
    if (value.isUnderlined) {
      fontStyles.push(core.getFontStyles().UNDERLINE);
    }
    const watermarkOption = {
      fontSize: value.fontSize,
      fontFamily: value.font,
      color: value.color.toString(),
      opacity: value.opacity,
      text: value.text,
      fontStyles,
    };

    return watermarkOption;
  };

  createWatermarks = () => {
    const watermarks = {};

    Object.keys(WATERMARK_LOCATIONS).forEach(key => {
      const temp = this.constructWatermarkOption(
        this.state.locationSettings[key],
      );
      const value = WATERMARK_LOCATIONS[key];
      watermarks[WATERMARK_API_LOCATIONS[value]] = temp;
    });
    return watermarks;
  };

  // eslint-disable-next-line class-methods-use-this
  removeWatermarkCreatedByModal = () => {
    core.setWatermark({});
  };

  closeModal = () => {
    this.props.modalClosed();
  };

  handleInputChange = (key, value) => {
    const currLocationSettings = {
      ...this.state.locationSettings,
    };
    const currSelectedLocation = this.getCurrentSelectedLocation();
    currLocationSettings[currSelectedLocation] = {
      ...currLocationSettings[currSelectedLocation],
      [key]: value,
    };

    this.setState(
      {
        locationSettings: currLocationSettings,
      },
      () => {
        this.addWatermarks();
      },
    );
  };

  resetForm = event => {
    event.preventDefault();
    const locationSettings = this.initializeLocationSettings();
    this.setState(
      {
        locationSettings,
      },
      () => this.addWatermarks(),
    );
  };

  onOkPressed = () => {
    this.setState(
      {
        previousLocationSettings: this.state.locationSettings,
      },
      () => {
        // the order of these fxn calls matter
        this.props.modalClosed();
        const watermarkOptions = this.createWatermarks();
        this.props.formSubmitted(watermarkOptions);
      },
    );
  };

  getCirclePosn = lineLength => {
    const lineStart = circleRadius;
    const currSelectedLocation = this.getCurrentSelectedLocation();
    return (
      (this.state.locationSettings[currSelectedLocation][
        FORM_FIELD_KEYS.opacity
      ] /
        100) *
        lineLength +
      lineStart
    );
  };

  setColorPaletteVisibility = visible => {
    this.setState({ isColorPaletteVisible: visible });
  };

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

    this.setState(
      {
        locationSettings: currLocationSettings,
      },
      () => {
        this.addWatermarks();
      },
    );
  };

  // eslint-disable-next-line class-methods-use-this
  initializeLocationSettings = () => {
    const locationSettings = {};
    Object.keys(WATERMARK_LOCATIONS).forEach(key => {
      // ignore location as it is redundant as we already have location key
      const { ...others } = DEFAULT_VALS;
      const temp = {
        ...others,
        isSelected: WATERMARK_LOCATIONS[key] === DEFAULT_VALS.location,
      };
      locationSettings[key] = temp;
    });
    return locationSettings;
  };

  // eslint-disable-next-line class-methods-use-this
  getKeyByValue = (object, value) =>
    Object.keys(object).find(key => object[key] === value);

  getCurrentSelectedLocation = () =>
    Object.keys(this.state.locationSettings).find(locationKey => {
      const locationSetting = this.state.locationSettings[locationKey];
      return locationSetting.isSelected;
    });

  onColorChanged = newColor => {
    const currLocation = this.getCurrentSelectedLocation();
    const currLocationSetting = this.state.locationSettings[currLocation];
    currLocationSetting[FORM_FIELD_KEYS.color] = new window.Annotations.Color(
      newColor.R,
      newColor.G,
      newColor.B,
    );
    const locationSettings = {
      ...this.state.locationSettings,
    };
    if (!currLocationSetting[FORM_FIELD_KEYS.text]) {
      // if text is undefined, persist the changed color to other location settings (customer's request)
      Object.keys(WATERMARK_LOCATIONS).forEach(location => {
        const locationSetting = locationSettings[location];
        if (!locationSetting[FORM_FIELD_KEYS.text]) {
          locationSetting[FORM_FIELD_KEYS.color] = new window.Annotations.Color(
            newColor.R,
            newColor.G,
            newColor.B,
          );
        }
      });
    }
    this.setState(
      {
        locationSettings,
      },
      () => {
        this.addWatermarks();
      },
    );
  };

  onBackgroundClick = event => {
    if (event.target !== event.currentTarget) {
      return;
    }
    this.closeModal();
  }

  render() {
    const { isVisible } = this.props;
    if (!isVisible) {
      return null;
    }

    const { t } = this.props;

    const currLocation = this.getCurrentSelectedLocation();
    const formInfo = this.state.locationSettings[currLocation];
    return (
      <Swipeable
        onSwipedUp={this.closeModal}
        onSwipedDown={this.closeModal}
        preventDefaultTouchmoveEvent
      >
        <FocusTrap locked={this.state.lockFocus}>
          <div
            className={'Modal Watermark'}
            id="watermarkModal"
            onMouseDown={this.onBackgroundClick}
          >
            <div className="form-container" id="formContainer">
              <div className="swipe-indicator" />
              <div className="form-content-container">
                <div className="watermark-settings">
                  <form id="form" onSubmit={e => e.preventDefault()}>
                    <div className="form-field">
                      <label for="location">{t(`option.watermark.location`)}</label>
                      <select
                        id="location"
                        value={WATERMARK_LOCATIONS[currLocation]}
                        onChange={event => {
                          this.onLocationChanged(event.target.value);
                        }}
                      >
                        {Object.keys(WATERMARK_LOCATIONS).map(key => (
                          <option key={key}>{WATERMARK_LOCATIONS[key]}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-field separator"></div>
                    <div className="form-field">
                      <label for="textInput">{t(`option.watermark.text`)}</label>
                      <input
                        className="text-input"
                        id="textInput"
                        value={formInfo[FORM_FIELD_KEYS.text]}
                        onChange={event =>
                          this.handleInputChange(
                            FORM_FIELD_KEYS.text,
                            event.target.value,
                          )
                        }
                        type="text"
                      />
                    </div>
                    <div className="form-field">
                      <label for="fonts">{t(`option.watermark.font`)}</label>
                      <select
                        id="fonts"
                        value={formInfo[FORM_FIELD_KEYS.font]}
                        onChange={event =>
                          this.handleInputChange(
                            FORM_FIELD_KEYS.font,
                            event.target.value,
                          )
                        }
                      >
                        {FONTS.map(font => (
                          <option key={font}>{font}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-field">
                      <label for="fontSize">{t(`option.watermark.size`)}</label>
                      <select
                        id="fontSize"
                        value={formInfo[FORM_FIELD_KEYS.fontSize]}
                        onChange={event =>
                          this.handleInputChange(
                            FORM_FIELD_KEYS.fontSize,
                            +event.target.value,
                          )
                        }
                      >
                        {FONT_SIZES.map(fontSize => (
                          <option key={fontSize}>{fontSize}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-field opacity-slider" id="opacitySlider">
                      <Slider
                        property={'opacity'} // arbitrary property name. this property isn't used in this file
                        displayProperty={'opacity'} // arbitrary property name. this property isn't used in this file
                        value={formInfo[FORM_FIELD_KEYS.opacity]}
                        displayValue={`${formInfo[FORM_FIELD_KEYS.opacity]}%`}
                        getCirclePosition={this.getCirclePosn}
                        convertRelativeCirclePositionToValue={circlePosn =>
                          circlePosn
                        }
                        onStyleChange={(property, value) =>
                          this.handleInputChange(
                            FORM_FIELD_KEYS.opacity,
                            Math.round(value * 100),
                          )
                        }
                      />
                    </div>
                    <div className="form-field">
                      <label>{t(`option.watermark.style`)}</label>
                      <div className="style-container">
                        <div
                          id="currentColorCell"
                          className="colorSelect"
                          style={{
                            backgroundColor: formInfo[
                              FORM_FIELD_KEYS.color
                            ].toHexString(),
                          }}
                          onClick={() =>
                            this.setColorPaletteVisibility(
                              !this.state.isColorPaletteVisible,
                            )
                          }
                        ></div>
                        <div className="style-container">
                          <Button
                            dataElement="boldText"
                            img="icon-text-bold"
                            isActive={formInfo[FORM_FIELD_KEYS.isBolded]}
                            onClick={() =>
                              this.handleInputChange(
                                FORM_FIELD_KEYS.isBolded,
                                !formInfo[FORM_FIELD_KEYS.isBolded],
                              )
                            }
                          />
                          <Button
                            dataElement="italicizeText"
                            img="icon-text-italic"
                            isActive={formInfo[FORM_FIELD_KEYS.isItalic]}
                            onClick={() =>
                              this.handleInputChange(
                                FORM_FIELD_KEYS.isItalic,
                                !formInfo[FORM_FIELD_KEYS.isItalic],
                              )
                            }
                          />
                          <Button
                            dataElement="underlineText"
                            img="icon-text-underline"
                            isActive={formInfo[FORM_FIELD_KEYS.isUnderlined]}
                            onClick={() =>
                              this.handleInputChange(
                                FORM_FIELD_KEYS.isUnderlined,
                                !formInfo[FORM_FIELD_KEYS.isUnderlined],
                              )
                            }
                          />
                        </div>
                      </div>

                      {this.state.isColorPaletteVisible && (
                        <div
                          className={'Popup StylePopup'}
                          id="stylePopup"
                          onClick={() => this.setColorPaletteVisibility(false)}
                        >
                          <ColorPalette
                            color={formInfo[FORM_FIELD_KEYS.color]}
                            property={'TextColor'} // arbitrary property name. this property isn't used in this file
                            onStyleChange={(property, color) => {
                              this.onColorChanged(color);
                              this.setColorPaletteVisibility(false);
                            }}
                          />
                        </div>
                      )}
                      <div className="form-field separator"></div>
                      <button
                        className="resetSettings"
                        id="reset"
                        onClick={this.resetForm}
                      >
                        {t(`option.watermark.resetAllSettings`)}
                      </button>
                    </div>
                  </form>
                </div>

                <div
                  className="canvas-container"
                  ref={this.canvasContainerRef}
                ></div>
              </div>

              <div className="button-container">
                <button
                  className="cancel button"
                  id="cancel"
                  onClick={this.closeModal}
                >
                  {t(`action.cancel`)}
                </button>
                <button
                  className="ok button"
                  id="submit"
                  onClick={this.onOkPressed}
                >
                  {t(`action.ok`)}
                </button>
              </div>
            </div>
          </div>
        </FocusTrap>
      </Swipeable>
    );
  }
}

export default withTranslation()(WatermarkModal);
