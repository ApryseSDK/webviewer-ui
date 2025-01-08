import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { ItemTypes, DropLocation } from 'constants/dnd';

import PortfolioItemContent from 'components/PortfolioItemContent';

import './PortfolioItem.scss';

const propTypes = {
  portfolioItem: PropTypes.object.isRequired,
  connectDragSource: PropTypes.func,
  connectDragPreview: PropTypes.func,
  connectDropTarget: PropTypes.func,
  isDragging: PropTypes.bool,
  isDraggedUpwards: PropTypes.bool,
  isDraggedDownwards: PropTypes.bool,
  movePortfolio: PropTypes.func,
};

const PortfolioItem = forwardRef(({
  portfolioItem,
  connectDragSource,
  connectDragPreview,
  connectDropTarget,
  isDragging,
  isDraggedUpwards,
  isDraggedDownwards,
  movePortfolio
}, ref) => {

  const elementRef = useRef(null);
  connectDragSource(elementRef);
  connectDragPreview(getEmptyImage(), { captureDraggingState: true });
  connectDropTarget(elementRef);
  const opacity = isDragging ? 0.5 : 1;
  useImperativeHandle(ref, () => ({
    getNode: () => elementRef.current,
  }));
  const [isRenaming, setIsRenaming] = useState(false);

  return (
    <div
      ref={elementRef}
      className="outline-drag-container"
      style={{ opacity }}
    >
      <div className="outline-drag-line" style={{ opacity: isDraggedUpwards ? 1 : 0 }} />
      <PortfolioItemContent
        movePortfolio={movePortfolio}
        portfolioItem={portfolioItem}
        isPortfolioRenaming={isRenaming}
        setPortfolioRenaming={setIsRenaming}
      />
      <div className="outline-drag-line" style={{ opacity: isDraggedDownwards ? 1 : 0 }} />
    </div>
  );
});

PortfolioItem.propTypes = propTypes;
PortfolioItem.displayName = 'PortfolioItem';

const PortfolioItemNested = DropTarget(
  ItemTypes.PORTFOLIO,
  {
    hover(props, dropTargetMonitor, dropTargetContainer) {
      if (!dropTargetContainer) {
        return;
      }

      const dragObject = dropTargetMonitor.getItem();
      if (!dragObject) {
        return;
      }

      const { dragPortfolioItem, dragSourceNode } = dragObject;
      const { portfolioItem: dropPortfolioItem } = props;

      const dropTargetNode = dropTargetContainer.getNode();
      if (!dragSourceNode || !dropTargetNode) {
        return;
      }

      const portfolioItemIsBeingDraggedIntoDescendant = dragSourceNode.contains(dropTargetNode);
      if (portfolioItemIsBeingDraggedIntoDescendant) {
        dragObject.dropTargetNode = undefined;
        dragObject.dropLocation = DropLocation.INITIAL;
        return;
      }

      dragObject.dropTargetNode = dropTargetNode;
      const dragId = dragPortfolioItem.id;
      const hoverId = dropPortfolioItem.id;
      // do nothing if drag object and drop object are the same item
      // depends on the data structure, could have more conditions here
      if (dragId === hoverId) {
        return;
      }

      const dropTargetBoundingRect = dropTargetNode.getBoundingClientRect();
      const dropTargetVerticalMiddlePoint = (dropTargetBoundingRect.height / 2) + dropTargetBoundingRect.top;
      const clientOffset = dropTargetMonitor.getClientOffset();
      const dropTargetClientY = clientOffset.y;
      switch (true) {
        case dropTargetClientY > dropTargetVerticalMiddlePoint:
          dragObject.dropLocation = DropLocation.BELOW_TARGET;
          dropTargetNode.classList.remove('isNesting');
          break;
        case dropTargetClientY < dropTargetVerticalMiddlePoint:
          dragObject.dropLocation = DropLocation.ABOVE_TARGET;
          dropTargetNode.classList.remove('isNesting');
          break;
        default:
          dragObject.dropLocation = DropLocation.INITIAL;
          dropTargetNode.classList.remove('isNesting');
          break;
      }
    },
    drop(props, dropTargetMonitor, dropTargetContainer) {
      if (!dropTargetContainer) {
        return;
      }
      const dragObject = dropTargetMonitor.getItem();
      const { dragPortfolioItem, dropTargetNode } = dragObject;
      const { portfolioItem: dropPortfolioItem, movePortfolioInward, movePortfolioBeforeTarget, movePortfolioAfterTarget } = props;

      if (!dropTargetNode) {
        return;
      }

      switch (dragObject.dropLocation) {
        case DropLocation.ON_TARGET_HORIZONTAL_MIDPOINT:
          movePortfolioInward(dragPortfolioItem, dropPortfolioItem);
          break;
        case DropLocation.ABOVE_TARGET:
          movePortfolioBeforeTarget(dragPortfolioItem.id, dropPortfolioItem.id);
          break;
        case DropLocation.BELOW_TARGET:
          movePortfolioAfterTarget(dragPortfolioItem.id, dropPortfolioItem.id);
          break;
        default:
          break;
      }
      dropTargetNode.classList.remove('isNesting');
      dragObject.dropLocation = DropLocation.INITIAL;
    }
  },
  (connect, dropTargetState) => ({
    connectDropTarget: connect.dropTarget(),
    isDraggedUpwards: dropTargetState.isOver({ shallow: true }) && (dropTargetState.getItem()?.dropLocation === DropLocation.ABOVE_TARGET),
    isDraggedDownwards: dropTargetState.isOver({ shallow: true }) && (dropTargetState.getItem()?.dropLocation === DropLocation.BELOW_TARGET),
  })
)(DragSource(
  ItemTypes.PORTFOLIO,
  {
    beginDrag: (props, dragSourceMonitor, dragSourceContainer) => ({
      sourceId: dragSourceMonitor.sourceId,
      dragPortfolioItem: props.portfolioItem,
      dragSourceNode: dragSourceContainer.getNode(),
      dropLocation: DropLocation.INITIAL,
    }),
    canDrag: () => true,
  },
  (connect, dragSourceState) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: dragSourceState.isDragging(),
  })
)(PortfolioItem));

PortfolioItemNested.propTypes = propTypes;

export default PortfolioItemNested;
