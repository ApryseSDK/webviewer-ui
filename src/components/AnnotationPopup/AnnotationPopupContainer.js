import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import AnnotationPopup from './AnnotationPopup';

import core from 'core';
import { getAnnotationPopupPositionBasedOn } from 'helpers/getPopupPosition';
import getAnnotationStyles from 'helpers/getAnnotationStyles';
import applyRedactions from 'helpers/applyRedactions';
import { isMobile, isIE, isMac } from 'helpers/device';
import { getOpenedWarningModal, getOpenedColorPicker, getDatePicker } from 'helpers/getElements';
import getHashParameters from 'helpers/getHashParameters';
import useOnClickOutside from 'hooks/useOnClickOutside';
import useOnRightClick from 'hooks/useOnRightClick';
import actions from 'actions';
import selectors from 'selectors';
import DataElements from 'constants/dataElement';

import './AnnotationPopup.scss';

const { ToolNames } = window.Core.Tools;

const AnnotationPopupContainer = () => {
  const [
    isDisabled,
    isOpen,
    isRightClickAnnotationPopupEnabled,
    isNotesPanelDisabled,
    isAnnotationStylePopupDisabled,
    isInlineCommentingDisabled,
    popupItems,
    isNotesPanelOpen,
    isLinkModalOpen,
    isRichTextPopupOpen,
    isMultiTab,
    tabManager,
    tabs,
    notesInLeftPanel,
    leftPanelOpen,
    activeLeftPanel,
  ] = useSelector(
    (state) => [
      selectors.isElementDisabled(state, DataElements.ANNOTATION_POPUP),
      selectors.isElementOpen(state, DataElements.ANNOTATION_POPUP),
      selectors.isRightClickAnnotationPopupEnabled(state),
      selectors.isElementDisabled(state, DataElements.NOTES_PANEL),
      selectors.isElementDisabled(state, DataElements.ANNOTATION_STYLE_POPUP),
      selectors.isElementDisabled(state, DataElements.INLINE_COMMENT_POPUP),
      selectors.getPopupItems(state, DataElements.ANNOTATION_POPUP),
      selectors.isElementOpen(state, DataElements.NOTES_PANEL),
      selectors.isElementOpen(state, DataElements.LINK_MODAL),
      selectors.isElementOpen(state, 'richTextPopup'),
      selectors.getIsMultiTab(state),
      selectors.getTabManager(state),
      selectors.getTabs(state),
      selectors.getNotesInLeftPanel(state),
      selectors.isElementOpen(state, DataElements.LEFT_PANEL),
      selectors.getActiveLeftPanel(state),
    ],
    shallowEqual,
  );
  const dispatch = useDispatch();
  const [position, setPosition] = useState({ left: 0, top: 0 });
  // focusedAnnotation is selectedAnnotation by default and right-clicked annotation (even when there're multiple annotations selected) when API is on
  const [focusedAnnotation, setFocusedAnnotation] = useState(null);
  const [selectedMultipleAnnotations, setSelectedMultipleAnnotations] = useState(false);
  const [canModify, setCanModify] = useState(false);
  const [isStylePopupOpen, setIsStylePopupOpen] = useState(false);
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [isDatePickerMount, setDatePickerMount] = useState(false);
  const [isCalibrationPopupOpen, setCalibrationPopupOpen] = useState(false);
  const [hasAssociatedLink, setHasAssociatedLink] = useState(true);
  const popupRef = useRef();
  const [includesFormFieldAnnotation, setIncludesFormFieldAnnotation] = useState(false);
  const [stylePopupRepositionFlag, setStylePopupRepositionFlag] = useState(false);

  const isFocusedAnnotationSelected = isRightClickAnnotationPopupEnabled ? core.isAnnotationSelected(focusedAnnotation) : true;
  const annotManager = core.getAnnotationManager();
  const isNotesPanelOpenOrActive = isNotesPanelOpen || (notesInLeftPanel && leftPanelOpen && activeLeftPanel === 'notesPanel');
  // on tablet, the behaviour will be like on desktop, including being draggable

  useOnClickOutside(
    popupRef,
    useCallback((e) => {
      const notesPanel = document.querySelector(`[data-element="${DataElements.NOTES_PANEL}"]`);
      const clickedInNotesPanel = notesPanel?.contains(e.target);
      const clickedInLinkModal = document.querySelector('.LinkModal.open')?.contains(e.target);
      const datePicker = getDatePicker();
      const warningModal = getOpenedWarningModal();
      const colorPicker = getOpenedColorPicker();

      // the notes panel has mousedown handlers to handle the opening/closing states of this component
      // we don't want this handler to run when clicked in the notes panel otherwise the opening/closing states may mess up
      // for example: click on a note will call core.selectAnnotation which triggers the annotationSelected event
      // and opens this component. If we don't exclude the notes panel this handler will run and close it after
      if (!clickedInNotesPanel && !clickedInLinkModal && !warningModal && !colorPicker && !datePicker) {
        if (isRightClickAnnotationPopupEnabled) {
          closeAndReset();
        } else {
          dispatch(actions.closeElement(DataElements.ANNOTATION_POPUP));
        }
      }
    }, [isRightClickAnnotationPopupEnabled])
  );

  // helper function to get all the link annotations that are grouped with the passed in annotation
  const getGroupedLinkAnnotations = (annotation) => {
    const groupedLinks = annotManager.getGroupAnnotations(annotation).filter((groupedAnnotation) => {
      return groupedAnnotation instanceof window.Core.Annotations.Link;
    });
    return groupedLinks;
  };

  useEffect(() => {
    if (focusedAnnotation) {
      const linkAnnotations = getGroupedLinkAnnotations(focusedAnnotation);
      setHasAssociatedLink(!!linkAnnotations.length);

      if (focusedAnnotation.ToolName === ToolNames.CALIBRATION_MEASUREMENT) {
        setCalibrationPopupOpen(true);
      }
    }
  }, [focusedAnnotation, getGroupedLinkAnnotations]);

  // calling this function will always rerender this component
  // because the position state always has a new object reference
  const setPopupPositionAndShow = () => {
    if (popupRef.current && popupItems.length > 0) {
      setPosition(getAnnotationPopupPositionBasedOn(focusedAnnotation, popupRef));
      dispatch(actions.openElement(DataElements.ANNOTATION_POPUP));
    }
  };

  const closeAndReset = () => {
    dispatch(actions.closeElement(DataElements.ANNOTATION_POPUP));
    setPosition({ left: 0, top: 0 });
    setFocusedAnnotation(null);
    setIncludesFormFieldAnnotation(false);
    setCanModify(false);
    setIsStylePopupOpen(false);
    setDatePickerOpen(false);
    setCalibrationPopupOpen(false);
  };

  useEffect(() => {
    if (focusedAnnotation || isStylePopupOpen || isDatePickerMount) {
      setPopupPositionAndShow();
    }

    const onMouseLeftUp = (e) => {
      // clicking on the selected annotation is considered clicking outside of this component
      // so this component will close due to useOnClickOutside
      // this handler is used to make sure that if we click on the selected annotation, this component will show up again
      if (focusedAnnotation) {
        const annotUnderMouse = core.getAnnotationByMouseEvent(e);

        if (!annotUnderMouse) {
          closeAndReset();
        }

        if (!isRightClickAnnotationPopupEnabled && annotUnderMouse === focusedAnnotation) {
          setPopupPositionAndShow();
        }

        // clicking on full page redactions should close the stylePopup if it is already open
        if (focusedAnnotation['redactionType'] === 'fullPage' && isStylePopupOpen) {
          setIsStylePopupOpen(false);
          dispatch(actions.closeElement(DataElements.ANNOTATION_POPUP));
        }
      }
    };

    const onAnnotationChanged = (annotations, action) => {
      if (!isFocusedAnnotationSelected) {
        return;
      }
      if (action === 'modify') {
        setPopupPositionAndShow();
      }
      const hasLinkAnnotation = annotations.some((annotation) => annotation instanceof window.Core.Annotations.Link);
      if (!hasLinkAnnotation) {
        return;
      }
      if (action === 'add') {
        setHasAssociatedLink(true);
      }
      if (action === 'delete') {
        setHasAssociatedLink(false);
      }
    };

    const onUpdateAnnotationPermission = () => {
      if (focusedAnnotation) {
        setCanModify(core.canModify(focusedAnnotation));
      }
    };

    core.addEventListener('mouseLeftUp', onMouseLeftUp);
    core.addEventListener('annotationChanged', onAnnotationChanged);
    core.addEventListener('updateAnnotationPermission', onUpdateAnnotationPermission);
    return () => {
      core.removeEventListener('mouseLeftUp', onMouseLeftUp);
      core.removeEventListener('annotationChanged', onAnnotationChanged);
      core.removeEventListener('updateAnnotationPermission', onUpdateAnnotationPermission);
    };
  }, [canModify, focusedAnnotation, isStylePopupOpen, popupItems, isDatePickerMount, stylePopupRepositionFlag, isRightClickAnnotationPopupEnabled]);

  useEffect(() => {
    const onAnnotationSelected = (annotations, action) => {
      if (action === 'selected' && annotations.length && annotations[0].ToolName !== window.Core.Tools.ToolNames.CROP) {
        if (!isRightClickAnnotationPopupEnabled) {
          setFocusedAnnotation(annotations[0]);
        }
        setSelectedMultipleAnnotations(annotations.length > 1);
        setIncludesFormFieldAnnotation(annotations.some((annotation) => annotation.isFormFieldPlaceholder()));
        const isSignedByAppearance = annotations[0] instanceof window.Core.Annotations.SignatureWidgetAnnotation && annotations[0].isSignedByAppearance();
        setCanModify(core.canModify(annotations[0]) && !isSignedByAppearance);
        if (isNotesPanelOpen) {
          setTimeout(() => dispatch(actions.openElement(DataElements.ANNOTATION_NOTE_CONNECTOR_LINE)), 300);
        }
        const isAnnotationSelectedWithDatePickerOpen = annotations[0] === focusedAnnotation && isDatePickerOpen;
        if (isAnnotationSelectedWithDatePickerOpen) {
          closeAndReset();
        }
      } else {
        const actionOnOtherAnnotation = focusedAnnotation && annotations && !annotations.includes(focusedAnnotation);
        if (!(action === 'deselected' && actionOnOtherAnnotation)) {
          closeAndReset();
        }
      }
    };

    const onResize = () => {
      focusedAnnotation && !isDisabled && setPosition(getAnnotationPopupPositionBasedOn(focusedAnnotation, popupRef));
    };

    core.addEventListener('annotationSelected', onAnnotationSelected);
    core.addEventListener('documentUnloaded', closeAndReset);
    window.addEventListener('resize', onResize);
    return () => {
      core.removeEventListener('annotationSelected', onAnnotationSelected);
      core.removeEventListener('documentUnloaded', closeAndReset);
      window.removeEventListener('resize', onResize);
    };
  }, [isNotesPanelOpen, focusedAnnotation, isDatePickerOpen, isRightClickAnnotationPopupEnabled]);

  useOnRightClick(
    useCallback((e) => {
      if (!isRightClickAnnotationPopupEnabled) {
        return;
      }

      const annotUnderMouse = core.getAnnotationByMouseEvent(e);
      if (annotUnderMouse && annotUnderMouse.ToolName !== window.Core.Tools.ToolNames.CROP) {
        if (e.ctrlKey && isMac) {
          return;
        }

        if (annotUnderMouse !== focusedAnnotation) {
          if (!core.isAnnotationSelected(annotUnderMouse)) {
            core.deselectAllAnnotations();
          }
          core.selectAnnotation(annotUnderMouse);
          setFocusedAnnotation(annotUnderMouse);
          setIsStylePopupOpen(false);
          setDatePickerOpen(false);
        }
        if (annotUnderMouse === focusedAnnotation) {
          setPopupPositionAndShow();
        }
      } else {
        closeAndReset();
      }
    }, [focusedAnnotation, isRightClickAnnotationPopupEnabled])
  );

  useEffect(() => {
    if (isOpen || isRichTextPopupOpen) {
      dispatch(actions.closeElements([
        DataElements.INLINE_COMMENT_POPUP,
      ]));
    }
  }, [isOpen, isRichTextPopupOpen]);

  useEffect(() => {
    const onScroll = _.debounce(() => {
      setStylePopupRepositionFlag((flag) => !flag);
    }, 100);
    const scrollViewElement = core.getDocumentViewer().getScrollViewElement();
    scrollViewElement?.addEventListener('scroll', onScroll);

    return () => {
      scrollViewElement?.removeEventListener('scroll', onScroll);
    };
  }, []);

  /* VIEW FILE */
  const wvServer = !!getHashParameters('webviewerServerURL', null);
  const acceptFormats = wvServer ? window.Core.SupportedFileFormats.SERVER : window.Core.SupportedFileFormats.CLIENT;
  const showViewFileButton = focusedAnnotation instanceof window.Core.Annotations.FileAttachmentAnnotation && isMultiTab
    && acceptFormats.includes(window.Core.mimeTypeToExtension[focusedAnnotation.getFileMetadata().mimeType]);

  const onViewFile = useCallback(async () => {
    if (!tabManager || !isMultiTab) {
      return console.warn('Can\'t open file in non-multi-tab mode');
    }
    const metaData = focusedAnnotation.getFileMetadata();
    const fileAttachmentTab = tabs.find((tab) => tab.options.filename === metaData.filename);
    if (fileAttachmentTab) { // If already opened once
      await tabManager.setActiveTab(fileAttachmentTab.id, true);
      return;
    }
    await tabManager.addTab(await focusedAnnotation.getFileData(), {
      extension: window.Core.mimeTypeToExtension[metaData.mimeType],
      filename: metaData.filename,
      saveCurrentActiveTabState: true,
      setActive: true,
    });
  }, [tabManager, focusedAnnotation, tabs, isMultiTab]);

  /* ALL REACT HOOKS NEED TO BE BEFORE RENDERING */
  if (isDisabled || !focusedAnnotation) {
    return null;
  }

  /* COMMENT / DATE */
  const selectedAnnotations = core.getSelectedAnnotations();
  const numberOfSelectedAnnotations = selectedAnnotations.length;
  const multipleAnnotationsSelected = numberOfSelectedAnnotations > 1;
  const isFreeTextAnnot = focusedAnnotation instanceof window.Core.Annotations.FreeTextAnnotation;
  const isDateFreeTextCanEdit = isFreeTextAnnot && !!focusedAnnotation.getDateFormat() && core.canModifyContents(focusedAnnotation);
  const numberOfGroups = core.getNumberOfGroups(selectedAnnotations);
  const canGroup = numberOfGroups > 1;
  const canUngroup = numberOfGroups === 1 && numberOfSelectedAnnotations > 1 && isFocusedAnnotationSelected;
  const isAppearanceSignature =
    focusedAnnotation instanceof window.Core.Annotations.SignatureWidgetAnnotation
    && focusedAnnotation.isSignedByAppearance();

  const showCommentButton = (
    (!isNotesPanelDisabled || !isInlineCommentingDisabled)
    && (!multipleAnnotationsSelected || (multipleAnnotationsSelected && !isFocusedAnnotationSelected))
    && focusedAnnotation.ToolName !== ToolNames.CROP
    && !includesFormFieldAnnotation
    && !focusedAnnotation.isContentEditPlaceholder()
    && !focusedAnnotation.isUncommittedContentEditPlaceholder()
    && !isAppearanceSignature
  );

  const onCommentAnnotation = () => {
    if (isDateFreeTextCanEdit) {
      setDatePickerOpen(true);
      return;
    }

    dispatch(actions.closeElement('searchPanel'));
    dispatch(actions.closeElement('redactionPanel'));
    const contentEditManager = core.getContentEditManager();
    if (contentEditManager.isInContentEditMode()) {
      dispatch(actions.closeElement('textEditingPanel'));
      contentEditManager.endContentEditMode();
    }

    dispatch(actions.triggerNoteEditing());
    if (isInlineCommentingDisabled) {
      dispatch(actions.openElement(DataElements.NOTES_PANEL));
      dispatch(actions.closeElement(DataElements.ANNOTATION_POPUP));
    } else {
      if (!isNotesPanelOpen) {
        dispatch(actions.openElement(DataElements.INLINE_COMMENT_POPUP));
      }
      closeAndReset();
    }
  };

  const handleDateChange = (text) => {
    annotManager.setNoteContents(focusedAnnotation, text);
    annotManager.updateAnnotation(focusedAnnotation);
  };

  const onDatePickerShow = (isDatePickerShowed) => {
    setDatePickerMount(isDatePickerShowed);
  };

  /* EDIT STYLE */
  const annotationStyle = getAnnotationStyles(focusedAnnotation);
  const hasStyle = Object.keys(annotationStyle).length > 0;

  const toolsWithNoStyling = [
    ToolNames.CROP,
    ToolNames.RADIO_FORM_FIELD,
    ToolNames.CHECK_BOX_FIELD,
    ToolNames.VIDEO_REDACTION,
    ToolNames.VIDEO_AND_AUDIO_REDACTION,
    ToolNames.AUDIO_REDACTION,
  ];

  const showEditStyleButton = (
    canModify
    && hasStyle
    && !isAnnotationStylePopupDisabled
    && (!multipleAnnotationsSelected || canUngroup || (multipleAnnotationsSelected && !isFocusedAnnotationSelected))
    && !toolsWithNoStyling.includes(focusedAnnotation.ToolName)
    && !(focusedAnnotation instanceof window.Core.Annotations.Model3DAnnotation)
    && !focusedAnnotation.isContentEditPlaceholder()
    && !focusedAnnotation.isUncommittedContentEditPlaceholder()
    && !isAppearanceSignature
  );

  const hideSnapModeCheckbox = focusedAnnotation instanceof window.Core.Annotations.EllipseAnnotation || !core.isFullPDFEnabled();

  const onResize = () => {
    setStylePopupRepositionFlag(!stylePopupRepositionFlag);
  };

  /* EDIT CONTENT */
  const showContentEditButton =
    focusedAnnotation.isContentEditPlaceholder()
    && focusedAnnotation.getContentEditType() === window.Core.ContentEdit.Types.TEXT;

  const onEditContent = async () => {
    // TODO: remove this from the state and nuke the modal
    if (isMobile()) {
      const content = await window.Core.ContentEdit.getDocumentContent(focusedAnnotation);
      dispatch(actions.setCurrentContentBeingEdited({ content, annotation: focusedAnnotation }));
      dispatch(actions.openElement('contentEditModal'));
    } else {
      annotManager.trigger('annotationDoubleClicked', focusedAnnotation);
    }
    dispatch(actions.closeElement(DataElements.ANNOTATION_POPUP));
  };

  /* CLEAR APPEARANCE SIGNATURE */
  const onClearAppearanceSignature = () => {
    focusedAnnotation.clearSignature(annotManager);
    dispatch(actions.closeElement(DataElements.ANNOTATION_POPUP));
  };

  /* REDACTION */
  const redactionEnabled = core.isAnnotationRedactable(focusedAnnotation);
  const showRedactionButton = redactionEnabled && !multipleAnnotationsSelected && !includesFormFieldAnnotation;

  const onApplyRedaction = () => {
    dispatch(applyRedactions(focusedAnnotation));
    dispatch(actions.closeElement(DataElements.ANNOTATION_POPUP));
  };

  /* GROUP / UNGROUP */
  const primaryAnnotation = selectedAnnotations.find((selectedAnnotation) => !selectedAnnotation.InReplyTo);

  const showGroupButton =
    isFocusedAnnotationSelected
    && canGroup
    && !includesFormFieldAnnotation;

  const onGroupAnnotations = () => {
    core.groupAnnotations(primaryAnnotation, selectedAnnotations);
  };

  const showUngroupButton = canUngroup;

  const onUngroupAnnotations = () => {
    core.ungroupAnnotations(selectedAnnotations);
  };

  /* FORM FIELD */
  const showFormFieldButton = includesFormFieldAnnotation;

  const onOpenFormField = () => {
    closeAndReset();
    dispatch(actions.openElement(DataElements.FORM_FIELD_EDIT_POPUP));
  };

  /* DELETE ANNOTATION */
  const showDeleteButton = canModify;

  const onDeleteAnnotation = () => {
    if (isFocusedAnnotationSelected) {
      core.deleteAnnotations(core.getSelectedAnnotations());
    } else {
      core.deleteAnnotations([focusedAnnotation]);
    }
    closeAndReset();
  };

  /* LINK ANNOTATION */
  const toolsThatCantHaveLinks = [
    ToolNames.CROP,
    ToolNames.SIGNATURE,
    ToolNames.REDACTION,
    ToolNames.REDACTION2,
    ToolNames.REDACTION3,
    ToolNames.REDACTION4,
    ToolNames.STICKY,
    ToolNames.STICKY2,
    ToolNames.STICKY3,
    ToolNames.STICKY4,
  ];

  const showLinkButton = (
    !toolsThatCantHaveLinks.includes(focusedAnnotation.ToolName)
    && !includesFormFieldAnnotation
    && !focusedAnnotation.isContentEditPlaceholder()
    // TODO(Adam): Update this once SoundAnnotation tool is created.
    && !(focusedAnnotation instanceof window.Core.Annotations.SoundAnnotation)
    && !focusedAnnotation.isUncommittedContentEditPlaceholder()
    && !isAppearanceSignature
  );

  const linkAnnotationToURL = () => {
    if (hasAssociatedLink) {
      const annotationsToUnlink = isFocusedAnnotationSelected ? selectedAnnotations : [focusedAnnotation];
      annotationsToUnlink.forEach((annot) => {
        const linkAnnotations = getGroupedLinkAnnotations(annot);
        linkAnnotations.forEach((linkAnnot, index) => {
          annotManager.ungroupAnnotations([linkAnnot]);
          if (annot instanceof window.Core.Annotations.TextHighlightAnnotation && annot.Opacity === 0 && index === 0) {
            annotManager.deleteAnnotations([annot, linkAnnot], null, true);
          } else {
            annotManager.deleteAnnotation(linkAnnot, null, true);
          }
        });
      });
      closeAndReset();
    } else {
      dispatch(actions.openElement(DataElements.LINK_MODAL));
    }
  };

  /* DOWNLOAD FILE ATTACHMENT */
  const showFileDownloadButton = focusedAnnotation instanceof window.Core.Annotations.FileAttachmentAnnotation;

  const downloadFileAttachment = (annot) => {
    // no need to check that annot is of type file annot as the check is done in the JSX
    // trigger the annotationDoubleClicked event so that it will download the file
    annotManager.trigger('annotationDoubleClicked', annot);
  };

  /* AUDIO ANNOTATION */
  const showAudioPlayButton = (
    !isIE &&
    !selectedMultipleAnnotations &&
    focusedAnnotation instanceof window.Core.Annotations.SoundAnnotation &&
    focusedAnnotation.hasAudioData()
  );

  const handlePlaySound = (annotation) => {
    dispatch(actions.setActiveSoundAnnotation(annotation));
    dispatch(actions.triggerResetAudioPlaybackPosition(true));
    dispatch(actions.openElement('audioPlaybackPopup'));
  };

  return (
    <AnnotationPopup
      isMobile={isMobile()}
      isIE={isIE}
      isOpen={isOpen}
      isRightClickMenu={isRightClickAnnotationPopupEnabled}
      isNotesPanelOpenOrActive={isNotesPanelOpenOrActive}
      isRichTextPopupOpen={isRichTextPopupOpen}
      isLinkModalOpen={isLinkModalOpen}

      popupRef={popupRef}
      position={position}
      focusedAnnotation={focusedAnnotation}

      showViewFileButton={showViewFileButton}
      onViewFile={onViewFile}

      showCommentButton={showCommentButton}
      onCommentAnnotation={onCommentAnnotation}
      isDateFreeTextCanEdit={isDateFreeTextCanEdit}
      isDatePickerOpen={isDatePickerOpen}
      handleDateChange={handleDateChange}
      onDatePickerShow={onDatePickerShow}
      isCalibrationPopupOpen={isCalibrationPopupOpen}

      showEditStyleButton={showEditStyleButton}
      isStylePopupOpen={isStylePopupOpen}
      hideSnapModeCheckbox={hideSnapModeCheckbox}
      openEditStylePopup={() => setIsStylePopupOpen(true)}
      closeEditStylePopup={() => setIsStylePopupOpen(false)}
      annotationStyle={annotationStyle}
      onResize={onResize}

      showContentEditButton={showContentEditButton}
      onEditContent={onEditContent}

      isAppearanceSignature={isAppearanceSignature}
      onClearAppearanceSignature={onClearAppearanceSignature}

      showRedactionButton={showRedactionButton}
      onApplyRedaction={onApplyRedaction}

      showGroupButton={showGroupButton}
      onGroupAnnotations={onGroupAnnotations}
      showUngroupButton={showUngroupButton}
      onUngroupAnnotations={onUngroupAnnotations}

      showFormFieldButton={showFormFieldButton}
      onOpenFormField={onOpenFormField}

      showDeleteButton={showDeleteButton}
      onDeleteAnnotation={onDeleteAnnotation}

      showLinkButton={showLinkButton}
      hasAssociatedLink={hasAssociatedLink}
      linkAnnotationToURL={linkAnnotationToURL}

      showFileDownloadButton={showFileDownloadButton}
      downloadFileAttachment={downloadFileAttachment}

      showAudioPlayButton={showAudioPlayButton}
      handlePlaySound={handlePlaySound}
    />
  );
};

export default AnnotationPopupContainer;
