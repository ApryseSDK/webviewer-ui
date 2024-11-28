import React, { useLayoutEffect, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';
import throttle from 'lodash/throttle';
import NoteContext from 'components/Note/Context';
import selectors from 'selectors';
import CommentTextarea from './CommentTextarea/CommentTextarea';
import mentionsManager from 'helpers/MentionsManager';

const propTypes = {
  // same the value attribute of a HTML textarea element
  value: PropTypes.string,
  // same the placeholder attribute of a HTML textarea element
  placeholder: PropTypes.string,
  // same the onChange attribute of a HTML textarea element
  onChange: PropTypes.func.isRequired,
  // same the onBlur attribute of a HTML textarea element
  onBlur: PropTypes.func,
  // same the onBlur attribute of a HTML textarea element
  onFocus: PropTypes.func,
  // a function that will be invoked when Ctrl + Enter or Cmd + Enter or only Enter are pressed
  onSubmit: PropTypes.func,
};

const NoteTextarea = React.forwardRef((props, forwardedRef) => {
  const [
    userData,
    canSubmitByEnter,
  ] = useSelector(
    (state) => [
      selectors.getUserData(state),
      selectors.isNoteSubmissionWithEnterEnabled(state),
      selectors.getAutoFocusNoteOnAnnotationSelection(state),
      selectors.getIsNoteEditing(state),
    ],
    shallowEqual,
  );

  const { resize } = useContext(NoteContext);
  const textareaRef = useRef();
  const prevHeightRef = useRef();

  useLayoutEffect(() => {
    // when the height of the textarea changes, we also want to call resize
    // to clear the cell measurer cache and update the note height in the virtualized list
    const boxDOMElement = textareaRef.current?.editor?.container.firstElementChild;
    const boundingBox = boxDOMElement?.getBoundingClientRect() || {};
    if (prevHeightRef.current && prevHeightRef.current !== boundingBox.height) {
      resize();
    }
    prevHeightRef.current = boundingBox.height;
    // we need value to be in the dependency array because the height will only change when value changes
    // eslint-disable-next-line
  }, [props.value, resize]);


  const handleKeyDown = (e) => {
    const enterKey = 13;
    const enterKeyPressed = e.which === enterKey;
    if (enterKeyPressed) {
      const isSubmittingByEnter = canSubmitByEnter;
      const isSubmittingByCtrlEnter = (e.metaKey || e.ctrlKey);

      if (isSubmittingByEnter || isSubmittingByCtrlEnter) {
        props.onSubmit(e);
      }
    }
  };

  const handleChange = (content, delta, source, editor) => {
    if (textareaRef.current) {
      /* For the React Quill editor, the text won't ever be empty, at least a '\n'
       * will be there, so it is necessary to trim the value to check if it is empty
       */
      const isEmpty = editor && editor.getText().trim() === '' && content === '<p><br></p>';
      let value = '';

      if (!isEmpty) {
        value = content.target ? content.target.value : content;
      }
      props.onChange(value);

      // If the delta contains a mention, then move the cursor to the end of the editor.
      // This is necessary instead of using debounce when mentioning a user because
      // the debounce was generating the following bug
      // https://apryse.atlassian.net/browse/WVR-2380
      const deltaContainsMention = mentionsManager.doesDeltaContainMention(delta.ops);

      if (deltaContainsMention) {
        const formattedText = mentionsManager.getFormattedTextFromDeltas(delta.ops);
        const mentionData = mentionsManager.extractMentionDataFromStr(formattedText);
        const editortextValue = editor.getText();
        const totalTextLength = editortextValue.length + mentionData.plainTextValue.length;
        const textareaEditor = textareaRef.current?.editor;
        setTimeout(() => textareaEditor?.setSelection(totalTextLength, totalTextLength), 1);
      }
    }
  };

  const textareaProps = {
    ...props,
    ref: (el) => {
      textareaRef.current = el;
      forwardedRef(el);
    },
    onChange: throttle(handleChange, 100),
    onKeyDown: handleKeyDown,
    userData,
  };

  return (
    <>
      <CommentTextarea {...textareaProps}/>
    </>
  );
});

NoteTextarea.displayName = 'NoteTextarea';
NoteTextarea.propTypes = propTypes;

export default NoteTextarea;
