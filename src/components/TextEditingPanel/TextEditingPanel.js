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
  if (shouldUpdateColorsArray) {
    colorArray.push(newColor);
  }
  colorsToIgnore = colorArray.map((color) => color.toLowerCase());
  const rgbColor = format?.color || DEFAULT_COLOR;

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
