import React, { useRef, useCallback } from 'react';
import Button from '../Button';
import { useDrag, useDrop } from 'react-dnd';
import Icon from 'components/Icon';

import './CreatableList.scss';

const CreatableListItem = ({
  option,
  index,
  onChange,
  onDeleteItem,
  moveListItem,
  id,
  addItem,
}) => {
  const ItemTypes = {
    ITEM: 'item'
  };

  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: ItemTypes.ITEM,
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveListItem(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.ITEM,
    item: { type: ItemTypes.ITEM, id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const onChangeHandler = useCallback((event) => {
    onChange(event.target.value);
  }, [onChange]);

  const addNewItemOnEnterKey = useCallback((event) => {
    if (event.key === 'Enter') {
      addItem();
    }
  }, [addItem]);

  drag(drop(ref));

  const opacity = isDragging ? 0 : 1;

  return (
    <div ref={ref} style={{ opacity }} className="creatable-list-item">
      <div className="icon-handle">
        <Icon
          glyph="icon-drag-handle"
        />
      </div>
      <input
        type="text"
        onChange={onChangeHandler}
        value={option.displayValue}
        onKeyPress={addNewItemOnEnterKey}
        autoFocus
      />
      <Button
        title="action.delete"
        img="icon-delete-line"
        onClick={onDeleteItem}
      />
    </div>
  );
};

export default CreatableListItem;