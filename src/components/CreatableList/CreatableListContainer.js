import React, { useEffect, useState, useCallback, useRef } from 'react';
import Button from '../Button';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import CreatableListItem from './CreatableListItem';

import './CreatableList.scss';

const propTypes = {
  options: PropTypes.object,
  onOptionsUpdated: PropTypes.func,
  popupRef: PropTypes.object
};

const CreatableListContainer = ({
  options,
  onOptionsUpdated,
  popupRef,
}) => {

  const isInitialized = useRef(false);

  useEffect(() => {
    isInitialized.current = false;
  }, [onOptionsUpdated]);

  useEffect(() => {
    setItems(draggableItems);
  }, [options]);

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
  const [invalidInputList, setInvalidInputList] = useState([]);
  const [inputListHasEmptyValue, setInputListHasEmptyValue] = useState(false);
  const [inputListDuplicateValues, setInputListDuplicateValues] = useState([]);
  const containerRef = useRef();

  useEffect(() => {
    // Skip calling onOptionsUpdated on the initial prop-driven update
    if (isInitialized.current) {
      const { invalidItems, hasEmpty, duplicates } = validateItems();

      setInvalidInputList(invalidItems);
      setInputListHasEmptyValue(hasEmpty);
      setInputListDuplicateValues(Array.from(duplicates));

      const filteredOptions = items.filter((item) => item.value && !invalidInputList.includes(item));
      const sanitizedOptions = filteredOptions.map((item) => ({ value: item.value, displayValue: item.displayValue }));
      onOptionsUpdated(sanitizedOptions);
    } else {
      setInvalidInputList([]);
      isInitialized.current = true;
    }
  }, [items, onOptionsUpdated]);

  const getCounts = useCallback(() => {
    const valueCounts = new Map();
    for (const item of items) {
      const { value } = item;
      if (!value) {
        continue;
      }
      const count = valueCounts.get(value) || 0;
      valueCounts.set(value, count + 1);
    }
    return valueCounts;
  }, [items]);

  const identifyInvalidItems = useCallback((counts) => {
    const invalidItems = [];
    let hasEmpty = false;
    const duplicates = new Set();
    for (const item of items) {
      const { value } = item;
      if (value && counts.get(value) > 1) {
        invalidItems.push(item);
        duplicates.add(value);
      } else if (!value) {
        hasEmpty = true;
        invalidItems.push(item);
      }
    }
    return { invalidItems, hasEmpty, duplicates };
  }, [items]);

  const validateItems = useCallback(() => {
    const valueCounts = getCounts();
    return identifyInvalidItems(valueCounts);
  }, [items]);

  const onAddItem = useCallback(() => {
    const id = nextId;
    setNextId(nextId + 1);
    setItems([...items, { id, value: '', displayValue: '' }]);
    if (popupRef) {
      validatePopupHeight();
    }
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
        {items.map((item, index) => (
          <CreatableListItem
            key={item.id}
            index={index}
            id={item.id}
            option={item}
            onChange={handleItemValueChange(item.id)}
            onDeleteItem={handleDeleteItem(item.id)}
            moveListItem={moveListItem}
            addItem={invalidInputList?.length > 0 ? () => { } : onAddItem}
            invalid={invalidInputList?.includes(item) || invalidInputList.some((i) => i.value === item.value && i.id !== item.id)}
          />
        ))}
      </div>
      {inputListHasEmptyValue && (
        <div
          className="invalid-option-message"
          role="alert"
          aria-live="assertive"
        >
          {t('message.listEmptyValue')}
        </div>
      )}
      {inputListDuplicateValues.length > 0 && (
        <div
          className="invalid-option-message"
          role="alert"
          aria-live="assertive"
        >
          {t('message.listDuplicateValue')} {inputListDuplicateValues.join(', ')}
        </div>
      )}
      <Button
        title={t('action.addOption')}
        className="add-item-button"
        label={t('action.addOption')}
        img="icon-plus-sign"
        onClick={onAddItem}
        disabled={invalidInputList?.length > 0}
      />
    </div>
  );
};

CreatableListContainer.propTypes = propTypes;

export default CreatableListContainer;