import React, { useState, useCallback, useContext, useEffect, useLayoutEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { DragSource, DropTarget } from 'react-dnd';
import { useTranslation } from 'react-i18next';
import { ItemTypes, DropLocation, BUFFER_ROOM } from 'constants/dnd';
import fireEvent from 'helpers/fireEvent';

import OutlineContext from './Context';
import Icon from 'components/Icon';
import Button from 'components/Button';
import DataElementWrapper from 'components/DataElementWrapper';
import OutlineEditPopup from 'components/OutlineEditPopup';
import OutlineTextInput from 'components/OutlineTextInput';

import core from 'core';
import outlineUtils from 'helpers/OutlineUtils';
import { isMobile, isIE } from 'helpers/device';
import actions from 'actions';
import selectors from 'selectors';

import './Outline.scss';

const propTypes = {
  outline: PropTypes.object.isRequired,
  moveOutlineInward: PropTypes.func.isRequired,
  moveOutlineBeforeTarget: PropTypes.func.isRequired,
  moveOutlineAfterTarget: PropTypes.func.isRequired,
  connectDragSource: PropTypes.func,
  connectDropTarget: PropTypes.func,
  isDragging: PropTypes.bool,
  isDraggedUpwards: PropTypes.bool,
  isDraggedDownwards: PropTypes.bool
};

const Outline = forwardRef(
  function Outline(
    {
      outline,
      isDragging,
      isDraggedUpwards,
      isDraggedDownwards,
      connectDragSource,
      connectDropTarget,
      moveOutlineInward,
      moveOutlineBeforeTarget,
      moveOutlineAfterTarget
    },
    ref
  ) {
    const outlines = useSelector(state => selectors.getOutlines(state));
    const {
      setSelectedOutlinePath,
      isOutlineSelected,
      selectedOutlinePath,
      setIsAddingNewOutline,
      isAddingNewOutline,
      reRenderPanel,
      addNewOutline,
    } = useContext(OutlineContext);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [showHoverBackground, setShowHoverBackground] = useState(false);
    const dispatch = useDispatch();
    const [t] = useTranslation();

    const elementRef = useRef(null);
    connectDragSource(elementRef);
    connectDropTarget(elementRef);
    const opacity = isDragging ? 0 : 1;
    useImperativeHandle(ref, () => ({
      getNode: () => elementRef.current,
    }));

    useEffect(() => {
    // automatically sets the current outline to be expanded in two cases
    // 1. another outline is nested into this outline (by listening to the change of selectedOutlinePath)
    // 2. a new child outline is going to be added (by listening to the change of isAddingNewOutline)
      const path = outlineUtils.getPath(outline);

      if (
        selectedOutlinePath !== null &&
      selectedOutlinePath !== path &&
      selectedOutlinePath.startsWith(path)
      ) {
        setIsExpanded(true);
      }
    }, [selectedOutlinePath, isAddingNewOutline, outline]);

    useLayoutEffect(() => {
      setIsEditingName(false);
    }, [outlines]);

    const handleClickExpand = useCallback(function() {
      setIsExpanded(expand => !expand);
    }, []);

    const handleOutlineClick = useCallback(
      function() {
        core.goToOutline(outline);
        setSelectedOutlinePath(outlineUtils.getPath(outline));

        if (isMobile()) {
          dispatch(actions.closeElement('leftPanel'));
        }
      },
      [dispatch, setSelectedOutlinePath, outline],
    );

    function handleOutlineDoubleClick() {
      if (!core.isFullPDFEnabled()) {
        return;
      }

      setIsEditingName(true);
    }

    async function changeOutlineName(e) {
      const newName = e.target.value;

      if (!newName || outline.getName() === newName) {
        setIsEditingName(false);
        return;
      }

      await outlineUtils.setOutlineName(outlineUtils.getPath(outline), newName);
      reRenderPanel();
    }

    const isSelected = isOutlineSelected(outline);

    return (
      <div
        className="Outline"
        style={{ opacity }}
      >
        <div className="padding">
          {(outline.getChildren().length > 0 ) && (
            <div
              className={classNames({
                arrow: true,
                expanded: isExpanded,
              })}
              onClick={handleClickExpand}
            >
              <Icon glyph="ic_chevron_right_black_24px" />
            </div>
          )}
        </div>
        <div className={classNames({ content: true, editable: core.isFullPDFEnabled() })}>
          {isDraggedUpwards && <div style={{ borderTop: '1px solid #bbb' }}/>}
          {isEditingName ? (
            <OutlineTextInput
              defaultValue={outline.getName()}
              onEscape={() => setIsEditingName(false)}
              onEnter={changeOutlineName}
              onBlur={changeOutlineName}
            />
          ) : (
            <div className={classNames({ row: true, selected: isSelected, hover: showHoverBackground && !isSelected })} ref={elementRef}>
              <Button
                className="contentButton"
                onDoubleClick={handleOutlineDoubleClick}
                label={outline.getName()}
                onClick={handleOutlineClick}
              />
              <OutlineEditButton
                outline={outline}
                setIsEditingName={setIsEditingName}
                onPopupOpen={() => setShowHoverBackground(true)}
                onPopupClose={() => setShowHoverBackground(false)}
              />
            </div>
          )}
          {isDraggedDownwards && <div style={{ borderTop: '1px solid #bbb' }}/>}
          {isExpanded &&
          outline.getChildren().map(outline =>
            <DropOutine
              outline={outline}
              key={outlineUtils.getOutlineId(outline)}
              moveOutlineInward={moveOutlineInward}
              moveOutlineBeforeTarget={moveOutlineBeforeTarget}
              moveOutlineAfterTarget={moveOutlineAfterTarget}
            />)
          }
          {isAddingNewOutline && isSelected && (
            <OutlineTextInput
              defaultValue={t('message.untitled')}
              onEscape={() => setIsAddingNewOutline(false)}
              onEnter={addNewOutline}
              onBlur={addNewOutline}
            />
          )}
        </div>
      </div>
    );
  });

Outline.propTypes = propTypes;

function OutlineEditButton({ outline, setIsEditingName, onPopupOpen, onPopupClose }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      onPopupOpen();
    } else {
      onPopupClose();
    }
  }, [isOpen, onPopupOpen, onPopupClose]);

  function handleButtonClick() {
    setIsOpen(open => !open);
  }

  const trigger = `edit-button-${outlineUtils.getPath(outline)}`;

  return (
    <DataElementWrapper className="editOutlineButton" dataElement="editOutlineButton">
      <Button dataElement={trigger} img="icon-tool-more" onClick={handleButtonClick} />
      {isOpen && (
        <OutlineEditPopup
          outline={outline}
          trigger={trigger}
          setIsOpen={setIsOpen}
          setIsEditingName={setIsEditingName}
        />
      )}
    </DataElementWrapper>
  );
}
OutlineEditButton.propTypes = {
  outline: PropTypes.object.isRequired,
  setIsEditingName: PropTypes.func.isRequired,
  onPopupOpen: PropTypes.func.isRequired,
  onPopupClose: PropTypes.func.isRequired,
};

const DropOutine = DropTarget(ItemTypes.OUTLINE, {
  hover(props, dragSourceState, outlineComponentInstance) {
    if (!outlineComponentInstance) {
      return null;
    }

    if (dragSourceState.getItem() === null) {
      return;
    }

    // node = HTML Div element from imperative API
    const node = outlineComponentInstance.getNode();
    if (!node) {
      return null;
    }
    dragSourceState.getItem().node = node;
    const dragIndex = dragSourceState.getItem().outline.index;
    const hoverIndex = props.outline.index;
    if (dragSourceState.getItem().outline.parent === props.outline.parent && dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const dropTargetBoundingRect = node.getBoundingClientRect();
    // Get vertical middle
    const dropTargetYMidPoint = (dropTargetBoundingRect.bottom - dropTargetBoundingRect.top) / 2;
    // Determine mouse position
    const clientOffset = dragSourceState.getClientOffset();
    // Get pixels to the top
    const dropTargetClientY = clientOffset.y - dropTargetBoundingRect.top;
    switch (true) {
      case  dropTargetClientY <= dropTargetYMidPoint + BUFFER_ROOM && dropTargetClientY >= dropTargetYMidPoint - BUFFER_ROOM:
        dragSourceState.getItem().dropLocation = DropLocation.ON_TARGET_HORIZONTAL_MIDPOINT;
        node.style.backgroundColor = '#bbb';
        setTimeout(() => {
          if (dragSourceState.getItem()?.node !== node) {
            node.style.backgroundColor = 'transparent';
          }
        }, 100);
        break;
      case dropTargetClientY > dropTargetYMidPoint + BUFFER_ROOM:
        dragSourceState.getItem().dropLocation = DropLocation.BELOW_TARGET;
        node.style.backgroundColor = 'transparent';
        break;
      case dropTargetClientY < dropTargetYMidPoint - BUFFER_ROOM:
        dragSourceState.getItem().dropLocation = DropLocation.ABOVE_TARGET;
        node.style.backgroundColor = 'transparent';
        break;
      default:
        dragSourceState.getItem().dropLocation = DropLocation.INITIAL;
        node.style.backgroundColor = 'transparent';
        break;
    }
    fireEvent('onDraggingItem',
      {
        targetOutline: props.outline,
        draggedOutline: dragSourceState.getItem().outline,
        dropLocation: dragSourceState.getItem().dropLocation
      }
    );
  },
  drop(props, dragSourceState, outlineComponentInstance) {
    if (!outlineComponentInstance) {
      return null;
    }
    const { outline, moveOutlineInward, moveOutlineBeforeTarget, moveOutlineAfterTarget } = props;
    switch (dragSourceState.getItem().dropLocation) {
      case DropLocation.ON_TARGET_HORIZONTAL_MIDPOINT:
        moveOutlineInward(dragSourceState.getItem().outline, outline);
        break;
      case DropLocation.ABOVE_TARGET:
        moveOutlineBeforeTarget(dragSourceState.getItem().outline, outline);
        break;
      case DropLocation.BELOW_TARGET:
        moveOutlineAfterTarget(dragSourceState.getItem().outline, outline);
        break;
    }
    dragSourceState.getItem().node.style.backgroundColor = 'transparent';
    fireEvent('onDropItem',
      {
        targetOutline: outline,
        draggedOutline: dragSourceState.getItem().outline,
        dropLocation: dragSourceState.getItem().dropLocation
      }
    );
    dragSourceState.getItem().dropLocation = DropLocation.INITIAL;
  }
}, (connect, dropTargetState) => ({
  connectDropTarget: connect.dropTarget(),
  // check if the position of drag card higher than the position of the hovered card
  isDraggedUpwards: dropTargetState.isOver({ shallow: true }) && (dropTargetState.getItem()?.dropLocation === DropLocation.ABOVE_TARGET),
  // check if the position of drag card lower than the position of the hovered card
  isDraggedDownwards: dropTargetState.isOver({ shallow: true }) && (dropTargetState.getItem()?.dropLocation === DropLocation.BELOW_TARGET),
}))(DragSource(ItemTypes.OUTLINE, {
  beginDrag: props => ({
    id: props.id,
    outline: props.outline,
    dropLocation: DropLocation.INITIAL,
  }),
  canDrag() {
    if (!core.isFullPDFEnabled() && !isIE) {
      console.warn('Full API must be enabled to drag and drop outlines');
    } else if (isIE) {
      console.warn('Drag and drop for IE11 is not supported');
    }
    // enable fullPdfEnabled and disable IE
    return core.isFullPDFEnabled() && !isIE;
  }
}, (connect, dragSourceState) => ({
  connectDragSource: connect.dragSource(),
  isDragging: dragSourceState.isDragging(),
}))(Outline));

export default DropOutine;