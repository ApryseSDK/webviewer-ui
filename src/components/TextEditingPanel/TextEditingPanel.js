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
  freeTextMode,
  contentSelectMode,
  textEditProperties = {},
  format,
  handlePropertyChange,
  handleRichTextStyleChange,
  handleTextFormatChange,
  handleColorChange,
  fonts,
  handleAddLinkToText,
  disableLinkButton,
}) => {
  const currentPalette = 'TextColor';

  const DEFAULT_COLOR = new window.Annotations.Color('#000000');

  const FONT_PLACEHOLDER = 'Font';

  useEffect(() => {
    if (!('Font' in textEditProperties)) {
      // hack to use placeholder in font dropdown needs to have a non-empty, not included value
      textEditProperties['Font'] = FONT_PLACEHOLDER;
    }
  }, []);

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
                onRichTextStyleChange={handleRichTextStyleChange}
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
                color={format.color ? format.color : DEFAULT_COLOR}
                property={currentPalette}
                onStyleChange={handleColorChange}
                overridePalette2={['#000000', '#FFFFFF']}
              />
              <ColorPalettePicker
                color={format?.color ? format.color : DEFAULT_COLOR}
                property={currentPalette}
                onStyleChange={handleColorChange}
                disableTitle
                enableEdit
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
      </div>
    </>
  );
};

export default TextEditingPanel;
