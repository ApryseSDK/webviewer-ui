import { useState, useMemo } from 'react';
import { getStampText, getStampTitle, getStampSubtitle } from 'helpers/stamps';
import useCore from 'hooks/useCore';

const TOOL_NAME = 'AnnotationCreateRubberStamp';

/**
 * A custom hook for searching stamps within visible categories
 * @param {*} props
 * @param {Array} props.stamps The list of all stamps to search through
 * @param {Array} props.visibleCategories The categories that are currently visible
 * @param {Function} props.getStampCategory Function to get the category of a stamp
 * @returns {Object}
 * @returns {string} returnObject.searchValue - The current search value
 * @returns {Function} returnObject.setSearchValue - Function to update the search value
 * @returns {Object} returnObject.searchResults - The search results organized by category, in the form { [category: string]: Array<Stamp> }
 * @ignore
 */
function useStampSearch({
  stamps,
  visibleCategories,
  getStampCategory,
}) {
  const { core } = useCore();
  const [searchValue, setSearchValue] = useState('');
  const stampTool = core.getTool(TOOL_NAME);

  const stampsByCategory = useMemo(() => {
    return stamps.reduce((acc, stamp, index) => {
      const category = getStampCategory(stamp);
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push({ ...stamp, index });
      return acc;
    }, {});
  }, [stamps]);

  const matchesSearchValue = (stamp) => {
    if (!searchValue) {
      return true;
    }

    const text = getStampText(stamp);
    const title = getStampTitle(stamp);
    const subtitle = getStampSubtitle(stamp);
    const formattedSubtitle = stampTool?.formatCustomStampSubtitle?.(subtitle, stamp.annotation?.['DateCreated']) || subtitle;
    return text.toLowerCase().includes(searchValue.toLowerCase()) ||
           title.toLowerCase().includes(searchValue.toLowerCase()) ||
           formattedSubtitle.toLowerCase().includes(searchValue.toLowerCase());
  };

  const searchResults = useMemo(() => {
    return visibleCategories.reduce((acc, category) => {
      const stampsInCategory = stampsByCategory[category] || [];
      const visibleStamps = stampsInCategory.filter(matchesSearchValue);
      if (visibleStamps.length > 0) {
        acc[category] = visibleStamps;
      }
      return acc;
    }, {});
  }, [visibleCategories, stampsByCategory, matchesSearchValue]);

  return {
    searchValue,
    setSearchValue,
    searchResults,
  };
}

export default useStampSearch;
