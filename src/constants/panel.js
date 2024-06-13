export const panelMinWidth = 264;
export const RESIZE_BAR_WIDTH = 14;

/**
 * The different available pre-built panels options.
 * @name UI.Panels
 * @property {string} OUTLINE - Represents the OUTLINE panel.
 * @property {string} SIGNATURE - Represents the SIGNATURE panel.
 * @property {string} BOOKMARKS - Represents the BOOKMARKS panel.
 * @property {string} FILE_ATTACHMENT - Represents the FILE_ATTACHMENT panel.
 * @property {string} THUMBNAIL - Represents the THUMBNAIL panel.
 * @property {string} LAYERS - Represents the LAYERS panel.
 * @property {string} TEXT_EDITING - Represents the TEXT_EDITING panel.
 * @property {string} CHANGE_LIST - Represents the CHANGE_LIST panel.
 * @property {string} STYLE - Represents the STYLE panel.
 * @property {string} REDACTION - Represents the REDACTION panel.
 * @property {string} SEARCH - Represents the SEARCH panel.
 * @property {string} NOTES - Represents the NOTES panel.
 * @property {string} TABS - Represents the TABS panel.
 * @property {string} SIGNATURE_LIST - Represents the SIGNATURE_LIST panel.
 * @property {string} RUBBER_STAMP - Represents the RUBBER_STAMP panel.
 * @property {string} PORTFOLIO - Represents the PORTFOLIO panel.
 */

export const panelNames = {
  OUTLINE: 'outlinesPanel',
  SIGNATURE: 'signaturePanel',
  BOOKMARKS: 'bookmarksPanel',
  FILE_ATTACHMENT: 'fileAttachmentPanel',
  THUMBNAIL: 'thumbnailsPanel',
  LAYERS: 'layersPanel',
  TEXT_EDITING: 'textEditingPanel',
  CHANGE_LIST: 'changeListPanel',
  STYLE: 'stylePanel',
  REDACTION: 'redactionPanel',
  SEARCH: 'searchPanel',
  NOTES: 'notesPanel',
  TABS: 'tabPanel',
  SIGNATURE_LIST: 'signatureListPanel',
  RUBBER_STAMP: 'rubberStampPanel',
  PORTFOLIO: 'portfolioPanel',
};

export const panelData = {
  [panelNames.OUTLINE]: {
    icon: 'icon-panel-outlines',
    title: 'component.outlinesPanel',
  },
  [panelNames.SIGNATURE]: {
    icon: 'icon-tool-signature',
    title: 'component.signaturePanel',
  },
  [panelNames.BOOKMARKS]: {
    icon: 'ic_bookmarks_black_24px',
    title: 'component.bookmarksPanel',
  },
  [panelNames.FILE_ATTACHMENT]: {
    icon: 'ic_fileattachment_24px',
    title: 'component.attachmentPanel',
  },
  [panelNames.THUMBNAIL]: {
    icon: 'icon-panel-thumbnail-line',
    title: 'component.thumbnailsPanel',
  },
  [panelNames.LAYERS]: {
    icon: 'ic_layers_24px',
    title: 'component.layersPanel',
  },
  [panelNames.TEXT_EDITING]: {
    icon: 'icon-content-edit',
    title: 'action.contentEditMode',
  },
  [panelNames.CHANGE_LIST]: {
    icon: 'icon-header-compare',
    title: 'component.comparePanel',
  },
  [panelNames.STYLE]: {
    icon: 'icon-style-panel-toggle',
    title: 'action.style',
  },
  [panelNames.REDACTION]: {
    icon: 'icon-redact-panel',
    title: 'annotation.redact',
  },
  [panelNames.SEARCH]: {
    icon: 'icon-header-search',
    title: 'component.searchPanel',
  },
  [panelNames.NOTES]: {
    icon: 'icon-header-chat-line',
    title: 'component.notesPanel',
  },
  [panelNames.PORTFOLIO]: {
    icon: 'icon-pdf-portfolio',
    title: 'portfolio.portfolioPanelTitle',
  },
  [panelNames.SIGNATURE_LIST]: {
    icon: 'icon-tool-signature',
    title: 'signatureListPanel.header',
  },
  [panelNames.RUBBER_STAMP]: {
    icon: 'icon-tool-stamp-line',
    title: 'annotation.rubberStamp',
  },
};

export const PANEL_SIZES = {
  FULL_SIZE: 'full-size',
  HALF_SIZE: 'half-size',
  SMALL_SIZE: 'small-size',
};
