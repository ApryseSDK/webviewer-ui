import React, { useState, useEffect, forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { getPresetButtonDOM } from '../../Helpers/menuItems';
import core from 'core';
import { PRESET_BUTTON_TYPES } from 'constants/customizationVariables';
import FlyoutItemContainer from '../../FlyoutItemContainer';
import selectors from 'selectors';
import actions from 'actions';
import DataElements from 'constants/dataElement';
import { workerTypes } from 'constants/types';

/**
 * A button that starts semantic text compare and opens the compare panel
 * @name compareButton
 * @memberof UI.Components.CompareButton
 */
const CompareButton = forwardRef((props, ref) => {
  const { isFlyoutItem, className, style } = props;
  const isPanelOpen = useSelector((state) => selectors.isElementOpen(state, DataElements.COMPARE_PANEL));
  const [doc1TypeValid, setDoc1TypeValid] = useState(false);
  const [doc2TypeValid, setDoc2TypeValid] = useState(false);
  const isCompareStarted = useSelector(selectors.isCompareStarted);
  const dispatch = useDispatch();

  useEffect(() => {
    const onDocumentLoaded = (documentViewerKey) => () => {
      const documentViewer = core.getDocumentViewer(documentViewerKey);
      const isValid = documentViewer.getDocument()?.getType() === 'pdf' ||
        (documentViewer.getDocument()?.getType() === workerTypes.WEBVIEWER_SERVER && !documentViewer.getDocument()?.isWebViewerServerDocument());
      documentViewerKey === 1 ? setDoc1TypeValid(isValid) : setDoc2TypeValid(isValid);
    };
    const onDocumentUnloaded = (documentViewerKey) => () => {
      documentViewerKey === 1 ? setDoc1TypeValid(false) : setDoc2TypeValid(false);
      dispatch(actions.setIsCompareStarted(false));
      dispatch(actions.closeElement(DataElements.COMPARE_PANEL));
    };
    const docLoaded1 = onDocumentLoaded(1);
    const docLoaded2 = onDocumentLoaded(2);
    const docUnloaded1 = onDocumentUnloaded(1);
    const docUnloaded2 = onDocumentUnloaded(2);
    docLoaded1();
    docLoaded2();
    core.addEventListener('documentLoaded', docLoaded1, undefined, 1);
    core.addEventListener('documentUnloaded', docUnloaded1, undefined, 1);
    core.addEventListener('documentLoaded', docLoaded2, undefined, 2);
    core.addEventListener('documentUnloaded', docUnloaded2, undefined, 2);
    return () => {
      core.removeEventListener('documentLoaded', docLoaded1, 1);
      core.removeEventListener('documentUnloaded', docUnloaded1, 1);
      core.removeEventListener('documentLoaded', docLoaded2, 2);
      core.removeEventListener('documentUnloaded', docUnloaded2, 2);
    };
  }, []);

  const isDisabled = !doc1TypeValid || !doc2TypeValid;

  useEffect(() => {
    if (isDisabled) {
      if (isFlyoutItem) {
        return null;
      }
      console.warn('The compare preset button can only be used when 2 PDF documents are loaded on both sides');
    }
  }, [isDisabled]);

  const handleClick = () => {
    const isOpening = !isPanelOpen;
    dispatch(actions.toggleElement(DataElements.COMPARE_PANEL));
    if (!isCompareStarted && isOpening) {
      dispatch(actions.setIsCompareStarted(true));
      const documentViewers = core.getDocumentViewers();
      documentViewers[0].startSemanticDiff(documentViewers[1]);
    }
  };

  return (
    isFlyoutItem ?
      <FlyoutItemContainer {...props} ref={ref} onClick={handleClick} isActive={isPanelOpen} />
      :
      getPresetButtonDOM({
        isDisabled,
        buttonType: PRESET_BUTTON_TYPES.COMPARE,
        onClick: handleClick,
        isActive: isPanelOpen,
        className,
        style,
      })
  );
});

CompareButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};
CompareButton.displayName = 'CompareButton';

export default CompareButton;