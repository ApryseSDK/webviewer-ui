import React from 'react';
import ToggleElementButton from '../ToggleElementButton';
import { useDispatch, useSelector } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';

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
        dataElement="pageManipulationOverlayButton"
        element="pageManipulationOverlay"
        img="icon-tool-more"
      />
    </div>
  );
}

export default PageManipulationOverlayButtonContainer;