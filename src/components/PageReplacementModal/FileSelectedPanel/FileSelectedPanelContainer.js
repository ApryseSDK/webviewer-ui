import React from 'react';
import FileSelectedPanel from './FileSelectedPanel';
import { replacePages } from '../../../helpers/pageManipulationFunctions';
import useCore from 'hooks/useCore';

// Need to forward the ref to keep the focus trap working correctly
const FileSelectedPanelContainer = React.forwardRef((props, ref) => {
  const { core } = useCore();
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
