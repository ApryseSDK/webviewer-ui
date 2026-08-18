import React, { useState, useCallback, useContext, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { DragSource, DropTarget } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { ItemTypes, DropLocation, BUFFER_ROOM } from 'constants/dnd';
// For canDrag() function
// eslint-disable-next-line custom/use-core-hook-in-components
import core from 'core';
import useCore from 'hooks/useCore';
import actions from 'actions';
import selectors from 'selectors';

import Events from 'constants/events';
import fireEvent from 'helpers/fireEvent';
import outlineUtils from 'helpers/OutlineUtils';
import { isMobile, isIE } from 'helpers/device';
import OutlineContext from './Context';
import OutlineContent from 'src/components/OutlineContent';
import DataElementWrapper from '../DataElementWrapper';
import { isOutlineExpanded } from 'src/helpers/outlinesPanelHelper';

import './Outline.scss';
import '../../constants/bookmarksOutlinesShared.scss';

const propTypes = {
  outline: PropTypes.object.isRequired,
  nestingLevel: PropTypes.number,
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

const OUTLINE_NESTING_INDENT = 32;

export const isOutlinePathDescendant = (ancestorPath, descendantPath) => {
  return typeof ancestorPath === 'string'
    && typeof descendantPath === 'string'
    && descendantPath !== ancestorPath
    && descendantPath.startsWith(`${ancestorPath}-`);
};

export const isOutlinePathSelfOrDescendant = (ancestorPath, descendantPath) => {
  return typeof ancestorPath === 'string'
    && typeof descendantPath === 'string'
    && (descendantPath === ancestorPath || isOutlinePathDescendant(ancestorPath, descendantPath));
};

export const shouldExpandOutline = (activeOutlinePath, outlinePath) => {
  return isOutlinePathDescendant(outlinePath, activeOutlinePath);
};

const Outline = forwardRef(
  function Outline(
    {
      outline,
      nestingLevel,
      setMultiSelected,
      isDragging,
      isDraggedUpwards,
      isDraggedDownwards,
      connectDragSource,
      connectDragPreview,
      connectDropTarget,
    },
    ref
  ) {
    const { core } = useCore();
    const activeDocumentViewerKey = useSelector((state) => selectors.getActiveDocumentViewerKey(state));
    const outlinePath = outlineUtils.getPath(outline);
    const resolvedNestingLevel = nestingLevel ?? outlineUtils.getNestedLevel(outline);
    const outlineState = useSelector(
      (state) => selectors.getOutlinesStateMap(state, activeDocumentViewerKey)?.[outlinePath],
      shallowEqual
    );

    const {
      setActiveOutlinePath,
      activeOutlinePath,
      isOutlineActive,
      setIsAddingNewOutline,
      isAddingNewOutline,
      isMultiSelectMode,
      shouldAutoExpandOutlines,
      isOutlineEditable,
      updateOutlines,
    } = useContext(OutlineContext);

    const isExpanded = isOutlineExpanded(outlineState, shouldAutoExpandOutlines);
    const isRenaming = outlineState?.isRenaming || false;
    const isChangingDest = outlineState?.isChangingDest || false;

    const [clearSingleClick, setClearSingleClick] = useState(undefined);

    const dispatch = useDispatch();

    const elementRef = useRef(null);
    connectDragSource(elementRef);
    connectDragPreview(getEmptyImage(), { captureDraggingState: true });
    connectDropTarget(elementRef);
    useImperativeHandle(ref, () => ({
      getNode: () => elementRef.current,
    }));

    const updateIsExpanded = useCallback((isExpanded) => {
      dispatch(actions.setOutlinesStateMap(outlinePath, { isExpanded }, activeDocumentViewerKey));
    }, [dispatch, outlinePath, activeDocumentViewerKey]);

    const updateIsRenaming = useCallback((isRenaming) => {
      dispatch(actions.setOutlinesStateMap(outlinePath, { isRenaming }, activeDocumentViewerKey));
    }, [dispatch, outlinePath, activeDocumentViewerKey]);

    const updateIsOutlineChangingDest = useCallback((isChangingDest) => {
      dispatch(actions.setOutlinesStateMap(outlinePath, { isChangingDest }, activeDocumentViewerKey));
    }, [dispatch, outlinePath, activeDocumentViewerKey]);

    useEffect(() => {
      if (shouldExpandOutline(activeOutlinePath, outlinePath)) {
        updateIsExpanded(true);
      }
      if (isAddingNewOutline && activeOutlinePath === outlinePath) {
        updateIsExpanded(true);
      }
    }, [activeOutlinePath, isAddingNewOutline, outlinePath, updateIsExpanded]);

    const onSingleClick = () => {
      core.goToOutline(outline);

      outlinePath === activeOutlinePath
        ? setActiveOutlinePath(null)
        : setActiveOutlinePath(outlinePath);


      if (isAddingNewOutline) {
        setIsAddingNewOutline(false);
        updateOutlines();
      }

      if (isMobile()) {
        dispatch(actions.closeElement('leftPanel'));
      }
    };

    const isActive = isOutlineActive(outline);

    const convertRgbObjectToRgbString = (rgbObject) => {
      const rValue = rgbObject['r'] * 255;
      const gValue = rgbObject['g'] * 255;
      const bValue = rgbObject['b'] * 255;
      return `rgb(${rValue}, ${gValue}, ${bValue})`;
    };

    return (
      <div
        ref={(!isAddingNewOutline && isMultiSelectMode && isOutlineEditable) ? elementRef : null}
        className={classNames('outline-drag-container', { 'outline-dragging': isDragging })}
        css={{ paddingInlineStart: resolvedNestingLevel * OUTLINE_NESTING_INDENT }}
      >
        <div className={classNames('outline-drag-line', { 'outline-dragged': isDraggedUpwards })} />
        <DataElementWrapper
          className={classNames({
            'bookmark-outline-single-container': true,
            'editing': isRenaming || isChangingDest,
            'default': !isRenaming && !isChangingDest,
            'selected': isActive,
          })}
          tabIndex={0}
          onKeyDown={(e) => {
            e.key === 'Enter' && onSingleClick();
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.stopPropagation();
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
          <OutlineContent
            text={outline.getName()}
            outlinePath={outlinePath}
            isRenaming={isRenaming}
            isExpanded={isExpanded}
            updateIsExpanded={updateIsExpanded}
            updateIsRenaming={updateIsRenaming}
            isChangingDest={isChangingDest}
            updateIsChangingDest={updateIsOutlineChangingDest}
            textColor={outline.color ? convertRgbObjectToRgbString(outline.color) : null}
            setMultiSelected={setMultiSelected}
            childrenCount={outline.getChildren()?.length || 0}
            nestingLevel={resolvedNestingLevel}
          />
        </DataElementWrapper>

        <div className={classNames('outline-drag-line', { 'outline-dragged': isDraggedDownwards })} />

        {isAddingNewOutline && isActive && (
          <DataElementWrapper
            className="bookmark-outline-single-container editing"
            css={{ marginInlineStart: OUTLINE_NESTING_INDENT }}
          >
            <OutlineContent
              isAdding={true}
              text={''}
              onCancel={() => setIsAddingNewOutline(false)}
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

      const { dragOutline } = dragObject;
      const { outline: dropOutline } = props;

      const dropTargetNode = dropTargetContainer.getNode();
      if (!dropTargetNode) {
        return;
      }

      const dragPath = outlineUtils.getPath(dragOutline);
      const dropPath = outlineUtils.getPath(dropOutline);
      const outlineIsBeingDraggedIntoSelfOrDescendant = isOutlinePathSelfOrDescendant(dragPath, dropPath);
      if (outlineIsBeingDraggedIntoSelfOrDescendant) {
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
        [dropOutline, dragObject.dragOutline, dragObject.dropLocation]
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
        [dropOutline, dragOutline, dragObject.dropLocation]
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
    beginDrag: (props, dragSourceMonitor) => ({
      sourceId: dragSourceMonitor.sourceId,
      dragOutline: props.outline,
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
