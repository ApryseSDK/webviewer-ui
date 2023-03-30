import React, { useState } from 'react';
import Draggable from 'react-draggable';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { FocusTrap } from '@pdftron/webviewer-react-toolkit';

import ActionButton from 'components/ActionButton';
import AnnotationStylePopup from 'components/AnnotationStylePopup';
import DatePicker from 'components/DatePicker';
import CustomizablePopup from 'components/CustomizablePopup';
import CalibrationPopup from 'components/CalibrationPopup';

import { getDataWithKey, mapToolNameToKey, mapAnnotationToKey } from 'constants/map';

import DataElements from 'constants/dataElement';
import './AnnotationPopup.scss';

const propTypes = {
  isMobile: PropTypes.bool,
  isIE: PropTypes.bool,
  isOpen: PropTypes.bool,
  isRightClickMenu: PropTypes.bool,
  isNotesPanelOpenOrActive: PropTypes.bool,
  isRichTextPopupOpen: PropTypes.bool,
  isLinkModalOpen: PropTypes.bool,

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
  isStylePopupOpen: PropTypes.bool,
  hideSnapModeCheckbox: PropTypes.bool,
  openEditStylePopup: PropTypes.func,
  closeEditStylePopup: PropTypes.func,
  annotationStyle: PropTypes.object,
  onResize: PropTypes.func,

  showContentEditButton: PropTypes.bool,
  onEditContent: PropTypes.func,

  isAppearanceSignature: PropTypes.bool,
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
};

const AnnotationPopup = ({
  isMobile,
  isIE,
  isOpen,
  isRightClickMenu,
  isNotesPanelOpenOrActive,
  isRichTextPopupOpen,
  isLinkModalOpen,

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
  isStylePopupOpen,
  hideSnapModeCheckbox,
  openEditStylePopup,
  closeEditStylePopup,
  annotationStyle,
  onResize,

  showContentEditButton,
  onEditContent,

  isAppearanceSignature,
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
}) => {
  const [t] = useTranslation();
  const [shortCutKeysFor3DVisible, setShortCutKeysFor3DVisible] = useState(false);

  const commentButtonLabel = isDateFreeTextCanEdit ? 'action.changeDate' : 'action.comment';
  const commentButtonImg = isDateFreeTextCanEdit ? 'icon-tool-fill-and-sign-calendar' : 'icon-header-chat-line';

  const show3DShortCutButton = focusedAnnotation instanceof window.Core.Annotations.Model3DAnnotation && !isMobile;
  const isRectangle = focusedAnnotation instanceof window.Core.Annotations.RectangleAnnotation;
  const isEllipse = focusedAnnotation instanceof window.Core.Annotations.EllipseAnnotation;
  const isPolygon = focusedAnnotation instanceof window.Core.Annotations.PolygonAnnotation;
  const isFreeText =
    focusedAnnotation instanceof window.Core.Annotations.FreeTextAnnotation &&
    (focusedAnnotation.getIntent() === window.Core.Annotations.FreeTextAnnotation.Intent.FreeText ||
      focusedAnnotation.getIntent() === window.Core.Annotations.FreeTextAnnotation.Intent.FreeTextCallout);
  const isRedaction = focusedAnnotation instanceof window.Core.Annotations.RedactionAnnotation;
  const colorMapKey = mapAnnotationToKey(focusedAnnotation);
  const isMeasure = !!focusedAnnotation.Measure;
  const showLineStyleOptions = getDataWithKey(mapToolNameToKey(focusedAnnotation.ToolName)).hasLineEndings;
  let StrokeStyle = 'solid';

  try {
    StrokeStyle = (focusedAnnotation['Style'] === 'dash')
      ? `${focusedAnnotation['Style']},${focusedAnnotation['Dashes']}`
      : focusedAnnotation['Style'];
  } catch (err) {
    console.error(err);
  }
  let properties = {};
  if (showLineStyleOptions) {
    properties = {
      StartLineStyle: focusedAnnotation.getStartStyle(),
      EndLineStyle: focusedAnnotation.getEndStyle(),
      StrokeStyle,
    };
  }

  if (isRectangle || isEllipse || isPolygon) {
    properties = {
      StrokeStyle,
    };
  }

  if (isFreeText) {
    const richTextStyles = focusedAnnotation.getRichTextStyle();
    properties = {
      Font: focusedAnnotation.Font,
      FontSize: focusedAnnotation.FontSize,
      TextAlign: focusedAnnotation.TextAlign,
      TextVerticalAlign: focusedAnnotation.TextVerticalAlign,
      bold: richTextStyles?.[0]?.['font-weight'] === 'bold' ?? false,
      italic: richTextStyles?.[0]?.['font-style'] === 'italic' ?? false,
      underline: richTextStyles?.[0]?.['text-decoration']?.includes('underline') || richTextStyles?.[0]?.['text-decoration']?.includes('word'),
      strikeout: richTextStyles?.[0]?.['text-decoration']?.includes('line-through') ?? false,
      StrokeStyle,
    };
  }

  if (isRedaction) {
    properties = {
      OverlayText: focusedAnnotation['OverlayText'],
      Font: focusedAnnotation['Font'],
      FontSize: focusedAnnotation['FontSize'],
      TextAlign: focusedAnnotation['TextAlign']
    };
  }

  const renderPopup = () => {
    switch (true) {
      case isStylePopupOpen:
        return (
          <AnnotationStylePopup
            annotations={[focusedAnnotation]}
            style={annotationStyle}
            isOpen={isOpen}
            onResize={onResize}
            isFreeText={isFreeText}
            isEllipse={isEllipse}
            isRedaction={isRedaction}
            isMeasure={isMeasure}
            colorMapKey={colorMapKey}
            showLineStyleOptions={showLineStyleOptions}
            properties={properties}
            hideSnapModeCheckbox={hideSnapModeCheckbox}
            hasBackToMenu={isRightClickMenu}
            onBackToMenu={closeEditStylePopup}
          />
        );
      case isDatePickerOpen:
        return (
          <DatePicker onClick={handleDateChange} annotation={focusedAnnotation} onDatePickerShow={onDatePickerShow} />
        );
      case isCalibrationPopupOpen:
        return <CalibrationPopup annotation={focusedAnnotation} />;
      case shortCutKeysFor3DVisible && focusedAnnotation instanceof window.Core.Annotations.Model3DAnnotation:
        return (
          <div className="shortCuts3D">
            <div className="closeButton" onClick={() => setShortCutKeysFor3DVisible(false)}>x</div>
            <div className="row">{t('action.rotate3D')} <span>{t('shortcut.rotate3D')}</span></div>
            <div className="row">{t('action.zoom')} <span>{t('shortcut.zoom3D')}</span></div>
          </div>
        );
      default:
        return (
          <FocusTrap
            locked={isOpen && !isRichTextPopupOpen && !isNotesPanelOpenOrActive && !isLinkModalOpen && !isFreeText}
          >
            <div className="container">
              <CustomizablePopup
                dataElement={DataElements.ANNOTATION_POPUP}
                childrenClassName="main-menu-button"
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
                    onClick={openEditStylePopup}
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
                {isAppearanceSignature && (
                  <ActionButton
                    className="main-menu-button"
                    dataElement="annotationClearSignatureButton"
                    label={isRightClickMenu ? 'action.clearSignature' : ''}
                    title={!isRightClickMenu ? 'action.clearSignature' : ''}
                    img="icon-delete-line"
                    onClick={onClearAppearanceSignature}
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
                    onClick={onDeleteAnnotation}
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
                {show3DShortCutButton && (
                  <ActionButton
                    className="main-menu-button"
                    dataElement="shortCutKeysFor3D"
                    label={isRightClickMenu ? 'action.viewShortCutKeysFor3D' : ''}
                    title={!isRightClickMenu ? 'action.viewShortCutKeysFor3D' : ''}
                    img="icon-keyboard"
                    onClick={() => setShortCutKeysFor3DVisible(true)}
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
        stylePopupOpen: isStylePopupOpen,
        'is-vertical': isRightClickMenu,
        'is-horizontal': !isRightClickMenu,
      })}
      ref={popupRef}
      data-element={DataElements.ANNOTATION_POPUP}
      style={{ ...position }}
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
