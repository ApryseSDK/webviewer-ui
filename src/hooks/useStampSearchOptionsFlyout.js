import { useState, useEffect, useMemo, useCallback } from 'react';
import { sortCategoriesByLocalizedName } from 'src/helpers/stamps';

function useStampSearchOptionsFlyout({
  stamps,
  categories,
  getStampsByCategory,
}) {
  const sortedCategories = useMemo(() => sortCategoriesByLocalizedName(categories), [categories]);
  const [categoryMap, setCategoryMap] = useState(() => ({
    ...sortedCategories.reduce((map, category) => {
      const stampsInCategory = getStampsByCategory?.(stamps, category) || [];
      const hasStamps = stampsInCategory?.length > 0;
      map[category] = {
        isCheckboxEnabled: true,
        isCheckboxVisible: hasStamps,
      };
      return map;
    }, {})
  }));
  const visibleCategories = useMemo(() => {
    return sortedCategories.filter((category) => categoryMap[category]?.isCheckboxVisible && categoryMap[category]?.isCheckboxEnabled);
  }, [sortedCategories, categoryMap]);

  useEffect(() => {
    setCategoryMap((prevMap) => {
      return sortedCategories.reduce((map, category) => {
        const stampsInCategory = getStampsByCategory?.(stamps, category) || [];
        const hasStamps = stampsInCategory?.length > 0;
        const isEnabled = prevMap[category]?.isCheckboxEnabled ?? true;
        map[category] = {
          isCheckboxEnabled: isEnabled,
          isCheckboxVisible: hasStamps,
        };
        return map;
      }, {});
    });
  }, [stamps, sortedCategories, getStampsByCategory]);

  const onCheckboxChange = useCallback((category) => {
    setCategoryMap((prevMap) => ({
      ...prevMap,
      [category]: {
        ...prevMap[category],
        isCheckboxEnabled: !prevMap[category]?.isCheckboxEnabled,
      },
    }));
  }, []);

  return {
    categoryMap,
    visibleCategories,
    onCheckboxChange,
  };
}

export default useStampSearchOptionsFlyout;
