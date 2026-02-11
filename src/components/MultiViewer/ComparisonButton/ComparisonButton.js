import React, { useCallback, useState, useEffect } from 'react';
import './ComparisonButton.scss';
import { useSelector, useDispatch } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import Choice from 'components/Choice';
import DataElements from 'src/constants/dataElement';
import useCore from 'hooks/useCore';
import { useTranslation } from 'react-i18next';

const ComparisonButton = () => {
  const { core: coreLeftViewer } = useCore(1);
  const { core: coreRightViewer } = useCore(2);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [disabled, setDisabled] = useState(true);
  const [isCompareStarted, isComparisonOverlayEnabled] = useSelector((state) => [
    selectors.isCompareStarted(state),
    selectors.getIsComparisonOverlayEnabled(state),
  ]);
  const semanticDiffAnnotations = coreLeftViewer.getSemanticDiffAnnotations();

  useEffect(() => {
    const checkDisabled = () => {
      const documentsLoaded = coreLeftViewer.getDocument() && coreRightViewer.getDocument();
      const document1IsValidType = coreLeftViewer.getDocument()?.getType() === 'pdf' ||
        (coreLeftViewer.getDocument()?.getType() === 'webviewerServer' && !coreLeftViewer.getDocument()?.isWebViewerServerDocument());
      const document2IsValidType = coreRightViewer.getDocument()?.getType() === 'pdf' ||
        (coreRightViewer.getDocument()?.getType() === 'webviewerServer' && !coreRightViewer.getDocument()?.isWebViewerServerDocument());
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
    coreLeftViewer.addEventListener('documentLoaded', checkDisabled, undefined);
    coreRightViewer.addEventListener('documentLoaded', checkDisabled, undefined);
    coreLeftViewer.addEventListener('documentUnloaded', unLoaded, undefined);
    coreRightViewer.addEventListener('documentUnloaded', unLoaded, undefined);

    if (!semanticDiffAnnotations.length && isComparisonOverlayEnabled) {
      dispatch(actions.setIsComparisonOverlayEnabled(false));
    }

    if (semanticDiffAnnotations.length && !isComparisonOverlayEnabled) {
      dispatch(actions.setIsComparisonOverlayEnabled(true));
    }

    return () => {
      coreLeftViewer.removeEventListener('documentLoaded', checkDisabled, undefined);
      coreRightViewer.removeEventListener('documentLoaded', checkDisabled, undefined);
      coreLeftViewer.removeEventListener('documentUnloaded', unLoaded, undefined);
      coreRightViewer.removeEventListener('documentUnloaded', unLoaded, undefined);
    };
  }, [semanticDiffAnnotations]);

  const startComparison = useCallback(() => {
    const documentViewer1 = coreLeftViewer.getDocumentViewer();
    const documentViewer2 = coreRightViewer.getDocumentViewer();
    const shouldDiff = documentViewer1?.getDocument() && documentViewer2?.getDocument();
    if (shouldDiff) {
      dispatch(actions.setIsCompareStarted(true));
      dispatch(actions.enableElement('comparePanelToggleButton'));
      dispatch(actions.openElement(DataElements.LOADING_MODAL));
      documentViewer1.startSemanticDiff(documentViewer2).catch((error) => {
        console.error(error);
        dispatch(actions.closeElement(DataElements.LOADING_MODAL));
      });
    }
  }, []);

  const toggleComparisonOverlay = async () => {
    const enable = !isComparisonOverlayEnabled;
    const documentViewer1 = coreLeftViewer.getDocumentViewer();
    const documentViewer2 = coreRightViewer.getDocumentViewer();
    if (enable) {
      await documentViewer1.startSemanticDiff(documentViewer2);
    } else {
      await documentViewer1.stopSemanticDiff();
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
