import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Button from 'components/Button';
import ReplyAreaMultiSelect from 'components/Note/ReplyArea/ReplyAreaMultiSelect';
import MultiStylePopup from 'components/MultiSelectControls/MultiStylePopup';
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

const propTypes = {
  showMultiReply: PropTypes.bool.isRequired,
  setShowMultiReply: PropTypes.func.isRequired,
  setShowMultiState: PropTypes.func.isRequired,
  showMultiStyle: PropTypes.bool.isRequired,
  setShowMultiStyle: PropTypes.func.isRequired,
  setMultiSelectMode: PropTypes.func.isRequired,
  multiSelectedMap: PropTypes.object.isRequired,
  setMultiSelectedMap: PropTypes.func.isRequired,
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
  multiSelectedMap,
  setMultiSelectedMap,
  multiSelectedAnnotations,
}) => {
  const [
    modifiableMultiSelectAnnotations,
    setModifiableMultiSelectAnnotations,
  ] = useState([]);
  const dispatch = useDispatch();
  const [t] = useTranslation();

  const activeDocumentViewerKey = useSelector(selectors.getActiveDocumentViewerKey);
  const customizableUI = useSelector(selectors.getIsCustomUIEnabled);

  useEffect(() => {
    const handleAnnotationDelete = (annotations) => {
      const updatedMap = { ...multiSelectedMap };
      annotations.forEach((annot) => {
        delete updatedMap[annot.Id];
      });
      setMultiSelectedMap(updatedMap);
    };
    const handleAnnotationModify = (annotations) => {
      const updatedMap = getUpdatedMultiSelectedMap(annotations);

      if (hasDifferenceInKeys(updatedMap)) {
        setMultiSelectedMap(updatedMap);
      }
    };
    const getUpdatedMultiSelectedMap = (annotations) => {
      const updatedMap = { ...multiSelectedMap };

      annotations.forEach((annot) => {
        updateGroupAnnotations(annot, updatedMap);
      });

      return updatedMap;
    };
    const updateGroupAnnotations = (annot, updatedMap) => {
      const groupedAnnots = core.getGroupAnnotations(annot, activeDocumentViewerKey);
      const groupIsSelected = groupedAnnots.some((groupedAnnot) => multiSelectedMap[groupedAnnot.Id]);

      if (groupIsSelected) {
        groupedAnnots.forEach((groupAnnot) => {
          updatedMap[groupAnnot.Id] = groupAnnot;
        });
      }
    };
    const hasDifferenceInKeys = (updatedMap) => {
      const originalKeys = Object.keys(multiSelectedMap);
      const updatedKeys = Object.keys(updatedMap);

      return originalKeys.some((key) => !updatedKeys.includes(key));
    };
    const onAnnotationChanged = (annotations, action) => {
      if (action === 'delete') {
        handleAnnotationDelete(annotations);
      } else if (action === 'modify') {
        handleAnnotationModify(annotations);
      }
    };

    core.addEventListener('annotationChanged', onAnnotationChanged, undefined, activeDocumentViewerKey);
    return () => {
      core.removeEventListener('annotationChanged', onAnnotationChanged, activeDocumentViewerKey);
    };
  }, [multiSelectedMap, activeDocumentViewerKey]);

  useEffect(() => {
    return () => {
      setShowMultiReply(false);
      setMultiSelectedMap({});
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

  const handleStateChange = useCallback((newValue) => {
    getParentAnnotations(multiSelectedAnnotations, activeDocumentViewerKey).forEach((annot) => {
      const stateAnnotation = createStateAnnotation(annot, newValue, activeDocumentViewerKey);
      annot.addReply(stateAnnotation);
      const annotationManager = core.getAnnotationManager(activeDocumentViewerKey);
      annotationManager.addAnnotation(stateAnnotation);
      annotationManager.trigger('addReply', [stateAnnotation, annot, annotationManager.getRootAnnotation(annot)]);
    });
    setShowMultiState(false);
  }, [multiSelectedAnnotations, activeDocumentViewerKey]);

  const memoizedContextValue = useMemo(
    () => ({
      resize: () => {},
    }) // Add dependencies if necessary
  );

  if (showMultiReply) {
    return (
      <NoteContext.Provider value={memoizedContextValue}>
        <ReplyAreaMultiSelect
          annotations={getParentAnnotations(multiSelectedAnnotations, activeDocumentViewerKey)}
          onSubmit={() => setShowMultiReply(false)}
          onClose={() => setShowMultiReply(false)}
        />
      </NoteContext.Provider>
    );
  }

  const isMultiStyleButtonDisabled = modifiableMultiSelectAnnotations.length === 0;
  const multiStyleButtonProps = {
    dataElement: DataElements.NOTE_MULTI_STYLE_BUTTON,
    img: 'icon-menu-style-line',
    disabled: isMultiStyleButtonDisabled,
    title: 'action.style'
  };

  return (
    <div className="multi-select-footer">
      <div className="buttons-container">
        <Button
          dataElement={DataElements.NOTE_MULTI_REPLY_BUTTON}
          disabled={multiSelectedAnnotations.length === 0}
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
          disabled={modifiableMultiSelectAnnotations.length === 0}
        />
        <NoteStateFlyout
          isMultiSelectMode={true}
          handleStateChange={handleStateChange}
        />
        {customizableUI
          ? <ToggleElementButton
            {...multiStyleButtonProps}
            toggleElement={DataElements.MULTI_SELECT_STYLE_PANEL_FLYOUT}
          />
          : <Button
            {...multiStyleButtonProps}
            onClick={() => {
              setShowMultiStyle(!showMultiStyle);
            }}
          />
        }
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
            disabled={!canGroup}
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
          disabled={modifiableMultiSelectAnnotations.length === 0}
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
          ariaLabel={t('option.documentControls.closeTooltip')}
        />
      </div>
    </div>
  );
};

MultiSelectControls.propTypes = propTypes;

export default MultiSelectControls;
