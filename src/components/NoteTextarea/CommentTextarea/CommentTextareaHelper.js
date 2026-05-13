/**
 * Creates a ref handler for the CommentTextarea component.
 * Handler sets the appropriate aria label on the editor root element and calls an external ref handler, if provided.
 * @param {Object} options
 * @param {boolean} options.isReply true if the textarea is for a reply, false if it's for a comment
 * @param {function} options.t i18n translation function, used to get the aria label text
 * @param {function} options.externalRefHandler an external ref handler to be called with the textarea element
 * @returns callback function to be used as ref handler for the CommentTextarea component
 * @ignore
 */
export const createRefHandler = ({
  isReply = false,
  t = (key) => key,
  externalRefHandler = () => {},
}) => {

  /**
   * Callback ref handler
   * @param element the ReactQuill element for the CommentTextarea component
   * @returns the result of calling the external ref handler with the element
   * @ignore
   */
  const refHandler = (element) => {
    if (element) {
      const editor = element.editor && element.getEditor?.();
      if (editor) {
        editor.root.ariaLabel = `${isReply ? t('action.reply') : t('action.comment')}`;
      }
    }
    return externalRefHandler(element);
  };

  return refHandler;
};
