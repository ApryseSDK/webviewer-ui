import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Swipeable } from 'react-swipeable';
import { FocusTrap } from '@pdftron/webviewer-react-toolkit';

import core from 'core';
import actions from 'actions';
import selectors from 'selectors';
import Choice from 'components/Choice';

import ReactQuill from 'react-quill';
import './quill.scss';
import './ContentEditModal.scss';

function ContentEditModal() {
  const [isDisabled, isOpen, isContentEditWarningHidden, currentContentBeingEdited] = useSelector(state => [
    selectors.isElementDisabled(state, 'contentEditModal'),
    selectors.isElementOpen(state, 'contentEditModal'),
    selectors.isContentEditWarningHidden(state),
    selectors.getCurrentContentBeingEdited(state)
  ]);

  const [t] = useTranslation();
  const dispatch = useDispatch();
  const store = useStore();

  const [hideWarning, setHideWarning] = useState(true);
  const [showWarning, setShowWarning] = useState(false);

  const closeModal = () => {
    dispatch(actions.closeElement('contentEditModal'));

    if (showWarning) {
      // this means warning was cancelled
      core.setToolMode(window.Core.Tools.ToolNames.EDIT);
    }
  };

  useEffect(() => {
    const handleToolModeChange = (newTool, oldTool) => {
      if (newTool instanceof Core.Tools.ContentEditTool) {
        setTimeout(() => {
          setShowWarning(!isContentEditWarningHidden);
          dispatch(actions.openElement('contentEditModal'));
        }, 500);
      } else if (oldTool instanceof Core.Tools.ContentEditTool) {
        dispatch(actions.clearCurrentContentBeingEdited());
      }
    };

    const handleDoubleClickContentBox = async (annotation) => {
      if (annotation.isContentEditPlaceholder() && annotation.getContentEditType() === window.Core.ContentEdit.Types.TEXT) {
        const content = await instance.Core.ContentEdit.getDocumentContent(annotation);

        dispatch(actions.setCurrentContentBeingEdited({ content, annotation }));

        dispatch(actions.openElement('contentEditModal'));
      }
    };

    core.addEventListener('toolModeUpdated', handleToolModeChange);
    core.addEventListener('annotationDoubleClicked', handleDoubleClickContentBox);

    return () => {
      core.removeEventListener('toolModeUpdated', handleToolModeChange);
      core.removeEventListener('annotationDoubleClicked', handleDoubleClickContentBox);
    };
  }, [isContentEditWarningHidden]);

  const closeWarningModal = () => {
    dispatch(actions.closeElement('contentEditModal'));
    dispatch(actions.setHideContentEditWarning(hideWarning));
    setShowWarning(false);
  };

  // save the edit changes
  const saveTextEditResults = () => {
    dispatch(actions.closeElement('contentEditModal'));
    instance.Core.ContentEdit.updateDocumentContent(currentContentBeingEdited.annotation, currentContentBeingEdited.content);
  };

  const richTextEditorChangeHandler = value => {
    dispatch(actions.updateCurrentContentBeingEdited(value));
  };

  const modalClass = classNames({
    Modal: true,
    ContentEditModal: true,
    open: isOpen,
    closed: !isOpen,
  });

  const toolbarOptions = [['bold', 'italic', 'underline']];

  const isEditing = !!currentContentBeingEdited;

  return isDisabled || (!isEditing && !showWarning) ? null : (
    <Swipeable onSwipedUp={closeModal} onSwipedDown={closeModal} preventDefaultTouchmoveEvent>
      <FocusTrap locked={isOpen}>
        <div className={modalClass} data-element="contentEditModal" onMouseDown={closeModal}>
          <div className="container" onMouseDown={e => e.stopPropagation()}>
            <div className="swipe-indicator" />
            {showWarning ? (
              <div>
                <h2 className="textareaLabel">{t('message.warning')}</h2>
                <p className="textareaLabel">{t('message.enterContentEditingMode')}</p>
                <p className="textareaLabel">{t('message.existingAnnotationWarning')}</p>
                <p className="textareaLabel">{t('message.changesCannotBeUndone')}</p>
                <Choice
                  type="checkbox"
                  checked={hideWarning}
                  label={t(`message.doNotShowAgain`)}
                  onChange={() => {
                    setHideWarning(!hideWarning);
                  }}
                />
              </div>
            ) : (
              <div>
                <ReactQuill
                  value={currentContentBeingEdited.content}
                  onChange={richTextEditorChangeHandler}
                  modules={{ toolbar: toolbarOptions }}
                />
              </div>
            )}
            <div className="editing-controls">
              <button className="button cancel-button editing-pad" onClick={closeModal}>
                {t('action.cancel')}
              </button>
              {showWarning ? (
                <button className="button text-edit-proceed-button" onClick={() => closeWarningModal()}>
                  {t('action.proceed')}
                </button>
              ) : (
                <button className="button text-edit-save-button" onClick={saveTextEditResults}>
                  {t('action.save')}
                </button>
              )}
            </div>
          </div>
        </div>
      </FocusTrap>
    </Swipeable>
  );
}

export default ContentEditModal;
