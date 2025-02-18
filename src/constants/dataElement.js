const DataElements = {
  LEGACY_RICH_TEXT_POPUP: 'legacyRichTextPopup',
  ANNOTATION_NOTE_CONNECTOR_LINE: 'annotationNoteConnectorLine',
  ANNOTATION_STYLE_POPUP: 'annotationStylePopup',
  ANNOTATION_STYLE_POPUP_BACK_BUTTON: 'annotationStylePopupBackButton',
  ANNOTATION_STYLE_POPUP_BACK_BUTTON_CONTAINER: 'annotationStylePopupBackButtonContainer',
  INLINE_COMMENT_POPUP_EXPAND_BUTTON: 'inlineCommentPopupExpandButton',
  INLINE_COMMENT_POPUP_CLOSE_BUTTON: 'inlineCommentPopupCloseButton',

  LOGO_BAR: 'logoBar',
  COLOR_PALETTE: 'colorPalette',
  OPACITY_SLIDER: 'opacitySlider',
  STROKE_THICKNESS_SLIDER: 'strokeThicknessSlider',
  FONT_SIZE_SLIDER: 'fontSizeSlider',
  STYLE_OPTION: 'styleOption',
  STYLE_POPUP: 'stylePopup',
  STYLE_PANEL: 'stylePanel',
  SIGNATURE_LIST_PANEL: 'signatureListPanel',
  RUBBER_STAMP_PANEL: 'rubberStampPanel',
  SCALE_INPUT_CONTAINER: 'scaleInputContainer',
  PRECISION_INPUT_CONTAINER: 'precisionInputContainer',
  STYLE_POPUP_TEXT_STYLE_CONTAINER: 'stylePopupTextStyleContainer',
  STYLE_POPUP_COLORS_CONTAINER: 'stylePopupColorsContainer',
  STYLE_POPUP_LABEL_TEXT_CONTAINER: 'stylePopupLabelTextContainer',
  REDACTION_PANEL: 'redactionPanel',
  REDACTION_PANEL_TOGGLE: 'redactionPanelToggle',
  REDACT_ALL_MARKED_BUTTON: 'redactAllMarkedButton',
  WV3D_PROPERTIES_PANEL: 'wv3dPropertiesPanel',
  WV3D_PROPERTIES_PANEL_TOGGLE: 'wv3dPropertiesPanelToggle',
  LEFT_PANEL: 'leftPanel',
  LEFT_PANEL_BUTTON: 'leftPanelButton',
  STROKE_STYLE_CONTAINER: 'strokeStyleContainer',
  FILL_COLOR_CONTAINER: 'fillColorContainer',
  OPACITY_CONTAINER: 'opacityContainer',
  OUTLINE_PANEL: 'outlinesPanel',
  OUTLINE_PANEL_BUTTON: 'outlinesPanelButton',
  OUTLINE_MULTI_SELECT: 'outlineMultiSelect',
  OUTLINE_CONTROLS: 'outlineControls',
  OUTLINE_ADD_NEW_BUTTON_CONTAINER: 'addNewOutlineButtonContainer',
  OUTLINE_ADD_NEW_BUTTON: 'addNewOutlineButton',
  OUTLINE_MOVE_UP_BUTTON: 'moveOutlineUpButton',
  OUTLINE_MOVE_DOWN_BUTTON: 'moveOutlineDownButton',
  OUTLINE_MOVE_OUTWARD_BUTTON: 'moveOutlineOutwardButton',
  OUTLINE_MOVE_INWARD_BUTTON: 'moveOutlineInwardButton',
  BOOKMARK_PANEL: 'bookmarksPanel',
  BOOKMARK_MULTI_SELECT: 'bookmarkMultiSelect',
  BOOKMARK_SHORTCUT_OPTION: 'bookmarkShortcutOption',
  BOOKMARK_ADD_NEW_BUTTON_CONTAINER: 'addNewBookmarkButtonContainer',
  BOOKMARK_ADD_NEW_BUTTON: 'addNewBookmarkButton',
  NOTES_PANEL: 'notesPanel',
  INDEX_PANEL: 'indexPanel',
  FORM_FIELD_INDICATOR_CONTAINER: 'formFieldIndicatorContainer',
  FORM_FIELD_PANEL: 'formFieldPanel',
  WATERMARK_PANEL: 'watermarkPanel',
  WATERMARK_PANEL_TOGGLE: 'watermarkPanelToggle',
  WATERMARK_PANEL_IMAGE_TAB: 'watermarkPanelImageTab',
  WATERMARK_PANEL_TEXT_TAB: 'watermarkPanelTextTab',
  SEARCH_PANEL: 'searchPanel',
  TEXT_EDITING_PANEL: 'textEditingPanel',
  COMPARE_PANEL: 'comparePanel',
  PORTFOLIO_PANEL: 'portfolioPanel',
  PORTFOLIO_PANEL_BUTTON: 'portfolioPanelButton',
  LAYERS_PANEL: 'layersPanel',
  SIGNATURE_PANEL: 'signaturePanel',
  ATTACHMENT_PANEL: 'attachmentPanel',
  MOBILE_PANEL_WRAPPER: 'MobilePanelWrapper',
  PORTFOLIO_ADD_FILE: 'portfolioAddFile',
  PORTFOLIO_ADD_FOLDER: 'portfolioAddFolder',
  PORTFOLIO_ADD_NEW_BUTTON: 'portfolioAddNewButton',
  RICH_TEXT_STYLE_CONTAINER: 'richTextStyleContainer',
  CALIBRATION_POPUP_BUTTON: 'calibratePopupButton',
  CALIBRATION_MODAL: 'calibrationModal',
  PAGE_NAV_FLOATING_HEADER: 'page-nav-floating-header',
  TABS_LIST_MENU: 'tabsListMenu',
  ADDITIONAL_SHEET_TABS_MENU: 'additionalSheetTabsMenu',

  NotesPanel: {
    DefaultHeader: {
      INPUT_CONTAINER: 'notesPanelHeader-inputContainer',
      COMMENTS_COUNTER: 'notesPanelHeader-commentsCounter',
      SORT_ROW: 'notesPanelHeader-sortRow',
      FILTER_ANNOTATION_BUTTON: 'filterAnnotationButton'
    },
    ADD_REPLY_ATTACHMENT_BUTTON: 'addReplyAttachmentButton'
  },
  MULTITABS_EMPTY_PAGE: 'multiTabsEmptyPage',

  // Overlays
  SCALE_OVERLAY_CONTAINER: 'scaleOverlayContainer',
  MEASUREMENT_OVERLAY: 'measurementOverlay',
  VIEW_CONTROLS_OVERLAY: 'viewControlsOverlay',
  VIEW_CONTROLS_OVERLAY_BUTTON: 'viewControlsButton',
  SEARCH_OVERLAY: 'searchOverlay',
  MENU_OVERLAY: 'menuOverlay',
  MENU_OVERLAY_BUTTON: 'menuButton',
  ZOOM_OVERLAY: 'zoomOverlay',
  ZOOM_OVERLAY_BUTTON: 'zoomOverlayButton',
  TRACK_CHANGE_OVERLAY_BUTTON: 'trackChangeOverlayButton',
  PAGE_MANIPULATION_OVERLAY: 'pageManipulationOverlay',
  PAGE_MANIPULATION_OVERLAY_BUTTON: 'pageManipulationOverlayButton',
  TOOLS_OVERLAY: 'toolsOverlay',
  STAMP_OVERLAY: 'stampOverlay',
  SIGNATURE_OVERLAY: 'signatureOverlay',
  REDACTION_OVERLAY: 'redactionOverlay',
  ANNOTATION_CONTENT_OVERLAY: 'annotationContentOverlay',
  THUMBNAILS_PANEL: 'thumbnailsPanel',
  THUMBNAILS_CONTROL_ROTATE_POPUP_TRIGGER: 'thumbnailsControlRotatePopupTrigger',
  THUMBNAILS_CONTROL_MANIPULATE_POPUP: 'thumbnailsControlManipulatePopup',
  THUMBNAILS_CONTROL_MANIPULATE_POPUP_TRIGGER: 'thumbnailsControlManipulatePopupTrigger',
  THUMBNAILS_CONTROL_MANIPULATE_POPUP_SMALL: 'thumbnailsControlManipulatePopupSmall',
  THUMBNAILS_CONTROL_MANIPULATE_POPUP_SMALL_TRIGGER: 'thumbnailsControlManipulatePopupSmallTrigger',

  // Stamps overlay
  RUBBER_STAMP_TAB_HEADER: 'rubberStampTabHeader',
  STANDARD_STAMPS_PANEL_BUTTON: 'standardStampPanelButton',
  CUSTOM_STAMPS_PANEL_BUTTON: 'customStampPanelButton',
  STANDARD_STAMPS_PANEL: 'standardStampPanel',
  CUSTOM_STAMPS_PANEL: 'customStampPanel',
  CREATE_CUSTOM_STAMP_BUTTON: 'createCustomStampButton',
  DELETE_CUSTOM_STAMP_BUTTON: 'deleteCustomStampButton',

  // Popups
  ANNOTATION_POPUP: 'annotationPopup',
  FORM_FIELD_EDIT_POPUP: 'formFieldEditPopup',
  TEXT_POPUP: 'textPopup',
  CONTEXT_MENU_POPUP: 'contextMenuPopup',
  INLINE_COMMENT_POPUP: 'inlineCommentPopup',
  TOOL_STYLE_POPUP: 'toolStylePopup',
  RICH_TEXT_POPUP: 'richTextPopup',
  RICH_TEXT_EDITOR: 'richTextEditor',
  AUDIO_PLAYBACK_POPUP: 'audioPlaybackPopup',
  ANNOTATION_ALIGNMENT_POPUP: 'annotationAlignmentPopup',
  DOCUMENT_CROP_POPUP: 'documentCropPopup',
  SNIPPING_TOOL_POPUP: 'snippingToolPopup',
  LINK_ANNOTATION_POPUP: 'linkAnnotationPopup',
  LINK_ANNOTATION_UNLINK_BUTTON: 'linkAnnotationUnlinkButton',
  LINK_URI: 'linkUri',
  EMBEDDED_JS_POPUP: 'embeddedJsPopup',
  MAIN_MENU: 'MainMenuFlyout',
  VIEW_CONTROLS_FLYOUT: 'viewControlsFlyout',
  PAGE_CONTROLS_FLYOUT: 'pageControlsFlyout',
  NOTE_STATE_FLYOUT: 'noteStateFlyout',
  NOTE_POPUP_FLYOUT: 'notePopupFlyout',
  SHEET_TAB_OPTIONS_FLYOUT: 'sheetTabOptionsFlyout',
  BOOKMARK_OUTLINE_FLYOUT: 'bookmarkOutlineFlyout',
  BOOKMARK_FLYOUT: 'bookmarkFlyout',
  LINE_SPACING_FLYOUT: 'lineSpacingFlyout',
  PAGE_MANIPULATION: 'pageManipulationFlyout',
  PAGE_MANIPULATION_FLYOUT_MULTI_SELECT: 'pageManipulationFlyoutMultiSelect',

  // Modals
  PAGE_REDACT_MODAL: 'pageRedactionModal',
  LINK_MODAL: 'linkModal',
  LANGUAGE_MODAL: 'languageModal',
  FILTER_MODAL: 'filterModal',
  CONTENT_EDIT_LINK_MODAL: 'contentEditLinkModal',
  SCALE_MODAL: 'scaleModal',
  INSERT_PAGE_MODAL: 'insertPageModal',
  SETTINGS_MODAL: 'settingsModal',
  SAVE_MODAL: 'saveModal',
  PRINT_MODAL: 'printModal',
  SIGNATURE_MODAL: 'signatureModal',
  SIGNATURE_VALIDATION_MODAL: 'signatureValidationModal',
  ERROR_MODAL: 'errorModal',
  PASSWORD_MODAL: 'passwordModal',
  CUSTOM_STAMP_MODAL: 'customStampModal',
  PAGE_REPLACEMENT_MODAL: 'pageReplacementModal',
  LOADING_MODAL: 'loadingModal',
  PROGRESS_MODAL: 'progressModal',
  WARNING_MODAL: 'warningModal',
  MODEL3D_MODAL: 'Model3DModal',
  COLOR_PICKER_MODAL: 'ColorPickerModal',
  OPEN_FILE_MODAL: 'OpenFileModal',
  CUSTOM_MODAL: 'customModal',
  CREATE_PORTFOLIO_MODAL: 'createPortfolioModal',
  HEADER_FOOTER_OPTIONS_MODAL: 'headerFooterOptionsModal',

  // Filter modal
  ANNOTATION_USER_FILTER_PANEL_BUTTON: 'annotationUserFilterPanelButton',
  ANNOTATION_COLOR_FILTER_PANEL_BUTTON: 'annotationColorFilterPanelButton',
  ANNOTATION_TYPE_FILTER_PANEL_BUTTON: 'annotationTypeFilterPanelButton',
  ANNOTATION_STATUS_FILTER_PANEL_BUTTON: 'annotationStatusFilterPanelButton',

  // Settings modal
  SETTINGS_GENERAL_BUTTON: 'settingsGeneralButton',
  SETTINGS_KEYBOARD_BUTTON: 'settingsKeyboardButton',
  SETTINGS_ADVANCED_BUTTON: 'settingsAdvancedButton',
  SETTINGS_LANGUAGE_SECTION: 'settingsLanguageSection',
  SETTINGS_LANGUAGE_DROPDOWN: 'settingsLanguageDropdown',
  SETTINGS_THEME_SECTION: 'settingsThemeSection',

  // Create portfolio modal
  PORTFOLIO_UPLOAD_FILES_TAB: 'portfolioUploadFilesTab',
  PORTFOLIO_UPLOAD_FOLDER_TAB: 'portfolioUploadFolderTab',
  PORTFOLIO_MODAL_ADD_ITEM_TRIGGER: 'portfolioModalAddItemTrigger',

  // Signature Modal
  SAVED_SIGNATURES_TAB: 'signatureModalSavedSignaturesTab',
  SIGNATURE_ADD_BUTTON: 'signatureAddButton',

  // Notes panel - multi select
  NOTE_MULTI_SELECT_MODE_BUTTON: 'multiSelectModeButton',
  NOTE_MULTI_REPLY_BUTTON: 'multiReplyButton',
  NOTE_MULTI_STATE_BUTTON: 'multiStateButton',
  NOTE_MULTI_STYLE_BUTTON: 'multiStyleButton',
  NOTE_MULTI_GROUP_BUTTON: 'multiGroupButton',
  NOTE_MULTI_UNGROUP_BUTTON: 'multiUngroupButton',
  NOTE_MULTI_DELETE_BUTTON: 'multiDeleteButton',

  // Saved Signatures overlay
  SAVED_SIGNATURES_PANEL_BUTTON: 'savedFullSignaturePanelButton',
  SAVED_INTIALS_PANEL_BUTTON: 'savedInitialsPanelButton',
  SAVED_FULL_SIGNATURES_PANEL: 'savedFullSignaturePanel',
  SAVED_INITIALS_PANEL: 'savedInitialsPanel',

  // MultiViewer Mode (MultiViewer)
  MULTI_VIEWER_SAVE_DOCUMENT_BUTTON: 'multiViewerSaveDocumentButton',
  // Sheet Editor
  SPREADSHEET_EDITOR_TOOLS_HEADER: 'spreadsheetEditorToolsHeader',

  // Office Editor
  OFFICE_EDITOR_TOOLS_HEADER: 'officeEditorToolsHeader',
  OFFICE_EDITOR_TOOLS_HEADER_INSERT_IMAGE: 'officeEditorToolsHeaderInsertImage',
  OFFICE_EDITOR_TOOLS_HEADER_INSERT_TABLE: 'officeEditorToolsHeaderInsertTable',
  OFFICE_EDITOR_TOOLS_HEADER_INSERT_TABLE_BUTTON: 'officeEditorToolsHeaderInsertTableButton',
  OFFICE_EDITOR_FILE_NAME: 'officeEditorFileName',
  OFFICE_EDITOR_CUT: 'officeEditorCut',
  OFFICE_EDITOR_COPY: 'officeEditorCopy',
  OFFICE_EDITOR_PASTE: 'officeEditorPaste',
  OFFICE_EDITOR_PASTE_WITHOUT_FORMATTING: 'officeEditorPasteWithoutFormatting',
  OFFICE_EDITOR_DELETE: 'officeEditorDelete',
  OFFICE_EDITOR_INSERT_ROW_ABOVE: 'officeEditorInsertRowAbove',
  OFFICE_EDITOR_INSERT_ROW_BELOW: 'officeEditorInsertRowBelow',
  OFFICE_EDITOR_INSERT_COLUMN_RIGHT: 'officeEditorInsertColumnRight',
  OFFICE_EDITOR_INSERT_COLUMN_LEFT: 'officeEditorInsertColumnLeft',
  OFFICE_EDITOR_DELETE_ROW: 'officeEditorDeleteRow',
  OFFICE_EDITOR_DELETE_COLUMN: 'officeEditorDeleteColumn',
  OFFICE_EDITOR_DELETE_TABLE: 'officeEditorDeleteTable',
  OFFICE_EDITOR_BREAK_DROPDOWN_TOGGLE: 'officeEditorBreakDropdownToggle',
  OFFICE_EDITOR_BREAK_DROPDOWN: 'officeEditorBreakDropdown',
  OFFICE_EDITOR_PAGE_BREAK: 'officeEditorPageBreak',
  OFFICE_EDITOR_FLYOUT_COLOR_PICKER: 'officeEditorColorPicker',
  OFFICE_EDITOR_COLOR_PICKER_OVERLAY: 'officeEditorColorPickerOverlay',
  OFFICE_EDITOR_TEXT_COLOR_BUTTON: 'textColorButton',
  OFFICE_EDITOR_REVIEW_PANEL: 'officeEditorReviewPanel',
  HEADER_FOOTER_CONTROLS_OVERLAY: 'headerFooterControlsOverlay',

  // Insert Page Modal tabs
  INSERT_BLANK_PAGE_TAB: 'insertBlankPagePanelButton',
  INSERT_FROM_FILE_TAB: 'insertUploadedPagePanelButton',
  INSERT_BLANK_PAGE_PANEL: 'insertBlankPagePanel',
  INSERT_FROM_FILE_PANEL: 'insertUploadedPagePanel',

  // Toolbar groups/Ribbons
  VIEW_TOOLBAR_GROUP: 'toolbarGroup-View',
  ANNOTATE_TOOLBAR_GROUP: 'toolbarGroup-Annotate',
  SHAPES_TOOLBAR_GROUP: 'toolbarGroup-Shapes',
  REDACT_TOOLBAR_GROUP: 'toolbarGroup-Redact',
  INSERT_TOOLBAR_GROUP: 'toolbarGroup-Insert',
  MEASURE_TOOLBAR_GROUP: 'toolbarGroup-Measure',
  EDIT_TOOLBAR_GROUP: 'toolbarGroup-Edit',
  EDIT_TEXT_TOOLBAR_GROUP: 'toolbarGroup-EditText',
  FILL_AND_SIGN_TOOLBAR_GROUP: 'toolbarGroup-FillAndSign',
  FORMS_TOOLBAR_GROUP: 'toolbarGroup-Forms',

  TOOLBAR_GROUPS: [],

  // Print modal
  PRINT_QUALITY: 'printQuality',
  PRINT_WATERMARK: 'printWatermark',

  // Menu overlay items
  CREATE_PORTFOLIO_BUTTON: 'createPortfolioButton',
  NEW_DOCUMENT_BUTTON: 'newDocumentButton',
  FILE_PICKER_BUTTON: 'filePickerButton',
  DOWNLOAD_BUTTON: 'downloadButton',
  SAVE_AS_BUTTON: 'saveAsButton',
  PRINT_BUTTON: 'printButton',
  FULLSCREEN_BUTTON: 'fullscreenButton',
  SETTINGS_BUTTON: 'settingsButton',

  // Preset Buttons
  UNDO_PRESET_BUTTON: 'undoButton',
  REDO_PRESET_BUTTON: 'redoButton',
  NEW_DOCUMENT_PRESET_BUTTON: 'newDocumentPresetButton',
  FILE_PICKER_PRESET_BUTTON: 'filePickerPresetButton',
  DOWNLOAD_PRESET_BUTTON: 'downloadPresetButton',
  FULLSCREEN_PRESET_BUTTON: 'fullscreenPresetButton',
  SAVE_AS_PRESET_BUTTON: 'saveAsPresetButton',
  PRINT_PRESET_BUTTON: 'printPresetButton',
  CREATE_PORTFOLIO_PRESET_BUTTON: 'createPortfolioPresetButton',
  SETTINGS_PRESET_BUTTON: 'settingsPresetButton',
  FORM_FIELD_EDIT_PRESET_BUTTON: 'formFieldEditPresetButton',
  CONTENT_EDIT_PRESET_BUTTON: 'contentEditPresetButton',
  TOGGLE_ACCESSIBILITY_MODE_PRESET_BUTTON: 'toggleAccessibilityModePresetButton',
  BOLD_PRESET_BUTTON: 'boldPresetButton',
  ITALIC_PRESET_BUTTON: 'italicPresetButton',
  UNDERLINE_PRESET_BUTTON: 'underlinePresetButton',
  INCREASE_INDENT_PRESET_BUTTON: 'increaseIndentPresetButton',
  DECREASE_INDENT_PRESET_BUTTON: 'decreaseIndentPresetButton',
  OFFICE_EDITOR_TOGGLE_NON_PRINTING_CHARACTERS_BUTTON: 'officeEditorToggleNonPrintingCharactersButton',
  JUSTIFY_LEFT_PRESET_BUTTON: 'justifyLeftPresetButton',
  JUSTIFY_CENTER_PRESET_BUTTON: 'justifyCenterPresetButton',
  JUSTIFY_RIGHT_PRESET_BUTTON: 'justifyRightPresetButton',
  JUSTIFY_BOTH_PRESET_BUTTON: 'justifyBothPresetButton',
  OFFICE_EDITOR_COLOR_PICKER_PRESET_BUTTON: 'officeEditorColorPickerPresetButton',
  NEW_SPREADSHEET_PRESET_BUTTON: 'newSpreadsheetPresetButton',

  STRIKETHROUGH_PRESET_BUTTON: 'strikethroughPresetButton',

  CELL_TEXT_COLOR_BUTTON: 'cellTextColorButton',
  CELL_BG_COLOR_BUTTON: 'cellBackgroundColorButton',


  // Cell Border Style
  BORDER_STYLE_BUTTON: 'cellBorderStyleButton',

  MERGE_TOGGLE_BUTTON: 'mergeToggleButton',
  UNMERGE_TOGGLE_BUTTON: 'unmergeToggleButton',

  // Cell Formats
  CELL_FORMAT_CURRENCY_BUTTON: 'cellFormatAsCurrencyButton',
  CELL_FORMAT_PERCENT_BUTTON: 'cellFormatAsPercentButton',
  CELL_FORMAT_DEC_DECIMAL_BUTTON: 'cellFormatAsDecDecimalButton',
  CELL_FORMAT_INC_DECIMAL_BUTTON: 'cellFormatAsIncDecimalButton',
  CELL_FORMAT_MORE_BUTTON: 'formatMore',
  CELL_FORMAT_MORE_FLYOUT: 'cellFormatMoreFlyout',

  CELL_COPY_BUTTON: 'cellCopyButton',
  CELL_CUT_BUTTON: 'cellCutButton',
  CELL_PASTE_BUTTON: 'cellPasteButton',

  // Text Alignment
  CELL_TEXT_ALIGNMENT_BUTTON: 'cellTextAlignmentButton',
  CELL_TEXT_ALIGN_LEFT_BUTTON: 'cellTextAlignLeftButton',
  CELL_TEXT_ALIGN_CENTER_BUTTON: 'cellTextAlignCenterButton',
  CELL_TEXT_ALIGN_RIGHT_BUTTON: 'cellTextAlignRightButton',
  CELL_TEXT_ALIGN_TOP_BUTTON: 'cellTextAlignTopButton',
  CELL_TEXT_ALIGN_MIDDLE_BUTTON: 'cellTextAlignMiddleButton',
  CELL_TEXT_ALIGN_BOTTOM_BUTTON: 'cellTextAlignBottomButton',
  CELL_TEXT_ALIGNMENT_FLYOUT: 'cellTextAlignmentFlyout',

  // Cell Adjustment
  CELL_ADJUSTMENT_BUTTON: 'cellAdjustmentButton',
  CELL_ADJUSTMENT_FLYOUT: 'cellAdjustmentFlyout ',
  ABJ_INCERT_COL_LEFT: 'adjustmentIncertColLeft ',

  // Rubber Stamp Panel
  CREATE_RUBBER_STAMP_BUTTON_WRAP: 'createRubberStampButtonWrap',
  CREATE_RUBBER_STAMP_BUTTON: 'createRubberStampButton',

  PREVIOUS_PAGE_BUTTON: 'previousPageButton',
  NEXT_PAGE_BUTTON: 'nextPageButton',

  // Sheets Editor
  FORMULA_BAR: 'formulaBar',
};

DataElements.TOOLBAR_GROUPS = [
  DataElements.VIEW_TOOLBAR_GROUP,
  DataElements.ANNOTATE_TOOLBAR_GROUP,
  DataElements.SHAPES_TOOLBAR_GROUP,
  DataElements.REDACT_TOOLBAR_GROUP,
  DataElements.INSERT_TOOLBAR_GROUP,
  DataElements.MEASURE_TOOLBAR_GROUP,
  DataElements.EDIT_TOOLBAR_GROUP,
  DataElements.EDIT_TEXT_TOOLBAR_GROUP,
  DataElements.FILL_AND_SIGN_TOOLBAR_GROUP,
  DataElements.FORMS_TOOLBAR_GROUP,
];

export default DataElements;
