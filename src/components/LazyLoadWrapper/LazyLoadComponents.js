import { lazy } from 'react';

// Overlays
const ScaleOverlayContainer = lazy(() => import('components/ScaleOverlay/ScaleOverlayContainer'));

// Popups
const AnnotationPopup = lazy(() => import('components/AnnotationPopup'));
const FormFieldEditPopup = lazy(() => import('components/FormFieldEditPopup'));
const TextPopup = lazy(() => import('components/TextPopup'));
const ContextMenuPopup = lazy(() => import('components/ContextMenuPopup'));
const InlineCommentingPopup = lazy(() => import('components/InlineCommentingPopup'));
const RichTextPopup = lazy(() => import('components/RichTextPopup'));
const AudioPlaybackPopup = lazy(() => import('components/AudioPlaybackPopup'));
const DocumentCropPopup = lazy(() => import('components/DocumentCropPopup'));
const MeasurementOverlay = lazy(() => import('components/MeasurementOverlay'));

// Modals
const ContentEditModal = lazy(() => import('components/ContentEditModal'));
const ContentEditLinkModal = lazy(() => import('components/ContentEditLinkModal'));
const SignatureModal = lazy(() => import('components/SignatureModal'));
const ScaleModal = lazy(() => import('components/ScaleModal'));
const PrintModal = lazy(() => import('components/PrintModal'));
const ErrorModal = lazy(() => import('components/ErrorModal'));
const PasswordModal = lazy(() => import('components/PasswordModal'));
const CreateStampModal = lazy(() => import('components/CreateStampModal'));
const PageReplacementModal = lazy(() => import('components/PageReplacementModal'));
const LinkModal = lazy(() => import('components/LinkModal'));
const FilterAnnotModal = lazy(() => import('components/FilterAnnotModal'));
const PageRedactionModal = lazy(() => import('components/PageRedactionModal'));
const CalibrationModal = lazy(() => import('components/CalibrationModal'));
const SettingsModal = lazy(() => import('components/SettingsModal'));
const SaveModal = lazy(() => import('components/SaveModal'));
const InsertPageModal = lazy(() => import('components/InsertPageModal'));
const LoadingModal = lazy(() => import('components/LoadingModal'));
const ProgressModal = lazy(() => import('components/ProgressModal'));
const WarningModal = lazy(() => import('components/WarningModal'));
const Model3DModal = lazy(() => import('components/Model3DModal'));
const ColorPickerModal = lazy(() => import('components/ColorPickerModal'));
const OpenFileModal = lazy(() => import('components/OpenFileModal'));
const SignatureValidationModal = lazy(() => import('components/SignatureValidationModal'));
const CustomModal = lazy(() => import('components/CustomModal'));

const LazyLoadComponents = {
  AnnotationPopup,
  FormFieldEditPopup,
  TextPopup,
  ContextMenuPopup,
  InlineCommentingPopup,
  RichTextPopup,
  AudioPlaybackPopup,
  DocumentCropPopup,
  MeasurementOverlay,
  ScaleOverlayContainer,
  ContentEditModal,
  ContentEditLinkModal,
  SignatureModal,
  ScaleModal,
  PrintModal,
  ErrorModal,
  PasswordModal,
  CreateStampModal,
  PageReplacementModal,
  LinkModal,
  FilterAnnotModal,
  PageRedactionModal,
  CalibrationModal,
  SettingsModal,
  SaveModal,
  InsertPageModal,
  LoadingModal,
  ProgressModal,
  WarningModal,
  Model3DModal,
  ColorPickerModal,
  OpenFileModal,
  SignatureValidationModal,
  CustomModal,
};

export default LazyLoadComponents;
