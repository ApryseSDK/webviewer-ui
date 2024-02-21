import React from 'react';

import './MathSymbolsPicker.scss';

const symbols = [
  '\u002B',
  '\u2212',
  '\u00D7',
  '\u00F7',
  '\u003D',
  '\u2260',
  '\u00B1',
  '\u00AC',
  '\u003C',
  '\u003E',
  '\u22DC',
  '\u22DD',
  '\u00B0',
  '\u00B9',
  '\u00B2',
  '\u00B3',
  '\u0192',
  '\u0025',
  '\u2030',
  '\u2031',
  '\u2200',
  '\u2201',
  '\u2202',
  '\u2203',
  '\u2204',
  '\u2205',
  '\u2206',
  '\u2207',
  '\u2208',
  '\u2209',
  '\u220A',
  '\u220B',
  '\u220C',
  '\u220D',
  '\u220E',
  '\u220F',
  '\u2210',
  '\u2211',
  '\u2213',
  '\u2214',
  '\u2215',
  '\u2216',
  '\u2217',
  '\u2218',
  '\u2219',
  '\u221A',
  '\u221B',
  '\u221C',
  '\u221D',
  '\u221E',
  '\u221F',
  '\u2220',
  '\u2221',
  '\u2222',
  '\u2223',
  '\u2224',
  '\u2225',
  '\u2226',
  '\u2227',
  '\u2228',
  '\u2229',
  '\u222A',
  '\u222B',
  '\u222C',
  '\u222D',
  '\u222E',
  '\u222F',
  '\u2230',
  '\u2231',
  '\u2232',
  '\u2233',
  '\u2234',
  '\u2235',
  '\u2236',
  '\u2237',
  '\u2238',
  '\u2239',
  '\u223A',
  '\u223B',
  '\u223C',
  '\u223D',
  '\u223E',
  '\u223F',
  '\u2240',
  '\u2241',
  '\u2242',
  '\u2243',
  '\u2244',
  '\u2245',
  '\u2246',
  '\u2247',
  '\u2248',
  '\u2249',
  '\u224A',
  '\u224B',
  '\u224C'
];

const MathSymbolsPicker = ({ onClickHandler, maxHeight }) => {
  return (
    <div
      className="mathSymbolsContainer padding"
      style={{ maxHeight: `${maxHeight}px` }}
    >
      {symbols.map((symbol, i) => (
        <button
          key={i}
          className="cell-container"
          onClick={() => {
            onClickHandler(symbol);
          }}
        >
          {symbol}
        </button>
      ))}
    </div>
  );
};

export default MathSymbolsPicker;