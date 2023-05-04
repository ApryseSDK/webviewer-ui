import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Button from 'components/Button';
import ReplyAreaMultiSelect from 'components/Note/ReplyArea/ReplyAreaMultiSelect';
import MultiStylePopup from 'components/NotesPanel/MultiStylePopup';
import NoteContext from 'components/Note/Context';
import NoteStateFlyout from 'components/ModularComponents/NoteStateFlyout';
import ToggleElementButton from 'components/ModularComponents/ToggleElementButton';

import { createStateAnnotation } from 'helpers/NoteStateUtils';
import DataElements from 'constants/dataElement';
import PropTypes from 'prop-types';
import actions from 'actions';
import core from 'core';
import selectors from 'selectors';

import './MultiSelectControls.scss';
import NoteShareTypeMultiControl from '../NoteShareType/NoteShareTypeMultiControl';

const propTypes = {
  showMultiReply: PropTypes.bool.isRequired,
  setShowMultiReply: PropTypes.func.isRequired,
  setShowMultiState: PropTypes.func.isRequired,
  showMultiStyle: PropTypes.bool.isRequired,
  setShowMultiStyle: PropTypes.func.isRequired,
  setMultiSelectMode: PropTypes.func.isRequired,
  isMultiSelectedMap: PropTypes.object.isRequired,
  setIsMultiSelectedMap: PropTypes.func.isRequired,
  multiSelectedAnnotations: PropTypes.array.isRequired,
};

const getParentAnnotations = (annotations, documentViewerKey = 1) => {
  const annotSet = new Set();
  annotations.forEach((annotation) => {
    if (annotation.isGrouped()) {
      const parentAnnotation = core.getAnnotationById(annotation['InReplyTo'], documentViewerKey);
      if (parentAnnotation) {
        annotSet.add(parentAnnotation);
      }
    } else {
      annotSet.add(annotation);
    }
  });
  return Array.from(annotSet);
};

const MultiSelectControls = ({
  showMultiReply,
  setShowMultiReply,
  setShowMultiState,
  showMultiStyle,
  setShowMultiStyle,
  setMultiSelectMode,
  isMultiSelectedMap,
  setIsMultiSelectedMap,
  multiSelectedAnnotations,
}) => {
  const [
    modifiableMultiSelectAnnotations,
    setModifiableMultiSelectAnnotations,
  ] = useState([]);
  const dispatch = useDispatch();
  const [t] = useTranslation();

  const activeDocumentViewerKey = useSelector(selectors.getActiveDocumentViewerKey);
  const isDocumentReadOnly = useSelector(selectors.isDocumentReadOnly);

  useEffect(() => {
    const onAnnotationChanged = (annotations, action) => {
      if (action === 'delete') {
        const _isMultiSelectedMap = { ...isMultiSelectedMap };
        annotations.forEach((annot) => {
          delete _isMultiSelectedMap[annot.Id];
        });
        setIsMultiSelectedMap(_isMultiSelectedMap);
      } else if (action === 'modify') {
        const _isMultiSelectedMap = { ...isMultiSelectedMap };
        // update isMultiSelectedMap by looking at modified annots and
        // their grouped annots
        annotations.forEach((annot) => {
          const groupedAnnots = core.getGroupAnnotations(annot, activeDocumentViewerKey);
          const someAnnotInGroupIsSelected =
            groupedAnnots.some((groupedAnnot) => isMultiSelectedMap[groupedAnnot.Id]);
          if (someAnnotInGroupIsSelected) {
            // select all annots in this group
            groupedAnnots.forEach((groupAnnot) => {
              _isMultiSelectedMap[groupAnnot.Id] = groupAnnot;
            });
          }
        });

        const originalKeys = Object.keys(isMultiSelectedMap);
        const updatedKeys = Object.keys(isMultiSelectedMap);
        const difference = originalKeys.filter((key) => !updatedKeys.includes(key));
        if (difference.length > 0) {
          // Only update if we have a difference to not cause re-renders and
          // actions to not be dispatched if unneeded.
          setIsMultiSelectedMap(_isMultiSelectedMap);
        }
      }
    };

    core.addEventListener('annotationChanged', onAnnotationChanged, undefined, activeDocumentViewerKey);
    return () => {
      core.removeEventListener('annotationChanged', onAnnotationChanged, activeDocumentViewerKey);
    };
  }, [isMultiSelectedMap, activeDocumentViewerKey]);

  useEffect(() => {
    return () => {
      setShowMultiReply(false);
      setIsMultiSelectedMap({});
    };
  }, []);

  useEffect(() => {
    const _modifiableMultiSelectAnnotations = multiSelectedAnnotations.filter((multiSelectedAnnot) => {
      return core.canModify(multiSelectedAnnot, activeDocumentViewerKey);
    });
    setModifiableMultiSelectAnnotations(_modifiableMultiSelectAnnotations);
  }, [multiSelectedAnnotations]);

  const numberOfGroups = core.getNumberOfGroups(modifiableMultiSelectAnnotations, activeDocumentViewerKey);
  const canGroup = numberOfGroups > 1;
  const canUngroup = !canGroup && (modifiableMultiSelectAnnotations.length > 2 ||
    (modifiableMultiSelectAnnotations.length > 0 && core.getGroupAnnotations(modifiableMultiSelectAnnotations[0], activeDocumentViewerKey).length > 1));

  // const handleStateChange = useCallback((newValue) => {
  //   getParentAnnotations(multiSelectedAnnotations, activeDocumentViewerKey).forEach((annot) => {
  //     const stateAnnotation = createStateAnnotation(annot, newValue, activeDocumentViewerKey);
  //     annot.addReply(stateAnnotation);
  //     const annotationManager = core.getAnnotationManager(activeDocumentViewerKey);
  //     annotationManager.addAnnotation(stateAnnotation);
  //     annotationManager.trigger('addReply', [stateAnnotation, annot, annotationManager.getRootAnnotation(annot)]);
  //   });
  //   setShowMultiState(false);
  // }, [multiSelectedAnnotations, activeDocumentViewerKey]);

  // if (showMultiReply) {
  //   return (
  //     <NoteContext.Provider value={{
  //       resize: () => {},
  //     }}>
  //       <ReplyAreaMultiSelect
  //         annotations={getParentAnnotations(multiSelectedAnnotations, activeDocumentViewerKey)}
  //         onSubmit={() => setShowMultiReply(false)}
  //         onClose={() => setShowMultiReply(false)}
  //       />
  //     </NoteContext.Provider>
  //   );
  // }

  return (
    <div className="multi-select-footer">
      <div className="buttons-container">
        {/* <Button
          dataElement={DataElements.NOTE_MULTI_REPLY_BUTTON}
          disabled={isDocumentReadOnly || multiSelectedAnnotations.length === 0}
          img="icon-header-chat-line"
          onClick={() => {
            setShowMultiReply(true);
          }}
          title="action.comment"
        />
        <ToggleElementButton
          dataElement={DataElements.NOTE_MULTI_STATE_BUTTON}
          title={t('option.notesOrder.status')}
          img={'icon-annotation-status-none'}
          toggleElement={DataElements.NOTE_STATE_FLYOUT}
          disabled={isDocumentReadOnly || modifiableMultiSelectAnnotations.length === 0}
        />
        <NoteStateFlyout
          isMultiSelectMode={true}
          handleStateChange={handleStateChange}
        />*/}
        <Button
          dataElement={DataElements.NOTE_MULTI_STYLE_BUTTON}
          img="icon-menu-style-line"
          disabled={isDocumentReadOnly || modifiableMultiSelectAnnotations.length === 0}
          onClick={() => {
            setShowMultiStyle(!showMultiStyle);
          }}
          title="action.style"
        />
        {showMultiStyle &&
          <MultiStylePopup
            annotations={modifiableMultiSelectAnnotations}
            triggerElementName="multiStyleButton"
            onClose={() => {
              setShowMultiStyle(false);
            }}
          />}
        {!canUngroup &&
          <Button
            dataElement={DataElements.NOTE_MULTI_GROUP_BUTTON}
            disabled={isDocumentReadOnly || !canGroup}
            img="group-annotations-icon"
            onClick={() => {
              core.groupAnnotations(multiSelectedAnnotations[0], multiSelectedAnnotations, activeDocumentViewerKey);
            }}
            title="action.group"
          />}
        {canUngroup &&
          <Button
            dataElement={DataElements.NOTE_MULTI_UNGROUP_BUTTON}
            img="ungroup-annotations-icon"
            onClick={() => {
              core.ungroupAnnotations(multiSelectedAnnotations, activeDocumentViewerKey);
            }}
            title="action.ungroup"
          />}
        <Button
          dataElement={DataElements.NOTE_MULTI_DELETE_BUTTON}
          disabled={isDocumentReadOnly || modifiableMultiSelectAnnotations.length === 0}
          img="icon-delete-line"
          onClick={() => {
            const title = t('warning.multiDeleteAnnotation.title');
            const message = t('warning.multiDeleteAnnotation.message');
            const confirmBtnText = t('action.delete');

            const warning = {
              title,
              message,
              confirmBtnText,
              onConfirm: () => {
                core.deleteAnnotations(modifiableMultiSelectAnnotations, undefined, activeDocumentViewerKey);
              },
            };
            dispatch(actions.showWarningMessage(warning));
          }}
          title="action.delete"
        />
      </div>
      <div
        className="close-container"
      >
        <Button
          className="close-icon-container"
          onClick={() => {
            setMultiSelectMode(false);
          }}
          img='ic_close_black_24px'
        />
      </div>
    </div>
  );
};

MultiSelectControls.propTypes = propTypes;

export default MultiSelectControls;
