/**
 * Sets the theme of Webviewer UI. Please note that this does not work in IE11.
 * @method WebViewer#setTheme
 * @param {(string|object)} theme Either theme object or predefined string. Predefined strings are 'default' and 'dark'.
 * @param {string} [theme.primary=#FFFFFF] Background color for the header, modals, overlays, etc.
 * @param {string} [theme.secondary=#F5F5F5] ackground color for panels and the document container.
 * @param {string} [theme.border=#CDCDCD] Border color for different components.
 * @param {string} [theme.buttonHover=#F6F6F6] Background color for hovering on a button.
 * @param {string} [theme.buttonActive=#F0F0F0] Background color for an active button.
 * @param {string} [theme.text=#333333] Text color.
 * @param {string} [theme.icon=#757575] Icon color.
 * @param {string} [theme.iconActive=#757575] Icon color when button is active.
 * @example // 5.1 and after
// Using an object
WebViewer(...)
  .then(function(instance) {
    instance.setTheme({
      primary: '#2C2B3A',
      secondary: '#4D4C5F',
      border: '#555555',
      buttonHover: '#686880',
      buttonActive: '#686880',
      text: '#FFFFFF',
      icon: '#FFFFFF',
      iconActive: '#FFFFFF'
    });
  });
 * @example // 4.0 ~ 5.0
// Using an object
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.setTheme({
    primary: '#2C2B3A',
    secondary: '#4D4C5F',
    border: '#555555',
    buttonHover: '#686880',
    buttonActive: '#686880',
    text: '#FFFFFF',
    icon: '#FFFFFF',
    iconActive: '#FFFFFF'
  });
});
 * @example // 5.1 and after
// Using predefined string
WebViewer(...)
  .then(function(instance) {
    instance.setTheme('dark');
  });
 * @example // 4.0 ~ 5.0
// Using predefined string
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.setTheme('dark');
});
 */

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