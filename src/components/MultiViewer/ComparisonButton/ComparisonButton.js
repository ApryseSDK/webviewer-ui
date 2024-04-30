import React, { useCallback, useState, useEffect } from 'react';
import './ComparisonButton.scss';
import { useSelector, useDispatch } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import Choice from 'components/Choice';
import DataElements from 'src/constants/dataElement';
import core from 'core';
import { useTranslation } from 'react-i18next';

const ComparisonButton = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [disabled, setDisabled] = useState(true);
  const [isCompareStarted, isComparisonOverlayEnabled] = useSelector((state) => [
    selectors.isCompareStarted(state),
    selectors.getIsComparisonOverlayEnabled(state),
  ]);
  const semanticDiffAnnotations = core.getSemanticDiffAnnotations();

  useEffect(() => {
    const checkDisabled = () => {
      const documentsLoaded = core.getDocument(1) && core.getDocument(2);
      const document1IsValidType = core.getDocument(1)?.getType() === 'pdf' ||
        (core.getDocument(1)?.getType() === 'webviewerServer' && !core.getDocument(1)?.isWebViewerServerDocument());
      const document2IsValidType = core.getDocument(2)?.getType() === 'pdf' ||
        (core.getDocument(2)?.getType() === 'webviewerServer' && !core.getDocument(2)?.isWebViewerServerDocument());
      if (documentsLoaded && document1IsValidType && document2IsValidType) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    };
    const unLoaded = () => {
      setDisabled(true);
      dispatch(actions.setIsCompareStarted(false));
      dispatch(actions.disableElement('comparePanelToggleButton'));
      dispatch(actions.closeElement('comparePanel'));
    };
    checkDisabled();
    core.addEventListener('documentLoaded', checkDisabled, undefined, 1);
    core.addEventListener('documentLoaded', checkDisabled, undefined, 2);
    core.addEventListener('documentUnloaded', unLoaded, undefined, 1);
    core.addEventListener('documentUnloaded', unLoaded, undefined, 2);

    if (!semanticDiffAnnotations.length && isComparisonOverlayEnabled) {
      dispatch(actions.setIsComparisonOverlayEnabled(false));
    }

    if (semanticDiffAnnotations.length && !isComparisonOverlayEnabled) {
      dispatch(actions.setIsComparisonOverlayEnabled(true));
    }

    return () => {
      core.removeEventListener('documentLoaded', checkDisabled, undefined, 1);
      core.removeEventListener('documentLoaded', checkDisabled, undefined, 2);
      core.removeEventListener('documentUnloaded', unLoaded, undefined, 1);
      core.removeEventListener('documentUnloaded', unLoaded, undefined, 2);
    };
  }, [semanticDiffAnnotations]);

  const startComparison = useCallback(() => {
    const [documentViewer, documentViewer2] = core.getDocumentViewers();
    const shouldDiff = documentViewer?.getDocument() && documentViewer2?.getDocument();
    if (shouldDiff) {
      dispatch(actions.setIsCompareStarted(true));
      dispatch(actions.enableElement('comparePanelToggleButton'));
      dispatch(actions.openElement(DataElements.LOADING_MODAL));
      documentViewer.startSemanticDiff(documentViewer2).catch((error) => {
        console.error(error);
        dispatch(actions.closeElement(DataElements.LOADING_MODAL));
      });
    }
  }, []);

  const toggleComparisonOverlay = async () => {
    const enable = !isComparisonOverlayEnabled;
    const [documentViewerOne, documentViewerTwo] = core.getDocumentViewers();
    if (enable) {
      await documentViewerOne.startSemanticDiff(documentViewerTwo);
    } else {
      await documentViewerOne.stopSemanticDiff();
    }
    dispatch(actions.setIsComparisonOverlayEnabled(enable));
  };

  return (
    <div className="ComparisonButton">
      {!isCompareStarted ?
        <button disabled={disabled} onClick={startComparison}>{t('action.startComparison')}</button>
        :
        <Choice
          isSwitch
          label={t('action.showComparison')}
          checked={isComparisonOverlayEnabled}
          onChange={toggleComparisonOverlay}
        />
      }
    </div>
  );
};

export default ComparisonButton;
