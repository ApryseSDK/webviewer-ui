import React, { useEffect } from 'react';
import i18next from 'i18next';

import TextStylePicker from 'components/TextStylePicker';
import ColorPalette from 'components/ColorPalette';
import ColorPalettePicker from 'components/ColorPalettePicker';

// //TODO: implement when opacity is available from worker
// import Slider from 'components/Slider';

import Button from 'components/Button';
import HorizontalDivider from 'components/HorizontalDivider';

import './TextEditingPanel.scss';

function hexToRGB(hex) {
  // Convert the hex color to RGB components
  const red = parseInt(hex.slice(1, 3), 16);
  const green = parseInt(hex.slice(3, 5), 16);
  const blue = parseInt(hex.slice(5, 7), 16);
  return { red, green, blue };
}

function calculateEuclideanDistance(rgb1, rgb2) {
  // Calculate the Euclidean distance between two RGB values
  return Math.sqrt(
    (rgb2.red - rgb1.red) ** 2 +
    (rgb2.green - rgb1.green) ** 2 +
    (rgb2.blue - rgb1.blue) ** 2
  );
}

function areColorsClose(hex1, hex2, threshold) {
  // Convert hex colors to RGB
  const rgb1 = hexToRGB(hex1);
  const rgb2 = hexToRGB(hex2);

  // Calculate the Euclidean distance between RGB values
  const distance = calculateEuclideanDistance(rgb1, rgb2);

  // Compare the distance to the threshold
  return distance <= threshold;
}

const TextEditingPanel = ({
  undoRedoProperties,
  freeTextMode,
  contentSelectMode,
  textEditProperties = {},
  format,
  handlePropertyChange,
  handleTextFormatChange,
  handleColorChange,
  fonts,
  handleAddLinkToText,
  disableLinkButton,
  colorArray = []
}) => {
  const currentPalette = 'TextColor';
  const DEFAULT_COLOR = new window.Core.Annotations.Color('#000000');
  const FONT_PLACEHOLDER = 'Font';
  let colorsToIgnore = [];

  useEffect(() => {
    if (!('Font' in textEditProperties)) {
      // hack to use placeholder in font dropdown needs to have a non-empty, not included value
      textEditProperties['Font'] = FONT_PLACEHOLDER;
    }
  }, []);

  const undoRedoSection = (
    <div className="text-editing-panel-section">
      <div className="text-editing-panel-menu-items">
        <div className='text-editing-panel-menu-items-buttons'>
          <Button
            img="icon-action-undo"
            dataElement="textPanelUndoButton"
            disabled={!undoRedoProperties?.canUndo}
            onClick={undoRedoProperties?.handleUndo}
            title={i18next.t('action.undo')}
          />

          <Button
            img="icon-action-redo"
            dataElement="textPanelRedoButton"
            disabled={!undoRedoProperties?.canRedo}
            onClick={undoRedoProperties?.handleRedo}
            title={i18next.t('action.redo')}
          />
        </div>
      </div>
    </div>
  );

  const newColor = format?.color?.toHexString ? format.color.toHexString().toUpperCase() : DEFAULT_COLOR.toHexString().toUpperCase();
  const shouldUpdateColorsArray = colorArray?.length > 0 && !colorArray.includes(newColor);
  // Currently there is an issue where CMYK documents will return slightly different hex values
  // to prevent them from flooding the Color Swatch panel we check the distance between the new color
  // and the existing colors and if it is less than 50 we use the existing color, once the Worker is
  // updated to return the same hex values for CMYK documents this can be removed
  let closeMatchColor;
  if (shouldUpdateColorsArray) {
    let closeMatch = false;
    for (let i = 0; i < colorArray.length; i++) {
      const color = colorArray[i];
      if (areColorsClose(color, newColor, 50)) {
        closeMatch = true;
        closeMatchColor = new window.Core.Annotations.Color(color);
        break;
      }
    }

    if (!closeMatch) {
      colorArray.push(newColor);
    }
  }
  colorsToIgnore = colorArray.map((color) => color.toLowerCase());
  let rgbColor = format?.color || DEFAULT_COLOR;
  if (closeMatchColor) {
    rgbColor = closeMatchColor;
  }

  return (
    <>
      <div className="text-editing-panel">
        <div className="text-editing-panel-section">
          <span className="text-editing-panel-heading">{i18next.t('textEditingPanel.paragraph')}</span>
          <div className="text-editing-panel-menu-items">
            <div className={`text-editing-panel-text-style-picker ${contentSelectMode ? '' : 'inactive'}`}>
              <TextStylePicker
                fonts={fonts}
                onPropertyChange={handlePropertyChange}
                properties={textEditProperties}
                isContentEditing={true}
              />
            </div>
          </div>
        </div>

        <HorizontalDivider style={{ paddingTop: 0 }} />

        <div className="text-editing-panel-section">
          <span className="text-editing-panel-heading">{i18next.t('textEditingPanel.text')}</span>
          <div
            className="text-editing-panel-menu-items"
            // prevent the blur event from being triggered when clicking on panel buttons
            // otherwise we can't style the text inline since a blur event is triggered before a click event
            onMouseDown={(e) => {
              if (e.type !== 'touchstart') {
                e.preventDefault();
              }
            }}
          >
            <div
              className={`text-editing-panel-menu-items-buttons ${contentSelectMode || freeTextMode ? '' : 'inactive'}`}
            >
              <Button
                isActive={format?.bold}
                dataElement="richTextBoldButton"
                onClick={handleTextFormatChange('bold')}
                img="icon-text-bold"
                title="option.richText.bold"
              />
              <Button
                isActive={format?.italic}
                dataElement="richTextItalicButton"
                onClick={handleTextFormatChange('italic')}
                img="icon-text-italic"
                title="option.richText.italic"
              />
              <Button
                isActive={format?.underline}
                dataElement="richTextUnderlineButton"
                onClick={handleTextFormatChange('underline')}
                img="ic_annotation_underline_black_24px"
                title="option.richText.underline"
              />
            </div>
            <div className={'text-editing-panel-color-palette'}>
              <ColorPalette
                colorMapKey="freeText"
                color={rgbColor}
                property={currentPalette}
                onStyleChange={handleColorChange}
                overridePalette2={colorArray}
              />
              <ColorPalettePicker
                color={rgbColor}
                property={currentPalette}
                onStyleChange={handleColorChange}
                disableTitle
                enableEdit
                colorsToIgnore={colorsToIgnore}
              />
            </div>
            {/* TODO: implement when opacity is available from worker */}
            {/* <Slider {...sliderProperties} onStyleChange={handleStyleChange} onSliderChange={handleSliderChange}/> */}
            <Button
              dataElement="textPanelAddLinkButton"
              onClick={handleAddLinkToText}
              img="icon-tool-link"
              title="link.urlLink"
              disabled={disableLinkButton}
            />
          </div>
        </div>

        <HorizontalDivider style={{ paddingTop: 0 }} />
        {undoRedoProperties ? undoRedoSection : undefined }
      </div>
    </>
  );
};

export default TextEditingPanel;