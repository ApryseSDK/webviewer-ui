import React from 'react';
import InsertUploadedPagePanel from './InsertUploadedPagePanel';
import { insertPages, exitPageInsertionWarning } from 'helpers/pageManipulationFunctions';
import { useDispatch } from 'react-redux';

const InsertUploadedPagePanelContainer = React.forwardRef((props, ref) => {
  // This makes it easier to mock the insertPages handler for testing purposes
  const dispatch = useDispatch();
  const { closeModal } = props;
  const closeModalWarning = () => exitPageInsertionWarning(closeModal, dispatch);
  return (<InsertUploadedPagePanel {...props} insertPages={insertPages} closeModalWarning={closeModalWarning} ref={ref} />);
});

InsertUploadedPagePanelContainer.displayName = 'InsertUploadedPagePanelContainer';
export default InsertUploadedPagePanelContainer;