import React, { useState, useEffect, useRef, useCallback } from 'react';
import Draggable from 'react-draggable';
import classNames from 'classnames';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';

import ActionButton from 'components/ActionButton';
import AnnotationStylePopup from 'components/AnnotationStylePopup';
import DatePicker from 'src/components/DatePicker';
import CustomizablePopup from 'components/CustomizablePopup';

import core from 'core';
import { getDataWithKey, mapToolNameToKey, mapAnnotationToKey } from 'constants/map';
import { getAnnotationPopupPositionBasedOn } from 'helpers/getPopupPosition';
import getAnnotationStyles from 'helpers/getAnnotationStyles';
import applyRedactions from 'helpers/applyRedactions';
import { isMobile, isIE } from 'helpers/device';
import { getOpenedWarningModal, getOpenedColorPicker, getDatePicker } from 'helpers/getElements';
import useOnClickOutside from 'hooks/useOnClickOutside';
import actions from 'actions';
import selectors from 'selectors';

import './AnnotationPopup.scss';
import getHashParameters from 'helpers/getHashParameters';

const AnnotationPopup = () => {
  const [
    isDisabled,
    isOpen,
    isNotesPanelDisabled,
    isAnnotationStylePopupDisabled,
    popupItems,
    isNotesPanelOpen,
    isMultiTab,
    tabManager,
    tabs,
  ] = useSelector(
    (state) => [
      selectors.isElementDisabled(state, 'annotationPopup'),
      selectors.isElementOpen(state, 'annotationPopup'),
      selectors.isElementDisabled(state, 'notesPanel'),
      selectors.isElementDisabled(state, 'annotationStylePopup'),
      selectors.getPopupItems(state, 'annotationPopup'),
      selectors.isElementOpen(state, 'notesPanel'),
      selectors.getIsMultiTab(state),
      selectors.getTabManager(state),
      selectors.getTabs(state),
    ],
    shallowEqual,
  );
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const [position, setPosition] = useState({ left: 0, top: 0 });
  // first annotation in the array when there're multiple annotations selected
  const [firstAnnotation, setFirstAnnotation] = useState(null);
  const [selectedMultipleAnnotations, setSelectedMultipleAnnotations] = useState(false);
  const [canModify, setCanModify] = useState(false);
  const [isStylePopupOpen, setIsStylePopupOpen] = useState(false);
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [isDatePickerMount, setDatePickerMount] = useState(false);
  const [hasAssociatedLink, setHasAssociatedLink] = useState(true);
  const [shortCutKeysFor3DVisible, setShortCutKeysFor3DVisible] = useState(false);
  const popupRef = useRef();
  const [includesFormFieldAnnotation, setIncludesFormFieldAnnotation] = useState(false);
  const [stylePopupRepositionFlag, setStylePopupRepositionFlag] = useState(false);

  // helper function to get all the link annotations that are grouped with the passed in annotation
  const getGroupedLinkAnnotations = (annotation) => {
    const groupedLinks = core.getAnnotationManager().getGroupAnnotations(annotation).filter((groupedAnnotation) => {
      return groupedAnnotation instanceof Annotations.Link;
    });
    return groupedLinks;
  };

  useOnClickOutside(popupRef, (e) => {
    const notesPanel = document.querySelector('[data-element="notesPanel"]');
    const clickedInNotesPanel = notesPanel?.contains(e.target);
    const datePicker = getDatePicker();
    const warningModal = getOpenedWarningModal();
    const colorPicker = getOpenedColorPicker();

    // the notes panel has mousedown handlers to handle the opening/closing states of this component
    // we don't want this handler to run when clicked in the notes panel otherwise the opening/closing states may mess up
    // for example: click on a note will call core.selectAnnotation which triggers the annotationSelected event
    // and opens this component. If we don't exclude the notes panel this handler will run and close it after
    if (!clickedInNotesPanel && !warningModal && !colorPicker && !datePicker) {
      dispatch(actions.closeElement('annotationPopup'));
    }
  });

  useEffect(() => {
    if (firstAnnotation) {
      const linkAnnotations = getGroupedLinkAnnotations(firstAnnotation);
      setHasAssociatedLink(!!linkAnnotations.length);
    }
  }, [firstAnnotation]);

  useEffect(() => {
    // calling this function will always rerender this component
    // because the position state always has a new object reference
    const setPopupPositionAndShow = () => {
      if (popupRef.current && popupItems.length > 0) {
        setPosition(getAnnotationPopupPositionBasedOn(firstAnnotation, popupRef));
        dispatch(actions.openElement('annotationPopup'));
      }
    };

    if (firstAnnotation || isStylePopupOpen || isDatePickerMount) {
      setPopupPositionAndShow();
    }

    const onMouseLeftUp = (e) => {
      // clicking on the selected annotation is considered clicking outside of this component
      // so this component will close due to useOnClickOutside
      // this handler is used to make sure that if we click on the selected annotation, this component will show up again
      if (firstAnnotation) {
        const annotUnderMouse = core.getAnnotationByMouseEvent(e);

        if (annotUnderMouse === firstAnnotation) {
          setPopupPositionAndShow();
        }

        // clicking on full page redactions should close the stylePopup if it is already open
        if (firstAnnotation['redactionType'] === 'fullPage' && isStylePopupOpen) {
          setIsStylePopupOpen(false);
          dispatch(actions.closeElement('annotationPopup'));
        }
      }
    };

    const onAnnotationChanged = (annotations, action) => {
      if (!core.isAnnotationSelected(firstAnnotation)) {
        return;
      }
      if (action === 'modify') {
        setPopupPositionAndShow();
      }
      const hasLinkAnnotation = annotations.some((annotation) => annotation instanceof Annotations.Link);
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
      if (firstAnnotation) {
        setCanModify(core.canModify(firstAnnotation));
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
  }, [dispatch, canModify, firstAnnotation, isStylePopupOpen, popupItems, isDatePickerMount, stylePopupRepositionFlag]);

  useEffect(() => {
    const closeAndReset = () => {
      dispatch(actions.closeElement('annotationPopup'));
      setPosition({ left: 0, top: 0 });
      setFirstAnnotation(null);
      setIncludesFormFieldAnnotation(false);
      setCanModify(false);
      setIsStylePopupOpen(false);
      setDatePickerOpen(false);
    };

    const onAnnotationSelected = (annotations, action) => {
      if (action === 'selected' && annotations.length && annotations[0].ToolName !== window.Core.Tools.ToolNames.CROP) {
        setFirstAnnotation(annotations[0]);
        setSelectedMultipleAnnotations(annotations.length > 1);
        setIncludesFormFieldAnnotation(annotations.some((annotation) => annotation.isFormFieldPlaceholder()));
        setCanModify(core.canModify(annotations[0]));
        if (isNotesPanelOpen) {
          setTimeout(() => dispatch(actions.openElement('annotationNoteConnectorLine')), 300);
        }
      } else {
        const actionOnOtherAnnotation = firstAnnotation && annotations && !annotations.includes(firstAnnotation);
        if (!(action === 'deselected' && actionOnOtherAnnotation)) {
          closeAndReset();
        }
      }
    };

    const onResize = () => {
      firstAnnotation && setPosition(getAnnotationPopupPositionBasedOn(firstAnnotation, popupRef));
    };

    core.addEventListener('annotationSelected', onAnnotationSelected);
    core.addEventListener('documentUnloaded', closeAndReset);
    window.addEventListener('resize', onResize);
    return () => {
      core.removeEventListener('annotationSelected', onAnnotationSelected);
      core.removeEventListener('documentUnloaded', closeAndReset);
      window.removeEventListener('resize', onResize);
    };
  }, [dispatch, isNotesPanelOpen, firstAnnotation]);

  const onViewFile = useCallback(async () => {
    if (!tabManager || !isMultiTab) {
      return console.warn('Can\'t open file in non-multi-tab mode');
    }
    const metaData = firstAnnotation.getFileMetadata();
    const fileAttachmentTab = tabs.find((tab) => tab.options.filename === metaData.filename);
    if (fileAttachmentTab) { // If already opened once
      // eslint-disable-next-line no-return-await
      return await tabManager.setActiveTab(fileAttachmentTab.id, true);
    }
    await tabManager.addTab(await firstAnnotation.getFileData(), {
      extension: window.Core.mimeTypeToExtension[metaData.mimeType],
      filename: metaData.filename,
      saveCurrentActiveTabState: true,
      setActive: true,
    });
  }, [tabManager, firstAnnotation, tabs, isMultiTab]);


  if (isDisabled || !firstAnnotation) {
    return null;
  }

  const toggleDatePicker = () => setDatePickerOpen((isOpen) => !isOpen);
  const style = getAnnotationStyles(firstAnnotation);
  const hasStyle = Object.keys(style).length > 0;
  const redactionEnabled = core.isAnnotationRedactable(firstAnnotation);
  const selectedAnnotations = core.getSelectedAnnotations();
  const primaryAnnotation = selectedAnnotations.find((selectedAnnotation) => !selectedAnnotation.InReplyTo);
  const numberOfSelectedAnnotations = selectedAnnotations.length;
  const numberOfGroups = core.getNumberOfGroups(selectedAnnotations);
  const canGroup = numberOfGroups > 1;
  const canUngroup = numberOfGroups === 1 && numberOfSelectedAnnotations > 1;
  const multipleAnnotationsSelected = numberOfSelectedAnnotations > 1;

  const isFreeTextAnnot = firstAnnotation instanceof window.Annotations.FreeTextAnnotation;
  const isDateFreeTextCanEdit = isFreeTextAnnot && firstAnnotation.getDateFormat() && core.canModifyContents(firstAnnotation);

  const commentOnAnnotation = () => {
    if (isDateFreeTextCanEdit) {
      toggleDatePicker();
      return;
    }
    dispatch(actions.openElement('notesPanel'));
    dispatch(actions.closeElement('searchPanel'));
    dispatch(actions.triggerNoteEditing());

    dispatch(actions.closeElement('annotationPopup'));
  };

  const handleDateChange = (text) => {
    core.getAnnotationManager().setNoteContents(firstAnnotation, text);
    core.getAnnotationManager().updateAnnotation(firstAnnotation);
  };
  const ShortCutKeysFor3DComponent = () => {
    return (<div className="shortCuts3D">
      <div className="closeButton" onClick={() => setShortCutKeysFor3DVisible(false)}>x</div>
      <div className="row">{t('action.rotate3D')} <span>{t('shortcut.rotate3D')}</span></div>
      <div className="row">{t('action.zoom')} <span>{t('shortcut.zoom3D')}</span></div>
    </div>);
  };

  const downloadFileAttachment = (annot) => {
    // no need to check that annot is of type file annot as the check is done in the JSX
    // trigger the annotationDoubleClicked event so that it will download the file
    core.getAnnotationManager().trigger('annotationDoubleClicked', annot);
  };

  const handlePlaySound = (annotation) => {
    dispatch(actions.setActiveSoundAnnotation(annotation));
    dispatch(actions.triggerResetAudioPlaybackPosition(true));
    dispatch(actions.openElement('audioPlaybackPopup'));
  };

  const toolNames = window.Core.Tools.ToolNames;
  const toolsWithNoStyling = [
    toolNames.CROP,
    toolNames.RADIO_FORM_FIELD,
    toolNames.CHECK_BOX_FIELD,
  ];

  const toolsThatCantHaveLinks = [
    toolNames.CROP,
    toolNames.SIGNATURE,
    toolNames.REDACTION,
    toolNames.REDACTION2,
    toolNames.REDACTION3,
    toolNames.REDACTION4,
    toolNames.STICKY,
    toolNames.STICKY2,
    toolNames.STICKY3,
    toolNames.STICKY4,
  ];

  const showCommentButton =
    !isNotesPanelDisabled &&
    !multipleAnnotationsSelected &&
    firstAnnotation.ToolName !== toolNames.CROP &&
    !includesFormFieldAnnotation &&
    !firstAnnotation.isContentEditPlaceholder();

  const showEditStyleButton =
    canModify &&
    hasStyle &&
    !isAnnotationStylePopupDisabled &&
    (!multipleAnnotationsSelected || canUngroup) &&
    !toolsWithNoStyling.includes(firstAnnotation.ToolName) && !(firstAnnotation instanceof Annotations.Model3DAnnotation) &&
    !firstAnnotation.isContentEditPlaceholder();

  const showRedactionButton = redactionEnabled && !multipleAnnotationsSelected && !includesFormFieldAnnotation;

  const showGroupButton = canGroup && !includesFormFieldAnnotation;

  const showCalibrateButton =
    canModify && firstAnnotation.Measure && firstAnnotation instanceof Annotations.LineAnnotation;

  const showFileDownloadButton = firstAnnotation instanceof window.Annotations.FileAttachmentAnnotation;

  const wvServer = !!getHashParameters('webviewerServerURL', null);
  const acceptFormats = wvServer ? window.Core.SupportedFileFormats.SERVER : window.Core.SupportedFileFormats.CLIENT;
  const showViewFileButton = firstAnnotation instanceof Annotations.FileAttachmentAnnotation && isMultiTab
    && acceptFormats.includes(window.Core.mimeTypeToExtension[firstAnnotation.getFileMetadata().mimeType]);

  const shouldShowAudioPlayButton = (
    !isIE &&
    !selectedMultipleAnnotations &&
    firstAnnotation instanceof window.Annotations.SoundAnnotation &&
    firstAnnotation.hasAudioData()
  );

  const showLinkButton = (
    !toolsThatCantHaveLinks.includes(firstAnnotation.ToolName) &&
    !includesFormFieldAnnotation &&
    !firstAnnotation.isContentEditPlaceholder() &&
    !(firstAnnotation instanceof Annotations.SoundAnnotation) // TODO(Adam): Update this once SoundAnnotation tool is created.
  );

  const onDatePickerShow = (isDatePickerShowed) => {
    setDatePickerMount(isDatePickerShowed);
  };

  const show3DShortCutButton = firstAnnotation instanceof Annotations.Model3DAnnotation && !isMobile();

  const onResize = () => {
    setStylePopupRepositionFlag(!stylePopupRepositionFlag);
  };

  const isFreeText =
    firstAnnotation instanceof window.Annotations.FreeTextAnnotation &&
    (firstAnnotation.getIntent() === window.Annotations.FreeTextAnnotation.Intent.FreeText ||
    firstAnnotation.getIntent() === window.Annotations.FreeTextAnnotation.Intent.FreeTextCallout);
  const isRedaction = firstAnnotation instanceof window.Annotations.RedactionAnnotation;
  const colorMapKey = mapAnnotationToKey(firstAnnotation);
  const isMeasure = !!firstAnnotation.Measure;
  const showLineStyleOptions = getDataWithKey(mapToolNameToKey(firstAnnotation.ToolName)).hasLineEndings;

  let properties = {};
  if (showLineStyleOptions) {
    properties = {
      StartLineStyle: firstAnnotation.getStartStyle(),
      EndLineStyle: firstAnnotation.getEndStyle(),
    };
  }

  if (isFreeText) {
    const richTextStyles = firstAnnotation.getRichTextStyle();
    properties = {
      Font: firstAnnotation.Font,
      FontSize: firstAnnotation.FontSize,
      TextAlign: firstAnnotation.TextAlign,
      TextVerticalAlign: firstAnnotation.TextVerticalAlign,
      bold: richTextStyles?.[0]?.['font-weight'] === 'bold' ?? false,
      italic: richTextStyles?.[0]?.['font-style'] === 'italic' ?? false,
      underline: richTextStyles?.[0]?.['text-decoration']?.includes('underline') || richTextStyles?.[0]?.['text-decoration']?.includes('word'),
      strikeout: richTextStyles?.[0]?.['text-decoration']?.includes('line-through') ?? false,
    };
  }

  if (isRedaction) {
    properties = {
      OverlayText: firstAnnotation['OverlayText'],
      Font: firstAnnotation['Font'],
      FontSize: firstAnnotation['FontSize'],
      TextAlign: firstAnnotation['TextAlign']
    };
  }

  const annotationPopup = (
    <div
      className={classNames({
        Popup: true,
        AnnotationPopup: true,
        open: isOpen,
        closed: !isOpen,
        stylePopupOpen: isStylePopupOpen,
      })}
      ref={popupRef}
      data-element="annotationPopup"
      style={{ ...position }}
    >
      {isStylePopupOpen || isDatePickerOpen ? (
        isStylePopupOpen ? (
          <AnnotationStylePopup
            annotations={[firstAnnotation]}
            style={style}
            isOpen={isOpen}
            onResize={onResize}
            isFreeText={isFreeText}
            isRedaction={isRedaction}
            isMeasure={isMeasure}
            colorMapKey={colorMapKey}
            showLineStyleOptions={showLineStyleOptions}
            properties={properties}
            hideSnapModeCheckbox={(firstAnnotation instanceof window.Annotations.EllipseAnnotation || !core.isFullPDFEnabled())}
          />
        ) : (
          <DatePicker onClick={handleDateChange} annotation={firstAnnotation} onDatePickerShow={onDatePickerShow} />
        )
      ) : (shortCutKeysFor3DVisible && firstAnnotation instanceof Annotations.Model3DAnnotation) ?
        <ShortCutKeysFor3DComponent /> : (
          <CustomizablePopup dataElement="annotationPopup">
            {showViewFileButton && (
              <ActionButton
                dataElement="viewFileButton"
                img="icon-view"
                title="action.viewFile"
                onClick={onViewFile}
              />
            )}
            {showCommentButton && (
              <ActionButton
                dataElement="annotationCommentButton"
                title="action.comment"
                img="icon-header-chat-line"
                onClick={commentOnAnnotation}
              />
            )}
            {showEditStyleButton && (
              <ActionButton
                dataElement="annotationStyleEditButton"
                title="action.style"
                img="icon-menu-style-line"
                onClick={() => setIsStylePopupOpen(true)}
              />
            )}
            {firstAnnotation.isContentEditPlaceholder() && firstAnnotation.getContentEditType() === window.Core.ContentEdit.Types.TEXT && (
              <ActionButton
                dataElement="annotationContentEditButton"
                title="action.edit"
                img="ic_edit_page_24px"
                onClick={async () => {
                  // eslint-disable-next-line no-undef
                  const content = await instance.Core.ContentEdit.getDocumentContent(firstAnnotation);
                  dispatch(actions.setCurrentContentBeingEdited({ content, annotation: firstAnnotation }));
                  dispatch(actions.openElement('contentEditModal'));
                  dispatch(actions.closeElement('annotationPopup'));
                }}
              />
            )}
            {showRedactionButton && (
              <ActionButton
                dataElement="annotationRedactButton"
                title="action.apply"
                img="ic_check_black_24px"
                onClick={() => {
                  dispatch(applyRedactions(firstAnnotation));
                  dispatch(actions.closeElement('annotationPopup'));
                }}
              />
            )}
            {showGroupButton && (
              <ActionButton
                dataElement="annotationGroupButton"
                title="action.group"
                img="group-annotations-icon"
                onClick={() => core.groupAnnotations(primaryAnnotation, selectedAnnotations)}
              />
            )}
            {canUngroup && (
              <ActionButton
                dataElement="annotationUngroupButton"
                title="action.ungroup"
                img="ungroup-annotations-icon"
                onClick={() => core.ungroupAnnotations(selectedAnnotations)}
              />
            )}
            {includesFormFieldAnnotation && (
              <ActionButton
                title="action.formFieldEdit"
                img="icon-edit-form-field"
                onClick={() => {
                  dispatch(actions.closeElement('annotationPopup'));
                  dispatch(actions.openElement('formFieldEditPopup'));
                }}
                dataElement="formFieldEditButton"
              />
            )
            }
            {canModify && (
              <ActionButton
                dataElement="annotationDeleteButton"
                title="action.delete"
                img="icon-delete-line"
                onClick={() => {
                  core.deleteAnnotations(core.getSelectedAnnotations());
                  dispatch(actions.closeElement('annotationPopup'));
                }}
              />
            )}
            {showCalibrateButton && (
              <ActionButton
                dataElement="calibrateButton"
                title="action.calibrate"
                img="calibrate"
                onClick={() => {
                  dispatch(actions.closeElement('annotationPopup'));
                  dispatch(actions.openElement('calibrationModal'));
                }}
              />
            )}
            {showLinkButton && (
              <ActionButton
                title="tool.Link"
                img={hasAssociatedLink ? 'icon-tool-unlink' : 'icon-tool-link'}
                onClick={
                  hasAssociatedLink
                    ? () => {
                      const annotManager = core.getAnnotationManager();
                      selectedAnnotations.forEach((annot) => {
                        const linkAnnotations = getGroupedLinkAnnotations(annot);
                        linkAnnotations.forEach((linkAnnot, index) => {
                          annotManager.ungroupAnnotations([linkAnnot]);
                          if (annot instanceof Annotations.TextHighlightAnnotation && annot.Opacity === 0 && index === 0) {
                            annotManager.deleteAnnotations([annot, linkAnnot], null, true);
                          } else {
                            annotManager.deleteAnnotation(linkAnnot, null, true);
                          }
                        });
                      });
                      dispatch(actions.closeElement('annotationPopup'));
                    }
                    : () => dispatch(actions.openElement('linkModal'))
                }
                dataElement="linkButton"
              />
            )}
            {showFileDownloadButton &&
              (
                <ActionButton
                  title="action.fileAttachmentDownload"
                  img="icon-download"
                  onClick={() => downloadFileAttachment(firstAnnotation)}
                  dataElement="fileAttachmentDownload"
                />
              )
            }
            {
              show3DShortCutButton &&
              (
                <ActionButton
                  title="action.viewShortCutKeysFor3D"
                  img="icon-keyboard"
                  onClick={() => setShortCutKeysFor3DVisible(true)}
                  dataElement="shortCutKeysFor3D"
                />
              )
            }
            {
              shouldShowAudioPlayButton &&
              (
                <ActionButton
                  title="action.playAudio"
                  img="ic_play_24px"
                  onClick={() => handlePlaySound(firstAnnotation)}
                  dataElement="playSoundButton"
                />
              )
            }
          </CustomizablePopup>
        )}
    </div>
  );

  return isIE || isMobile() ? (
    annotationPopup
  ) : (
    <Draggable cancel=".Button, .cell, .sliders-container svg, select, button, input">{annotationPopup}</Draggable>
  );
};

export default AnnotationPopup;
