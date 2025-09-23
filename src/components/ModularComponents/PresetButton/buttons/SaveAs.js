import React, { useState, useEffect, forwardRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { getPresetButtonDOM } from '../../Helpers/menuItems';
import { workerTypes } from 'constants/types';
import core from 'core';
import actions from 'actions';
import DataElements from 'constants/dataElement';
import { PRESET_BUTTON_TYPES } from 'constants/customizationVariables';
import useFocusHandler from 'hooks/useFocusHandler';
import FlyoutItemContainer from '../../FlyoutItemContainer';
import useOnDocumentUnloaded from 'hooks/useOnDocumentUnloaded';
import selectors from 'selectors';

/**
 * A button that opens the save as modal.
 * @name saveAsButton
 * @memberof UI.Components.PresetButton
 */
const SaveAsButton = forwardRef((props, ref) => {
  const {
    isFlyoutItem,
    dataElement,
    className,
    style,
    img: icon,
    title,
  } = props;
  const [documentType, setDocumentType] = useState();
  const dispatch = useDispatch();
  const activeDocumentViewerKey = useSelector(selectors.getActiveDocumentViewerKey);

  useEffect(() => {
    const onDocumentLoaded = (viewerKey) => {
      const document = core.getDocument(viewerKey);
      setDocumentType(document?.getType() || null);
    };

    onDocumentLoaded(activeDocumentViewerKey);
    core.addEventListener('documentLoaded', onDocumentLoaded);
    return () => core.removeEventListener('documentLoaded', onDocumentLoaded);
  }, [activeDocumentViewerKey]);

  const handleDocumentUnloaded = useCallback(() => {
    setDocumentType(null);
  }, []);
  useOnDocumentUnloaded(handleDocumentUnloaded);

  const handleClick = () => {
    dispatch(actions.openElement(DataElements.SAVE_MODAL));
  };

  const handleSaveAsButtonClick = useFocusHandler(handleClick);

  const isDisabled = !documentType || documentType === workerTypes.XOD;

  if (isDisabled) {
    if (isFlyoutItem) {
      return null;
    }
    console.warn('The save as preset button is not available for XOD documents.');
  }

  return (
    isFlyoutItem ?
      <FlyoutItemContainer {...props} ref={ref} onClick={handleSaveAsButtonClick} />
      :
      getPresetButtonDOM({
        buttonType: PRESET_BUTTON_TYPES.SAVE_AS,
        isDisabled,
        onClick: handleSaveAsButtonClick,
        dataElement,
        className,
        style,
        icon,
        title,
      })
  );
});

SaveAsButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
  dataElement: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  img: PropTypes.string,
  title: PropTypes.string,
};
SaveAsButton.displayName = 'SaveAsButton';

export default SaveAsButton;