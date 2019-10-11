import React from 'react';

// this component is used to preload the font(s) that is used in the SignatureModal(TextSignature)
// if the font(s) isn't loaded in advanced, we will see the signature text filled with the sans-serif font
// we could use <link rel="preload" href="/path/some.woff2" as="font"> to preload a font but this hasn't been supported in all the browsers
const FontHandler = () => (
  <div style={{ opacity: 0 }}>
    <span style={{ fontFamily: 'GreatVibes-Regular' }}></span>
  </div>
);

export default FontHandler;
