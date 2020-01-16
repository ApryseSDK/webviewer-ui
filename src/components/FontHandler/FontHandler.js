import React from 'react';
import { useSelector } from 'react-redux';

import selectors from 'selectors';

// this component is used to preload the font(s) that is used in the SignatureModal(TextSignature)
// if the font(s) isn't loaded in advanced, we will see the signature text filled with the sans-serif font
// we could use <link rel="preload" href="/path/some.woff2" as="font"> to preload a font but this hasn't been supported in all the browsers
const FontHandler = () => {
  const fonts = useSelector(state => selectors.getSignatureFonts(state));

  return (
    <div style={{ opacity: 0 }}>
      {fonts.map(font => (
        <span key={font} style={{ fontFamily: font }}></span>
      ))}
    </div>
  );
};
export default FontHandler;
