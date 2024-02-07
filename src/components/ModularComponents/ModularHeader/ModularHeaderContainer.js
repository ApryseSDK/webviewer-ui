import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import selectors from 'selectors';
import ModularHeader from './ModularHeader';
import { ITEM_TYPE } from 'constants/customizationVariables';

const ModularHeaderContainer = React.forwardRef((props, ref) => {
  const { items } = props;

  const [
    activeGroupedItems,
    fixedGroupedItems
  ] = useSelector(
    (state) => [
      selectors.getActiveGroupedItems(state),
      selectors.getFixedGroupedItems(state),
    ],
    shallowEqual
  );

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
  }, [items, activeGroupedItems, fixedGroupedItems]);

  return <ModularHeader ref={ref} {...props} items={memoizedItems} />;
});

ModularHeaderContainer.displayName = 'ModularHeaderContainer';

export default ModularHeaderContainer;