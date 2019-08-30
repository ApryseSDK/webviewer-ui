/**
 * Contains string enums for all features for WebViewer UI
 * @name WebViewer#Feature
 * @property {string} Measurement
 * @property {string} Annotations
 * @property {string} Download
 * @property {string} FilePicker
 * @property {string} LocalStorage
 * @property {string} NotesPanel
 * @property {string} Print
 * @property {string} Redaction
 * @property {string} TextSelection
 * @property {string} TouchScrollLock
 * @property {string} CopyText
 * @property {string} ReadOnly
 * @example
WebViewer(...)
  .then(function(instance) {
    var Feature = instance.Feature;
    instance.enableFeatures([Feature.Measurement]);
    instance.disableFeatures([Feature.CopyText]);
  });
 */

export default {
  Measurement: 'Measurement',
  Annotations: 'Annotations',
  Download: 'Download',
  FilePicker: 'FilePicker',
  LocalStorage: 'LocalStorage',
  NotesPanel: 'NotesPanel',
  Print: 'Print',
  Redaction: 'Redaction',
  TextSelection: 'TextSelection',
  TouchScrollLock: 'TouchScrollLock',
  CopyText: 'CopyText',
  ReadOnly: 'ReadOnly',
};