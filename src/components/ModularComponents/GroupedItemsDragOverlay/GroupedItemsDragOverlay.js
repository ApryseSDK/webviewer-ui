import React from 'react';

const GroupedItemsDragOverlay = ({ numberOfItems }) => {
  const styles = {
    display: 'flex',
    alignItems: 'center',
    border: '2px dashed black',
    padding: '8px',
    borderRadius: '4px',
  };
  return (
    <div style={styles}>
      {numberOfItems} Items
    </div>
  );
};

export default GroupedItemsDragOverlay;