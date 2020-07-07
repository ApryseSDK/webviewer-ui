import actions from 'actions';

function generateSetCustomModal(store) {

  /**
   * Add custom modal element to WebViewer.
   * <br /><br />
   * Controlling custom modals is done using element API for example {@link WebViewerInstance#openElements openElements}, {@link WebViewerInstance#closeElements closeElements}, {@link WebViewerInstance#toggleElement toggleElement}, and {@link WebViewerInstance#disableElements disableElements}.
   * dateElement string passed on these function should be same as you set in options.dataElement.
   * <br /><br />
   * Every custom modal will add new &lt;div&gt; element with <b>CustomModal</b> and <b>&lt;options.dataElement string&gt;</b> set as class attribute
   * Modal with identical <em>options.dataElement</em> will get replaced by the latest modal options.
   * <br /><br />
   * For styling these components, see <a href="https://www.pdftron.com/documentation/web/guides/customizing-styles/" target="_blank">Customizing WebViewer UI Styles</a>
   *
   * @example
WebWiewer(...).then(function(instance) {
  var modal = {
    dataElement: 'meanwhileInFinlandModal',
    render: function renderCustomModal(){
      var div = document.createElement("div");
      div.style.color = 'white';
      div.style.backgroundColor = 'hotpink';
      div.style.padding = '20px 40px';
      div.style.borderRadius = '5px';
      div.innerText = 'Meanwhile in Finland';
      return div
    }
  }
  instance.setCustomModal(modal);
  instance.openElements([modal.dataElement]);
});
   * @method WebViewerInstance#setCustomModal
   * @param {object} options
   * @param {string} options.dataElement Unique name of custom modal.
   * @param {WebViewerInstance.renderCustomModal} options.render Function rendering custom model contents
   */
  /**
   * Callback that gets passed to `options.render` in {@link WebViewerInstance#setCustomModal setCustomModal}.
   * @callback WebViewerInstance.renderCustomModal
   * @returns {(HTMLElement|string)} Modal element. If string is returned, it will be displayed as is inside modal
   */
  return function setCustomModal(customModal) {
    store.dispatch(actions.setCustomModal(customModal));
  };
}

export default generateSetCustomModal;
