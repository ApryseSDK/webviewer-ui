import React, { useEffect, useState, useRef } from 'react';
import DataElements from 'constants/dataElement';
import { useDispatch, useSelector } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import core from 'core';
import { createPageRedactions, redactPages } from 'helpers/pageManipulationFunctions';
import PageRedactionModal from 'components/PageRedactionModal/PageRedactionModal';

import './PageRedactionModal.scss';

const MAX_CANVAS_COUNT = 10;

const PageRedactionModalContainer = () => {
  const dispatch = useDispatch();
  const [isOpen, currentPage, selectedIndexes, pageLabels, activeToolName, activeToolStyles] = useSelector((state) => [
    selectors.isElementOpen(state, DataElements.PAGE_REDACT_MODAL),
    selectors.getCurrentPage(state),
    selectors.getSelectedThumbnailPageIndexes(state),
    selectors.getPageLabels(state),
    selectors.getActiveToolName(state),
    selectors.getActiveToolStyles(state)
  ]);
  const renderCanvasesCount = useRef(0);

  const selectedPages = selectedIndexes.map((index) => index + 1);

  useEffect(() => {
    if (isOpen) {
      dispatch(actions.closeElements(['printModal', 'loadingModal', 'progressModal', 'errorModal']));
    }
  }, [isOpen, dispatch]);

  const closeModal = () => dispatch(actions.closeElement(DataElements.PAGE_REDACT_MODAL));

  const getRedactionStyles = () => (activeToolName?.includes('AnnotationCreateRedaction') ? activeToolStyles : {});

  const onRedact = (pageNumbers) => {
    redactPages(pageNumbers, getRedactionStyles());
    closeModal();
  };

  const markPages = (pageNumbers) => {
    createPageRedactions(pageNumbers, getRedactionStyles());
    closeModal();
  };

  const renderCanvases = (canvasContainer, pageNumbers) => {
    renderCanvasesCount.current++;
    const callCount = renderCanvasesCount.current;

    const doc = core.getDocument();
    while (canvasContainer.current.firstChild) {
      canvasContainer.current.removeChild(canvasContainer.current.firstChild);
    }
    if (!pageNumbers) {
      return;
    }
    if (pageNumbers?.length > MAX_CANVAS_COUNT) {
      pageNumbers = pageNumbers.splice(0, MAX_CANVAS_COUNT);
    }
    for (const pageNumber of pageNumbers) {
      const pageInfo = doc?.getPageInfo(pageNumber);
      if (isOpen && doc && canvasContainer.current && pageInfo) {
        let zoom = 1;
        const rect = canvasContainer.current.getBoundingClientRect();
        const borderWidth = parseInt(window.getComputedStyle(canvasContainer.current).borderWidth) + 0.1;
        rect.height -= borderWidth;
        rect.width -= borderWidth;
        if (pageInfo.width > pageInfo.height) {
          zoom = rect.width / pageInfo.width;
        } else {
          zoom = rect.height / pageInfo.height;
        }
        zoom > 0 && doc.loadCanvas({
          pageNumber,
          zoom,
          pageRotation: 0,
          drawComplete: (canvas) => {
            callCount === renderCanvasesCount.current && canvasContainer.current.appendChild(canvas);
          },
          allowUseOfOptimizedThumbnail: true
        });
      }
    }
  };

  const [evenDisabled, setEvenDisabled] = useState(false);
  useEffect(() => {
    const docLoaded = () => {
      const document = core.getDocument();
      const documentCompletePromise = document.getDocumentCompletePromise();

      // Office documents don't have all pages available onload, so we need to
      // wait for the documentCompletePromise to resolve before we can check
      documentCompletePromise?.then(() => {
        const pageCount = document.getPageCount();
        if (pageCount < 2) {
          setEvenDisabled(true);
        } else {
          setEvenDisabled(false);
        }
      });
    };
    core.addEventListener('documentLoaded', docLoaded);
    return () => core.removeEventListener('documentLoaded', docLoaded);
  }, []);

  return (
    <PageRedactionModal
      evenDisabled={evenDisabled}
      closeModal={closeModal}
      renderCanvases={renderCanvases}
      redactPages={onRedact}
      markPages={markPages}
      currentPage={currentPage}
      selectedPages={selectedPages}
      pageLabels={pageLabels}
      isOpen={isOpen}
    />
  );
};

export default PageRedactionModalContainer;