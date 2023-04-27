import React, { useCallback, useState, useEffect } from 'react';
import './ComparisonButton.scss';
import { useSelector, useDispatch } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import Choice from 'components/Choice';
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

  useEffect(() => {
    const checkDisabled = () => {
      if (core.getDocument(1) && core.getDocument(2)) {
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
    return () => {
      core.removeEventListener('documentLoaded', checkDisabled, undefined, 1);
      core.removeEventListener('documentLoaded', checkDisabled, undefined, 2);
      core.removeEventListener('documentUnloaded', unLoaded, undefined, 1);
      core.removeEventListener('documentUnloaded', unLoaded, undefined, 2);
    };
  }, []);

  const startComparison = useCallback(() => {
    const [documentViewer, documentViewer2] = core.getDocumentViewers();
    const shouldDiff = documentViewer?.getDocument() && documentViewer2?.getDocument();
    if (shouldDiff) {
      dispatch(actions.setIsCompareStarted(true));
      dispatch(actions.enableElement('comparePanelToggleButton'));
      dispatch(actions.openElement('loadingModal'));
      documentViewer.startSemanticDiff(documentViewer2);
    }
  }, []);

  const toggleComparisonOverlay = () => {
    const enable = !isComparisonOverlayEnabled;
    if (enable) {
      core.showAnnotations(core.getSemanticDiffAnnotations(1), 1);
      core.showAnnotations(core.getSemanticDiffAnnotations(2), 2);
    } else {
      core.hideAnnotations(core.getSemanticDiffAnnotations(1), 1);
      core.hideAnnotations(core.getSemanticDiffAnnotations(2), 2);
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
          label={'Show Comparison'}
          checked={isComparisonOverlayEnabled}
          onChange={toggleComparisonOverlay}
        />
      }
    </div>
  );
};

export default ComparisonButton;
