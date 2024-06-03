import { lazy } from 'react';

// Overlays
const ScaleOverlayContainer = lazy(() => import('components/ScaleOverlay/ScaleOverlayContainer'));
const MeasurementOverlay = lazy(() => import('components/MeasurementOverlay'));
const ViewControlsOverlay = lazy(() => import('components/ViewControlsOverlay'));
const MenuOverlay = lazy(() => import('components/MenuOverlay'));
const ZoomOverlay = lazy(() => import('components/ZoomOverlay'));
const PageManipulationOverlay = lazy(() => import('components/PageManipulationOverlay'));
const AnnotationContentOverlay = lazy(() => import('components/AnnotationContentOverlay'));
const ThumbnailMoreOptionsPopup = lazy(() => import('src/components/LeftPanelOverlay/ThumbnailMoreOptionsPopup'));
const ThumbnailMoreOptionsPopupSmall = lazy(() => import('src/components/LeftPanelOverlay/ThumbnailMoreOptionsPopupSmall'));

// Popups
const AnnotationPopup = lazy(() => import('components/AnnotationPopup'));
const FormFieldEditPopup = lazy(() => import('components/FormFieldEditPopup'));
const TextPopup = lazy(() => import('components/TextPopup'));
const ContextMenuPopup = lazy(() => import('components/ContextMenuPopup'));
const RichTextPopup = lazy(() => import('components/RichTextPopup'));
const RichTextStyleEditor = lazy(() => import('components/RichTextStyleEditor'));
const AudioPlaybackPopup = lazy(() => import('components/AudioPlaybackPopup'));
const DocumentCropPopup = lazy(() => import('components/DocumentCropPopup'));
const InlineCommentingPopup = lazy(() => import('components/InlineCommentingPopup'));
const LinkAnnotationPopup = lazy(() => import('components/LinkAnnotationPopup'));
const AlignmentPopup = lazy(() => import('components/AlignmentPopup'));

// Modals
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
const CreatePortfolioModal = lazy(() => import('components/CreatePortfolioModal'));

// Panels
const OutlinesPanel = lazy(() => import('components/OutlinesPanel'));
const SignaturePanel = lazy(() => import('components/SignaturePanel'));
const BookmarksPanel = lazy(() => import('components/BookmarksPanel'));
const FileAttachmentPanel = lazy(() => import('components/FileAttachmentPanel'));
const ThumbnailsPanel = lazy(() => import('components/ThumbnailsPanel'));
const StylePanel = lazy(() => import('components/StylePanel'));
const NotesPanel = lazy(() => import('components/NotesPanel'));
const SearchPanel = lazy(() => import('components/SearchPanel'));
const TabPanel = lazy(() => import('components/ModularComponents/TabPanel'));
const SignatureListPanel = lazy(() => import('components/SignatureListPanel'));
const LeftPanel = lazy(() => import('components/LeftPanel'));
const RubberStampPanel = lazy(() => import('components/RubberStampPanel'));
const RedactionPanel = lazy(() => import('components/RedactionPanel'));
const PortfolioPanel = lazy(() => import('components/PortfolioPanel'));


const OfficeEditorToolsHeader = lazy(() => import('components/Header/OfficeEditorToolsHeader'));

const LazyLoadComponents = {
  AnnotationPopup,
  FormFieldEditPopup,
  TextPopup,
  ContextMenuPopup,
  InlineCommentingPopup,
  RichTextPopup,
  RichTextStyleEditor,
  AudioPlaybackPopup,
  AlignmentPopup,
  DocumentCropPopup,
  MeasurementOverlay,
  ScaleOverlayContainer,
  ViewControlsOverlay,
  MenuOverlay,
  ZoomOverlay,
  PageManipulationOverlay,
  AnnotationContentOverlay,
  ThumbnailMoreOptionsPopup,
  ThumbnailMoreOptionsPopupSmall,
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
  OutlinesPanel,
  SignaturePanel,
  BookmarksPanel,
  FileAttachmentPanel,
  ThumbnailsPanel,
  StylePanel,
  NotesPanel,
  SearchPanel,
  TabPanel,
  LeftPanel,
  RedactionPanel,
  PortfolioPanel,
  OfficeEditorToolsHeader,
  CreatePortfolioModal,
  LinkAnnotationPopup,
  SignatureListPanel,
  RubberStampPanel,
};

export default LazyLoadComponents;
