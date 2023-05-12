import actions from 'actions';

/**
 * @namespace UI.NotesPanel
 */

/**
 * Enables the collapsing of the annotation's text in the Notes Panel.
 *
 * @method UI.NotesPanel.enableTextCollapse
 *
 * @example
 * WebViewer(...).then(async function(instance) {
 *
 *   instance.UI.NotesPanel.enableTextCollapse()
 *
 * });
 */
const enableTextCollapse = (store) => () => {
  store.dispatch(actions.setNotesPanelTextCollapsing(true));
};

/**
 * Disables the collapsing of the annotation's text in the Notes Panel.
 *
 * @method UI.NotesPanel.disableTextCollapse
 *
 * @example
 * WebViewer(...).then(async function(instance) {
 *
 *   instance.UI.NotesPanel.disableTextCollapse()
 * });
 */
const disableTextCollapse = (store) => () => {
  store.dispatch(actions.setNotesPanelTextCollapsing(false));
};

/**
 * Enables the collapsing of the replies in the Notes Panel.
 *
 * @method UI.NotesPanel.enableReplyCollapse
 *
 * @example
 * WebViewer(...).then(async function(instance) {
 *
 *   instance.UI.NotesPanel.enableReplyCollapse()
 * });
 */
const enableReplyCollapse = (store) => () => {
  store.dispatch(actions.setNotesPanelRepliesCollapsing(true));
};

/**
 * Disables the collapsing of the replies in the Notes Panel.
 *
 * @method UI.NotesPanel.disableReplyCollapse
 *
 * @example
 * WebViewer(...).then(async function(instance) {
 *
 *   instance.UI.NotesPanel.disableReplyCollapse()
 * });
 */
const disableReplyCollapse = (store) => () => {
  store.dispatch(actions.setNotesPanelRepliesCollapsing(false));
};

/**
 * Disables the automatic expansion of all the comments threads in the Notes Panel.
 *
 * @method UI.NotesPanel.disableAutoExpandCommentThread
 *
 * @example
 * WebViewer(...).then(async function(instance) {
 *
 *   instance.UI.NotesPanel.disableAutoExpandCommentThread()
 * });
 */
const disableAutoExpandCommentThread = (store) => () => {
  store.dispatch(actions.setCommentThreadExpansion(false));
};

/**
 * Enables the automatic expansion of the comments threads in the Notes Panel.
 *
 * @method UI.NotesPanel.enableAutoExpandCommentThread
 *
 * @example
 * WebViewer(...).then(async function(instance) {
 *
 *   instance.UI.NotesPanel.enableAutoExpandCommentThread()
 * });
 */
const enableAutoExpandCommentThread = (store) => () => {
  store.dispatch(actions.setCommentThreadExpansion(true));
};

/**
 * Sets a custom header for the notes panel by overwriting or prepending to the default header.
 * @method UI.NotesPanel.setCustomHeader
 * @param {object} options
 * @param {boolean} [options.overwriteDefaultHeader=false] Replaces original notes panel header with content in render function.
 * @param {UI.NotesPanel.renderCustomHeader} options.render Callback function that returns custom elements to be prepended or to completely overwrite the default header. This function will receive the array of notes as an argument.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.NotesPanel.setCustomHeader({
      overwriteDefaultHeader: true,
      render: (notes) => {
        const div = document.createElement('div');

        const header = document.createElement('h2');
        header.innerHTML = 'Custom header goes here!';
        div.appendChild(header);

        const subheader = document.createElement('h3');
        subheader.innerHTML = `Number of notes: ${notes.length}`;
        div.appendChild(subheader);

        const button = document.createElement('button');
        button.innerHTML = 'Back to Issues';
        button.addEventListener('click', () => {
            alert('Clicked button!');
        });
        div.appendChild(button);

        return div;
      }
    });
  });
 */

/**
 * Callback used in {@link UI.NotesPanel.setCustomHeader setCustomHeader} and {@link UI.NotesPanel.setCustomEmptyPanel setCustomEmptyPanel}.
 * @callback UI.NotesPanel.renderCustomHeader
 * @param {Array} notes Array of notes displayed in the notes panel. Parameter not available in {@link UI.NotesPanel.setCustomEmptyPanel setCustomEmptyPanel} (since there are no notes).
 * @returns {HTMLElement} Custom header element.
 */
const setCustomHeader = (store) => (customHeader) => {
  store.dispatch(actions.setNotesPanelCustomHeader(customHeader));
};

/**
 * Sets either an icon and message, or custom content, in the Notes Panel when the panel is empty.
 * @method UI.NotesPanel.setCustomEmptyPanel
 * @param {object} options
 * @param {string} [options.message] Message displayed when panel is empty.
 * @param {string} [options.readOnlyMessage] Message displayed when panel is empty for a read-only document.
 * @param {string} [options.icon] Use inline SVG with this parameter. Default icon is used if nothing is specified.
 * @param {boolean} [options.hideIcon=false] Hides icon if true.
 * @param {UI.NotesPanel.renderCustomHeader} [options.render] Callback function that returns custom elements to render in empty notes panel. Overwrites all other properties if provided.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.NotesPanel.setCustomEmptyPanel({
      icon: '<svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><style>.cls-1{fill:#dfe2ed;}</style></defs><title>Artboard 1</title><path class="cls-1" d="M50,4.5H14A3.5,3.5,0,0,0,10.5,8V56A3.5,3.5,0,0,0,14,59.5H50A3.5,3.5,0,0,0,53.5,56V8A3.5,3.5,0,0,0,50,4.5ZM50.5,56a.5.5,0,0,1-.5.5H14a.5.5,0,0,1-.5-.5V8a.5.5,0,0,1,.5-.5H50a.5.5,0,0,1,.5.5Z"/><circle class="cls-1" cx="20.5" cy="32" r="2.5"/><circle class="cls-1" cx="20.5" cy="44.3" r="2.5"/><circle class="cls-1" cx="20.5" cy="19.7" r="2.5"/><rect class="cls-1" x="25.98" y="30.26" width="20.02" height="3.49"/><rect class="cls-1" x="25.98" y="42.55" width="20.02" height="3.49"/><polygon class="cls-1" points="25.98 17.96 25.98 21.45 46 21.45 46 17.96 44 17.96 25.98 17.96"/></svg>',
      message: 'Here is a custom message to show when the Notes Panel is empty.'
    });

    instance.UI.NotesPanel.setCustomEmptyPanel({
      hideIcon: false,
      readOnlyMessage: 'A different custom message if Notes Panel is empty and document is read-only.'
    });

    instance.UI.NotesPanel.setCustomEmptyPanel({
      render: () => {
        const div = document.createElement('div');
        const header = document.createElement('h2');
        header.innerHTML = 'Custom empty content goes here!';
        div.appendChild(header);
        return div;
      }
    });
  });
*/
const setCustomEmptyPanel = (store) => (options) => {
  store.dispatch(actions.setNotesPanelEmptyPanel(options));
};

/**
 * Enable the preview of attachments.
 * @method UI.NotesPanel.enableAttachmentPreview
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.NotesPanel.enableAttachmentPreview();
  });
 */
const enableAttachmentPreview = (store) => () => {
  store.dispatch(actions.setReplyAttachmentPreviewEnabled(true));
};

/**
 * Disable the preview of attachments.
 * @method UI.NotesPanel.disableAttachmentPreview
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.NotesPanel.disableAttachmentPreview();
  });
 */
const disableAttachmentPreview = (store) => () => {
  store.dispatch(actions.setReplyAttachmentPreviewEnabled(false));
};

/**
 * @callback UI.NotesPanel.attachmentHandler
 * @param {File} file The file selected to be uploaded
 * @returns {Promise<string>} A promise that resolves to a URL string pointing to the file saved on the cloud
 */

/**
 * Set the handler function for reply attachment. Can use this for uploading attachments to cloud.
 * @method UI.NotesPanel.setAttachmentHandler
 * @param {UI.NotesPanel.attachmentHandler} handler The handler function
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.NotesPanel.setAttachmentHandler(async (file) => {
      const uploadedURL = await aws.upload(file); //e.g. https://pdftron.s3.amazonaws.com/downloads/pl/demo.pdf

      return uploadedURL;
    });
  });
 */
const setAttachmentHandler = (store) => (attachmentHandler) => {
  store.dispatch(actions.setReplyAttachmentHandler(attachmentHandler));
};

export {
  enableTextCollapse,
  disableTextCollapse,
  enableReplyCollapse,
  disableReplyCollapse,
  disableAutoExpandCommentThread,
  enableAutoExpandCommentThread,
  setCustomHeader,
  setCustomEmptyPanel,
  enableAttachmentPreview,
  disableAttachmentPreview,
  setAttachmentHandler
};
