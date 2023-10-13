import React from 'react';
import ToggleElementButton from '../ToggleElementButton';
import { useDispatch, useSelector } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import DataElements from 'constants/dataElement';

function PageManipulationOverlayButtonContainer(props) {
  const { className, pageIndex } = props;

  const dispatch = useDispatch();
  const selectedPageIndexes = useSelector((state) => selectors.getSelectedThumbnailPageIndexes(state));

  const onClickPageManipulationOverlayButton = () => {
    if (selectedPageIndexes.indexOf(pageIndex) === -1) {
      dispatch(actions.setSelectedPageThumbnails([pageIndex]));
    }
  };

  return (
    <div
      className={className}
      onClick={onClickPageManipulationOverlayButton}
    >
      <ToggleElementButton
        dataElement={DataElements.PAGE_MANIPULATION_OVERLAY_BUTTON}
        element={DataElements.PAGE_MANIPULATION_OVERLAY}
        img="icon-tool-more"
        title="option.thumbnailPanel.moreOptions"
      />
    </div>
  );
}

export default PageManipulationOverlayButtonContainer;