import React from 'react';
import FileSelectedPanel from './FileSelectedPanel';
import { replacePages } from '../../../helpers/pageManipulationFunctions';
import core from 'core';

// Need to forward the ref to keep the focus trap working correctly
const FileSelectedPanelContainer = React.forwardRef((props, ref) => {
  const documentInViewer = core.getDocument();

  return (
    <FileSelectedPanel
      {...props}
      documentInViewer={documentInViewer}
      replacePagesHandler={replacePages}
      ref={ref}
    />
  );
});

FileSelectedPanelContainer.displayName = 'FileSelectedPanelContainer';

export default FileSelectedPanelContainer;
