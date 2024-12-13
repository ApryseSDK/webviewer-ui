import React from 'react';
import Icon from 'components/Icon';

const mapDataElementToLabel = (dataElement) => {
  switch (dataElement) {
    case 'leftPanel':
      return 'Left Panel';
    case 'notesPanel':
      return 'Notes Panel';
    case 'searchPanel':
      return 'Search Panel';
    case 'signaturePanel':
      return 'Signature Panel';
    default:
      return 'Unknown Panel';
  }
};
const PanelDragOverlay = ({ dataElement }) => {
  const styles = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'FFFFFF',
    border: '2px dashed black',
    padding: '8px',
    borderRadius: '4px',
  };
  return (
    <div style={styles}>
      <Icon glyph="icon-header-sidebar-line" style={{ marginRight: '8px' }} />
      {mapDataElementToLabel(dataElement)}
    </div>
  );
};

export default PanelDragOverlay;