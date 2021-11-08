import React, { useState } from 'react';
import './TextStylePicker.scss';
import Dropdown from "components/Dropdown";
import FontSizeDropdown from "components/FontSizeDropdown";
import Button from "components/Button";

const TextStylePicker = ({ onPropertyChange, properties, onRichTextStyleChange }) => {
  // List is not complete
  const supportedFonts = [
    "Helvetica",
    "Times New Roman",
    "Courier",
    "Georgia",
    "serif",
    "Verdana",
    "sans-serif",
    "Lucida Console",
    "monospace",
    'Tahoma',
    'Trebuchet MS',
    'Garamond',
    'Brush Script MT',
  ];

  const [font, setFont] = useState(properties?.Font || supportedFonts[0]);
  const changeFont = font => {
    onPropertyChange("Font", font);
    setFont(font);
  };

  const [fontSize, setFontSize] = useState(properties?.FontSize || "12pt");
  const changeFontSize = fontSize => {
    onPropertyChange("FontSize", fontSize);
    setFontSize(fontSize);
  };

  const [bold, setBold] = useState(properties?.bold || false);
  const toggleBold = () => {
    onRichTextStyleChange("font-weight", !bold ? "bold" : "normal");
    setBold(!bold);
  };


  const [italic, setItalic] = useState(properties?.italic || false);
  const toggleItalic = () => {
    onRichTextStyleChange("font-style", !italic ? "italic" : "normal");
    setItalic(!italic);
  };

  const [underline, setUnderline] = useState(properties?.underline || false);
  const [strikeout, setStrikeout] = useState(properties?.strikeout || false);
  const toggleUnderline = () => {
    const newUnderline = !underline;
    if (newUnderline && strikeout) {
      onRichTextStyleChange("text-decoration", "line-through underline");
    } else if (strikeout) {
      onRichTextStyleChange("text-decoration", "line-through");
    } else if (newUnderline) {
      onRichTextStyleChange("text-decoration", "underline");
    } else {
      onRichTextStyleChange("text-decoration", "none");
    }
    setUnderline(newUnderline);
  };
  const toggleStrikeout = () => {
    const newStrikeout = !strikeout;
    if (underline && newStrikeout) {
      onRichTextStyleChange("text-decoration", "line-through underline");
    } else if (newStrikeout) {
      onRichTextStyleChange("text-decoration", "line-through");
    } else if (underline) {
      onRichTextStyleChange("text-decoration", "underline");
    } else {
      onRichTextStyleChange("text-decoration", "none");
    }
    setStrikeout(newStrikeout);
  };

  const [textAlign, setTextAlign] = useState(properties?.TextAlign || "left");
  const changeXAlign = xAlign => {
    onPropertyChange("TextAlign", xAlign);
    setTextAlign(xAlign);
  };

  const [textVerticalAlign, setTextVerticalAlign] = useState(properties?.TextVerticalAlign || "top");
  const changeYAlign = yAlign => {
    onPropertyChange("TextVerticalAlign", yAlign);
    setTextVerticalAlign(yAlign);
  };

  const fontSizeProps = fontSize?.match(/([0-9.]+)|([a-z]+)/gi);

  const [error, setError] = useState('');

  return (
    <>
      <div className={`container-fluid ${error && 'error'}`}>
        <Dropdown
          items={supportedFonts}
          onClickItem={changeFont}
          currentSelectionKey={font}
          isFont
        />
        <FontSizeDropdown
          fontSize={fontSizeProps && parseFloat(fontSizeProps[0]) || 12}
          fontUnit={fontSizeProps && fontSizeProps[1] || "pt"}
          onFontSizeChange={changeFontSize}
          onError={setError}
        />
        {error && <div className="error-text">
          {error}
        </div>}
      </div>
      <div className="icon-grid">
        <div className="row rich-text-format">
          <Button
            dataElement="freeTextBoldButton"
            onClick={toggleBold}
            img="icon-menu-bold"
            title="option.richText.bold"
            isActive={bold}
          />
          <Button
            dataElement="freeTextItalicButton"
            onClick={toggleItalic}
            img="icon-menu-italic"
            title="option.richText.italic"
            isActive={italic}
          />
          <Button
            dataElement="freeTextUnderlineButton"
            onClick={toggleUnderline}
            img="icon-menu-text-underline"
            title="option.richText.underline"
            isActive={underline}
          />
          <Button
            dataElement="freeTextStrikeoutButton"
            onClick={toggleStrikeout}
            img="icon-tool-text-manipulation-strikethrough"
            title="option.richText.strikeout"
            isActive={strikeout}
          />
        </div>
        <div className="row text-horizontal-alignment">
          <Button
            dataElement="freeTextAlignLeftButton"
            onClick={() => changeXAlign("left")}
            img="icon-menu-align-left"
            title="option.richText.alignLeft"
            isActive={textAlign === "left"}
          />
          <Button
            dataElement="freeTextAlignCenterButton"
            onClick={() => changeXAlign("center")}
            img="icon-menu-align-centre"
            title="option.richText.alignCenter"
            isActive={textAlign === "center"}
          />
          <Button
            dataElement="freeTextAlignRightButton"
            onClick={() => changeXAlign("right")}
            img="icon-menu-align-right"
            title="option.richText.alignRight"
            isActive={textAlign === "right"}
          />
          {/*TODO: Implement justify button below*/}
          <Button
            dataElement="freeTextJustifyCenterButton"
            onClick={() => changeXAlign("justify")}
            img="icon-text-justify-center"
            title="option.richText.justifyCenter"
            isActive={textAlign === "justify"}
          />
        </div>
        <div className="row text-vertical-alignment">
          <Button
            onClick={() => changeYAlign("top")}
            img="icon-arrow-to-top"
            title="option.richText.alignTop"
            isActive={textVerticalAlign === "top"}
          />
          <Button
            onClick={() => changeYAlign("center")}
            img="icon-arrow-to-middle"
            title="option.richText.alignMiddle"
            isActive={textVerticalAlign === "center"}
          />
          <Button
            onClick={() => changeYAlign("bottom")}
            img="icon-arrow-to-bottom"
            title="option.richText.alignBottom"
            isActive={textVerticalAlign === "bottom"}
          />
        </div>
      </div>
    </>
  );
};

export default TextStylePicker;