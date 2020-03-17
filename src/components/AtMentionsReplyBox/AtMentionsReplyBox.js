import './AtMentionsReplyBox.scss';
import React, { forwardRef, useRef, useEffect } from 'react';
import T from 'prop-types';
import Tribute from 'tributejs';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import { HiveAPI } from '../../helpers/hiveApi';
import AttachedFile from 'components/AttachedFile';
import Icon from 'components/Icon';

const placeCaretAtEnd = el => {
  el.focus();
  if (typeof window.getSelection !== undefined && typeof document.createRange !== undefined) {
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
  } else if (typeof document.body.createTextRange !== undefined) {
    const textRange = document.body.createTextRange();
    textRange.moveToElementText(el);
    textRange.collapse(false);
    textRange.select();
  }
};

const useMentions = (values, element) => {
  const tributeRef = useRef();
  useEffect(() => {
    if (tributeRef.current) {
      element.current.removeAttribute('data-tribute');
      tributeRef.current.detach(element.current);
    }
    tributeRef.current = new Tribute({
      values,
      allowSpaces: true,
      selectTemplate: item => {
        if (!item) {
          return null;
        }

        return `<span class="at-mention" data-id="${item.original.id}" data-key="${
          item.original.key
        }" data-value="${item.original.value}" contenteditable="false">@${
          item.original.value
        }</span>`;
      },
    });
    tributeRef.current.attach(element.current);
  }, [values]);
};

const AtMentionsReplyBox = forwardRef((props, forwardedRef) => {
  const { attachedFiles, onUploadFile, onSubmit, ...restProps } = props;
  const replyBox = useRef();
  const atMentions = useSelector(state => selectors.getAtMentions(state));

  useMentions(atMentions, replyBox);

  useEffect(() => {
    replyBox.current.focus();

    replyBox.current.getText = () => replyBox.current.innerHTML;

    replyBox.current.setText = (text = '') => {
      replyBox.current.innerHTML = text;
      return text;
    };

    replyBox.current.handleMentions = () => {
      const elementList = replyBox.current.getElementsByClassName('at-mention');
      if (elementList.length > 0) {
        const atMentionedUsers = Array.from(elementList).map(element => ({ ...element.dataset }));
        HiveAPI.onAtMentions(atMentionedUsers);
      }
    }
  }, []);

  const onChange = (event) => {
    props.onChange(event.target.innerHTML);

    replyBox.current.style.height = '30px';
    replyBox.current.style.height = replyBox.current.scrollHeight + 2 + 'px';
  };

  const onKeyDown = (event) => {
    event.stopPropagation();
    // (Cmd/Ctrl + Enter)
    const isEnter = event.which === 13;
    if (isEnter && (event.metaKey || event.ctrlKey)) {
      replyBox.current.handleMentions(event);
      replyBox.current.setText('');
      onSubmit(event);
    }
  };

  const onFocus = event => {
    placeCaretAtEnd(event.target);
    props.onFocus(event);
  };

  const onAttachFile = async event => {
    event.stopPropagation();
    event.nativeEvent.stopPropagation();

    // trigger upload file callback
    const file = await HiveAPI.onUploadFile();
    if (file) {
      onUploadFile(file);
    }
  };

  return (
    <div className="AtMentionsReplyBox">
      <div className="editor-wrapper">
        <div
          ref={el => {
            replyBox.current = el;
            forwardedRef(el);
          }}
          {...restProps}
          contentEditable
          className="editor"
          onInput={onChange}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
        />
        {attachedFiles.map(file => <AttachedFile key={file._id} file={file} />)}
      </div>

      <div className="IconWrapper" onMouseDown={onAttachFile}>
        <Icon glyph="hive-paperclip" />
      </div>
    </div>
  );
});

AtMentionsReplyBox.propTypes = {
  onChange: T.func,
  onSubmit: T.func,
  onFocus: T.func,
  onUploadFile: T.func,
  attachedFiles: T.arrayOf(T.object),
};

AtMentionsReplyBox.defaultProps = {
  onChange: v => v,
  onSubmit: v => v,
  onFocus: v => v,
  onUploadFile: v => v,
  attachedFiles: [],
};

export default AtMentionsReplyBox;
