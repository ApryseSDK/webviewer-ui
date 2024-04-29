import { getFontPath } from '../apis/fontPathHandler';

const defaultFonts = {
  'Lato-Regular': {
    type: 'woff',
    style: {
      family: 'Lato',
    }
  },
  'Lato-Italic': {
    type: 'woff',
    style: {
      family: 'Lato',
      style: 'italic',
    }
  },
  'Lato-Bold': {
    type: 'woff',
    style: {
      family: 'Lato',
      weight: 'bold'
    }
  },
  'Lato-BoldItalic': {
    type: 'woff',
    style: {
      family: 'Lato',
      style: 'italic',
      weight: 'bold'
    }
  },
  'GreatVibes-Regular': {
    type: ['woff2', 'woff'],
    style: {
      family: 'GreatVibes-Regular',
    }
  },
  'Satisfy': {
    type: 'woff',
    style: {
      family: 'Satisfy',
    }
  },
  'Nothing-You-Could-Do': {
    type: 'woff',
    style: {
      family: 'Nothing-You-Could-Do',
    }
  },
  'La-Belle-Aurore': {
    type: 'woff',
    style: {
      family: 'La-Belle-Aurore',
    }
  },
  'Whisper': {
    type: 'woff',
    style: {
      family: 'Whisper',
    }
  },
};

const loadFont = (font, fontType, isWebFont = false, fileName = null, style = {}) => {
  const fontDirectoryPaht = getFontPath() || 'assets/fonts/';

  const fontTypes = {
    ttf: 'truetype',
    woff: 'woff',
    woff2: 'woff2',
  };
  const fontName = font.replace(/\s/g, '');
  if (!fileName) {
    fileName = fontName;
  }
  const isWebComponent = window.isApryseWebViewerWebComponent;
  const fontStyle = { style: 'normal', weight: 'normal', ...style };

  let url = '';

  if (Array.isArray(fontType)) {
    const urls = fontType.map((type) => {
      // eslint-disable-next-line no-undef, camelcase
      const fontPath = `${isWebComponent ? __webpack_public_path__ : './'}${fontDirectoryPaht}${isWebFont ? 'webfonts/' : ''}${fileName}.${type}`;
      return `url(${fontPath}) format(${fontTypes[type]})`;
    });
    url = urls.join();
  } else {
    // eslint-disable-next-line no-undef, camelcase
    const fontPath = `${isWebComponent ? __webpack_public_path__ : './'}${fontDirectoryPaht}${isWebFont ? 'webfonts/' : ''}${fileName}.${fontType}`;
    url = `url(${fontPath}) format(${fontTypes[fontType]})`;
  }

  const fontFace = new FontFace(font, url, fontStyle);
  fontFace.load().then(function(loadedFace) {
    document.fonts.add(loadedFace);
  });
};

export default loadFont;

export const loadDefaultFonts = () => {
  Object.keys(defaultFonts).forEach((fontName) => {
    const item = defaultFonts[fontName];
    loadFont(item.style.family, item.type, false, fontName, item.style);
  });
};
