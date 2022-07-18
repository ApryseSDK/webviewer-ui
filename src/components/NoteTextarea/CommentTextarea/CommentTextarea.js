import React from 'react';
import ReactQuill from 'react-quill';
import 'quill-mention';
import mentionsManager from 'helpers/MentionsManager';

import './CommentTextarea.scss';
let globalUserData = [];
// mentionsModule has to be outside the funtion to be able to access it without it being destroyed and recreated
const mentionModule = { 
  mention : {
    allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
    mentionDenotationChars: ["@", "#"],
    mentionContainerClass: 'mention__element',
    mentionListClass: 'mention__suggestions__list',
    listItemClass: 'mention__suggestions__item',
    renderItem: function(item, searchTerm) {
      // quill-mentions does not support jsx being returned
      if (item.email) {
        return (`<div> ${item.value} <p class="email"> ${item.email} </p> </div>`)
      }
      return (`<div> ${item.value} </div>`)
    },
    source: async function(searchTerm, renderList, mentionChar) {
      const mentionsSearchFunction = mentionsManager.getMentionLookupCallback();
      const foundUsers = await mentionsSearchFunction(globalUserData, searchTerm);
      renderList(foundUsers, searchTerm);
    }
  }
}

const CommentTextarea = React.forwardRef(
  (
    { 
      value='', 
      onChange,
      onKeyDown, 
      onBlur, 
      onFocus, 
      placeholder,
      userData
    }, 
    ref
  ) => {
    globalUserData = userData;

    // onBlur and onFocus have to be outside in the div because of quill bug
    return (
      <div className={'comment-textarea'} onBlur={onBlur} onFocus={onFocus}>
      <ReactQuill
        className={"comment-textarea ql-container ql-editor"}
        style={{overflowY: 'visible'}}
        ref={ref}
        modules={userData && userData.length > 0 ? mentionModule : {}}
        theme="snow" 
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onKeyDown={onKeyDown} 
      />
      </div>
    );
})

export default CommentTextarea;