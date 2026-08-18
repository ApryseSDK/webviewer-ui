import React from 'react';
import Draggable from 'react-draggable';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import FocusTrap from 'components/FocusTrap';

import ActionButton from 'components/ActionButton';
import DatePicker from 'components/DatePicker';
import CustomizablePopup from 'components/CustomizablePopup';
import CalibrationPopup from 'components/CalibrationPopup';

import DataElements from 'constants/dataElement';

import './AnnotationPopup.scss';
import { getShadowRootFromNode } from 'helpers/getRootNode';
const propTypes = {
  isMobile: PropTypes.bool,
  isIE: PropTypes.bool,
  isOpen: PropTypes.bool,
  isRightClickMenu: PropTypes.bool,
  isNotesPanelOpenOrActive: PropTypes.bool,
  isRichTextPopupOpen: PropTypes.bool,
  isLinkModalOpen: PropTypes.bool,
  isWarningModalOpen: PropTypes.bool,
  isContextMenuPopupOpen: PropTypes.bool,
  isVisible: PropTypes.bool,

  focusedAnnotation: PropTypes.object,
  popupRef: PropTypes.any,
  position: PropTypes.object,

  showViewFileButton: PropTypes.bool,
  onViewFile: PropTypes.func,

  showCommentButton: PropTypes.bool,
  onCommentAnnotation: PropTypes.func,
  isDateFreeTextCanEdit: PropTypes.bool,
  isDatePickerOpen: PropTypes.bool,
  handleDateChange: PropTypes.func,
  onDatePickerShow: PropTypes.func,
  isCalibrationPopupOpen: PropTypes.bool,

  showEditStyleButton: PropTypes.bool,
  showContentEditButton: PropTypes.bool,
  onEditContent: PropTypes.func,
  openContentEditDeleteWarningModal: PropTypes.func,

  showClearSignatureButton: PropTypes.bool,
  onClearAppearanceSignature: PropTypes.func,

  showRedactionButton: PropTypes.bool,
  onApplyRedaction: PropTypes.func,

  showGroupButton: PropTypes.bool,
  onGroupAnnotations: PropTypes.func,
  showUngroupButton: PropTypes.bool,
  onUngroupAnnotations: PropTypes.func,

  showFormFieldButton: PropTypes.bool,
  onOpenFormField: PropTypes.func,

  showDeleteButton: PropTypes.bool,
  onDeleteAnnotation: PropTypes.func,

  showLinkButton: PropTypes.bool,
  hasAssociatedLink: PropTypes.bool,
  linkAnnotationToURL: PropTypes.func,

  showFileDownloadButton: PropTypes.bool,
  downloadFileAttachment: PropTypes.func,

  showAudioPlayButton: PropTypes.bool,
  handlePlaySound: PropTypes.func,

  showCalibrateButton: PropTypes.bool,
  onOpenCalibration: PropTypes.func,

  showAlignButton: PropTypes.bool,
  onOpenAlignmentModal: PropTypes.func,

  toggleStylePanel: PropTypes.func,
};

const AnnotationPopup = ({
  isMobile,
  isIE,
  isOpen,
  isRightClickMenu,
  isNotesPanelOpenOrActive,
  isRichTextPopupOpen,
  isLinkModalOpen,
  isWarningModalOpen,
  isContextMenuPopupOpen,
  isVisible,

  focusedAnnotation,
  popupRef,
  position,

  showViewFileButton,
  onViewFile,

  showCommentButton,
  onCommentAnnotation,
  isDateFreeTextCanEdit,
  isDatePickerOpen,
  handleDateChange,
  onDatePickerShow,
  isCalibrationPopupOpen,

  showEditStyleButton,
  showContentEditButton,
  onEditContent,
  openContentEditDeleteWarningModal,

  showClearSignatureButton,
  onClearAppearanceSignature,

  showRedactionButton,
  onApplyRedaction,

  showGroupButton,
  onGroupAnnotations,
  showUngroupButton,
  onUngroupAnnotations,

  showFormFieldButton,
  onOpenFormField,

  showDeleteButton,
  onDeleteAnnotation,

  showLinkButton,
  hasAssociatedLink,
  linkAnnotationToURL,

  showFileDownloadButton,
  downloadFileAttachment,

  showAudioPlayButton,
  handlePlaySound,

  showCalibrateButton,
  onOpenCalibration,

  showAlignButton,
  onOpenAlignmentModal,

  toggleStylePanel,
}) => {

  const commentButtonLabel = isDateFreeTextCanEdit ? 'action.changeDate' : 'action.comment';
  const commentButtonImg = isDateFreeTextCanEdit ? 'icon-tool-fill-and-sign-calendar' : 'icon-header-chat-line';
  const isFreeText =
    focusedAnnotation instanceof window.Core.Annotations.FreeTextAnnotation &&
    (focusedAnnotation.getIntent() === window.Core.Annotations.FreeTextAnnotation.Intent.FreeText ||
      focusedAnnotation.getIntent() === window.Core.Annotations.FreeTextAnnotation.Intent.FreeTextCallout);
  const activeRoot = getShadowRootFromNode(document.activeElement);
  const popupRoot = getShadowRootFromNode(popupRef?.current);
  const isInstanceActive = !window.isApryseWebViewerWebComponent || Boolean(popupRoot && activeRoot === popupRoot);
  const isContentEdit = focusedAnnotation.isContentEditPlaceholder?.();
  const isReadOnlySignature = focusedAnnotation instanceof window.Core.Annotations.SignatureWidgetAnnotation && focusedAnnotation.fieldFlags.get(window.Core.Annotations.WidgetFlags.READ_ONLY);

  const renderPopup = () => {
    switch (true) {
      case isDatePickerOpen:
        return (
          <DatePicker onClick={handleDateChange} annotation={focusedAnnotation} onDatePickerShow={onDatePickerShow} />
        );
      case isCalibrationPopupOpen:
        return <CalibrationPopup annotation={focusedAnnotation} />;
      default:
        return (
          <FocusTrap
            locked={isOpen && isInstanceActive && !isRichTextPopupOpen && !isNotesPanelOpenOrActive && !isLinkModalOpen && !isWarningModalOpen && !isFreeText && !isContextMenuPopupOpen}
          >
            <div className="container">
              <CustomizablePopup
                dataElement={DataElements.ANNOTATION_POPUP}
                childrenClassName='main-menu-button'
              >
                {showViewFileButton && (
                  <ActionButton
                    className="main-menu-button"
                    dataElement="viewFileButton"
                    label={isRightClickMenu ? 'action.viewFile' : ''}
                    title={!isRightClickMenu ? 'action.viewFile' : ''}
                    img="icon-view"
                    onClick={onViewFile}
                  />
                )}
                {showCommentButton && (
                  <ActionButton
                    className="main-menu-button"
                    dataElement="annotationCommentButton"
                    label={isRightClickMenu ? commentButtonLabel : ''}
                    title={!isRightClickMenu ? commentButtonLabel : ''}
                    img={commentButtonImg}
                    onClick={onCommentAnnotation}
                  />
                )}
                {showEditStyleButton && (
                  <ActionButton
                    className="main-menu-button"
                    dataElement="annotationStyleEditButton"
                    label={isRightClickMenu ? 'action.style' : ''}
                    title={!isRightClickMenu ? 'action.style' : ''}
                    img="icon-menu-style-line"
                    onClick={ toggleStylePanel }
                  />
                )}
                {showContentEditButton && (
                  <ActionButton
                    className="main-menu-button"
                    dataElement="annotationContentEditButton"
                    label={isRightClickMenu ? 'action.edit' : ''}
                    title={!isRightClickMenu ? 'action.edit' : ''}
                    img="ic_edit_page_24px"
                    onClick={onEditContent}
                  />
                )}
                {showClearSignatureButton && (
                  <ActionButton
                    className="main-menu-button"
                    dataElement="annotationClearSignatureButton"
                    label={!isReadOnlySignature && isRightClickMenu ? 'action.clearSignature' : ''}
                    title={isReadOnlySignature ? 'action.readOnlySignature' : (!isRightClickMenu ? 'action.clearSignature' : '')}
                    img={'icon-delete-line'}
                    onClick={onClearAppearanceSignature}
                    isNotClickableSelector={() => isReadOnlySignature}
                  />
                )}
                {showRedactionButton && (
                  <ActionButton
                    className="main-menu-button"
                    dataElement="annotationRedactButton"
                    label={isRightClickMenu ? 'action.apply' : ''}
                    title={!isRightClickMenu ? 'action.apply' : ''}
                    img="ic_check_black_24px"
                    onClick={onApplyRedaction}
                  />
                )}
                {showGroupButton && (
                  <ActionButton
                    className="main-menu-button"
                    dataElement="annotationGroupButton"
                    label={isRightClickMenu ? 'action.group' : ''}
                    title={!isRightClickMenu ? 'action.group' : ''}
                    img="group-annotations-icon"
                    onClick={onGroupAnnotations}
                  />
                )}
                {showUngroupButton && (
                  <ActionButton
                    className="main-menu-button"
                    dataElement="annotationUngroupButton"
                    label={isRightClickMenu ? 'action.ungroup' : ''}
                    title={!isRightClickMenu ? 'action.ungroup' : ''}
                    img="ungroup-annotations-icon"
                    onClick={onUngroupAnnotations}
                  />
                )}
                {showAlignButton && (
                  <ActionButton
                    className="main-menu-button"
                    dataElement='openAlignmentButton'
                    label={isRightClickMenu ? 'alignmentPopup.alignment' : ''}
                    title={!isRightClickMenu ? 'alignmentPopup.alignment' : ''}
                    img="ic-alignment-main"
                    onClick={onOpenAlignmentModal}
                  />
                )}
                {showFormFieldButton && (
                  <ActionButton
                    className="main-menu-button"
                    dataElement="formFieldEditButton"
                    label={isRightClickMenu ? 'action.formFieldEdit' : ''}
                    title={!isRightClickMenu ? 'action.formFieldEdit' : ''}
                    img="icon-edit-form-field"
                    onClick={onOpenFormField}
                  />
                )}
                {showDeleteButton && (
                  <ActionButton
                    className="main-menu-button"
                    dataElement="annotationDeleteButton"
                    label={isRightClickMenu ? 'action.delete' : ''}
                    title={!isRightClickMenu ? 'action.delete' : ''}
                    img="icon-delete-line"
                    onClick={isContentEdit ? openContentEditDeleteWarningModal : onDeleteAnnotation}
                  />
                )}
                {showCalibrateButton && (
                  <ActionButton
                    className="main-menu-button"
                    dataElement={DataElements.CALIBRATION_POPUP_BUTTON}
                    label={isRightClickMenu ? 'action.calibrate' : ''}
                    title={!isRightClickMenu ? 'action.calibrate' : ''}
                    img="calibrate"
                    onClick={onOpenCalibration}
                  />
                )}
                {showLinkButton && (
                  <ActionButton
                    className="main-menu-button"
                    dataElement="linkButton"
                    label={isRightClickMenu ? 'tool.Link' : ''}
                    title={!isRightClickMenu ? 'tool.Link' : ''}
                    img={hasAssociatedLink ? 'icon-tool-unlink' : 'icon-tool-link'}
                    onClick={linkAnnotationToURL}
                  />
                )}
                {showFileDownloadButton && (
                  <ActionButton
                    className="main-menu-button"
                    dataElement="fileAttachmentDownload"
                    label={isRightClickMenu ? 'action.fileAttachmentDownload' : ''}
                    title={!isRightClickMenu ? 'action.fileAttachmentDownload' : ''}
                    img="icon-download"
                    onClick={() => downloadFileAttachment(focusedAnnotation)}
                  />
                )}
                {showAudioPlayButton && (
                  <ActionButton
                    className="main-menu-button"
                    dataElement="playSoundButton"
                    label={isRightClickMenu ? 'action.playAudio' : ''}
                    title={!isRightClickMenu ? 'action.playAudio' : ''}
                    img="ic_play_24px"
                    onClick={() => handlePlaySound(focusedAnnotation)}
                  />
                )}
              </CustomizablePopup>
            </div>
          </FocusTrap>
        );
    }
  };

  const annotationPopup = (
    <div
      className={classNames({
        Popup: true,
        AnnotationPopup: true,
        open: isOpen,
        closed: !isOpen,
        'is-vertical': isRightClickMenu,
        'is-horizontal': !isRightClickMenu,
        'is-hidden': isVisible === false,
      })}
      ref={popupRef}
      data-element={DataElements.ANNOTATION_POPUP}
      css={position}
    >
      {renderPopup()}
    </div>
  );

  return isIE || isMobile ? (
    annotationPopup
  ) : (
    <Draggable cancel=".Button, .cell, .sliders-container svg, select, button, input">{annotationPopup}</Draggable>
  );
};

AnnotationPopup.propTypes = propTypes;

export default AnnotationPopup;
