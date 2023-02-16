import actions from 'actions';

/**
 * Add custom modal element to WebViewer.
 * <br /><br />
 * Controlling custom modals is done using the element API, for example {@link UI.openElements openElements}, {@link UI.closeElements closeElements}, {@link UI.toggleElement toggleElement}, and {@link UI.disableElements disableElements}.
 * dateElement string passed on these function should be same as you set in options.dataElement.
 * <br /><br />
 * Every custom modal will add new &lt;div&gt; element with <b>CustomModal</b> and <b>&lt;options.dataElement string&gt;</b> set as class attribute
 * Modal with identical <em>options.dataElement</em> will get replaced by the latest modal options.
 * <br /><br />
 * For styling these components, see <a href="https://www.pdftron.com/documentation/web/guides/customizing-styles/" target="_blank">Customizing WebViewer UI Styles</a>
 *<br /><br />
 * Note that in most cases WebViewer is run inside an iframe and in order for <i>options.disableEscapeKeyDown</i> to automatically work, the iframe must be the
 * active element. This can be done by setting the focus to the iframe programmatically.
 *
 * @example
   WebViewer(...).then(function(instance) {
    const modal = {
      dataElement: 'meanwhileInFinlandModal',
      header: {
        title: 'Modal header',
        className: 'myCustomModal-header',
        style: {}, // optional inline styles
        children: []
      },
      body: {
        className: 'myCustomModal-body',
        style: {}, // optional inline styles
        children: [  divInput1, divInput2 ], // HTML dom elements
      },
      footer: {
        className: 'myCustomModal-footer footer',
        style: {}, // optional inline styles
        children: [
          {
            title: 'Cancel',
            button: true,
            style: {},
            className: 'modal-button cancel-form-field-button',
            onClick: (e) => { console.log('ff') }
          },
          {
            title: 'OK',
            button: true,
            style: {},
            className: 'modal-button confirm ok-btn',
            onClick: (e) => { console.log('xx') }
          },
        ]
      }
    };
    instance.UI.addCustomModal(modal);
    instance.UI.openElements([modal.dataElement]);
  });
 * @method UI.addCustomModal
 * @param {object} options
 * @param {string} options.dataElement Unique name of custom modal.
 * @param {boolean} [options.disableBackdropClick=false] Disable closing modal when user clicks outside of content area
 * @param {boolean} [options.disableEscapeKeyDown=false] Disable closing modal when user hit escape from keyboard
 * @param {UI.renderCustomModal} options.render Function rendering custom model contents, this is optional
 * @param {object} options.header JSON object with title, className, style and children parameter
 * @param {object} options.body JSON object with title, className, style and children parameter
 * @param {object} options.footer JSON object with title, className, style and children parameter
 */
const addCustomModal = (store) => (customModal) => {
  store.dispatch(actions.addCustomModal(customModal));
};

/**
 * @deprecated since version 8.5. Use [addCustomModal]{@link UI.addCustomModal} instead
 * @method UI.setCustomModal
 * @param {object} options
 * @param {string} options.dataElement Unique name of custom modal.
 * @param {boolean} [options.disableBackdropClick=false] Disable closing modal when user clicks outside of content area
 * @param {boolean} [options.disableEscapeKeyDown=false] Disable closing modal when user hit escape from keyboard
 * @param {UI.renderCustomModal} options.render Function rendering custom model contents
 */
const setCustomModal = (store) => (customModal) => {
  console.warn('\'setCustomModal\' deprecated since version 8.5. Please use UI.addCustomModal instead');
  addCustomModal(store)(customModal);
};

/**
 * Callback that gets passed to `options.render` in {@link UI.addCustomModal addCustomModal}.
 * @callback UI.renderCustomModal
 * @returns {(HTMLElement|string)} Modal element. If string is returned, it will be displayed as is inside the modal. Accepts React components as the return value as well.
 */

export {
  setCustomModal,
  addCustomModal as default
};
