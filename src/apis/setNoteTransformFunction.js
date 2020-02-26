import actions from 'actions';

/**
 * @callback NoteTransformFunction
 * @memberof WebViewerInstance
 * @param {HTMLElement} wrapperElement  A reference to the DOM node that wraps the note. You can use this to query select child elements to mutate (see the examples below)
 * @param {object} state The state of the note. Contains two properties, 'annotation' and 'isSelected'
 * @param {Annotations.Annotation} state.annotation A reference to the annotation object associated with the note
 * @param {boolean} state.isSelected whether or not the note is currently expanded
 * @param {function} createElement A utility function that should be used when creating DOM nodes. This is a replacement for `document.createElement`.
 * Accepts the same parameters as `document.createElement`. Using document.createElement instead of this function will cause your DOM nodes to not be cleaned up on subsequent renders.
 */

/**
 * Accepts a function that will be called every time a note in the left panel is rendered.
 * This function can be used to add, edit or hide the contents of the note.
 * <br><br>
 * <span style='font-size: 18px'><b>Please carefully read the documentation and the notes below before using this API</b></span><br><br>
 * 
 * <b>This API is experimental and should be used sparingly.</b> If you find you are heavily relying on this function,
 *  it is recommended that you <a href='https://www.pdftron.com/documentation/web/guides/advanced-customization/'>fork the UI repo</a> and make the changes directly in the source code (Note.js).
 * <br><br>
 * 
 * 
 * The structure of the HTML that is passed into this function may change may change without notice in any release. <b>Please make sure
 * to test this function thoroughly when upgrading WebViewer versions.</b>
 * <br><br>
 * 
 * 
 *  There may be unexpected behaviour when using this API. The HTML that is provided is controlled by React, and sometimes React will override any changes you make.
 *  If you find any unexpected behaviour when using this API, then this API probably won't work for your use case and you will have to make the changes directly in the source code.
 * <br><br>
 * 
 *  <b>Do not use document.createElement to create DOM elements</b>. Instead, use the provided `createElement` utility function provided as the third parameter.
 * 
 *  <b>Do not use HTMLElement.removeChild or any other APIs that remove elements from the DOM.</b> Doing so will cause React to lose reference to this node, and will crash.
 *  If you need to hide an HTML element, set the style to `display: none` instead.
 * <br><br>
 * @method WebViewerInstance#dangerouslySetNoteTransformFunction
 * @param {WebViewerInstance.NoteTransformFunction} noteTransformFunction The function that will be used to transform notes in the left panel
 * @example
Webviewer(...)
  .then(instance => {
    instance.dangerouslySetNoteTransformFunction((wrapper, state, createElement) => {
      // Change the title of every note
      wrapper.querySelector('.title>span').innerHTML = 'My custom note title';

      // Add a button that alerts the user when clicked
      const button = createElement('button');
      button.onmousedown = (e) => {
        if(state.isSelected) {
          alert('Hello world!');
        } else {
          alert('Goodbye world!');
        }
      };
      button.innerHTML = 'Alert me'
      wrapper.appendChild(button);

      // Add a button that makes the annotation blue
      const button = createElement('button');
      button.onmousedown = (e) => {
        state.annotation.StrokeColor = new instance.Annotations.Color(0, 0, 255);
        instance.annotManager.redrawAnnotation(state.annotation)
      };
      button.innerHTML = 'Make me blue'
      wrapper.appendChild(button);
    })
  });
 */
export default store => noteTransformFunction => {
  store.dispatch(actions.setNoteTransformFunction(noteTransformFunction));
};