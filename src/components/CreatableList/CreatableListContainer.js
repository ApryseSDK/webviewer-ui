import React, { useState, useCallback, useRef } from 'react';
import Button from '../Button';
import { useTranslation } from 'react-i18next';
import CreatableListItem from './CreatableListItem';

import './CreatableList.scss';

const CreatableListContainer = ({
  draggableItems,
  popupRef,
  fieldSelectionOptions,
  setFieldSelectionOptions,
}) => {
  const { t } = useTranslation();
  const [nextId, setNextId] = useState(draggableItems?.length ?? 0);
  const containerRef = useRef();

  const onAddItem = useCallback(() => {
    const id = nextId;
    setNextId(nextId + 1);
    setFieldSelectionOptions([...fieldSelectionOptions, { id, value: '', displayValue: '' }]);
    validatePopupHeight();
  }, [nextId, fieldSelectionOptions]);

  const handleDeleteItem = (id) => () => {
    const updatedItems = fieldSelectionOptions.filter((item) => {
      return id !== item.id;
    });

    setFieldSelectionOptions(updatedItems);
  };

  const handleItemValueChange = (id) => (value) => {
    const updatedItems = fieldSelectionOptions.map((item) => {
      if (item.id !== id) {
        return item;
      }
      return { ...item, value, displayValue: value };
    });

    setFieldSelectionOptions(updatedItems);
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
      const dragItem = fieldSelectionOptions[dragIndex];

      // Update items array without mutating original items array for perf reasons
      // First we remove the element being dragged
      const itemsWithoutDraggedElement = fieldSelectionOptions.filter((_item, index) => index !== dragIndex);
      // Now we add the dragged element at the index it's currently hovering
      const itemsWithDraggedElementAtNewPosition = addItemAtIndex(itemsWithoutDraggedElement, hoverIndex, dragItem);

      setFieldSelectionOptions(itemsWithDraggedElementAtNewPosition);
    },
    [fieldSelectionOptions],
  );

  const validatePopupHeight = () => {
    const popupContainer = popupRef.current;
    const containerElement = containerRef.current;
    const { bottom } = popupContainer.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const availableHeight = viewportHeight - bottom;
    const isListOverflowing = containerElement.scrollHeight > containerElement.clientHeight;
    if (availableHeight <= 40 && !isListOverflowing) {
      const inputCount = containerElement.childElementCount;
      const maxContainerHeight = inputCount * 40;
      containerElement.style.maxHeight = `${maxContainerHeight}px`;
    } else if (availableHeight > 40) {
      containerElement.style.maxHeight = '200px';
    }
  };

  return (
    <div>
      <div className="creatable-list" ref={containerRef}>
        {fieldSelectionOptions.map((item, index) => (
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