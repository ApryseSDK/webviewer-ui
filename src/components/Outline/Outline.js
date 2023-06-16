import React, { useState, useCallback, useContext, useEffect, useLayoutEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { DragSource, DropTarget } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { ItemTypes, DropLocation, BUFFER_ROOM } from 'constants/dnd';
import core from 'core';
import actions from 'actions';
import selectors from 'selectors';

import Events from 'constants/events';
import fireEvent from 'helpers/fireEvent';
import outlineUtils from 'helpers/OutlineUtils';
import { isMobile, isIE } from 'helpers/device';
import OutlineContext from './Context';
import OutlineContent from 'src/components/OutlineContent';
import DataElementWrapper from '../DataElementWrapper';
import Choice from '../Choice';
import Button from '../Button';

import './Outline.scss';

const propTypes = {
  outline: PropTypes.object.isRequired,
  setMultiSelected: PropTypes.func,
  moveOutlineInward: PropTypes.func.isRequired,
  moveOutlineBeforeTarget: PropTypes.func.isRequired,
  moveOutlineAfterTarget: PropTypes.func.isRequired,
  connectDragSource: PropTypes.func,
  connectDragPreview: PropTypes.func,
  connectDropTarget: PropTypes.func,
  isDragging: PropTypes.bool,
  isDraggedUpwards: PropTypes.bool,
  isDraggedDownwards: PropTypes.bool,
};

const Outline = forwardRef(
  function Outline(
    {
      outline,
      setMultiSelected,
      isDragging,
      isDraggedUpwards,
      isDraggedDownwards,
      connectDragSource,
      connectDragPreview,
      connectDropTarget,
      moveOutlineInward,
      moveOutlineBeforeTarget,
      moveOutlineAfterTarget
    },
    ref
  ) {
    const outlines = useSelector((state) => selectors.getOutlines(state));
    const {
      setActiveOutlinePath,
      activeOutlinePath,
      isOutlineActive,
      setAddingNewOutline,
      isAddingNewOutline,
      isAnyOutlineRenaming,
      isMultiSelectMode,
      shouldAutoExpandOutlines,
      isOutlineEditable,
      selectedOutlines,
      updateOutlines,
    } = useContext(OutlineContext);

    const outlinePath = outlineUtils.getPath(outline);

    const [isExpanded, setIsExpanded] = useState(shouldAutoExpandOutlines);
    const [isSelected, setIsSelected] = useState(selectedOutlines.includes(outlinePath));
    const [isRenaming, setIsRenaming] = useState(false);
    const [isChangingDest, setChangingDest] = useState(false);
    const [isHovered, setHovered] = useState(false);
    const [clearSingleClick, setClearSingleClick] = useState(undefined);

    const dispatch = useDispatch();

    const elementRef = useRef(null);
    connectDragSource(elementRef);
    connectDragPreview(getEmptyImage(), { captureDraggingState: true });
    connectDropTarget(elementRef);
    const opacity = isDragging ? 0.5 : 1;
    useImperativeHandle(ref, () => ({
      getNode: () => elementRef.current,
    }));

    useEffect(() => {
      const shouldExpandOutline =
        activeOutlinePath !== null
        && activeOutlinePath !== outlinePath
        && activeOutlinePath.startsWith(outlinePath);
      if (shouldExpandOutline) {
        setIsExpanded(true);
      }
    }, [activeOutlinePath, isAddingNewOutline, outline]);

    useLayoutEffect(() => {
      setIsExpanded(shouldAutoExpandOutlines);
    }, [shouldAutoExpandOutlines]);

    useLayoutEffect(() => {
      setIsRenaming(false);
      setChangingDest(false);
    }, [outlines]);

    useEffect(() => {
      setIsSelected(selectedOutlines.includes(outlinePath));
    }, [selectedOutlines]);

    const toggleOutline = useCallback(() => {
      setIsExpanded((expand) => !expand);
    }, []);

    const onSingleClick = useCallback(() => {
      core.goToOutline(outline);

      outlinePath === activeOutlinePath
        ? setActiveOutlinePath(null)
        : setActiveOutlinePath(outlinePath);


      if (isAddingNewOutline) {
        setAddingNewOutline(false);
        updateOutlines();
      }

      if (isMobile()) {
        dispatch(actions.closeElement('leftPanel'));
      }
    }, [dispatch, setActiveOutlinePath, activeOutlinePath, isAddingNewOutline, outline]);

    const isActive = isOutlineActive(outline);

    return (
      <div
        ref={(!isAddingNewOutline && !isAnyOutlineRenaming && isMultiSelectMode && isOutlineEditable) ? elementRef : null}
        className="outline-drag-container"
        style={{ opacity }}
      >
        <div className="outline-drag-line" style={{ opacity: isDraggedUpwards ? 1 : 0 }} />
        <DataElementWrapper
          className={classNames({
            'bookmark-outline-single-container': true,
            'editing': isRenaming || isChangingDest,
            'default': !isRenaming && !isChangingDest,
            'selected': isActive,
            'hover': isHovered && !isActive,
          })}
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onSingleClick()}
          onClick={(e) => {
            if (!isRenaming && !isChangingDest && e.detail === 1) {
              setClearSingleClick(setTimeout(onSingleClick, 300));
            }
          }}
          onDoubleClick={() => {
            if (!isRenaming && !isChangingDest) {
              clearTimeout(clearSingleClick);
            }
          }}
        >
          {isMultiSelectMode &&
            <Choice
              type="checkbox"
              className="bookmark-outline-checkbox"
              id={`outline-checkbox-${outlinePath}`}
              checked={isSelected}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                setIsSelected(e.target.checked);
                setMultiSelected(outlinePath, e.target.checked);
              }}
            />
          }

          <div
            className={classNames({
              'outline-treeview-toggle': true,
              expanded: isExpanded,
            })}
            style={{ marginLeft: outlineUtils.getNestedLevel(outline) * 12 }}
          >
            {outline.getChildren().length > 0 &&
              <Button
                img="icon-chevron-right"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleOutline();
                }}
              />
            }
          </div>

          <OutlineContent
            text={outline.getName()}
            outlinePath={outlinePath}
            isOutlineRenaming={isRenaming}
            setOutlineRenaming={setIsRenaming}
            isOutlineChangingDest={isChangingDest}
            setOutlineChangingDest={setChangingDest}
            setIsHovered={setHovered}
          />
        </DataElementWrapper>

        <div className="outline-drag-line" style={{ opacity: isDraggedDownwards ? 1 : 0 }} />

        {isExpanded &&
          outline.getChildren().map((child) => (
            <OutlineNested
              outline={child}
              key={outlineUtils.getOutlineId(child)}
              setMultiSelected={setMultiSelected}
              moveOutlineInward={moveOutlineInward}
              moveOutlineBeforeTarget={moveOutlineBeforeTarget}
              moveOutlineAfterTarget={moveOutlineAfterTarget}
            />
          ))
        }
        {isAddingNewOutline && isActive && (
          <DataElementWrapper className="bookmark-outline-single-container editing">
            <div
              className="outline-treeview-toggle"
              style={{ marginLeft: outlineUtils.getNestedLevel(outline) * 12 }}
            ></div>
            <OutlineContent
              isAdding={true}
              text={''}
              onCancel={() => setAddingNewOutline(false)}
            />
          </DataElementWrapper>
        )}
      </div>
    );
  }
);

Outline.propTypes = propTypes;

const OutlineNested = DropTarget(
  ItemTypes.OUTLINE,
  {
    hover(props, dropTargetMonitor, dropTargetContainer) {
      if (!dropTargetContainer) {
        return;
      }

      const dragObject = dropTargetMonitor.getItem();
      if (!dragObject) {
        return;
      }

      const { dragOutline, dragSourceNode } = dragObject;
      const { outline: dropOutline } = props;

      const dropTargetNode = dropTargetContainer.getNode();
      if (!dragSourceNode || !dropTargetNode) {
        return;
      }

      const outlineIsBeingDraggedIntoDescendant = dragSourceNode.contains(dropTargetNode);
      if (outlineIsBeingDraggedIntoDescendant) {
        dragObject.dropTargetNode = undefined;
        dragObject.dropLocation = DropLocation.INITIAL;
        return;
      }

      dragObject.dropTargetNode = dropTargetNode;
      const dragIndex = dragOutline.index;
      const hoverIndex = dropOutline.index;
      if (dragOutline.parent === dropOutline.parent && dragIndex === hoverIndex) {
        return;
      }

      const dropTargetBoundingRect = dropTargetNode.getBoundingClientRect();
      const dropTargetVerticalMiddlePoint = (dropTargetBoundingRect.bottom - dropTargetBoundingRect.top) / 2;
      const clientOffset = dropTargetMonitor.getClientOffset();
      const dropTargetClientY = clientOffset.y - dropTargetBoundingRect.top;
      switch (true) {
        case dropTargetClientY <= dropTargetVerticalMiddlePoint + BUFFER_ROOM && dropTargetClientY >= dropTargetVerticalMiddlePoint - BUFFER_ROOM:
          dragObject.dropLocation = DropLocation.ON_TARGET_HORIZONTAL_MIDPOINT;
          if (dropTargetMonitor.isOver({ shallow: true })) {
            dropTargetNode.classList.add('isNesting');
          }
          setTimeout(() => {
            if (dragObject?.dropTargetNode !== dropTargetNode) {
              dropTargetNode.classList.remove('isNesting');
            }
          }, 100);
          break;
        case dropTargetClientY > dropTargetVerticalMiddlePoint + BUFFER_ROOM:
          dragObject.dropLocation = DropLocation.BELOW_TARGET;
          dropTargetNode.classList.remove('isNesting');
          break;
        case dropTargetClientY < dropTargetVerticalMiddlePoint - BUFFER_ROOM:
          dragObject.dropLocation = DropLocation.ABOVE_TARGET;
          dropTargetNode.classList.remove('isNesting');
          break;
        default:
          dragObject.dropLocation = DropLocation.INITIAL;
          dropTargetNode.classList.remove('isNesting');
          break;
      }
      fireEvent(Events.DRAG_OUTLINE,
        {
          targetOutline: dropOutline,
          draggedOutline: dragObject.dragOutline,
          dropLocation: dragObject.dropLocation
        }
      );
    },
    drop(props, dropTargetMonitor, dropTargetContainer) {
      if (!dropTargetContainer) {
        return;
      }
      const dragObject = dropTargetMonitor.getItem();
      const { dragOutline, dropTargetNode } = dragObject;
      const { outline: dropOutline, moveOutlineInward, moveOutlineBeforeTarget, moveOutlineAfterTarget } = props;

      if (!dropTargetNode) {
        return;
      }

      switch (dragObject.dropLocation) {
        case DropLocation.ON_TARGET_HORIZONTAL_MIDPOINT:
          moveOutlineInward(dragOutline, dropOutline);
          break;
        case DropLocation.ABOVE_TARGET:
          moveOutlineBeforeTarget(dragOutline, dropOutline);
          break;
        case DropLocation.BELOW_TARGET:
          moveOutlineAfterTarget(dragOutline, dropOutline);
          break;
        default:
          break;
      }
      dropTargetNode.classList.remove('isNesting');
      fireEvent(Events.DROP_OUTLINE,
        {
          targetOutline: dropOutline,
          draggedOutline: dragOutline,
          dropLocation: dragObject.dropLocation
        }
      );
      dragObject.dropLocation = DropLocation.INITIAL;
    }
  },
  (connect, dropTargetState) => ({
    connectDropTarget: connect.dropTarget(),
    isDraggedUpwards: dropTargetState.isOver({ shallow: true }) && (dropTargetState.getItem()?.dropLocation === DropLocation.ABOVE_TARGET),
    isDraggedDownwards: dropTargetState.isOver({ shallow: true }) && (dropTargetState.getItem()?.dropLocation === DropLocation.BELOW_TARGET),
  })
)(DragSource(
  ItemTypes.OUTLINE,
  {
    beginDrag: (props, dragSourceMonitor, dragSourceContainer) => ({
      sourceId: dragSourceMonitor.sourceId,
      dragOutline: props.outline,
      dragSourceNode: dragSourceContainer.getNode(),
      dropLocation: DropLocation.INITIAL,
    }),
    canDrag() {
      if (isIE) {
        console.warn('Drag and drop outlines for IE11 is not supported');
        return false;
      }
      if (!core.isFullPDFEnabled()) {
        console.warn('Full API must be enabled to drag and drop outlines');
        return false;
      }
      return true;
    }
  },
  (connect, dragSourceState) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: dragSourceState.isDragging(),
  })
)(Outline));

OutlineNested.propTypes = propTypes;

export default OutlineNested;
