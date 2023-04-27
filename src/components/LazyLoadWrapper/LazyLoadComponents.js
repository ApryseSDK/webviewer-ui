import { lazy } from 'react';

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

const LazyLoadComponents = {
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
};

export default LazyLoadComponents;
