import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import selectors from 'selectors';
import ModularHeader from './ModularHeader';

const ModularHeaderContainer = React.forwardRef((props, ref) => {
  const { items } = props;

  const [activeGroupedItems] = useSelector(
    (state) => [
      selectors.getCurrentGroupedItems(state),
    ],
    shallowEqual
  );

  // We memoize the items to avoid unneeded re-renders
  const memoizedItems = React.useMemo(() => {
    return items?.filter((item) => {
      const itemProps = item.props || item;
      if (itemProps.type === 'groupedItems' && activeGroupedItems) {
        return activeGroupedItems.includes(itemProps.dataElement);
      }
      return true;
    });
  }, [items, activeGroupedItems]);

  return <ModularHeader ref={ref} {...props} items={memoizedItems} />;
});

ModularHeaderContainer.displayName = 'ModularHeaderContainer';

export default ModularHeaderContainer;