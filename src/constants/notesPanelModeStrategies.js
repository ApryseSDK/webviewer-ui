import { OfficeEditorEditMode } from 'constants/officeEditor';
import { SpreadsheetEditorEditMode } from 'constants/spreadsheetEditor';
import DataElements from 'constants/dataElement';
import {
  BASE_SORT_STRATEGIES,
  NotesPanelSortStrategy,
  OFFICE_EDITOR_SORT_STRATEGIES,
  SPREADSHEET_EDITOR_SORT_STRATEGIES,
} from 'constants/sortStrategies';
import core from 'core';

/**
 * Enum of NotesPanel modes used to resolve a mode strategy.
 * @ignore
 */
export const NotesPanelMode = {
  DEFAULT: 'default',
  OFFICE_EDITOR: 'officeEditor',
  SPREADSHEET: 'spreadsheet',
};

// Precomputed so the returned array identity is stable across renders.
const BASE_SORT_STRATEGIES_WITH_NUMBER = [...BASE_SORT_STRATEGIES, NotesPanelSortStrategy.NUMBER];

// Neutral defaults so every mode satisfies the full contract. Call sites invoke
// these methods unconditionally, so keeping the contract total guarantees they
// never hit an undefined method and a mode that does not care about a concern
// inherits an explicit default instead of an accidental missing key.
const baseModeStrategy = {
  // Whether the review-changes footer should be shown.
  showReviewFooter: () => false,
  // Whether the comment footer should be shown.
  showCommentFooter: () => false,
  // Whether the review "preview all changes" toggle is on.
  isReviewPreviewOn: () => false,
  // Applies the review "preview all changes" toggle state.
  setReviewPreview: () => {},
  // Whether the header search input is disabled.
  isSearchDisabled: () => false,
  // Whether the header sort dropdown is disabled.
  isSortDisabled: () => false,
  // Whether the header multi-select button may be shown.
  showMultiSelectButton: () => true,
  // Sort strategy keys offered by the header sort dropdown.
  getSortStrategyKeys: ({ isAnnotationNumberingEnabled } = {}) =>
    isAnnotationNumberingEnabled ? BASE_SORT_STRATEGIES_WITH_NUMBER : BASE_SORT_STRATEGIES,
};

// "default" (PDF/viewer) mode only overrides where it diverges from the base.
const defaultModeStrategy = {
  ...baseModeStrategy,
};

// "officeEditor" mode overrides only the methods it actually cares about.
const officeEditorModeStrategy = {
  ...baseModeStrategy,
  showReviewFooter: ({ isMultiSelectMode, dataElement, notesCount } = {}) =>
    !isMultiSelectMode
    && dataElement === DataElements.OFFICE_EDITOR_REVIEW_PANEL
    && notesCount > 0,
  showCommentFooter: ({ isMultiSelectMode, dataElement, officeEditorEditMode, documentViewerKey } = {}) =>
    !isMultiSelectMode
    && !core.getIsReadOnly(documentViewerKey)
    && officeEditorEditMode !== OfficeEditorEditMode.VIEW_ONLY
    && officeEditorEditMode !== OfficeEditorEditMode.PREVIEW
    && dataElement === DataElements.OFFICE_EDITOR_COMMENT_PANEL,
  isReviewPreviewOn: ({ officeEditorEditMode } = {}) =>
    officeEditorEditMode === OfficeEditorEditMode.PREVIEW,
  setReviewPreview: ({ enabled } = {}) =>
    core.getOfficeEditor().setEditMode(enabled ? OfficeEditorEditMode.PREVIEW : OfficeEditorEditMode.REVIEWING),
  // Search and sort are not meaningful while previewing tracked changes.
  isSearchDisabled: ({ officeEditorEditMode } = {}) =>
    officeEditorModeStrategy.isReviewPreviewOn({ officeEditorEditMode }),
  isSortDisabled: ({ officeEditorEditMode } = {}) =>
    officeEditorModeStrategy.isReviewPreviewOn({ officeEditorEditMode }),
  showMultiSelectButton: () => false,
  getSortStrategyKeys: () => OFFICE_EDITOR_SORT_STRATEGIES,
};

// "spreadsheet" mode overrides its own footer and view-only behavior.
const spreadsheetEditorModeStrategy = {
  ...baseModeStrategy,
  showCommentFooter: ({ isMultiSelectMode, dataElement, spreadsheetEditorEditMode } = {}) =>
    !isMultiSelectMode
    && spreadsheetEditorEditMode !== SpreadsheetEditorEditMode.VIEW_ONLY
    && dataElement === DataElements.SPREADSHEET_EDITOR_COMMENT_PANEL,
  getSortStrategyKeys: () => SPREADSHEET_EDITOR_SORT_STRATEGIES,
};

const notesPanelModeStrategies = {
  [NotesPanelMode.DEFAULT]: defaultModeStrategy,
  [NotesPanelMode.OFFICE_EDITOR]: officeEditorModeStrategy,
  [NotesPanelMode.SPREADSHEET]: spreadsheetEditorModeStrategy,
};

export const getNotesPanelModeStrategies = () => notesPanelModeStrategies;
