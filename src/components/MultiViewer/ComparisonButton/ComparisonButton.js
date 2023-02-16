import React, { useCallback, useState, useEffect } from 'react';
import './ComparisonButton.scss';
import { useSelector, useDispatch } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import Choice from 'components/Choice';
import core from 'core';
import fireEvent from 'helpers/fireEvent';
import Events from 'constants/events';
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

  const startComparison = useCallback(async () => {
    dispatch(actions.setIsCompareStarted(true));
    dispatch(actions.enableElement('comparePanelToggleButton'));
    dispatch(actions.openElement('loadingModal'));
    const [documentViewer, documentViewer2] = core.getDocumentViewers();
    const shouldDiff = documentViewer?.getDocument() && documentViewer2?.getDocument();
    if (shouldDiff) {
      const { doc1Annotations, doc2Annotations, diffCount } = await documentViewer.startSemanticDiff(documentViewer2);
      const annotMap = {};
      for (const index in doc1Annotations) {
        const annotation = doc1Annotations[index];
        const type = annotation.getCustomData('TextDiffType');
        const id = annotation.getCustomData('TextDiffID');
        const otherAnnotation = doc2Annotations.find((annotation) => annotation?.getCustomData('TextDiffID') === id);
        if (!annotMap[annotation.PageNumber]) {
          annotMap[annotation.PageNumber] = [];
        }
        for (const pageNumber of Object.keys(annotMap)) {
          annotMap[pageNumber] = annotMap[pageNumber].sort((a, b) => {
            const aY = (a?.new?.Y || a?.old?.Y);
            const bY = (b?.new?.Y || b?.old?.Y);
            if (aY === bY) {
              return (a?.new?.X || a?.old?.X) - (b?.new?.X || b?.old?.X);
            }
            return aY - bY;
          });
        }
        annotMap[annotation.PageNumber].push({
          new: otherAnnotation,
          newText: otherAnnotation?.Author,
          newCount: otherAnnotation?.Author?.length,
          old: annotation,
          oldText: annotation?.Author,
          oldCount: annotation?.Author?.length,
          type: `${t('multiViewer.comparePanel.textContent')} - ${t(`multiViewer.comparePanel.${type}`)}`,
        });
      }
      dispatch(actions.closeElement('loadingModal'));
      fireEvent(Events.COMPARE_ANNOTATIONS_LOADED, { annotMap, diffCount });
      if (!isComparisonOverlayEnabled) {
        core.hideAnnotations(core.getSemanticDiffAnnotations(1), 1);
        core.hideAnnotations(core.getSemanticDiffAnnotations(2), 2);
      }
    }
  }, [isComparisonOverlayEnabled]);

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