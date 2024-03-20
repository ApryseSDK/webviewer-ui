export const panelMinWidth = 264;
export const RESIZE_BAR_WIDTH = 14;

export const panelNames = {
  OUTLINE: 'genericOutlinesPanel',
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
  [panelNames.SIGNATURE_LIST]: {
    icon: 'icon-tool-signature',
    title: 'signatureListPanel.header',
  },
  [panelNames.RUBBER_STAMP]: {
    icon: 'icon-tool-stamp-line',
    title: 'annotation.rubberStamp',
  },
};
