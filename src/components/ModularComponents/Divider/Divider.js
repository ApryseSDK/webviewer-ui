import React, { useRef } from 'react';
import classNames from 'classnames';
import DraggableContainer from '../DraggableContainer';

import './Divider.scss';

const Divider = ({ headerDirection, dataElement, groupedItem, isInEditorPanel }) => {
  const ref = useRef();
  const className = classNames('Divider', `${headerDirection || 'column'}`);

  return (
    <DraggableContainer
      ref={ref}
      dataElement={dataElement}
      type='divider'
      parentContainer={groupedItem}
      isInEditorPanel={isInEditorPanel}
    >
      <div className={className} data-element={dataElement} />
    </DraggableContainer>
  );
};

export default Divider;