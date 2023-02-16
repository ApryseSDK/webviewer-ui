import React, { useLayoutEffect, useRef, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';
import NoteContext from 'components/Note/Context';
import selectors from 'selectors';
import CommentTextarea from './CommentTextarea/CommentTextarea';

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
  const [userData, canSubmitByEnter] = useSelector(
    (state) => [
      selectors.getUserData(state),
      selectors.isNoteSubmissionWithEnterEnabled(state),
    ],
    shallowEqual,
  );

  const { resize } = useContext(NoteContext);
  const textareaRef = useRef();
  const prevHeightRef = useRef();
  const [pasting, setPasting] = useState(false);

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

  useEffect(() => {
    const handlePasting = () => {
      setPasting(true);
    };
    window.addEventListener('paste', handlePasting);
    return () => {
      window.removeEventListener('paste', handlePasting);
    };
  }, []);

  const handleKeyDown = (e) => {
    const enterKey = 13;
    const isSubmittingByEnter = canSubmitByEnter && e.which === enterKey;
    const isSubmittingByCtrlEnter = (e.metaKey || e.ctrlKey) && e.which === enterKey;

    if (isSubmittingByEnter || isSubmittingByCtrlEnter) {
      props.onSubmit(e);
    }
  };

  const handleChange = (content, delta, source, editor) => {
    /* For the React Quill editor, the text won't ever be empty, at least a '\n'
     * will be there, so it is necessary to trim the value to check if it is empty
     */
    const isEmpty = editor && editor.getText().trim() === '' && content === '<p><br></p>';
    let value = '';

    if (!isEmpty) {
      value = content.target ? content.target.value : content;
    }
    props.onChange(value);
    setPasting(false);
  };

  const textareaProps = {
    ...props,
    ref: (el) => {
      textareaRef.current = el;
      forwardedRef(el);
    },
    onChange: pasting ? handleChange : _.debounce(handleChange, 100),
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
