import React, { useEffect, useState } from 'react';
import ComparePanel from './ComparePanel';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import actions from 'actions';
import selectors from 'selectors';
import DataElements from 'src/constants/dataElement';
import core from 'core';
import MultiViewerWrapper from 'components/MultiViewer/MultiViewerWrapper';

const ComparePanelContainer = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => selectors.isElementOpen(state, DataElements.COMPARE_PANEL));
  const currentWidth = useSelector((state) => selectors.getComparePanelWidth(state));
  const isInDesktopOnlyMode = useSelector((state) => selectors.isInDesktopOnlyMode(state));
  const isComparisonOverlayEnabled = useSelector((state) => selectors.getIsComparisonOverlayEnabled(state));
  const compareAnnotationsMap = useSelector((state) => selectors.getCompareAnnotationsMap(state), shallowEqual);

  const [selectedAnnotations, setSelectedAnnotations] = useState(null);
  const [totalChanges, setTotalChanges] = useState(0);
  const [filteredListData, setFilteredListData] = useState(compareAnnotationsMap);

  useEffect(() => {
    setFilteredListData(compareAnnotationsMap);
    // Count the changes and set the total count
    let diffCount = 0;
    for (const pageNumber in compareAnnotationsMap) {
      diffCount += compareAnnotationsMap[pageNumber].length;
    }
    setTotalChanges(diffCount);
  }, [compareAnnotationsMap]);


  useEffect(() => {
    const onAnnotationSelected = (annotations, action) => {
      if (action === 'selected') {
        setSelectedAnnotations(annotations);
      } else if (action === 'deselected') {
        setSelectedAnnotations(null);
      }
    };
    core.addEventListener('annotationSelected', onAnnotationSelected);
    return () => {
      core.removeEventListener('annotationSelected', onAnnotationSelected);
    };
  }, []);

  const toggleComparisonAnnotations = async () => {
    const enable = !isComparisonOverlayEnabled;
    dispatch(actions.setIsComparisonOverlayEnabled(enable));
    const docViewers = core.getDocumentViewers();
    const [annotManager1, annotManager2] = docViewers.map((docViewer) => docViewer.getAnnotationManager());
    if (enable) {
      annotManager1.showAnnotations(annotManager1.getSemanticDiffAnnotations());
      annotManager2.showAnnotations(annotManager2.getSemanticDiffAnnotations());
    } else {
      annotManager1.hideAnnotations(annotManager1.getSemanticDiffAnnotations());
      annotManager2.hideAnnotations(annotManager2.getSemanticDiffAnnotations());
    }
  };

  return (
    <ComparePanel
      selectedAnnotations={selectedAnnotations}
      isOpen={isOpen}
      currentWidth={currentWidth}
      isInDesktopOnlyMode={isInDesktopOnlyMode}
      isComparisonOverlayEnabled={isComparisonOverlayEnabled}
      totalChanges={totalChanges}
      filteredListData={filteredListData}
      setFilteredListData={setFilteredListData}
      toggleComparisonAnnotations={toggleComparisonAnnotations}
    />
  );
};

function ComparePanelWrapper(props) {
  return (
    <MultiViewerWrapper>
      <ComparePanelContainer {...props}/>
    </MultiViewerWrapper>
  );
}

export default ComparePanelWrapper;