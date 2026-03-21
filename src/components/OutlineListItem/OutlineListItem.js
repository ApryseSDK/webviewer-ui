import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import Outline from 'components/Outline';

/**
 * Creates an outline list item component for the OutlinesPanel
 * @param {Object} props The props for the component
 * @param {Object} props.outline The outline data to be rendered
 * @param {Function} props.setSelectedOutlines The function to update the selected outlines in the OutlinesPanel
 * @param {Function} props.moveOutlineInward The function to move an outline inward in the hierarchy
 * @param {Function} props.moveOutlineBeforeTarget The function to move an outline before a target outline
 * @param {Function} props.moveOutlineAfterTarget The function to move an outline after a target outline
 * @returns {JSX.Element} The rendered OutlineListItem component
 * @ignore
 */
const OutlineListItem = React.memo(({
  outline,
  setSelectedOutlines,
  moveOutlineInward,
  moveOutlineBeforeTarget,
  moveOutlineAfterTarget,
}) => {

  /**
   * Handler for when an outline is selected or deselected
   * @param {string} path The path of the outline
   * @param {boolean} value True if the outline is being selected, false if it is being deselected
   * @ignore
   */
  const handleSetMultiSelected = useCallback((path, value) => {
    setSelectedOutlines((currentSelected) => {
      if (value) {
        return currentSelected.includes(path) ? currentSelected : [...currentSelected, path];
      }
      return currentSelected.filter((p) => p !== path);
    });
  }, [setSelectedOutlines]);

  return (
    <Outline
      outline={outline}
      setMultiSelected={handleSetMultiSelected}
      moveOutlineInward={moveOutlineInward}
      moveOutlineBeforeTarget={moveOutlineBeforeTarget}
      moveOutlineAfterTarget={moveOutlineAfterTarget} />
  );
});

OutlineListItem.displayName = 'OutlineListItem';
OutlineListItem.propTypes = {
  outline: Outline.propTypes.outline,
  setSelectedOutlines: PropTypes.func.isRequired,
  moveOutlineInward: PropTypes.func.isRequired,
  moveOutlineBeforeTarget: PropTypes.func.isRequired,
  moveOutlineAfterTarget: PropTypes.func.isRequired,
};

export default OutlineListItem;