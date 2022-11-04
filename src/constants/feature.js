/**
 * Contains string enums for all features for WebViewer UI
 * @name UI.Feature
 * @property {string} Measurement Measurement tools that can create annotations to measure distance, perimeter and area.
 * @property {string} Ribbons A collection of toolbar groups to switch between.
 * @property {string} Annotations Render annotations in the document and be able to edit them.
 * @property {string} Download A download button to download the current document.
 * @property {string} FilePicker Ctrl/Cmd + O hotkey and a open file button that can be clicked to load local files.
 * @property {string} LocalStorage Store and retrieve tool styles from window.localStorage.
 * @property {string} NotesPanel A panel that displays information of listable annotations.
 * @property {string} Print Ctrl/Cmd + P hotkey and a print button that can be clicked to print the current document.
 * @property {string} Redaction Redaction tools that can redact text or areas. Need fullAPI to be on to use this feature.
 * @property {string} TextSelection Ability to select text in a document.
 * @property {string} TouchScrollLock Lock document scrolling in one direction in mobile devices.
 * @property {string} Copy Ability to copy text or annotations use Ctrl/Cmd + C hotkeys or the copy button.
 * @property {string} MultipleViewerMerging Ability to drag and drop pages from one instance of WebViewer into another
 * @property {string} ThumbnailMerging Ability to drag and drop a file into the thumbnail panel to merge
 * @property {string} ThumbnailReordering Ability to reorder pages using the thumbnail panel
 * @property {string} PageNavigation Ability to navigate through pages using mouse wheel, arrow up/down keys and the swipe gesture.
 * @property {string} MouseWheelZoom Ability to zoom when holding ctrl/cmd + mouse wheel.
 * @property {string} Search Ctrl/Cmd + F hotkey and a search button that can be clicked to search the current document.
 * @property {string} MathSymbols Ability to add math symbols in free text editor
 * @property {string} OutlineEditing Ability to add, move and delete outlines in the outlines panel. This feature is only available when `fullAPI: true` is used.
 * @property {string} NotesPanelVirtualizedList Ability to use a virtualized list in the note panel. Will limit the number of notes rendered on the DOM
 * @property {string} NotesShowLastUpdatedDate Show last updated date in notes panel instead of created date
 * @property {string} MultiTab toggle feature to open multiple documents in the same viewer instance
 * @property {string} MultiViewerMode toggle feature to activate 2 viewers in Compare Mode.
 * @property {string} Initials toggle feature to activate initials signing mode in the Signature Modal
 * @property {string} SavedSignaturesTab toggle feature to enable the saved signatures tab in the Signature Modal and use it to sign elements.
 * @example
WebViewer(...)
  .then(function(instance) {
    var Feature = instance.UI.Feature;
    instance.UI.enableFeatures([Feature.Measurement]);
    instance.UI.disableFeatures([Feature.Copy]);
  });
 */

export default {
  Measurement: 'Measurement',
  Ribbons: 'Ribbons',
  Annotations: 'Annotations',
  Download: 'Download',
  FilePicker: 'FilePicker',
  LocalStorage: 'LocalStorage',
  NotesPanel: 'NotesPanel',
  Print: 'Print',
  Redaction: 'Redaction',
  TextSelection: 'TextSelection',
  TouchScrollLock: 'TouchScrollLock',
  Copy: 'Copy',
  MultipleViewerMerging: 'MultipleViewerMerging',
  ThumbnailMerging: 'ThumbnailMerging',
  ThumbnailReordering: 'ThumbnailReordering',
  ThumbnailMultiselect: 'ThumbnailMultiselect',
  PageNavigation: 'PageNavigation',
  MouseWheelZoom: 'MouseWheelZoom',
  Search: 'Search',
  MathSymbols: 'MathSymbols',
  OutlineEditing: 'OutlineEditing',
  NotesPanelVirtualizedList: 'NotesPanelVirtualizedList',
  NotesShowLastUpdatedDate: 'NotesShowLastUpdatedDate',
  MultiTab: 'MultiTab',
  ChangeView: 'ChangeView',
  ContentEdit: 'ContentEdit',
  MultiViewerMode: 'MultiViewerMode',
  Initials: 'Initials',
  SavedSignaturesTab: 'SavedSignaturesTab'
};
