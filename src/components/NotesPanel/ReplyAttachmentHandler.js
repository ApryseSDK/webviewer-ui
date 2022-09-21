import React from 'react';

const ReplyAttachmentHandler = ({ annotationId, addAttachments }) => {
  const onChange = (e) => {
    const file = e.target.files[0];
    file && addAttachments(annotationId, [file]);
  };

  return (
    <input
      id="reply-attachment-picker"
      type="file"
      style={{ display: 'none' }}
      onChange={onChange}
      onClick={(e) => {
        e.target.value = '';
      }}
    />
  );
};

export default ReplyAttachmentHandler;
