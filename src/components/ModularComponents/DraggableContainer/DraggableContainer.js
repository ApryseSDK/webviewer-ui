import React, { forwardRef, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import selectors from 'selectors';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import classNames from 'classnames';
import actions from 'actions';
import Icon from 'components/Icon';
import './DraggableContainer.scss';
import Button from 'components/Button';
import { ITEM_TYPE } from 'src/constants/customizationVariables';

const DraggableContainer = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const { dataElement, children, parentContainer, type, livesInHeader = false, isInEditorPanel = false, toolName, numberOfItems = 1, isMoreButton = false } = props;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: dataElement,
    data: { type, parentContainer, livesInHeader, toolName, numberOfItems },
  });

  const isInEditorMode = useSelector((state) => selectors.isInEditorMode(state));
  const isElementDisabled = useSelector((state) => selectors.isElementDisabled(state, dataElement));
  const recentDeletedItems = useSelector(selectors.getRecentDeletedItems);
  const parentElement = useSelector((state) => selectors.getModularComponent(state, parentContainer));
  const parentHeader = useSelector((state) => selectors.getHydratedHeader(state, parentContainer));
  const activeCustomRibbon = useSelector((state) => selectors.getActiveCustomRibbon(state));
  const modularComponent = useSelector((state) => selectors.getModularComponent(state, dataElement));

  const localRef = useRef();

  const combinedRef = (node) => {
    setNodeRef(node);
    if (ref) {
      if (typeof ref === 'function') {
        ref(node);
      } else {
        ref.current = node;
      }
    }
    localRef.current = node;
  };

  const deleteItem = () => {
    let items = [];

    if (parentElement?.items) {
      items = parentElement.items;
      const indexToDelete = items.indexOf(dataElement);
      items.splice(indexToDelete, 1);

      dispatch(actions.setModularComponentProperty('items', items, parentContainer));

      if (parentElement.type === ITEM_TYPE.RIBBON_GROUP && dataElement === activeCustomRibbon) {
        dispatch(actions.setActiveCustomRibbon(null));
      }

    } else if (livesInHeader) {
      items = parentHeader.items;
      const itemsDataElements = items.map((item) => item.dataElement);
      const indexToDelete = itemsDataElements.indexOf(dataElement);
      items.splice(indexToDelete, 1);
      dispatch(actions.setModularHeaderItems(parentContainer, items));
    }

    dispatch(actions.setRecentDeletedItems([...recentDeletedItems, modularComponent]));
  };

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  if (!isInEditorMode || dataElement === 'editorModeButton' || isMoreButton) {
    return (children);
  }

  const containerTypes = ['groupedItems'];

  const isContainer = containerTypes.includes(type);

  return (
    !isElementDisabled &&
    <div
      className={classNames({ 'DraggableContainer': true, 'is-in-editor-mode': isInEditorMode, 'is-container': isContainer, 'is-divider': type === 'divider' })}
      ref={combinedRef}
      style={style}
    >
      <div
        className="DraggableContainer__handle"
        {...attributes}
        {...listeners}
      >
        <Icon glyph="icon-drag-handle" className={classNames({ 'drag-handle': true, 'is-container-handle': isContainer })} />
      </div>

      <div className="DraggableContainer__content">
        {children}
      </div>
      {!isInEditorPanel && !isContainer && (
        <div className="corner-delete-button">
          <Button
            className='DraggableContainer__close'
            img='icon-close'
            onClick={deleteItem}
          />
        </div>
      )}
    </div>
  );
});

DraggableContainer.displayName = 'DraggableContainer';

export default DraggableContainer;