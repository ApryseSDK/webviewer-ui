
/**
 * Contains string enums for all reader page modes for WebViewer UI.
 * @name UI.ReaderModePageMode
 * @property {string} SINGLE A reader mode that shows one page at a time.
 * @property {string} CONTINUOUS A reader mode that shows all pages in a continuous scroll.
 * @example
 WebViewer(...)
 .then(function(instance) {
    var ReaderModePageMode = instance.UI.ReaderModePageMode;
    instance.UI.setReaderPageMode(ReaderModePageMode.CONTINUOUS);
  }
 */

export default {
  SINGLE: 'Single',
  CONTINUOUS: 'Continuous',
};