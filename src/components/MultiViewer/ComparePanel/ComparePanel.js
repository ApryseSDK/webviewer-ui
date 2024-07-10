import React, { useEffect, useRef, useState } from 'react';
import './ComparePanel.scss';
import DataElementWrapper from 'components/DataElementWrapper';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import selectors from 'selectors';
import { isMobileSize } from 'helpers/getDeviceSize';
import Events from 'constants/events';
import ChangeListItem from 'components/MultiViewer/ComparePanel/ChangeListItem';
import core from 'core';
import throttle from 'lodash/throttle';
import { SYNC_MODES } from 'constants/multiViewerContants';
import multiViewerHelper from 'helpers/multiViewerHelper';
import fireEvent from 'helpers/fireEvent';
import actions from 'actions';
import DataElements from 'src/constants/dataElement';
import { panelMinWidth } from 'constants/panel';

const specialChar = /([!@#$%^&*()+=\[\]\\';,./{}|":<>?~_-])/gm;

const ComparePanel = ({
  dataElement = 'comparePanel',
  // For storybook tests
  initialChangeListData = {},
  initialTotalChanges = 0,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const isMobile = isMobileSize();
  const [
    isOpen,
    currentWidth,
    isInDesktopOnlyMode,
    isComparisonOverlayEnabled,
    multiViewerSyncScrollMode,
  ] = useSelector((state) => [
    selectors.isElementOpen(state, dataElement),
    selectors.getComparePanelWidth(state),
    selectors.isInDesktopOnlyMode(state),
    selectors.getIsComparisonOverlayEnabled(state),
    selectors.getMultiViewerSyncScrollMode(state),
  ]);
  const isCustom = dataElement !== 'comparePanel';
  const panelWidth = !isCustom ? currentWidth : panelMinWidth - 32;
  const [searchValue, setSearchValue] = React.useState('');
  const style = !isInDesktopOnlyMode && isMobile ? {} : { width: `${panelWidth}px`, minWidth: `${panelWidth}px` };
  const changeListData = useRef(initialChangeListData);
  const [totalChanges, setTotalChanges] = useState(initialTotalChanges);
  const [filteredListData, setFilteredListData] = useState(initialChangeListData);
  const filterfuncRef = useRef(
    throttle(
      (searchValue) => {
        if (!changeListData.current) {
          return [];
        }
        if (!searchValue) {
          setFilteredListData(changeListData.current);
          return;
        }
        searchValue = searchValue.replace(specialChar, '\\$&');
        const keys = Object.keys(changeListData.current);
        const newData = {};
        for (const key of keys) {
          for (const item of changeListData.current[key]) {
            if (
              item.oldText?.toLowerCase().match(searchValue.toLowerCase()) ||
              item.newText?.toLowerCase().match(searchValue.toLowerCase())
            ) {
              if (!newData[key]) {
                newData[key] = [];
              }
              newData[key].push(item);
            }
          }
        }
        setFilteredListData(newData);
      },
      100,
      { leading: true },
    ),
  );

  useEffect(() => {
    const updatePanelItems = (doc1Annotations, doc2Annotations, diffCount) => {
      dispatch(actions.setIsCompareStarted(true));
      dispatch(actions.enableElement('comparePanelToggleButton'));
      dispatch(actions.openElement(DataElements.LOADING_MODAL));
      const annotMap = {};
      if (multiViewerSyncScrollMode === SYNC_MODES.SKIP_UNMATCHED) {
        const doc1AnnotationsClone = [...doc1Annotations];
        const doc2AnnotationsClone = [...doc2Annotations];
        const annotationMatches1 = [];
        const annotationMatches2 = [];
        while (doc1AnnotationsClone.length || doc2AnnotationsClone.length) {
          const annotation = doc1AnnotationsClone[0] || doc2AnnotationsClone[0];
          const ids = [annotation.getCustomData('TextDiffID')];
          const pageNumbers1 = [];
          const pageNumbers2 = [];
          const side1Annotations = [];
          const side2Annotations = [];
          const checkIfAnnotionMatches1 = (annotation) => ids.includes(annotation.getCustomData('TextDiffID')) || pageNumbers1.includes(annotation.PageNumber);
          const checkIfAnnotionMatches2 = (annotation) => ids.includes(annotation.getCustomData('TextDiffID')) || pageNumbers2.includes(annotation.PageNumber);
          let added = false;
          do {
            added = false;
            for (const annotation of doc1AnnotationsClone) {
              if (checkIfAnnotionMatches1(annotation)) {
                const annotId = annotation.getCustomData('TextDiffID');
                const annotPageNumber = annotation.PageNumber;
                !ids.includes(annotId) && ids.push(annotId);
                !pageNumbers1.includes(annotPageNumber) && pageNumbers1.push(annotation.PageNumber);
                doc1AnnotationsClone.splice(doc1AnnotationsClone.indexOf(annotation), 1);
                side1Annotations.push(annotation);
                added = true;
              }
            }
            for (const annotation of doc2AnnotationsClone) {
              if (checkIfAnnotionMatches2(annotation)) {
                const annotId = annotation.getCustomData('TextDiffID');
                const annotPageNumber = annotation.PageNumber;
                !ids.includes(annotId) && ids.push(annotId);
                !pageNumbers2.includes(annotPageNumber) && pageNumbers2.push(annotation.PageNumber);
                doc2AnnotationsClone.splice(doc2AnnotationsClone.indexOf(annotation), 1);
                side2Annotations.push(annotation);
                added = true;
              }
            }
          } while (added);
          if (side1Annotations.length && side2Annotations.length) {
            annotationMatches1.push(side1Annotations);
            annotationMatches2.push(side2Annotations);
          }
        }

        const matchedPages = { 1: {}, 2: {} };
        for (const i in annotationMatches1) {
          const doc1Annotations = annotationMatches1[i];
          const doc2Annotations = annotationMatches2[i];
          const doc1Pages = Array.from(new Set(doc1Annotations.map((annotation) => annotation.PageNumber)));
          const doc2Pages = Array.from(new Set(doc2Annotations.map((annotation) => annotation.PageNumber)));
          for (const pageNumber of doc1Pages) {
            matchedPages[1][pageNumber] = {
              otherSidePages: doc2Pages,
              thisSidePages: doc1Pages,
            };
          }
          for (const pageNumber of doc2Pages) {
            matchedPages[2][pageNumber] = {
              otherSidePages: doc1Pages,
              thisSidePages: doc2Pages,
            };
          }
        }
        multiViewerHelper.matchedPages = matchedPages;
      }
      const matchedIds = [];
      for (const index in doc1Annotations) {
        const annotation = doc1Annotations[index];
        const type = annotation.getCustomData('TextDiffType');
        const id = annotation.getCustomData('TextDiffID');
        const otherAnnotations = doc2Annotations.filter((annotation) => annotation?.getCustomData('TextDiffID') === id);
        if (!otherAnnotations.length) {
          continue;
        }
        if (!matchedIds.includes(id)) {
          matchedIds.push(id);
        }
        if (!annotMap[annotation.PageNumber]) {
          annotMap[annotation.PageNumber] = [];
        }
        annotMap[annotation.PageNumber].push({
          new: otherAnnotations[0],
          newText: otherAnnotations[0]?.Author,
          newCount: otherAnnotations[0]?.Author?.length,
          old: annotation,
          oldText: annotation?.Author,
          oldCount: annotation?.Author?.length,
          type: `${t('multiViewer.comparePanel.textContent')} - ${t(`multiViewer.comparePanel.${type}`)}`,
        });
        if (otherAnnotations.length > 1) {
          for (const i in otherAnnotations) {
            if (i === '0') {
              continue;
            }
            annotMap[annotation.PageNumber].push({
              new: otherAnnotations[i],
              newText: otherAnnotations[i]?.Author,
              newCount: otherAnnotations[i]?.Author?.length,
              old: annotation,
              oldText: annotation?.Author,
              oldCount: annotation?.Author?.length,
              type: `${t('multiViewer.comparePanel.textContent')} - ${t(`multiViewer.comparePanel.${type}`)}`,
            });
          }
        }
      }
      const unmatchedAnnotations1 = doc1Annotations.filter((annotation) => !matchedIds.includes(annotation.getCustomData('TextDiffID')));
      const unmatchedAnnotations2 = doc2Annotations.filter((annotation) => !matchedIds.includes(annotation.getCustomData('TextDiffID')));
      for (const annotation of unmatchedAnnotations1) {
        if (!annotMap[annotation.PageNumber]) {
          annotMap[annotation.PageNumber] = [];
        }
        annotMap[annotation.PageNumber].push({
          old: annotation,
          oldText: annotation?.Author,
          oldCount: annotation?.Author?.length,
          type: `${t('multiViewer.comparePanel.textContent')} - ${t(`multiViewer.comparePanel.${annotation.getCustomData('TextDiffType')}`)}`,
        });
      }
      for (const annotation of unmatchedAnnotations2) {
        if (!annotMap[annotation.PageNumber]) {
          annotMap[annotation.PageNumber] = [];
        }
        annotMap[annotation.PageNumber].push({
          new: annotation,
          newText: annotation?.Author,
          newCount: annotation?.Author?.length,
          type: `${t('multiViewer.comparePanel.textContent')} - ${t(`multiViewer.comparePanel.${annotation.getCustomData('TextDiffType')}`)}`,
        });
      }
      for (const pageNumber of Object.keys(annotMap)) {
        annotMap[pageNumber] = annotMap[pageNumber].sort((a, b) => {
          if (a?.new?.PageNumber && b?.new?.PageNumber && a?.new?.PageNumber !== b?.new?.PageNumber) {
            return a?.new?.PageNumber - b?.new?.PageNumber;
          }
          const aY = a?.new?.Y || a?.old?.Y;
          const bY = b?.new?.Y || b?.old?.Y;
          if (aY === bY) {
            return (a?.new?.X || a?.old?.X) - (b?.new?.X || b?.old?.X);
          }
          return aY - bY;
        });
      }
      dispatch(actions.closeElement(DataElements.LOADING_MODAL));
      fireEvent(Events.COMPARE_ANNOTATIONS_LOADED, { annotMap, diffCount });
      if (!isComparisonOverlayEnabled) {
        core.hideAnnotations(core.getSemanticDiffAnnotations(1), 1);
        core.hideAnnotations(core.getSemanticDiffAnnotations(2), 2);
      }
      setTotalChanges(diffCount);
      changeListData.current = annotMap;
      setFilteredListData(annotMap);
    };
    const resetPanelItems = () => {
      setTotalChanges(0);
      changeListData.current = {};
    };
    core.addEventListener(Events.COMPARE_ANNOTATIONS_LOADED, updatePanelItems, undefined, 1);
    core.addEventListener('documentUnloaded', resetPanelItems, undefined, 1);
    core.addEventListener('documentUnloaded', resetPanelItems, undefined, 2);
    return () => {
      core.removeEventListener(Events.COMPARE_ANNOTATIONS_LOADED, updatePanelItems, 1);
      core.removeEventListener('documentUnloaded', resetPanelItems, 1);
      core.removeEventListener('documentUnloaded', resetPanelItems, 2);
    };
  }, []);

  const renderPageItem = (pageNum) => {
    const changeListItems = filteredListData[pageNum];
    return <React.Fragment key={pageNum}>
      <div className="page-number">{t('multiViewer.comparePanel.page')} {pageNum}</div>
      {changeListItems.map(((props) => <ChangeListItem
        key={`${props.new?.Id ?? 'null'}-${props.old?.Id ?? 'null'}`} {...props} />))}
    </React.Fragment>;
  };

  const onSearchInputChange = (e) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    filterfuncRef.current(newValue);
  };

  const shouldRenderItems = !!(totalChanges && filteredListData && Object.keys(filteredListData).length);
  return (
    <DataElementWrapper
      className={classNames('Panel', 'ComparePanel', { 'open': isOpen })}
      dataElement={dataElement}
      style={style}
    >
      <div className="input-container">
        <input
          type="text"
          autoComplete="off"
          value={searchValue}
          onChange={onSearchInputChange}
          placeholder={t('multiViewer.comparePanel.Find')}
          aria-label={t('multiViewer.comparePanel.Find')}
          id="ComparePanel__input"
          tabIndex={isOpen ? 0 : -1}
        />
      </div>
      <div className="changeListContainer">
        <div className="changeListTitle">
          {t('multiViewer.comparePanel.changesList')} <span>({totalChanges})</span>
        </div>
        <div className="changeList">
          {shouldRenderItems && Object.keys(filteredListData).map((key) => renderPageItem(key))}
        </div>
      </div>
    </DataElementWrapper>
  );
};

export default ComparePanel;
