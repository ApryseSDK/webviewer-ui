import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Autolinker from 'autolinker';
import dayjs from 'dayjs';

import NoteTextarea from 'components/NoteTextarea';
import NotePopup from 'components/NotePopup';
import NoteState from 'components/NoteState';
import NoteContext from 'components/Note/Context';
import Icon from 'components/Icon';

import core from 'core';
import mentionsManager from 'helpers/MentionsManager';
import { mapAnnotationToKey, getDataWithKey } from 'constants/map';
import escapeHtml from 'helpers/escapeHtml';
import useDidUpdate from 'hooks/useDidUpdate';
import actions from 'actions';
import selectors from 'selectors';

import './NoteContent.scss';

const propTypes = {
  annotation: PropTypes.object.isRequired,
};

const NoteContent = ({ annotation, isEditing, setIsEditing }) => {
  const [
    noteDateFormat,
    iconColor,
    isNoteEditingTriggeredByAnnotationPopup,
    isStateDisabled,
  ] = useSelector(
    state => [
      selectors.getNoteDateFormat(state),
      selectors.getIconColor(state, mapAnnotationToKey(annotation)),
      selectors.getIsNoteEditing(state),
      selectors.isElementDisabled(state, 'notePopupState'),
    ],
    shallowEqual,
  );

  const { isSelected, searchInput, resize, isContentEditable } = useContext(
    NoteContext,
  );
  // const [isEditing, setIsEditing] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState(
    annotation.getCustomData('trn-mention')?.contents || annotation.getContents()
  );
  const dispatch = useDispatch();
  const isReply = annotation.isReply();

  useDidUpdate(() => {
    if (!isEditing) {
      dispatch(actions.finishNoteEditing());
    }

    resize();
  }, [isEditing]);

  useEffect(() => {
    // when the comment button in the annotation popup is clicked,
    // this effect will run and we set isEditing to true so that
    // the textarea will be rendered and focused after it is mounted
    if (
      isNoteEditingTriggeredByAnnotationPopup &&
      isSelected &&
      isContentEditable
    ) {
      setIsEditing(true);
    }
  }, [isContentEditable, isNoteEditingTriggeredByAnnotationPopup, isSelected, setIsEditing]);

  const renderAuthorName = useCallback(
    annotation => {
      const name = core.getDisplayAuthor(annotation);

      return name ? (
        <span
          dangerouslySetInnerHTML={{
            __html: highlightSearchInput(name, searchInput),
          }}
        />
      ) : (
        '(no name)'
      );
    },
    [searchInput],
  );

  const renderContents = useCallback(
    contents => {
      contents = escapeHtml(contents);

      let text;
      const transformedContents = Autolinker.link(contents, {
        stripPrefix: false,
      });
      if (transformedContents.includes('<a')) {
        // if searchInput is 't', replace <a ...>text</a> with
        // <a ...><span class="highlight">t</span>ext</a>
        text = transformedContents.replace(
          />(.+)</i,
          (_, p1) => `>${highlightSearchInput(p1, searchInput)}<`,
        );
      } else {
        text = highlightSearchInput(contents, searchInput);
      }

      return (
        <span className="contents" dangerouslySetInnerHTML={{ __html: text }} />
      );
    },
    [searchInput],
  );

  const icon = getDataWithKey(mapAnnotationToKey(annotation)).icon;
  const color = annotation[iconColor]?.toHexString?.();
  const contents = annotation.getContents();
  const numberOfReplies = annotation.getReplies().length;
  const formatNumberOfReplies = Math.min(numberOfReplies, 9);

  const header = useMemo(() => (
    <React.Fragment>
      {!isReply &&
        <div className="type-icon-container">
          {numberOfReplies > 0 &&
            <div className="num-replies-container">
              <div className="num-replies">{formatNumberOfReplies}</div>
            </div>}
          <Icon className="type-icon" glyph={icon} color={color} />
        </div>
      }
      <div className="author-and-date">
        <div className="author-and-overflow">
          <div className="author-and-time">
            {renderAuthorName(annotation)}
            <div className="date-and-time">
              {dayjs(annotation.DateCreated || new Date()).format(noteDateFormat)}
            </div>
          </div>
          <div className="state-and-overflow">
            {!isStateDisabled && !isReply &&
              <NoteState
                annotation={annotation}
                isSelected={isSelected}
              />
            }
            {!isEditing && isSelected &&
              <NotePopup
                annotation={annotation}
                setIsEditing={setIsEditing}
              />}
          </div>
        </div>
        {isEditing && isSelected ? (
          <ContentArea
            textAreaValue={textAreaValue}
            onTextAreaValueChange={setTextAreaValue}
            annotation={annotation}
            setIsEditing={setIsEditing}
          />
        ) : (
          contents && (
            <div className="container">{renderContents(contents)}</div>
          )
        )}
      </div>
    </React.Fragment>
  ), [isReply, numberOfReplies, formatNumberOfReplies, icon, color, renderAuthorName, annotation, noteDateFormat, isStateDisabled, isSelected, isEditing, setIsEditing, textAreaValue, contents, renderContents]);


  return useMemo(
    () => (
      <div className="NoteContent">
        {header}
      </div>
    ),
    [header],
  );
};

NoteContent.propTypes = propTypes;

export default NoteContent;

// a component that contains the content textarea, the save button and the cancel button
const ContentArea = ({
  annotation,
  setIsEditing,
  textAreaValue,
  onTextAreaValueChange,
}) => {
  const [isMentionEnabled] = useSelector(state => [
    selectors.getIsMentionEnabled(state),
  ]);
  const [t] = useTranslation();
  const textareaRef = useRef();
  const contents = annotation.getCustomData('trn-mention')?.contents || annotation.getContents();

  useEffect(() => {
    // on initial mount, focus the last character of the textarea
    if (textareaRef.current) {
      textareaRef.current.focus();

      const textLength = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(textLength, textLength);
    }
  }, []);

  const setContents = e => {
    // prevent the textarea from blurring out which will unmount these two buttons
    e.preventDefault();

    if (isMentionEnabled) {
      const { plainTextValue, ids } = mentionsManager.extractMentionDataFromStr(textAreaValue);

      annotation.setCustomData('trn-mention', {
        contents: textAreaValue,
        ids,
      });
      core.setNoteContents(annotation, plainTextValue);
    } else {
      core.setNoteContents(annotation, textAreaValue);
    }

    if (annotation instanceof window.Annotations.FreeTextAnnotation) {
      core.drawAnnotationsFromList([annotation]);
    }

    setIsEditing(false);
  };

  return (
    <div className="edit-content">
      <NoteTextarea
        ref={el => {
          textareaRef.current = el;
        }}
        value={textAreaValue}
        onChange={onTextAreaValueChange}
        onSubmit={setContents}
        placeholder={`${t('action.comment')}...`}
      />
      <div className="edit-buttons">
        <div
          className="cancel-button"
          onClick={e => {
            e.stopPropagation();
            setIsEditing(false);
            onTextAreaValueChange(contents);
          }}
        >
          {t('action.cancel')}
        </div>
        <div
          className="save-button"
          onClick={e => {
            e.stopPropagation();
            setContents(e);
          }}
        >
          {t('action.save')}
        </div>
      </div>
    </div>
  );
};

ContentArea.propTypes = {
  annotation: PropTypes.object.isRequired,
  setIsEditing: PropTypes.func.isRequired,
  textAreaValue: PropTypes.string,
  onTextAreaValueChange: PropTypes.func.isRequired,
};

const highlightSearchInput = (text, searchInput) => {
  if (searchInput.trim()) {
    try {
      text = text.replace(
        new RegExp(`(${searchInput})`, 'gi'),
        '<span class="highlight">$1</span>',
      );
    } catch (e) {
      // this condition is usually met when a search input contains symbols like *?!
      text = text
        .split(searchInput)
        .join(`<span class="highlight">${searchInput}</span>`);
    }
  }

  return text;
};
