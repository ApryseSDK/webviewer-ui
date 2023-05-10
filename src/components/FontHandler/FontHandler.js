import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import webFonts from 'constants/webFonts';

import selectors from 'selectors';

// this component is used to preload the font(s) that are used in Annotations and the SignatureModal(TextSignature)
// if the font(s) isn't loaded in advanced, we will see the signature text filled with the sans-serif font
// we could use <link rel="preload" href="/path/some.woff2" as="font"> to preload a font but this hasn't been supported in all the browsers
const FontHandler = () => {
  const signatureFonts = useSelector((state) => selectors.getSignatureFonts(state));
  const isWebComponent = window.isApryseWebViewerWebComponent;

  // load webfonts and if using web component load default font and signature fonts.
  useEffect(() => {
    const loadFont = (font, fontType, isWebFont = false, fileName = null, style = {}) => {
      const fontTypes = {
        ttf: 'truetype',
        woff: 'woff',
        woff2: 'woff2',
      };
      const fontName = font.replace(/\s/g, '');
      if (!fileName) {
        fileName = fontName;
      }
      // eslint-disable-next-line no-undef, camelcase
      const fontPath = `${isWebComponent ? __webpack_public_path__ : '.'}/assets/fonts/${isWebFont ? 'webfonts/' : ''}${fileName}.${fontType}`;
      const fontFace = new FontFace(font, `url(${fontPath}) format("${fontTypes[fontType]}")`, style);
      fontFace.load().then(function(loadedFace) {
        document.fonts.add(loadedFace);
      });
    };

    if (isWebComponent) {
      const defaultFonts = {
        'Lato-Regular': {
          'style': 'normal',
          'weight': 'normal',
        },
        'Lato-Italic': {
          'style': 'italic',
          'weight': 'normal',
        },
        'Lato-Bold': {
          'style': 'normal',
          'weight': 'bold',
        },
        'Lato-BoldItalic': {
          'style': 'italic',
          'weight': 'bold',
        },
      };

      Object.keys(defaultFonts).forEach((font) => {
        loadFont('Lato', 'woff', false, font, defaultFonts[font]);
      });

      signatureFonts.forEach((font) => {
        loadFont(font, 'woff');
      });

      loadFont('GreatVibes-Regular', 'woff2');
    }

    webFonts.forEach((font) => {
      loadFont(font, 'ttf', true);
    });
  }, []);

  return isWebComponent ? null : (
    <div style={{ opacity: 0 }}>
      {signatureFonts.map((font) => (
        <span key={font} style={{ fontFamily: font }}></span>
      ))}
    </div>
  );
};
export default FontHandler;
