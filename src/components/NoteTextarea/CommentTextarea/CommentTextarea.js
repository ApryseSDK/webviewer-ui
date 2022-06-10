import React from 'react';
import ReactQuill from 'react-quill';
import 'quill-mention';

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
    source: function(searchTerm, renderList, mentionChar) {
      if (searchTerm.length === 0) {
        renderList(globalUserData, searchTerm);
      } else {
        const matches = [];
        const searchTermLowerCase = searchTerm.toLowerCase();
        globalUserData.forEach(function(user) {
          const userValueIncludesSearchTerm = user.value.toLowerCase().includes(searchTermLowerCase);
          const userIdIncludesSearchTerm = user.id && user.id.toLowerCase().includes(searchTermLowerCase);
          const userEmailIncludesSearchTerm = user.email && user.email.toLowerCase().includes(searchTermLowerCase);
          
          if (userValueIncludesSearchTerm || userIdIncludesSearchTerm || userEmailIncludesSearchTerm) {
            matches.push(user);
          }
        })

        renderList(matches, searchTerm);
      }
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