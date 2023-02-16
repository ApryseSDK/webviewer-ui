import React from 'react';
import ReactQuill from 'react-quill';
import 'quill-mention';
import mentionsManager from 'helpers/MentionsManager';
import Button from 'components/Button';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import DataElements from 'constants/dataElement';
import selectors from 'selectors';

import './CommentTextarea.scss';

let globalUserData = [];

// mentionsModule has to be outside the funtion to be able to access it without it being destroyed and recreated
const mentionModule = {
  mention: {
    allowedChars: /^[A-Za-z\sÅÄÖåäö0-9\-_]*$/,
    mentionDenotationChars: ['@', '#'],
    mentionContainerClass: 'mention__element',
    mentionListClass: 'mention__suggestions__list',
    listItemClass: 'mention__suggestions__item',
    renderItem(item) {
      // quill-mentions does not support jsx being returned
      if (item.email) {
        return (`<div> ${item.value} <p class="email"> ${item.email} </p> </div>`);
      }
      return (`<div> ${item.value} </div>`);
    },
    async source(searchTerm, renderList) {
      const mentionsSearchFunction = mentionsManager.getMentionLookupCallback();
      const foundUsers = await mentionsSearchFunction(globalUserData, searchTerm);
      renderList(foundUsers, searchTerm);
    }
  }
};

const CommentTextarea = React.forwardRef(
  (
    {
      value = '',
      onChange,
      onKeyDown,
      onBlur,
      onFocus,
      userData,
      isReply,
    },
    ref
  ) => {
    const [t] = useTranslation();

    const isAddReplyAttachmentDisabled = useSelector((state) => selectors.isElementDisabled(state, DataElements.NotesPanel.ADD_REPLY_ATTACHMENT_BUTTON));

    globalUserData = userData;

    const addAttachment = () => {
      document.getElementById('reply-attachment-picker')?.click();
    };

    const onClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const onScroll = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    // Convert text with newline ("\n") to <p>...</p> format so
    // that editor handles multiline text correctly
    if (value) {
      const contentArray = value.split('\n');
      if (contentArray.length && contentArray[contentArray.length - 1] === '') {
        contentArray.pop();
        value = contentArray.map((item) => `<p>${item || '<br>'}</p>`).join('');
      }
    }

    // onBlur and onFocus have to be outside in the div because of quill bug
    return (
      <div className='comment-textarea' onBlur={onBlur} onFocus={onFocus} onClick={onClick} onScroll={onScroll}>
        <ReactQuill
          className='comment-textarea ql-container ql-editor'
          style={{ overflowY: 'visible' }}
          ref={ref}
          modules={userData && userData.length > 0 ? mentionModule : {}}
          theme="snow"
          value={value}
          placeholder={`${isReply ? t('action.reply') : t('action.comment')}...`}
          aria-label={`${isReply ? t('action.reply') : t('action.comment')}...`}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
        {isReply && !isAddReplyAttachmentDisabled &&
          <Button
            className='add-attachment'
            dataElement={DataElements.NotesPanel.ADD_REPLY_ATTACHMENT_BUTTON}
            img='ic_fileattachment_24px'
            onClick={addAttachment}
          />
        }
      </div>
    );
  });

CommentTextarea.displayName = 'CommentTextarea';

export default CommentTextarea;
