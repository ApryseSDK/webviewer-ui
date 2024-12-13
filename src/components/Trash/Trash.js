import { useDroppable } from '@dnd-kit/core';
import React from 'react';
import './Trash.scss';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import Icon from '../Icon';

const Trash = () => {
  const { setNodeRef, isOver } = useDroppable({ id: 'garbage-drop-zone' });
  const isInEditorMode = useSelector((state) => selectors.isInEditorMode(state));
  
  return (
    isInEditorMode && <div
      ref={setNodeRef}
      className="Trash"
      style={{
        borderColor: isOver ? 'red' : '#DDD',
      }}
    >
      <Icon glyph="icon-delete-line" />
      <span>Drop here to delete</span>
    </div>
  );
};

export default Trash;
