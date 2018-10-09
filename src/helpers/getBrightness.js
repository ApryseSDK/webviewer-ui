  /**
   * @param color color is an object returned by window.Annotations.Color method
   * @return brightness. In current design, we will use rgba(0, 0, 0, 0.54) if it's dark and rgba(255, 255, 255, 0.70) if it's bright
   */
  const getBrightness = color => {
    const threshold = 0.15;
    const darkness = 1 - (0.299 * color.R + 0.587 * color.G + 0.114 * color.B) / 255;   

    if (darkness < threshold || color.toHexString() === null){ // Also return dark color if selected transparency cell.
      return 'dark';
    }

    return 'bright';
  };

  export default getBrightness;