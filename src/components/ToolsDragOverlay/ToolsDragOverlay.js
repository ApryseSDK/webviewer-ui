import React from 'react';
import Icon from 'components/Icon';
import { useSelector, shallowEqual } from 'react-redux';
import selectors from 'selectors';


const ToolsDragOverlay = ({ toolName }) => {
  const toolButtonObject = useSelector((state) => selectors.getToolButtonObject(state, toolName), shallowEqual);
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
      <Icon glyph={toolButtonObject.img} style={{ marginRight: '8px' }} />
    </div>
  );
};

export default ToolsDragOverlay;