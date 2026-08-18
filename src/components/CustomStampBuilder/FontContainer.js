import React from 'react';
import Dropdown from 'components/Dropdown';
import Button from 'components/Button';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import PropTypes from 'prop-types';

const FontContainer = ({
  font,
  bold,
  italic,
  underline,
  strikeout,
  handleFontChange,
  handleRichTextStyleChange
}) => {
  const [t] = useTranslation();
  const fonts = useSelector((state) => selectors.getFonts(state));
  const toggleBold = () => handleRichTextStyleChange('bold');
  const toggleItalic = () => handleRichTextStyleChange('italic');
  const toggleStrikeout = () => handleRichTextStyleChange('strikeout');
  const toggleUnderline = () => handleRichTextStyleChange('underline');

  const fontContainer = <div className="font-container">
    <div className="stamp-sublabel" id="custom-stamp-font-family-label"> {t('option.customStampModal.fontStyle')} </div>
    <div className="font-inner-container">
      <Dropdown
        id='custom-stamp-font'
        labelledById='custom-stamp-font-family-label'
        items={fonts}
        ariaLabel={t('option.customStampModal.fontStyle')}
        onClickItem={handleFontChange}
        currentSelectionKey={font || fonts[0]}
        getCustomItemStyle={(item) => ({ fontFamily: item })}
        maxHeight={200} />
      <Button
        dataElement="stampTextBoldButton"
        onClick={toggleBold}
        img="icon-menu-bold"
        title="option.richText.bold"
        isActive={bold}
        ariaPressed={bold} />
      <Button
        dataElement="stampTextItalicButton"
        onClick={toggleItalic}
        img="icon-menu-italic"
        title="option.richText.italic"
        isActive={italic}
        ariaPressed={italic} />
      <Button
        dataElement="stampTextUnderlineButton"
        onClick={toggleUnderline}
        img="icon-menu-text-underline"
        title="option.richText.underline"
        isActive={underline}
        ariaPressed={underline} />
      <Button
        dataElement="stampTextStrikeoutButton"
        onClick={toggleStrikeout}
        img="icon-text-strikeout"
        title="option.richText.strikeout"
        isActive={strikeout}
        ariaPressed={strikeout} />
    </div>
  </div>;
  return fontContainer;
};

FontContainer.propTypes = {
  font: PropTypes.string,
  bold: PropTypes.bool,
  italic: PropTypes.bool,
  underline: PropTypes.bool,
  strikeout: PropTypes.bool,
  handleFontChange: PropTypes.func,
  handleRichTextStyleChange: PropTypes.func,
};

export default FontContainer;