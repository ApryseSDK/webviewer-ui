import ColorPalette from 'components/ColorPalette';
import Slider from 'components/Slider';
import core from 'core';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';
import Button from 'components/Button';
import FontSizeDropdown from 'components/FontSizeDropdown';
import { FONTS } from './web-fonts';
import './WatermarkModal.scss';
import ModalWrapper from '../../ModalWrapper';

import DataElementWrapper from 'src/components/DataElementWrapper';
import Dropdown from 'src/components/Dropdown';

import { isMobile } from 'helpers/device';

const DESIRED_WIDTH = 300;
const DESIRED_HEIGHT = 300;

const DEFAULT_FONT_SIZE = 48;

const DROPDOWN_WIDTH = 314;
const DROPDOWN_MOBILE_WIDTH = 160;
const DROPDOWN_WIDTH_LONG = 328;

const WATERMARK_LOCATIONS = {
  CENTER: 'center',
  TOP_LEFT: 'topLeft',
  TOP_RIGHT: 'topRight',
  TOP_CENTER: 'topCenter',
  BOT_LEFT: 'bottomLeft',
  BOT_RIGHT: 'bottomRight',
  BOT_CENTER: 'bottomCenter',
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
  [FORM_FIELD_KEYS.fontSize]: DEFAULT_FONT_SIZE,
  [FORM_FIELD_KEYS.text]: '',
  // red
  [FORM_FIELD_KEYS.color]: new window.Core.Annotations.Color(228, 66, 52),
  [FORM_FIELD_KEYS.opacity]: 100,
  [FORM_FIELD_KEYS.font]: FONTS[0],
  [FORM_FIELD_KEYS.isBolded]: false,
  [FORM_FIELD_KEYS.isItalic]: false,
  [FORM_FIELD_KEYS.isUnderlined]: false,
};

// Values come from https://docs.apryse.com/api/web/Core.DocumentViewer.html#setWatermark__anchor
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
    watermarkLocations: PropTypes.object,
    modalClosed: PropTypes.func,
    formSubmitted: PropTypes.func,
    t: PropTypes.func.isRequired,
    isCustomizableUI: PropTypes.bool,
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
    core.addEventListener('documentLoaded', this.closeModal);

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
        async () => {
          // Store the pre-existing watermark (if any) before we overwrite it
          this.preExistingWatermark = await core.getWatermark();
          this.addWatermarks();
        },
      );
    } else {
      this.removeWatermarkCreatedByModal();
      core.setWatermark(this.preExistingWatermark);
    }
  };

  addWatermarks = () => {
    const watermarkOptions = this.createWatermarks();
    const { t } = this.props;
    core.setWatermark(watermarkOptions);

    const pageHeight = core.getPageHeight(this.props.pageIndexToView + 1);
    const pageWidth = core.getPageWidth(this.props.pageIndexToView + 1);

    const desiredZoomForWidth = DESIRED_WIDTH / pageWidth;
    const desiredZoomForHeight = DESIRED_HEIGHT / pageHeight;

    const desiredZoom = Math.min(desiredZoomForHeight, desiredZoomForWidth);
    const pageNumber = this.props.pageIndexToView + 1;

    core.getDocument().loadCanvas({
      pageNumber: pageNumber,
      zoom: desiredZoom,
      drawComplete: (canvas) => {
        const nodes = this.canvasContainerRef.current.childNodes;
        if (nodes && nodes.length > 0) {
          this.canvasContainerRef.current.removeChild(nodes[0]);
        }
        canvas.style.border = this.canvasContainerRef.current.style.border;
        canvas.style.height = this.canvasContainerRef.current.style.height;
        canvas.style.backgroundColor = this.canvasContainerRef.current.style.backgroundColor;
        canvas.setAttribute('role', 'img');
        canvas.setAttribute('aria-label', `${t('action.page')} ${pageNumber}`);
        this.canvasContainerRef.current.appendChild(canvas);
      },
    });

    // Note: do not update and refresh the doc else it may affect other docs as well
  };

  // eslint-disable-next-line class-methods-use-this
  constructWatermarkOption = (value) => {
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

    Object.keys(WATERMARK_LOCATIONS).forEach((key) => {
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

  resetForm = (event) => {
    event.preventDefault();
    const locationSettings = this.resetLocationSettings();
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

  setColorPaletteVisibility = (visible) => {
    this.setState({ isColorPaletteVisible: visible });
  };

  onLocationChanged = (key) => {
    const currLocationSettings = {
      ...this.state.locationSettings,
    };
    Object.keys(currLocationSettings).forEach((locationKey) => {
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
  resetLocationSettings = () => {
    const locationSettings = {};
    Object.keys(WATERMARK_LOCATIONS).forEach((key) => {
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
  initializeLocationSettings = () => {
    const locationSettings = this.resetLocationSettings();

    if (this.props.watermarkLocations) {
      Object.keys(WATERMARK_LOCATIONS).forEach((key) => {
        const watermarkStrVal = WATERMARK_LOCATIONS[key];
        const tempWatermarkProps = this.props.watermarkLocations[WATERMARK_API_LOCATIONS[watermarkStrVal]] ?? false;
        if (!tempWatermarkProps) {
          return;
        }

        const temp = this.constructWatermarkOption(
          tempWatermarkProps
        );

        locationSettings[key].text = temp.text;

        const colorStr = tempWatermarkProps.color;
        const colorArray = colorStr.slice(5).replace(')', '').split(',');
        const color = new window.Core.Annotations.Color(
          colorArray[0],
          colorArray[1],
          colorArray[2],
          colorArray[3]
        );

        locationSettings[key].color = color;
        locationSettings[key].opacity = temp.opacity;
        locationSettings[key].fontSize = temp.fontSize;

        if (tempWatermarkProps.fontStyles) {
          locationSettings[key].isBolded = tempWatermarkProps['fontStyles'].includes('BOLD');
          locationSettings[key].isItalic = tempWatermarkProps['fontStyles'].includes('ITALIC');
          locationSettings[key].isUnderlined = tempWatermarkProps['fontStyles'].includes('UNDERLINE');
        }

        const fontFamily = tempWatermarkProps.fontFamily ?? false;

        if (!fontFamily || fontFamily.trim().length === 0) {
          locationSettings[key] = DEFAULT_VALS.font;
        }
      });
    }

    return locationSettings;
  };

  // eslint-disable-next-line class-methods-use-this
  getKeyByValue = (object, value) => Object.keys(object).find((key) => object[key] === value);

  getCurrentSelectedLocation = () => Object.keys(this.state.locationSettings).find((locationKey) => {
    const locationSetting = this.state.locationSettings[locationKey];
    return locationSetting.isSelected;
  });

  onColorChanged = (newColor) => {
    const currLocation = this.getCurrentSelectedLocation();
    const currLocationSetting = this.state.locationSettings[currLocation];
    currLocationSetting[FORM_FIELD_KEYS.color] = new window.Core.Annotations.Color(
      newColor.R,
      newColor.G,
      newColor.B,
    );
    const locationSettings = {
      ...this.state.locationSettings,
    };
    if (!currLocationSetting[FORM_FIELD_KEYS.text]) {
      // if text is undefined, persist the changed color to other location settings (customer's request)
      Object.keys(WATERMARK_LOCATIONS).forEach((location) => {
        const locationSetting = locationSettings[location];
        if (!locationSetting[FORM_FIELD_KEYS.text]) {
          locationSetting[FORM_FIELD_KEYS.color] = new window.Core.Annotations.Color(
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

  render() {
    const { isVisible } = this.props;
    if (!isVisible) {
      return null;
    }

    const { t, isCustomizableUI } = this.props;

    const currLocation = this.getCurrentSelectedLocation();
    const formInfo = this.state.locationSettings[currLocation];
    const hexColor = formInfo[FORM_FIELD_KEYS.color].toHexString();
    const dropdownHalfWidth = isMobile() ? DROPDOWN_MOBILE_WIDTH : DROPDOWN_WIDTH;
    const dropdownFullWidth = isMobile() ? DROPDOWN_WIDTH_LONG : DROPDOWN_WIDTH;
    return (
      <DataElementWrapper
        className={'Modal Watermark'}
        id="watermarkModal"
        data-element="watermarkModal"
      >
        <ModalWrapper
          isOpen={this.state.lockFocus} title={'option.watermark.addWatermark'}
          closeButtonDataElement={'watermarkModalCloseButton'}
          onCloseClick={this.closeModal}
          swipeToClose
          closeHandler={this.closeModal}
        >
          <div className="swipe-indicator" />

          <div className="form-content-container">
            <div
              className="canvas-container"
              ref={this.canvasContainerRef}
            ></div>

            <div className="watermark-settings">
              <form id="form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-field">
                  <label className="section-label print-quality-section-label" htmlFor="location" id="watermark-location-dropdown-label">{t('option.watermark.location')}</label>
                  <Dropdown
                    id="location"
                    labelledById='watermark-location-dropdown-label'
                    dataElement="watermarkLocation"
                    items={Object.keys(WATERMARK_LOCATIONS)}
                    getTranslationLabel={(key) => t(`option.watermark.locations.${WATERMARK_LOCATIONS[key]}`)}
                    currentSelectionKey={currLocation}
                    onClickItem={this.onLocationChanged}
                    width={dropdownFullWidth}
                  />
                  <div className="separator divider"></div>
                </div>

                <div className="form-field">
                  <label htmlFor="textInput">{t('option.watermark.text')}</label>
                  <input
                    className="text-input"
                    id="textInput"
                    value={formInfo[FORM_FIELD_KEYS.text]}
                    onChange={(event) => this.handleInputChange(
                      FORM_FIELD_KEYS.text,
                      event.target.value,
                    )
                    }
                    type="text"
                  />
                </div>
                <div className="font-form-fields">
                  <div className="form-font-type">
                    <label htmlFor="fonts" id="watermark-font-dropdown-label">{t('option.watermark.font')}</label>
                    <Dropdown
                      id="fonts"
                      labelledById='watermark-font-dropdown-label'
                      dataElement="watermarkFont"
                      items={FONTS}
                      currentSelectionKey={formInfo[FORM_FIELD_KEYS.font]}
                      onClickItem={(key) => this.handleInputChange(
                        FORM_FIELD_KEYS.font,
                        key
                      )}
                      width={dropdownHalfWidth}
                    />
                  </div>
                  <div className="form-font-size">
                    <label htmlFor="fontSize">{t('option.watermark.size')}</label>
                    <FontSizeDropdown
                      fontSize={formInfo[FORM_FIELD_KEYS.fontSize]}
                      key="fontSize"
                      fontUnit="pt"
                      onFontSizeChange={(val) => this.handleInputChange(FORM_FIELD_KEYS.fontSize, Number.parseInt(val))}
                      maxFontSize={1600}
                      initialFontValue={1}
                      initialMaxFontValue={512}
                      width={dropdownHalfWidth}
                    />
                  </div>
                </div>
                <div className="form-field opacity-slider" id="opacitySlider">
                  <Slider
                    dataElement={'watermarkOpacitySlider'}
                    property={'Opacity'}
                    displayProperty={'opacity'}
                    min={0}
                    max={100}
                    step={1}
                    value={formInfo[FORM_FIELD_KEYS.opacity]}
                    getDisplayValue={(opacity) => `${Math.round(opacity)}%`}
                    withInputField={isCustomizableUI}
                    inputFieldType={'number'}
                    onSliderChange={(_, value) => this.handleInputChange(
                      FORM_FIELD_KEYS.opacity,
                      Math.round(value * 100),
                    )}
                    getLocalValue={(opacity) => parseInt(opacity) / 100}
                  />
                </div>
                <div className="form-field">
                  <label>{t('option.watermark.style')}</label>
                  <div className="style-container">
                    <Button
                      id="currentColorCell"
                      // eslint-disable-next-line custom/no-hex-colors
                      className={`colorSelect ${hexColor === '#FFFFFF' ? 'white-color' : ''}`}
                      ariaLabel="colorSelectButton"
                      style={{
                        backgroundColor: hexColor,
                      }}
                      onClick={() => this.setColorPaletteVisibility(
                        !this.state.isColorPaletteVisible,
                      )
                      }
                    />
                    <div className="style-container">
                      <Button
                        dataElement="boldText"
                        img="icon-text-bold"
                        isActive={formInfo[FORM_FIELD_KEYS.isBolded]}
                        onClick={() => this.handleInputChange(
                          FORM_FIELD_KEYS.isBolded,
                          !formInfo[FORM_FIELD_KEYS.isBolded],
                        )}
                        ariaLabel={t('option.richText.bold')}
                      />
                      <Button
                        dataElement="italicizeText"
                        img="icon-text-italic"
                        isActive={formInfo[FORM_FIELD_KEYS.isItalic]}
                        onClick={() => this.handleInputChange(
                          FORM_FIELD_KEYS.isItalic,
                          !formInfo[FORM_FIELD_KEYS.isItalic],
                        )}
                        ariaLabel={t('option.richText.italic')}
                      />
                      <Button
                        dataElement="underlineText"
                        img="icon-text-underline"
                        isActive={formInfo[FORM_FIELD_KEYS.isUnderlined]}
                        onClick={() => this.handleInputChange(
                          FORM_FIELD_KEYS.isUnderlined,
                          !formInfo[FORM_FIELD_KEYS.isUnderlined],
                        )}
                        ariaLabel={t('option.richText.underline')}
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

                </div>
              </form>
            </div>
          </div>

          <div className="divider"></div>
          <div className="button-container">
            <button
              className="reset-settings"
              id="reset"
              onClick={this.resetForm}
            >
              {t('option.watermark.resetAllSettings')}
            </button>
            <Button
              className="add-watermark button"
              id="submit"
              onClick={this.onOkPressed}
            >
              {t('action.add')}
            </Button>
          </div>
        </ModalWrapper>
      </DataElementWrapper>
    );
  }
}

export default withTranslation()(WatermarkModal);
