import React from 'react';
import ReactQuill from 'react-quill';

import './CommentTextarea.scss';

const CommentTextarea = React.forwardRef(
  (
    { 
      value='', 
      onChange, 
      onKeyDown, 
      onBlur, 
      onFocus, 
      placeholder
    }, 
    ref
  ) => {

    return (
      <ReactQuill
        ref={ref}
        className={"comment-textarea"}
        theme="snow" 
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onKeyDown={onKeyDown} 
        onBlur={onBlur} 
        onFocus={onFocus}
      />
    );
})

export default CommentTextarea;