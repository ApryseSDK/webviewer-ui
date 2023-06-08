import React from 'react';
import Tooltip from 'components/Tooltip';
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
    <Tooltip content="option.thumbnailPanel.moreOptions">
      <div
        className={className}
        onClick={onClickPageManipulationOverlayButton}
      >
        <ToggleElementButton
          dataElement={DataElements.PAGE_MANIPULATION_OVERLAY_BUTTON}
          element={DataElements.PAGE_MANIPULATION_OVERLAY}
          img="icon-tool-more"
        />
      </div>
    </Tooltip>
  );
}

export default PageManipulationOverlayButtonContainer;