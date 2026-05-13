import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';
import selectors from 'selectors';
import ModularHeader from './ModularHeader';
import { ITEM_TYPE } from 'constants/customizationVariables';

const ModularHeaderContainer = React.forwardRef((props, ref) => {
  const { items, style: legacyStyle, wrapperStyle, ...headerProps } = props;

  const activeGroupedItems = useSelector((state) => selectors.getActiveGroupedItems(state), shallowEqual);
  const fixedGroupedItems = useSelector((state) => selectors.getFixedGroupedItems(state), shallowEqual);
  const viewOnlyWhitelist = useSelector(selectors.getViewOnlyWhitelist);

  // We memoize the items to avoid unneeded re-renders
  const memoizedItems = React.useMemo(() => {
    return items?.filter((item) => {
      const itemProps = item.props || item;
      if (itemProps.type === ITEM_TYPE.GROUPED_ITEMS && !itemProps.alwaysVisible) {
        if (activeGroupedItems.length || fixedGroupedItems.length) {
          return activeGroupedItems.includes(itemProps.dataElement) || fixedGroupedItems.includes(itemProps.dataElement);
        }
        return false;
      }
      return true;
    });
  }, [items, activeGroupedItems, fixedGroupedItems, viewOnlyWhitelist]);

  const resolvedWrapperStyle = wrapperStyle ?? legacyStyle;
  return <ModularHeader ref={ref} {...headerProps} items={memoizedItems} wrapperStyle={resolvedWrapperStyle} />;
});

ModularHeaderContainer.displayName = 'ModularHeaderContainer';
ModularHeaderContainer.propTypes = {
  items: PropTypes.array,
  wrapperStyle: PropTypes.object,
  /** @deprecated Use wrapperStyle instead. */
  style: PropTypes.object,
};

export default ModularHeaderContainer;
