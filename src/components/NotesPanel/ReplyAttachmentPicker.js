import React from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';

const ReplyAttachmentPicker = ({ annotationId, addAttachments }) => {
  const replyAttachmentHandler = useSelector((state) => selectors.getReplyAttachmentHandler(state));

  const onChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      let attachment = file;
      if (replyAttachmentHandler) {
        const url = await replyAttachmentHandler(file);
        attachment = {
          url,
          name: file.name,
          size: file.size,
          type: file.type
        };
      }
      addAttachments(annotationId, [attachment]);
    }
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

export default ReplyAttachmentPicker;
