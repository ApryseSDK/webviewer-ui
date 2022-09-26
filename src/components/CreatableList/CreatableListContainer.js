import React, { useEffect, useState, useCallback } from 'react';
import Button from '../Button';
import { useTranslation } from 'react-i18next';
import CreatableListItem from './CreatableListItem';

import './CreatableList.scss';

const CreatableListContainer = ({
  options,
  onOptionsUpdated,
}) => {
  const { t } = useTranslation();

  // In order to be draggable, each item needs a unique Id
  // These are managed internally in this component and not exposed to the user
  const draggableItems = options.map((option, index) => {
    return {
      id: index,
      displayValue: option.displayValue,
      value: option.value,
    };
  });
  const [items, setItems] = useState(draggableItems);
  const [nextId, setNextId] = useState(draggableItems.length);


  useEffect(() => {
    const sanitizedOptions = items.map((item) => ({ value: item.value, displayValue: item.displayValue }));
    onOptionsUpdated(sanitizedOptions);
  }, [items, onOptionsUpdated]);

  const onAddItem = useCallback(() => {
    const id = nextId;
    setNextId(nextId + 1);
    setItems([...items, { id, value: '', displayValue: '' }]);
  }, [nextId, items]);

  const handleDeleteItem = (id) => () => {
    const updatedItems = items.filter((item) => {
      return id !== item.id;
    });

    setItems(updatedItems);
  };

  const handleItemValueChange = (id) => (value) => {
    const updatedItems = items.map((item) => {
      if (item.id !== id) {
        return item;
      }
      return { ...item, value, displayValue: value };
    });

    setItems(updatedItems);
  };

  // We add this helper function that doesn't mutate the original array
  // This way we dont need to add a package like immutability-helper as this is the only use case
  function addItemAtIndex(array, index, value) {
    const result = array.slice(0);
    result.splice(index, 0, value);
    return result;
  }

  const moveListItem = useCallback(
    (dragIndex, hoverIndex) => {
      const dragItem = items[dragIndex];

      // Update items array without mutating original items array for perf reasons
      // First we remove the element being dragged
      const itemsWithoutDraggedElement = items.filter((_item, index) => index !== dragIndex);
      // Now we add the dragged element at the index it's currently hovering
      const itemsWithDraggedElementAtNewPosition = addItemAtIndex(itemsWithoutDraggedElement, hoverIndex, dragItem);

      setItems(itemsWithDraggedElementAtNewPosition);
    },
    [items],
  );

  return (
    <div>
      <div className="creatable-list">
        {items.map((item, index) => (
          <CreatableListItem
            key={item.id}
            index={index}
            id={item.id}
            option={item}
            onChange={handleItemValueChange(item.id)}
            onDeleteItem={handleDeleteItem(item.id)}
            moveListItem={moveListItem}
            addItem={onAddItem}
          />
        ))}
      </div>
      <Button
        title={t('action.addOption')}
        className="add-item-button"
        label={t('action.addOption')}
        img="icon-plus-sign"
        onClick={onAddItem}
      />
    </div>
  );
};

export default CreatableListContainer;