import React, { useState, useEffect } from 'react';
import './TextStylePicker.scss';
import Dropdown from 'components/Dropdown';
import FontSizeDropdown from 'components/FontSizeDropdown';
import Button from 'components/Button';
import Choice from 'components/Choice';
import PropTypes from 'prop-types';
import i18next from 'i18next';

const TextStylePicker = ({
  onPropertyChange,
  properties,
  onRichTextStyleChange,
  isRedaction,
  isContentEditing,
  fonts,
  stateless = false,
  textEditFormat = {},
  textEditHandleFormatChange = () => { },
  isFreeText = false,
  onFreeTextSizeToggle,
  isFreeTextAutoSize,
  isRichTextEditMode,
}) => {
  // List is not complete
  const supportedFonts = fonts?.length ? fonts : ['Helvetica', 'Times New Roman'];
  const freeTextAutoSizeDataElement = 'freeTextAutoSizeFontButton';
  const font = isRichTextEditMode ? properties?.quillFont : properties?.Font;
  const changeFont = (font) => {
    if (isContentEditing || isRedaction) {
      onPropertyChange('Font', font);
      return;
    }
    selectQuillFont(font);
    if (!isRichTextEditMode) {
      onPropertyChange('Font', font);
    }
  };

  useEffect(() => {
    setItalic(properties?.italic || false);
    setBold(properties?.bold || false);
    setUnderline(properties?.underline || false);
    setStrikeout(properties?.strikeout || false);
    setQuillFont(properties?.quillFont || font);
    setQuillFontSize(properties?.quillFontSize || fontSize);
  }, [properties]);

  /**
   * @ignore
   * We determine the font size by first checking its an AutoSize Font and using the Calculated Font Size if it is. Otherwise
   * we use the FontSize property. In the case where no properties exist we default to 12pt.
   * @param {object} properties
   * @returns {string}
   */
  const getFontSize = (properties) => {
    const defaultFontSize = isFreeTextAutoSize || properties?.FontSize === '0pt' ? properties?.calculatedFontSize : properties?.FontSize;
    if (isRichTextEditMode) {
      return properties.quillFontSize;
    }
    return defaultFontSize || undefined;
  };

  const fontSize = getFontSize(properties);

  const changeFontSize = (fontSize) => {
    if (isContentEditing || isRedaction) {
      onPropertyChange('FontSize', fontSize);
      return;
    }
    selectQuillFontSize(fontSize);
    if (!isRichTextEditMode) {
      onPropertyChange('FontSize', fontSize);
    }
  };

  const defaultBold = properties?.bold || false;
  const [bold, setBold] = useState(defaultBold);
  const toggleBold = () => {
    onRichTextStyleChange('font-weight', !bold ? 'bold' : '');
    setBold(!bold);
  };
  const selectQuillFont = (val) => {
    onRichTextStyleChange('font-family', val);
    setQuillFont(val);
  };
  const selectQuillFontSize = (val) => {
    onRichTextStyleChange('font-size', val);
    setQuillFontSize(val);
  };

  const defaultItalic = properties?.italic || false;
  const defaultQuillFont = properties?.quillFont || font;
  const [quillFont, setQuillFont] = useState(defaultQuillFont);
  const [quillFontSize, setQuillFontSize] = useState(fontSize);
  const [italic, setItalic] = useState(defaultItalic);
  const toggleItalic = () => {
    onRichTextStyleChange('font-style', !italic ? 'italic' : '');
    setItalic(!italic);
  };

  const defaultUnderline = properties?.underline || false;
  const defaultStrikeout = properties?.strikeout || false;
  const [underline, setUnderline] = useState(defaultUnderline);
  const [strikeout, setStrikeout] = useState(defaultStrikeout);
  const toggleUnderline = () => {
    const newUnderline = !underline;
    if (newUnderline) {
      onRichTextStyleChange('underline', true);
    } else {
      onRichTextStyleChange('underline', false);
    }
    setUnderline(newUnderline);
  };
  const toggleStrikeout = () => {
    const newStrikeout = !strikeout;
    if (newStrikeout) {
      onRichTextStyleChange('line-through', true);
    } else {
      onRichTextStyleChange('line-through', false);
    }
    setStrikeout(newStrikeout);
  };

  const textAlign = properties?.TextAlign || 'left';
  const changeXAlign = (xAlign) => {
    onPropertyChange('TextAlign', xAlign);
  };

  const textVerticalAlign = properties?.TextVerticalAlign || 'top';
  const changeYAlign = (yAlign) => {
    onPropertyChange('TextVerticalAlign', yAlign);
  };

  const fontSizeProps = fontSize?.match(/([0-9.]+)|([a-z]+)/gi);

  const [error, setError] = useState('');
  const fontSizePropsToUpdate = (fontSizeProps && parseFloat(fontSizeProps[0])) || undefined;

  const defaultConfig = {
    quillFont: {
      dataElement: 'freeTextQuillFontSelection',
      onClick: selectQuillFont,
      isActive: stateless ? defaultQuillFont : quillFont,
    },
    quillFontSize: {
      dataElement: 'freeTextQuillFontSizeSelection',
      onClick: selectQuillFontSize,
      isActive: stateless ? fontSize : quillFontSize,
    },
    bold: {
      dataElement: 'freeTextBoldButton',
      onClick: toggleBold,
      isActive: stateless ? defaultBold : bold,
    },
    italic: {
      dataElement: 'freeTextItalicButton',
      onClick: toggleItalic,
      isActive: stateless ? defaultItalic : italic,
    },
    underline: {
      dataElement: 'freeTextUnderlineButton',
      onClick: toggleUnderline,
      isActive: stateless ? defaultUnderline : underline,
    },
    strikeout: {
      dataElement: 'freeTextStrikeoutButton',
      onClick: toggleStrikeout,
      isActive: stateless ? defaultStrikeout : strikeout,
    },
    leftAlign: {
      dataElement: 'freeTextAlignLeftButton',
      isActive: textAlign === 'left',
      alignValue: 'left'
    },
    centerAlign: {
      dataElement: 'freeTextAlignCenterButton',
      isActive: textAlign === 'center',
      alignValue: 'center'
    },
    rightAlign: {
      dataElement: 'freeTextAlignRightButton',
      isActive: textAlign === 'right',
      alignValue: 'right'
    },
  };

  const contentEditConfig = {
    bold: {
      dataElement: 'richTextBoldButton',
      onClick: textEditHandleFormatChange('bold'),
      isActive: textEditFormat?.bold,
    },
    italic: {
      dataElement: 'richTextItalicButton',
      onClick: textEditHandleFormatChange('italic'),
      isActive: textEditFormat?.italic,
    },
    underline: {
      dataElement: 'richTextUnderlineButton',
      onClick: textEditHandleFormatChange('underline'),
      isActive: textEditFormat?.underline,
    },
    strikeout: {
      dataElement: 'richTextStrikeoutButton',
      onClick: textEditHandleFormatChange('strike'),
      isActive: textEditFormat?.strike,
    },
    leftAlign: {
      dataElement: 'richTextAlignLeftButton',
      isActive: textEditFormat.textAlign === 'Start',
      alignValue: 'Start'
    },
    centerAlign: {
      dataElement: 'richTextAlignCenterButton',
      isActive: textEditFormat.textAlign === 'Center',
      alignValue: 'Center'
    },
    rightAlign: {
      dataElement: 'richTextAlignRightButton',
      isActive: textEditFormat.textAlign === 'End',
      alignValue: 'End'
    },
  };

  const currentConfig = isContentEditing ? contentEditConfig : defaultConfig;

  return (
    <>
      <div className={`container-fluid ${error && 'error'}`}>
        <div className="container-dropdown">
          <Dropdown
            items={supportedFonts}
            onClickItem={changeFont}
            currentSelectionKey={defaultQuillFont}
            getCustomItemStyle={(item) => ({ fontFamily: item })}
            maxHeight={200}
            placeholder={isContentEditing ? 'Font' : undefined}
            disableFocusing={true}
          />
          <FontSizeDropdown
            fontSize={fontSizePropsToUpdate}
            key={fontSizePropsToUpdate}
            fontUnit={(fontSizeProps && fontSizeProps[1]) || 'pt'}
            onFontSizeChange={changeFontSize}
            onError={setError}
            applyOnlyOnBlur={isContentEditing}
            disabled={isFreeTextAutoSize}
            displayEmpty={isRichTextEditMode && !properties?.quillFontSize || fontSizePropsToUpdate === undefined}
          />
        </div>
        {error && <div className="error-text">{error}</div>}
      </div>
      <div className="icon-grid">
        {!isRedaction && (
          <div className="row rich-text-format">
            <Button
              dataElement={currentConfig.bold.dataElement}
              onClick={currentConfig.bold.onClick}
              img="icon-menu-bold"
              title="option.richText.bold"
              isActive={currentConfig.bold.isActive}
            />
            <Button
              dataElement={currentConfig.italic.dataElement}
              onClick={currentConfig.italic.onClick}
              img="icon-menu-italic"
              title="option.richText.italic"
              isActive={currentConfig.italic.isActive}
            />
            <Button
              dataElement={currentConfig.underline.dataElement}
              onClick={currentConfig.underline.onClick}
              img="icon-menu-text-underline"
              title="option.richText.underline"
              isActive={currentConfig.underline.isActive}
            />
            <Button
              dataElement={currentConfig.strikeout.dataElement}
              onClick={currentConfig.strikeout.onClick}
              img="icon-tool-text-manipulation-strikethrough"
              title="option.richText.strikeout"
              isActive={currentConfig.strikeout.isActive}
            />
          </div>
        )}
        <div className={`row text-horizontal-alignment ${isRedaction ? 'isRedaction' : ''}`}>
          <Button
            dataElement={currentConfig.leftAlign.dataElement}
            onClick={() => changeXAlign(currentConfig.leftAlign.alignValue)}
            img="icon-menu-align-left"
            title="option.richText.alignLeft"
            isActive={currentConfig.leftAlign.isActive}
          />
          <Button
            dataElement={currentConfig.centerAlign.dataElement}
            onClick={() => changeXAlign(currentConfig.centerAlign.alignValue)}
            img="icon-menu-align-centre"
            title="option.richText.alignCenter"
            isActive={currentConfig.centerAlign.isActive}
          />
          <Button
            dataElement={currentConfig.rightAlign.dataElement}
            onClick={() => changeXAlign(currentConfig.rightAlign.alignValue)}
            img="icon-menu-align-right"
            title="option.richText.alignRight"
            isActive={currentConfig.rightAlign.isActive}
          />
          {!isRedaction && !isContentEditing && (
            <Button
              dataElement="freeTextJustifyCenterButton"
              onClick={() => changeXAlign('justify')}
              img="icon-text-justify-center"
              title="option.richText.justifyCenter"
              isActive={textAlign === 'justify'}
            />
          )}
        </div>
        {!isRedaction && !isContentEditing && (
          <div className="row text-vertical-alignment">
            <Button
              onClick={() => changeYAlign('top')}
              img="icon-arrow-to-top"
              title="option.richText.alignTop"
              isActive={textVerticalAlign === 'top'}
              disabled={isFreeTextAutoSize}
            />
            <Button
              onClick={() => changeYAlign('center')}
              img="icon-arrow-to-middle"
              title="option.richText.alignMiddle"
              isActive={textVerticalAlign === 'center'}
              disabled={isFreeTextAutoSize}
            />
            <Button
              onClick={() => changeYAlign('bottom')}
              img="icon-arrow-to-bottom"
              title="option.richText.alignBottom"
              isActive={textVerticalAlign === 'bottom'}
              disabled={isFreeTextAutoSize}
            />
          </div>
        )}{isFreeText && (<div className="row text-vertical-alignment auto-size-checkbox">
          <Choice
            label={i18next.t('option.freeTextOption.autoSizeFont')}
            checked={isFreeTextAutoSize}
            onChange={onFreeTextSizeToggle}
            aria-label={freeTextAutoSizeDataElement}
          />
        </div>)}
      </div>
    </>
  );
};

TextStylePicker.propTypes = {
  onPropertyChange: PropTypes.func.isRequired,
  properties: PropTypes.object,
  textEditFormat: PropTypes.object,
  textEditHandleFormatChange: PropTypes.func,
  isRedaction: PropTypes.bool,
  isContentEditing: PropTypes.bool,
  isFreeText: PropTypes.bool,
  isFreeTextAutoSize: PropTypes.bool,
  onFreeTextSizeToggle: PropTypes.func,
  isRichTextEditMode: PropTypes.bool,
};

export default TextStylePicker;
