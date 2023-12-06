import React, { useState } from 'react';
import './TextStylePicker.scss';
import Dropdown from 'components/Dropdown';
import FontSizeDropdown from 'components/FontSizeDropdown';
import Button from 'components/Button';
import PropTypes from 'prop-types';

const TextStylePicker = ({
  onPropertyChange,
  properties,
  onRichTextStyleChange,
  isRedaction,
  isContentEditing,
  fonts,
  stateless = false,
}) => {
  // List is not complete
  const supportedFonts = fonts?.length ? fonts : ['Helvetica', 'Times New Roman'];

  const font = properties?.Font || supportedFonts[0];
  const changeFont = (font) => {
    onPropertyChange('Font', font);
  };

  const fontSize = properties?.FontSize || '12pt';
  const changeFontSize = (fontSize) => {
    onPropertyChange('FontSize', fontSize);
  };

  const defaultBold = properties?.bold || false;
  const [bold, setBold] = useState(defaultBold);
  const toggleBold = () => {
    onRichTextStyleChange('font-weight', !bold ? 'bold' : '');
    setBold(!bold);
  };

  const defaultItalic = properties?.italic || false;
  const [italic, setItalic] = useState(defaultItalic);
  const toggleItalic = () => {
    onRichTextStyleChange('font-style', !italic ? 'italic' : '');
    setItalic(!italic);
  };

  const defaultUnderline = properties?.underline || false;
  const defaultStrikeout = properties?.strikeout || false;
  const [underline, setUnderline] = useState(defaultUnderline);
  const [strikeout, setStrikeout] = useState(properties?.strikeout || false);
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
  const fontSizePropsToUpdate = (fontSizeProps && parseFloat(fontSizeProps[0])) || 12;

  return (
    <>
      <div className={`container-fluid ${error && 'error'}`}>
        <div className="container-dropdown">
          <Dropdown
            items={supportedFonts}
            onClickItem={changeFont}
            currentSelectionKey={font}
            getCustomItemStyle={(item) => ({ fontFamily: item })}
            maxHeight={200}
            placeholder={isContentEditing ? 'Font' : undefined}
          />
          <FontSizeDropdown
            fontSize={fontSizePropsToUpdate}
            key={fontSizePropsToUpdate}
            fontUnit={(fontSizeProps && fontSizeProps[1]) || 'pt'}
            onFontSizeChange={changeFontSize}
            onError={setError}
            applyOnlyOnBlur={isContentEditing}
          />
        </div>
        {error && <div className="error-text">{error}</div>}
      </div>
      <div className="icon-grid">
        {!isRedaction && !isContentEditing && (
          <div className="row rich-text-format">
            <Button
              dataElement="freeTextBoldButton"
              onClick={toggleBold}
              img="icon-menu-bold"
              title="option.richText.bold"
              isActive={stateless ? defaultBold : bold}
            />
            <Button
              dataElement="freeTextItalicButton"
              onClick={toggleItalic}
              img="icon-menu-italic"
              title="option.richText.italic"
              isActive={stateless ? defaultItalic : italic}
            />
            <Button
              dataElement="freeTextUnderlineButton"
              onClick={toggleUnderline}
              img="icon-menu-text-underline"
              title="option.richText.underline"
              isActive={stateless ? defaultUnderline : underline}
            />
            <Button
              dataElement="freeTextStrikeoutButton"
              onClick={toggleStrikeout}
              img="icon-tool-text-manipulation-strikethrough"
              title="option.richText.strikeout"
              isActive={stateless ? defaultStrikeout : strikeout}
            />
          </div>
        )}
        <div className={`row text-horizontal-alignment ${isRedaction ? 'isRedaction' : ''}`}>
          <Button
            dataElement="freeTextAlignLeftButton"
            onClick={() => changeXAlign('left')}
            img="icon-menu-align-left"
            title="option.richText.alignLeft"
            isActive={!isContentEditing && textAlign === 'left'}
          />
          <Button
            dataElement="freeTextAlignCenterButton"
            onClick={() => changeXAlign('center')}
            img="icon-menu-align-centre"
            title="option.richText.alignCenter"
            isActive={!isContentEditing && textAlign === 'center'}
          />
          <Button
            dataElement="freeTextAlignRightButton"
            onClick={() => changeXAlign('right')}
            img="icon-menu-align-right"
            title="option.richText.alignRight"
            isActive={!isContentEditing && textAlign === 'right'}
          />
          {/* TODO: Implement justify button below */}
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
            />
            <Button
              onClick={() => changeYAlign('center')}
              img="icon-arrow-to-middle"
              title="option.richText.alignMiddle"
              isActive={textVerticalAlign === 'center'}
            />
            <Button
              onClick={() => changeYAlign('bottom')}
              img="icon-arrow-to-bottom"
              title="option.richText.alignBottom"
              isActive={textVerticalAlign === 'bottom'}
            />
          </div>
        )}
      </div>
    </>
  );
};

TextStylePicker.propTypes = {
  onPropertyChange: PropTypes.func.isRequired,
};

export default TextStylePicker;
