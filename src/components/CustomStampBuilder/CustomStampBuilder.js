import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import useCore from 'hooks/useCore';
import selectors from 'selectors';

import './CustomStampBuilder.scss';
import StampInputContainer from './StampInputContainer';
import CategoryContainer from './CategoryContainer';
import FontContainer from './FontContainer';
import TimestampContainer from './TimestampContainer';
import ColorContainer from './ColorContainer';

const DEFAULT_CANVAS_WIDTH = 300;
const DEFAULT_CANVAS_HEIGHT = 100;

const propTypes = {
  stamp: PropTypes.object,
  setStamp: PropTypes.func,
  stampTool: PropTypes.object,
  userName: PropTypes.string,
};

const CustomStampBuilder = ({
  stamp,
  setStamp,
  stampTool,
  userName,
}) => {
  const [t] = useTranslation();
  const { core } = useCore();
  const canvasRef = useRef();
  const canvasContainerRef = useRef();
  const currentUser = core.getCurrentUser();
  const currentDateTime = new Date().toLocaleString();
  const featureFlags = useSelector((state) => selectors.getFeatureFlags(state));

  const updateCanvasWithStamp = (newStamp) => {
    if (!canvasRef.current || !canvasContainerRef.current) {
      return newStamp;
    }
    const canvasParameters = {
      ...newStamp,
      canvas: canvasRef.current,
      canvasParent: canvasContainerRef.current,
      width: DEFAULT_CANVAS_WIDTH,
      height: DEFAULT_CANVAS_HEIGHT,
    };
    const width = stampTool.drawCustomStamp(canvasParameters);
    return width;
  };

  useEffect(() => {
    updateCanvasWithStamp(stamp);
  }, [userName]);

  const buildStampWithCanvasMetrics = (newStamp) => {
    const width = updateCanvasWithStamp(newStamp);
    const dataURL = canvasRef.current.toDataURL();
    return {
      ...newStamp,
      width,
      height: DEFAULT_CANVAS_HEIGHT,
      dataURL,
    };
  };

  const setStampWithCanvasMetrics = (newStamp) => {
    const updatedStamp = buildStampWithCanvasMetrics(newStamp);
    setStamp(updatedStamp);
  };

  const handleInputChange = (e) => {
    const value = e.target.value || '';
    const nextStamp = {
      ...stamp,
      title: value,
    };
    setStampWithCanvasMetrics(nextStamp);
  };

  const handleCategoryChange = (category) => {
    const categoryValue = category ? category.value : null;
    setStamp({
      ...stamp,
      category: categoryValue,
    });
  };

  const handleFontChange = (font) => {
    const nextStamp = {
      ...stamp,
      font,
    };
    setStampWithCanvasMetrics(nextStamp);
  };

  const handleRichTextStyleChange = (style) => {
    const nextStamp = {
      ...stamp,
      [style]: !stamp[style],
    };
    setStampWithCanvasMetrics(nextStamp);
  };

  const handleTextColorChange = (newColor) => {
    const nextStamp = {
      ...stamp,
      textColor: newColor,
    };
    setStampWithCanvasMetrics(nextStamp);
  };

  const handleBackgroundColorChange = (newColor) => {
    const nextStamp = {
      ...stamp,
      color: newColor,
    };
    setStampWithCanvasMetrics(nextStamp);
  };

  const handleTimestampFormatChange = (newFormat) => {
    const nextStamp = {
      ...stamp,
      subtitle: newFormat,
    };
    setStampWithCanvasMetrics(nextStamp);
  };

  const stampInputContainer = <StampInputContainer
    stampText={stamp.title}
    handleInputChange={handleInputChange}
  />;

  const categoryContainer = featureFlags.newStampPanel ? <CategoryContainer
    category={stamp.category}
    handleCategoryChange={handleCategoryChange} /> : null;

  const fontContainer = <FontContainer
    font={stamp.font}
    bold={stamp.bold}
    italic={stamp.italic}
    underline={stamp.underline}
    strikeout={stamp.strikeout}
    handleFontChange={handleFontChange}
    handleRichTextStyleChange={handleRichTextStyleChange}
  />;

  const textColorContainer = <ColorContainer
    handleColorChange={handleTextColorChange}
    colorsArrayName="TEXT_COLORS"
    type="text"
  />;

  const backgroundColorContainer = <ColorContainer
    handleColorChange={handleBackgroundColorChange}
    colorsArrayName="FILL_COLORS"
    type="background"
  />;

  const timestampContainer = <TimestampContainer
    handleTimestampFormatChange={handleTimestampFormatChange}
  />;

  return (
    <div className="text-customstamp">
      <div className="canvas-container" ref={canvasContainerRef}>
        <canvas
          className="custom-stamp-canvas"
          ref={canvasRef}
          role={'img'}
          aria-label={`${t('option.customStampModal.previewCustomStamp')} ${stamp.title}, ${currentUser} ${currentDateTime}`}
        />
      </div>
      <div className="scroll-container">
        {stampInputContainer}
        {categoryContainer}
        {fontContainer}
        {textColorContainer}
        {backgroundColorContainer}
        {timestampContainer}
      </div>
    </div>
  );
};

CustomStampBuilder.propTypes = propTypes;

export default CustomStampBuilder;
