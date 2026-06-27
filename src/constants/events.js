/**
 * Contains string enums for WebViewer UI events.
 * @name UI.Events
 * @property {string} ANNOTATION_FILTER_CHANGED {@link UI#event:annotationFilterChanged UI.Events.annotationFilterChanged}
 * @property {string} DOCUMENT_MERGED {@link UI#event:documentMerged UI.Events.documentMerged}
 * @property {string} FILE_DOWNLOADED {@link UI#event:fileDownloaded UI.Events.fileDownloaded}
 * @property {string} LOAD_ERROR {@link UI#event:loaderror UI.Events.loaderror}
 * @property {string} DRAG_OUTLINE {@link UI#event:dragOutline UI.Events.dragOutline}
 * @property {string} DROP_OUTLINE {@link UI#event:dropOutline UI.Events.dropOutline}
 * @property {string} PANEL_RESIZED {@link UI#event:panelResized UI.Events.panelResized}
 * @property {string} THEME_CHANGED {@link UI#event:themeChanged UI.Events.themeChanged}
 * @property {string} TOOLBAR_GROUP_CHANGED {@link UI#event:toolbarGroupChanged UI.Events.toolbarGroupChanged}
 * @property {string} SELECTED_THUMBNAIL_CHANGED {@link UI#event:selectedThumbnailChanged UI.Events.selectedThumbnailChanged}
 * @property {string} THUMBNAIL_DRAGGED {@link UI#event:thumbnailDragged UI.Events.thumbnailDragged}
 * @property {string} THUMBNAIL_DROPPED {@link UI#event:thumbnailDropped UI.Events.thumbnailDropped}
 * @property {string} USER_BOOKMARKS_CHANGED {@link UI#event:userBookmarksChanged UI.Events.userBookmarksChanged}
 * @property {string} OUTLINE_BOOKMARKS_CHANGED {@link UI#event:outlineBookmarksChanged UI.Events.outlineBookmarksChanged}
 * @property {string} VIEWER_LOADED {@link UI#event:viewerLoaded UI.Events.viewerLoaded}
 * @property {string} VISIBILITY_CHANGED {@link UI#event:visibilityChanged UI.Events.visibilityChanged}
 * @property {string} FULLSCREEN_MODE_TOGGLED {@link UI#event:fullscreenModeToggled UI.Events.fullscreenModeToggled}
 * @property {string} BEFORE_TAB_CHANGED {@link UI#event:beforeTabChanged UI.Events.beforeTabChanged}
 * @property {string} AFTER_TAB_CHANGED {@link UI#event:afterTabChanged UI.Events.afterTabChanged}
 * @property {string} TAB_DELETED {@link UI#event:tabDeleted UI.Events.tabDeleted}
 * @property {string} BEFORE_TAB_DELETED {@link UI#event:beforeTabDeleted UI.Events.beforeTabDeleted}
 * @property {string} TAB_ADDED {@link UI#event:tabAdded UI.Events.tabAdded}
 * @property {string} TAB_MOVED {@link UI#event:tabMoved UI.Events.tabMoved}
 * @property {string} LANGUAGE_CHANGED {@link UI#event:languageChanged UI.Events.languageChanged}
 * @property {string} MULTI_VIEWER_READY {@link UI#event:multiViewerReady UI.Events.multiViewerReady}
 * @property {string} COMPARE_ANNOTATIONS_LOADED {@link UI#event:compareAnnotationsLoaded UI.Events.compareAnnotationsLoaded}
 * @property {string} TAB_MANAGER_READY {@link UI#event:onTabManagerReady UI.Events.onTabManagerReady}
 * @property {string} MODULAR_UI_IMPORTED {@link UI#event:modularUIImported UI.Events.modularUIImported}
 * @property {string} TOOLTIP_OPENED {@link UI#event:tooltipOpened UI.Events.tooltipOpened}
 * @property {string} ACTIVE_DOCUMENT_VIEWER_CHANGED {@link UI#event:activeDocumentViewerChanged UI.Events.activeDocumentViewerChanged}
 * @property {string} NOTE_AUTOSAVED {@link UI#event:noteAutosaved UI.Events.noteAutosaved}
 * @example
  WebViewer(...).then(function(instance) {
    const UIEvents = instance.UI.Events;
    instance.UI.addEventListener(UIEvents.ANNOTATION_FILTER_CHANGED, (types, authors, colors, statuses, checkRepliesForAuthorFilter) => {
      console.log(types, authors, colors, statuses);
    });
  });
 */

export default {
  'ANNOTATION_FILTER_CHANGED': 'annotationFilterChanged',
  'DOCUMENT_MERGED': 'documentMerged',
  'FILE_DOWNLOADED': 'fileDownloaded',
  'LOAD_ERROR': 'loaderror',
  'DRAG_OUTLINE': 'dragOutline',
  'DROP_OUTLINE': 'dropOutline',
  'PANEL_RESIZED': 'panelResized',
  'THEME_CHANGED': 'themeChanged',
  'TOOLBAR_GROUP_CHANGED': 'toolbarGroupChanged',
  'SELECTED_THUMBNAIL_CHANGED': 'selectedThumbnailChanged',
  'THUMBNAIL_DRAGGED': 'thumbnailDragged',
  'THUMBNAIL_DROPPED': 'thumbnailDropped',
  'USER_BOOKMARKS_CHANGED': 'userBookmarksChanged',
  'OUTLINE_BOOKMARKS_CHANGED': 'outlineBookmarksChanged',
  'VIEWER_LOADED': 'viewerLoaded',
  'VISIBILITY_CHANGED': 'visibilityChanged',
  'FULLSCREEN_MODE_TOGGLED': 'fullscreenModeToggled',
  'BEFORE_TAB_CHANGED': 'beforeTabChanged',
  'AFTER_TAB_CHANGED': 'afterTabChanged',
  'TAB_DELETED': 'tabDeleted',
  'BEFORE_TAB_DELETED': 'beforeTabDeleted',
  'TAB_ADDED': 'tabAdded',
  'TAB_MOVED': 'tabMoved',
  'LANGUAGE_CHANGED': 'languageChanged',
  'MULTI_VIEWER_READY': 'multiViewerReady',
  'COMPARE_ANNOTATIONS_LOADED': 'compareAnnotationsLoaded',
  'TAB_MANAGER_READY': 'onTabManagerReady',
  'MODULAR_UI_IMPORTED': 'modularUIImported',
  'TOOLTIP_OPENED': 'tooltipOpened',
  'ACTIVE_DOCUMENT_VIEWER_CHANGED': 'activeDocumentViewerChanged',
  'NOTE_AUTOSAVED': 'wv-note-autosaved'
};

/**
 * @typedef {object} UI.OutlineBookmarkData
 * @property {object} bookmark The changed bookmark.
 * @property {string} bookmark.id Changed outline bookmark id.
 * @property {string} bookmark.name Changed outline bookmark name.
 * @property {string} path Changed outline path in the outline tree.
 * @property {string} action The action that triggered the outline bookmarks change.
 */

/**
 * Triggered when annotation filter in the notes panel has changed.
 * Returns empty arrays if the filter is cleared.
 * @name UI#annotationFilterChanged
 * @event
 * @param {string[]} types Types filter.
 * @param {string[]} authors Author filter.
 * @param {string[]} colors Color filter.
 * @param {string[]} statuses Status filter.
 * @param {boolean} checkRepliesForAuthorFilter Whether replies are also checked when filtering by author.
 */

/**
* Triggered when a new document has been merged into the thumbnails panel.
* @name UI#documentMerged
* @event
* @param {string} filename File name.
* @param {number[]} pages Page numbers.
*/

/**
* Triggered when the file has finished downloading.
* @name UI#fileDownloaded
* @event
*/

/**
* Triggered when there is an error loading the document.
* @name UI#loaderror
* @event
* @param {object} err The error.
*/

/**
* Triggered when dragging Outline item.
* @name UI#dragOutline
* @event
*/

/**
* Triggered when dropping Outline item.
* @name UI#dropOutline
* @event
*/

/**
* Triggered when the panels are resized.
* @name UI#panelResized
* @event
* @param {string} element DataElement name.
* @param {number} width New panel width.
*/

/**
* Triggered when the UI theme has changed.
* @name UI#themeChanged
* @event
* @param {string} theme The new UI theme.
*/

/**
* Triggered when the toolbar group has changed.
* @name UI#toolbarGroupChanged
* @event
* @param {string} toolbarGroup The new toolbar group.
*/

/**
* Triggered when the selected thumbnail changed.
* @name UI#selectedThumbnailChanged
* @event
* @param {number[]} selectedThumbnailPageIndexes The array of indexes of currently selected thumbnails.
*/

/**
* Triggered when thumbnail(s) are dragged in the thumbnail panel.
* @name UI#thumbnailDragged
* @event
*/

/**
* Triggered when dragged thumbnail(s) are dropped to a new location in the thumbnail panel.
* @name UI#thumbnailDropped
* @event
* @param {number[]} pageNumbersBeforeMove The array of page numbers to be moved.
* @param {number[]} pageNumbersAfterMove The array of page numbers of where thumbnails are being dropped.
* @param {number} numberOfPagesMoved Number of pages being moved.
*/

/**
* Triggered when user bookmarks have changed.
* @name UI#userBookmarksChanged
* @event
* @param {Core.Bookmark[]} bookmarks The new bookmarks.
*/

/**
* Triggered when outline bookmarks have changed.
* @name UI#outlineBookmarksChanged
* @event
* @param {UI.OutlineBookmarkData} bookmarkData The bookmark data.
*/

/**
* Triggered when the viewer has loaded.
* @name UI#viewerLoaded
* @event
*/

/**
* Triggered when the visibility of an element has changed.
* @name UI#visibilityChanged
* @event
* @param {string} element The DataElement name.
* @param {boolean} isVisible The new visibility.
*/

/**
* Triggered when fullscreen mode is toggled.
* @name UI#fullscreenModeToggled
* @event
* @param {boolean} isInFullscreen Whether in fullscreen mode or not.
*/

/**
* Triggered before the UI switches tabs.
* @name UI#beforeTabChanged
* @event
* @param {object|null} currentTab An object containing the properties for the currently active tab (null if no currently active tab).
* @property {number} currentTab.id The id of the tab being switched to.
* @property {string} currentTab.src Source of current tab.
* @property {UI.loadDocumentOptions} currentTab.options Tab load options.
* @property {boolean} currentTab.annotationsChanged True if the annotations have been changed since loading the tab.
* @param {object} nextTab An object containing the properties for the tab being switched to.
* @property {number} nextTab.id The id of the tab being switched to.
* @property {string} nextTab.src Source of current tab.
* @property {UI.loadDocumentOptions} nextTab.options Tab load options.
*/

/**
 * Triggered after the UI switches tabs.
 * @name UI#afterTabChanged
 * @event
 * @param {object|null} currentTab An object containing the properties for the currently active tab (null if no currently active tab).
 * @property {number} currentTab.id The id of the tab being switched to.
 * @property {string} currentTab.src Source of current tab.
 * @property {UI.loadDocumentOptions} currentTab.options Tab load options.
 * @property {boolean} currentTab.annotationsChanged True if the annotations have been changed since loading the tab.
 */

/**
* Triggered when a Tab is deleted.
* @name UI#tabDeleted
* @event
* @param {number} id The id of the tab being deleted.
* @param {string} src Source of current tab.
* @param {UI.loadDocumentOptions} options Tab load options.
*/

/**
* Triggered before a Tab is deleted.
* @name UI#beforeTabDeleted
* @event
* @param {number} id The id of the tab being deleted.
* @param {string} src Source of current tab.
* @param {UI.loadDocumentOptions} options Tab load options.
*/

/**
* Triggered when a Tab is added.
* @name UI#tabAdded
* @event
* @param {number} id The id of the tab being added.
* @param {string} src Source of current tab.
* @param {UI.loadDocumentOptions} options Tab load options.
*/

/**
* Triggered when a Tab is moved.
* @name UI#tabMoved
* @event
* @param {number} id The id of the tab being moved.
* @param {string} src Source of moved tab.
* @param {UI.loadDocumentOptions} options Tab load options.
* @param {number} prevIndex Previous index of tab.
* @param {number} newIndex New index of tab.
*/

/**
* Triggered when the language changes in WebViewer via [setLanguage]{@link UI#setLanguage UI.setLanguage}.
* @name UI#languageChanged
* @event
* @param {string} prev The previous language.
* @param {string} next The new language that was just set.
*/

/**
* Triggered when MultiViewerMode is enabled and ready to be interacted with.
* @name UI#multiViewerReady
* @event
*/

/**
 * Triggered when the compare annotations are loaded.
 * @name UI#compareAnnotationsLoaded
 * @event
 * @param {object} annotMap Map of matched annotations grouped by page number.
 * @param {number} diffCount Number of detected differences.
 */

/**
 * Triggered when the Multi-Tab is ready and TabManager can be interacted with.
 * @name UI#onTabManagerReady
 * @event
 */

/**
 * Triggered when a Modular UI JSON configuration is imported.
 * @name UI#modularUIImported
 * @event
 * @param {UI.ModularComponentsData} importedComponents The imported modular components configuration that was passed to {@link UI.importModularComponents importModularComponents}.
 */

/**
 * Triggered when a tooltip is opened.
 * @name UI#tooltipOpened
 * @event
 */

/**
 * Triggered when the active document viewer changes in Multi-Viewer Mode.
 * @name UI#activeDocumentViewerChanged
 * @event
 * @param {number} activeDocumentViewerKey The key of the newly active document viewer.
 * @param {number} previousDocumentViewerKey The key of the previously active document viewer.
 */

/**
 * Triggered when a note is autosaved.
 * @name UI#noteAutosaved
 * @event
 * @property {string} annotationId The id of the annotation whose note was autosaved.
 */
