import { useEffect } from 'react';
import useCore from 'hooks/useCore';

/**
 * Selects the spreadsheet comment that lives on the top-left cell of the active cell range so
 * the notes panel expands it and scrolls it into view. When the cell has no comment, any
 * currently selected comment is deselected so nothing stays expanded.
 * @param {object} params
 * @param {boolean} params.isEnabled Whether cell-driven comment selection should run. Should be false
 * when not in Spreadsheet Editor mode or when the notes panel is not open.
 * @param {object} [params.comment] The comment annotation at the top-left cell of the active range, if any.
 * @param {number} [params.documentViewerKey] The document viewer the comment belongs to.
 * @ignore
 */
const useSpreadsheetCellCommentSelection = ({ isEnabled, comment, documentViewerKey }) => {
  const { core } = useCore(documentViewerKey);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const selectedAnnotations = core.getSelectedAnnotations();

    if (comment) {
      if (selectedAnnotations.length === 1 && selectedAnnotations[0].Id === comment.Id) {
        return;
      }
      // selectAnnotation adds to the current selection, so leftover comments from the
      // previously selected cell would put the notes panel into multi-select mode.
      if (selectedAnnotations.length) {
        core.deselectAllAnnotations();
      }
      core.selectAnnotation(comment);
      return;
    }

    if (selectedAnnotations.length) {
      core.deselectAllAnnotations();
    }
  }, [isEnabled, comment, core]);

};

export default useSpreadsheetCellCommentSelection;
