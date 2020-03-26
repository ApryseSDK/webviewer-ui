import React, { useLayoutEffect, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';

import AutoResizeTextarea from 'components/NoteTextarea/AutoResizeTextarea';
import NoteContext from 'components/Note/Context';

import selectors from 'selectors';

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
  // a function that will be invoked when Ctrl + Enter or Cmd + Enter are pressed
  onSubmit: PropTypes.func,
};

const MentionsTextarea = React.lazy(() =>
  import(/* webpackChunkName: 'mention' */'components/NoteTextarea/MentionsTextarea'),
);

const NoteTextarea = React.forwardRef((props, forwardedRef) => {
  const userData = useSelector(selectors.getUserData, shallowEqual);
  const { resize } = useContext(NoteContext);
  const textareaRef = useRef();
  const prevHeightRef = useRef();

  useLayoutEffect(() => {
    // when the height of the textarea changes, we also want to call resize
    // to clear the cell measurer cache and update the note height in the virtualized list
    const boundingBox = textareaRef.current?.getBoundingClientRect() || {};
    if (prevHeightRef.current && prevHeightRef.current !== boundingBox.height) {
      resize();
    }

    prevHeightRef.current = boundingBox.height;
    // we need value to be in the dependency array because the height will only change when value changes
    // eslint-disable-next-line
  }, [props.value, resize]);

  const handleKeyDown = e => {
    // (Cmd/Ctrl + Enter)
    if ((e.metaKey || e.ctrlKey) && e.which === 13) {
      props.onSubmit(e);
    }
  };

  const handleChange = value => {
    props.onChange(value);
  };

  const textareaProps = {
    ...props,
    ref: el => {
      textareaRef.current = el;
      forwardedRef(el);
    },
    onChange: handleChange,
    onKeyDown: handleKeyDown,
  };

  return userData?.length ? (
    <React.Suspense fallback={<div>Loading...</div>}>
      <MentionsTextarea {...textareaProps} userData={userData} />
    </React.Suspense>
  ) : (
    <AutoResizeTextarea {...textareaProps} />
  );
});

NoteTextarea.propTypes = propTypes;

export default NoteTextarea;
