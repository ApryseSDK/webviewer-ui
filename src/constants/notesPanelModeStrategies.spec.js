import core from 'core';
import { getNotesPanelModeStrategies, NotesPanelMode } from 'constants/notesPanelModeStrategies';
import { OfficeEditorEditMode } from 'constants/officeEditor';
import { SpreadsheetEditorEditMode } from 'constants/spreadsheetEditor';
import DataElements from 'constants/dataElement';
import {
  BASE_SORT_STRATEGIES,
  NotesPanelSortStrategy,
  OFFICE_EDITOR_SORT_STRATEGIES,
  SPREADSHEET_EDITOR_SORT_STRATEGIES,
} from 'constants/sortStrategies';

describe('notesPanelModeStrategies', () => {
  const strategies = getNotesPanelModeStrategies();

  describe('default mode', () => {
    const strategy = strategies[NotesPanelMode.DEFAULT];

    it('never shows the review or comment footer', () => {
      expect(strategy.showReviewFooter({})).toBe(false);
      expect(strategy.showCommentFooter({})).toBe(false);
    });
  });

  describe('office editor mode', () => {
    const strategy = strategies[NotesPanelMode.OFFICE_EDITOR];

    afterEach(() => {
      jest.restoreAllMocks();
    });

    describe('showReviewFooter', () => {
      it('is shown on the review panel when not multi-selecting and there are notes', () => {
        expect(strategy.showReviewFooter({
          isMultiSelectMode: false,
          dataElement: DataElements.OFFICE_EDITOR_REVIEW_PANEL,
          notesCount: 1,
        })).toBe(true);
      });

      it('is hidden while multi-selecting, with no notes, or on another panel', () => {
        expect(strategy.showReviewFooter({
          isMultiSelectMode: true,
          dataElement: DataElements.OFFICE_EDITOR_REVIEW_PANEL,
          notesCount: 1,
        })).toBe(false);
        expect(strategy.showReviewFooter({
          isMultiSelectMode: false,
          dataElement: DataElements.OFFICE_EDITOR_REVIEW_PANEL,
          notesCount: 0,
        })).toBe(false);
        expect(strategy.showReviewFooter({
          isMultiSelectMode: false,
          dataElement: DataElements.OFFICE_EDITOR_COMMENT_PANEL,
          notesCount: 1,
        })).toBe(false);
      });
    });

    describe('showCommentFooter', () => {
      it('is shown on the comment panel when editable and not view-only', () => {
        jest.spyOn(core, 'getIsReadOnly').mockReturnValue(false);
        expect(strategy.showCommentFooter({
          isMultiSelectMode: false,
          dataElement: DataElements.OFFICE_EDITOR_COMMENT_PANEL,
          officeEditorEditMode: OfficeEditorEditMode.EDITING,
          documentViewerKey: 1,
        })).toBe(true);
      });

      it('is hidden when read-only, view-only, multi-selecting, or on another panel', () => {
        jest.spyOn(core, 'getIsReadOnly').mockReturnValue(true);
        expect(strategy.showCommentFooter({
          isMultiSelectMode: false,
          dataElement: DataElements.OFFICE_EDITOR_COMMENT_PANEL,
          officeEditorEditMode: OfficeEditorEditMode.EDITING,
          documentViewerKey: 1,
        })).toBe(false);

        jest.spyOn(core, 'getIsReadOnly').mockReturnValue(false);
        expect(strategy.showCommentFooter({
          isMultiSelectMode: false,
          dataElement: DataElements.OFFICE_EDITOR_COMMENT_PANEL,
          officeEditorEditMode: OfficeEditorEditMode.VIEW_ONLY,
          documentViewerKey: 1,
        })).toBe(false);
        expect(strategy.showCommentFooter({
          isMultiSelectMode: false,
          dataElement: DataElements.OFFICE_EDITOR_COMMENT_PANEL,
          officeEditorEditMode: OfficeEditorEditMode.PREVIEW,
          documentViewerKey: 1,
        })).toBe(false);
        expect(strategy.showCommentFooter({
          isMultiSelectMode: true,
          dataElement: DataElements.OFFICE_EDITOR_COMMENT_PANEL,
          officeEditorEditMode: OfficeEditorEditMode.EDITING,
          documentViewerKey: 1,
        })).toBe(false);
        expect(strategy.showCommentFooter({
          isMultiSelectMode: false,
          dataElement: DataElements.OFFICE_EDITOR_REVIEW_PANEL,
          officeEditorEditMode: OfficeEditorEditMode.EDITING,
          documentViewerKey: 1,
        })).toBe(false);
      });
    });

    describe('isReviewPreviewOn', () => {
      it('is on when the edit mode is PREVIEW', () => {
        expect(strategy.isReviewPreviewOn({ officeEditorEditMode: OfficeEditorEditMode.PREVIEW })).toBe(true);
      });

      it('is off for any other edit mode', () => {
        expect(strategy.isReviewPreviewOn({ officeEditorEditMode: OfficeEditorEditMode.REVIEWING })).toBe(false);
        expect(strategy.isReviewPreviewOn({})).toBe(false);
      });
    });

    describe('setReviewPreview', () => {
      it('enables PREVIEW mode when enabled', () => {
        const setEditMode = jest.fn();
        jest.spyOn(core, 'getOfficeEditor').mockReturnValue({ setEditMode });
        strategy.setReviewPreview({ enabled: true });
        expect(setEditMode).toHaveBeenCalledWith(OfficeEditorEditMode.PREVIEW);
      });

      it('restores REVIEWING mode when disabled', () => {
        const setEditMode = jest.fn();
        jest.spyOn(core, 'getOfficeEditor').mockReturnValue({ setEditMode });
        strategy.setReviewPreview({ enabled: false });
        expect(setEditMode).toHaveBeenCalledWith(OfficeEditorEditMode.REVIEWING);
      });
    });
  });

  describe('spreadsheet mode', () => {
    const strategy = strategies[NotesPanelMode.SPREADSHEET];

    it('never shows the review footer', () => {
      expect(strategy.showReviewFooter({
        isMultiSelectMode: false,
        dataElement: DataElements.SPREADSHEET_EDITOR_COMMENT_PANEL,
        notesCount: 1,
      })).toBe(false);
    });

    describe('showCommentFooter', () => {
      it('is shown on the comment panel when not view-only and not multi-selecting', () => {
        expect(strategy.showCommentFooter({
          isMultiSelectMode: false,
          dataElement: DataElements.SPREADSHEET_EDITOR_COMMENT_PANEL,
          spreadsheetEditorEditMode: SpreadsheetEditorEditMode.EDITING,
        })).toBe(true);
      });

      it('is hidden when view-only, multi-selecting, or on another panel', () => {
        expect(strategy.showCommentFooter({
          isMultiSelectMode: false,
          dataElement: DataElements.SPREADSHEET_EDITOR_COMMENT_PANEL,
          spreadsheetEditorEditMode: SpreadsheetEditorEditMode.VIEW_ONLY,
        })).toBe(false);
        expect(strategy.showCommentFooter({
          isMultiSelectMode: true,
          dataElement: DataElements.SPREADSHEET_EDITOR_COMMENT_PANEL,
          spreadsheetEditorEditMode: SpreadsheetEditorEditMode.EDITING,
        })).toBe(false);
        expect(strategy.showCommentFooter({
          isMultiSelectMode: false,
          dataElement: DataElements.OFFICE_EDITOR_COMMENT_PANEL,
          spreadsheetEditorEditMode: SpreadsheetEditorEditMode.EDITING,
        })).toBe(false);
      });
    });
  });

  describe('header affordances', () => {
    const defaultStrategy = strategies[NotesPanelMode.DEFAULT];
    const officeStrategy = strategies[NotesPanelMode.OFFICE_EDITOR];
    const spreadsheetStrategy = strategies[NotesPanelMode.SPREADSHEET];

    it('should never disable search or sort outside Office preview', () => {
      [defaultStrategy, spreadsheetStrategy].forEach((strategy) => {
        expect(strategy.isSearchDisabled({ officeEditorEditMode: OfficeEditorEditMode.PREVIEW })).toBe(false);
        expect(strategy.isSortDisabled({ officeEditorEditMode: OfficeEditorEditMode.PREVIEW })).toBe(false);
      });
    });

    it('should disable search and sort only in Office preview', () => {
      expect(officeStrategy.isSearchDisabled({ officeEditorEditMode: OfficeEditorEditMode.PREVIEW })).toBe(true);
      expect(officeStrategy.isSortDisabled({ officeEditorEditMode: OfficeEditorEditMode.PREVIEW })).toBe(true);
      expect(officeStrategy.isSearchDisabled({ officeEditorEditMode: OfficeEditorEditMode.REVIEWING })).toBe(false);
      expect(officeStrategy.isSortDisabled({ officeEditorEditMode: OfficeEditorEditMode.REVIEWING })).toBe(false);
      expect(officeStrategy.isSearchDisabled()).toBe(false);
    });

    it('should hide multi-select only in Office mode', () => {
      expect(defaultStrategy.showMultiSelectButton()).toBe(true);
      expect(spreadsheetStrategy.showMultiSelectButton()).toBe(true);
      expect(officeStrategy.showMultiSelectButton()).toBe(false);
    });

    it('should return the sort strategy keys for each mode', () => {
      expect(defaultStrategy.getSortStrategyKeys()).toBe(BASE_SORT_STRATEGIES);
      expect(defaultStrategy.getSortStrategyKeys({ isAnnotationNumberingEnabled: true }))
        .toEqual([...BASE_SORT_STRATEGIES, NotesPanelSortStrategy.NUMBER]);
      expect(officeStrategy.getSortStrategyKeys({ isAnnotationNumberingEnabled: true })).toBe(OFFICE_EDITOR_SORT_STRATEGIES);
      expect(spreadsheetStrategy.getSortStrategyKeys({ isAnnotationNumberingEnabled: true })).toBe(SPREADSHEET_EDITOR_SORT_STRATEGIES);
    });

    it('should return a stable array identity when numbering is enabled', () => {
      const a = defaultStrategy.getSortStrategyKeys({ isAnnotationNumberingEnabled: true });
      const b = defaultStrategy.getSortStrategyKeys({ isAnnotationNumberingEnabled: true });
      expect(a).toBe(b);
    });
  });
});
