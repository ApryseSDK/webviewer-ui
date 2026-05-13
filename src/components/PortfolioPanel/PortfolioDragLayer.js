import React from 'react';
import { useDragLayer } from 'react-dnd';
import { ItemTypes } from 'constants/dnd';

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

export const PortfolioDragLayer = () => {
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

  const renderDragItemPreview = () => {
    if (!item) {
      return null;
    }

    const { dragPortfolioItem } = item;

    if (itemType === ItemTypes.PORTFOLIO) {
      return (
        <>
          {dragPortfolioItem.name}
        </>
      );
    }

    return null;
  };

  if (!isDragging) {
    return null;
  }

  return (
    <div className="layer-style">
      <div
        className="bookmark-outline-single-container preview"
        css={getItemStyles(initialOffset, currentOffset)}
      >
        {renderDragItemPreview()}
      </div>
    </div>
  );
};
