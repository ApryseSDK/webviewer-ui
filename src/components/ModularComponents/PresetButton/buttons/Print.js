import React, { forwardRef, useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { getPresetButtonDOM } from '../../Helpers/menuItems';
import { print } from 'helpers/print';
import selectors from 'selectors';
import core from 'core';
import { PRESET_BUTTON_TYPES } from 'constants/customizationVariables';
import useFocusHandler from 'hooks/useFocusHandler';
import FlyoutItemContainer from '../../FlyoutItemContainer';
import useOnDocumentUnloaded from 'src/hooks/useOnDocumentUnloaded';

/**
 * A button that prints the document.
 * @name printButton
 * @memberof UI.Components.PresetButton
 */
const PrintButton = forwardRef((props, ref) => {
  const { isFlyoutItem, className, style } = props;
  const dispatch = useDispatch();

  const useClientSidePrint = useSelector(selectors.useClientSidePrint);
  const isEmbedPrintSupported = useSelector(selectors.isEmbedPrintSupported);
  const sortStrategy = useSelector(selectors.getSortStrategy);
  const colorMap = useSelector(selectors.getColorMap);
  const timezone = useSelector(selectors.getTimezone);
  const activeDocumentViewerKey = useSelector(selectors.getActiveDocumentViewerKey);

  const [document, setDocument] = useState(null);

  useEffect(() => {
    const onDocumentLoaded = (viewerKey) => {
      const document = core.getDocument(viewerKey);
      setDocument(document);
    };

    onDocumentLoaded(activeDocumentViewerKey);
    core.addEventListener('documentLoaded', onDocumentLoaded);
    return () => core.removeEventListener('documentLoaded', onDocumentLoaded);
  }, [activeDocumentViewerKey]);

  const handleDocumentUnloaded = useCallback(() => {
    setDocument(null);
  }, []);
  useOnDocumentUnloaded(handleDocumentUnloaded);

  const handlePrint = () => {
    print(dispatch, useClientSidePrint, isEmbedPrintSupported, sortStrategy, colorMap, { isGrayscale: core.getDocumentViewer().isGrayscaleModeEnabled(), timezone });
  };

  const handlePrintButtonClick = useFocusHandler(handlePrint);

  if (!document) {
    if (isFlyoutItem) {
      return null;
    }
    console.warn('The print preset button is not available because no document is loaded.');
  }

  return (
    isFlyoutItem ?
      <FlyoutItemContainer {...props} ref={ref} onClick={handlePrintButtonClick} />
      :
      getPresetButtonDOM({
        buttonType: PRESET_BUTTON_TYPES.PRINT,
        onClick: handlePrintButtonClick,
        isDisabled: !document,
        className,
        style,
      })
  );
});

PrintButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};
PrintButton.displayName = 'PrintButton';

export default PrintButton;