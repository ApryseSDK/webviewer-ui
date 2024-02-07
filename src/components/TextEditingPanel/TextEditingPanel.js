import React, { useEffect } from 'react';
import i18next from 'i18next';

import './TextEditingPanel.scss';
import PropTypes from 'prop-types';
import TextStylePicker from 'components/TextStylePicker';
import ColorPalette from 'components/ColorPalette';
import ColorPalettePicker from 'components/ColorPalettePicker';
import Button from 'components/Button';
import HorizontalDivider from 'components/HorizontalDivider';

const TextEditingPanel = ({
  addActiveColor,
  contentSelectMode,
  disableLinkButton,
  fonts,
  format,
  handleAddLinkToText,
  handleColorChange,
  handlePropertyChange,
  handleTextFormatChange,
  rgbColor,
  textEditProperties = {},
  undoRedoProperties
}) => {
  const currentPalette = 'TextColor';
  const FONT_PLACEHOLDER = 'Font';

  useEffect(() => {
    if (!('Font' in textEditProperties)) {
      // hack to use placeholder in font dropdown needs to have a non-empty, not included value
      textEditProperties['Font'] = FONT_PLACEHOLDER;
    }
  }, []);

  /**
   * @ignore
   * Prevent the blur event from being triggered when clicking on panel buttons
   * otherwise we can't style the text inline since a blur event is triggered before a click event
   * @param {HTMLElement} Component the component to wrap
   * @returns {HTMLElement}
   */
  const textPanelSectionWrapper = (Component) => {
    return (
      <div className="text-editing-panel-section">
        <div
          className="text-editing-panel-menu-items"
          onMouseDown={(e) => {
            if (e.type !== 'touchstart') {
              e.preventDefault();
            }
          }}
        >
          {Component}
        </div>
      </div>
    );
  };

  const textStylesSection = (
    <div className="text-editing-panel-section">
      <div className="top-panel text-editing-panel-menu-items">
        <span className="text-editing-panel-heading" >{i18next.t('stylePanel.headings.textStyles')}</span>
        <div className={`text-editing-panel-text-style-picker ${contentSelectMode ? '' : 'inactive'}`}>
          <TextStylePicker
            fonts={fonts}
            onPropertyChange={handlePropertyChange}
            properties={textEditProperties}
            isContentEditing={true}
            textEditFormat={format}
            textEditHandleFormatChange={handleTextFormatChange}
          />
        </div>
        <div className="link-section">
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
  );

  const colorPaletteSection = textPanelSectionWrapper(
    <div className="color-palette-section">
      <span className="text-editing-panel-heading">{i18next.t('stylePanel.headings.currentColor')}</span>
      <div className="text-editing-row">
        <ColorPalette
          colorMapKey="freeText"
          color={rgbColor}
          property={currentPalette}
          onStyleChange={handleColorChange}
          overridePalette2={[rgbColor?.toHexString()]}
        />
        <Button
          img="ic-copy-color"
          onClick={addActiveColor}
          title={i18next.t('stylePanel.addColorToCustom')}
          dataElement={'addColorToCustom'}
          className={'addToCustomButton'}
        />
      </div>
      <div className="custom-colors-section">
        <span className="text-editing-panel-heading">{i18next.t('stylePanel.headings.customColors')}</span>
        <div className="text-editing-row custom-colors-pallete">
          <ColorPalettePicker
            color={rgbColor}
            property={currentPalette}
            onStyleChange={handleColorChange}
            disableTitle
            enableEdit
            getHexColor={(color) => color?.toHexString()}
          />
        </div>
      </div>
    </div>
  );

  const undoRedoSection = (
    <div className="text-editing-panel-section">
      <div className="text-editing-panel-menu-items">
        <div className='text-editing-panel-menu-items-buttons undo-redo'>
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

  return (
    <>
      <div className="text-editing-panel">
        {textStylesSection}
        <HorizontalDivider style={{ paddingTop: 0, paddingBottom: 0 }} />
        {colorPaletteSection}
        <HorizontalDivider style={{ paddingTop: 0, paddingBottom: 0 }} />
        {undoRedoProperties ? undoRedoSection : undefined }
      </div>
    </>
  );
};

TextEditingPanel.propTypes = {
  addActiveColor: PropTypes.func,
  contentSelectMode: PropTypes.bool,
  disableLinkButton: PropTypes.bool,
  fonts: PropTypes.arrayOf(PropTypes.string),
  format: PropTypes.object,
  handleAddLinkToText: PropTypes.func,
  handleColorChange: PropTypes.func,
  handlePropertyChange: PropTypes.func,
  handleTextFormatChange: PropTypes.func,
  rgbColor: PropTypes.object,
  textEditProperties: PropTypes.object,
  undoRedoProperties: PropTypes.object
};

export default TextEditingPanel;
