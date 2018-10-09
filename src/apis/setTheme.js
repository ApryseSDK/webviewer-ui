export default theme => {
  const isPresetTheme = typeof theme === 'string';
  const isCustomizedTheme = typeof theme === 'object';

  if (isPresetTheme) {
    setPresetTheme(theme);
  } else if (isCustomizedTheme){
    setTheme(theme);
  }
};

const setPresetTheme = theme => {
  const themeToPresetThemeMap = {
    default: {
      primary: '#FFFFFF',
      secondary: '#F5F5F5',
      border: '#E0E0E0',
      buttonHover: '#F6F6F6',
      buttonActive: '#F0F0F0',
      text: '#333333',
      icon: '#757575',
      iconActive: '#757575'
    },
    dark: {
      primary: '#2C2B3A',
      secondary: '#4D4C5F',
      border: '#555555',
      buttonHover: '#686880',
      buttonActive: '#686880',
      text: '#FFFFFF',
      icon: '#FFFFFF',
      iconActive: '#FFFFFF'
    }
  };
  const presetTheme = themeToPresetThemeMap[theme];
  
  if (presetTheme) {
    setTheme(themeToPresetThemeMap[theme]);
  } else {
    console.warn(`${theme} is not one of: default, dark`);
  }
};

const setTheme = theme => {
  const keyToCSSVarMap = {
    primary: '--primary-color',
    secondary: '--secondary-color',
    border: '--border-color',
    buttonHover: '--button-hover-color',
    buttonActive: '--button-active-color',
    text: '--text-color',
    icon: '--icon-color',
    iconActive: '--icon-active-color'
  };

  Object.keys(theme).forEach(key => {
    const cssVar = keyToCSSVarMap[key];
    if (cssVar) {
      const color = theme[key];
      document.body.style.setProperty(cssVar, color);
    } else {
      console.warn(`${key} is not valid, please make sure properties are a subset of:`);
      console.warn(`primary, secondary, text, buttonHover, buttonActive and icon`);
    }
  });
};