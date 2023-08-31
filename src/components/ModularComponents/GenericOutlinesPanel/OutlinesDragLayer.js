import React from 'react';
import { useDragLayer } from 'react-dnd';
import { ItemTypes } from 'constants/dnd';

const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 99999,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%'
};

const getItemStyles = (initialOffset, currentOffset) => {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none'
    };
  }
  const { x, y } = currentOffset;
  const transform = `translate(calc(${x}px - 50%), calc(${y}px - 100%))`;
  return {
    transform,
    WebkitTransform: transform,
  };
};

export const OutlinesDragLayer = () => {
  const {
    itemType,
    item,
    isDragging,
    initialOffset,
    currentOffset
  } = useDragLayer((dragLayerState) => ({
    itemType: dragLayerState.getItemType(),
    item: dragLayerState.getItem(),
    isDragging: dragLayerState.isDragging(),
    initialOffset: dragLayerState.getInitialSourceClientOffset(),
    currentOffset: dragLayerState.getClientOffset(),
  }));

  const renderDragItem = () => {
    if (!item) {
      return null;
    }

    const { dragOutline } = item;

    switch (itemType) {
      case ItemTypes.OUTLINE:
        return (
          <>
            {dragOutline.getName()}
          </>
        );
      default:
        return null;
    }
  };

  if (!isDragging) {
    return null;
  }

  return (
    <div style={layerStyles}>
      <div
        className="bookmark-outline-single-container preview"
        style={getItemStyles(initialOffset, currentOffset)}
      >
        {renderDragItem()}
      </div>
    </div>
  );
};
