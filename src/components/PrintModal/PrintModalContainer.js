import React, { useState, useEffect, useRef } from 'react';
import actions from 'actions';
import selectors from 'selectors';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import DataElements from 'constants/dataElement';

import core from 'core';

import { printPages } from 'helpers/print';
import { creatingPages } from 'helpers/rasterPrint';
import { printPDF, createPages, iosWindowOpen, convertToGrayscaleDocument } from 'helpers/embeddedPrint';
import PrintModal from './PrintModal';

import './PrintModal.scss';

const PrintModalContainer = () => {
  const dispatch = useDispatch();
  const [
    isDisabled,
    isOpen,
    isApplyWatermarkDisabled,
    currentPage,
    printQuality,
    defaultPrintOptions,
    pageLabels,
    sortStrategy,
    colorMap,
    layoutMode,
    printedNoteDateFormat,
    language,
    watermarkModalOptions,
    timezone,
    useEmbeddedPrint
  ] = useSelector(
    (state) => [
      selectors.isElementDisabled(state, DataElements.PRINT_MODAL),
      selectors.isElementOpen(state, DataElements.PRINT_MODAL),
      selectors.isElementDisabled(state, 'applyWatermark'),
      selectors.getCurrentPage(state),
      selectors.getPrintQuality(state),
      selectors.getDefaultPrintOptions(state),
      selectors.getPageLabels(state),
      selectors.getSortStrategy(state),
      selectors.getColorMap(state),
      selectors.getDisplayMode(state),
      selectors.getPrintedNoteDateFormat(state),
      selectors.getCurrentLanguage(state),
      selectors.getWatermarkModalOptions(state),
      selectors.getTimezone(state),
      selectors.isEmbedPrintSupported(state, 'useEmbeddedPrint')
    ],
    shallowEqual
  );

  const existingWatermarksRef = useRef();

  const [allowWatermarkModal, setAllowWatermarkModal] = useState(false);
  const [count, setCount] = useState(-1);

  const [maintainPageOrientation, setMaintainPageOrientation] = useState(false);
  const [pagesToPrint, setPagesToPrint] = useState([]);
  const [isGrayscale, setIsGrayscale] = useState(false);
  const [shouldFlatten, setShouldFlatten] = useState(false);
  const [isWatermarkModalVisible, setIsWatermarkModalVisible] = useState(false);
  const [includeAnnotations, setIncludeAnnotations] = useState(true);
  const [includeComments, setIncludeComments] = useState(false);
  const [isCurrentView, setIsCurrentView] = useState(false);
  const [isCurrentViewDisabled, setIsCurrentViewDisabled] = useState(false);

  useEffect(() => {
    if (defaultPrintOptions) {
      setIncludeAnnotations(defaultPrintOptions.includeAnnotations ?? includeAnnotations);
      setIncludeComments(defaultPrintOptions.includeComments ?? includeComments);
      setMaintainPageOrientation(defaultPrintOptions.maintainPageOrientation ?? maintainPageOrientation);
    }
  }, [defaultPrintOptions]);

  const isPrinting = count >= 0;

  useEffect(() => {
    if (isOpen) {
      if (useEmbeddedPrint) {
        checkCurrentView();
      }

      dispatch(actions.closeElements([
        DataElements.SIGNATURE_MODAL,
        DataElements.LOADING_MODAL,
        DataElements.PROGRESS_MODAL,
        DataElements.ERROR_MODAL,
      ]));
    }
  }, [isOpen, dispatch]);

  const checkCurrentView = () => {
    if (isCurrentViewDisabled) {
      return;
    }

    const virtualDisplayMode = core.getDisplayModeObject();
    const visiblePagesArray = virtualDisplayMode.getVisiblePages(0, 0);

    if (visiblePagesArray?.length > 1) {
      setIsCurrentViewDisabled(true);
    } else {
      setIsCurrentViewDisabled(false);
    }
  };

  const createPagesAndPrint = (e) => {
    const document = core.getDocument();
    const fileType = document.getType();

    if (useEmbeddedPrint && fileType === 'xod') {
      console.warn('Falling back to raster printing, XOD files and Embedded Printing is not supported');
    }

    if (useEmbeddedPrint && fileType !== 'xod') {
      embeddedPrinting(iosWindowOpen());
    } else {
      rasterPrinting(e);
    }
  };

  const embeddedPrinting = async (windowRef) => {
    if (pagesToPrint.length < 1) {
      return;
    }
    const document = core.getDocument();
    const annotManager = core.getAnnotationManager();
    const printingOptions = { isCurrentView, includeAnnotations, shouldFlatten, includeComments };
    let pdf = await createPages(
      document,
      annotManager,
      pagesToPrint,
      printingOptions,
      watermarkModalOptions
    );

    if (isGrayscale) {
      pdf = await convertToGrayscaleDocument(pdf);
    }

    printPDF(pdf, windowRef);
  };

  const rasterPrinting = (e) => {
    e.preventDefault();

    if (pagesToPrint.length < 1) {
      return;
    }

    setCount(0);

    if (allowWatermarkModal) {
      core.setWatermark(watermarkModalOptions);
    } else {
      core.setWatermark(existingWatermarksRef.current);
    }

    const printOptions = {
      includeComments,
      includeAnnotations,
      maintainPageOrientation,
      printQuality,
      sortStrategy,
      colorMap: colorMap,
      printedNoteDateFormat,
      isCurrentView,
      language,
      timezone,
      createCanvases: false,
      isGrayscale
    };

    const createPages = creatingPages(
      pagesToPrint,
      printOptions,
      undefined
    );
    createPages.forEach(async (pagePromise) => {
      await pagePromise;
      setCount(count < pagesToPrint.length && (count !== -1 ? count + 1 : count));
    });
    Promise.all(createPages)
      .then((pages) => {
        printPages(pages);
        closePrintModal();
      })
      .catch((e) => {
        console.error(e);
        setCount(-1);
      });
  };

  const closePrintModal = () => {
    setCount(-1);
    dispatch(actions.closeElement(DataElements.PRINT_MODAL));
  };

  return (
    <PrintModal
      isDisabled={isDisabled}
      isOpen={isOpen}
      isApplyWatermarkDisabled={isApplyWatermarkDisabled}
      isFullAPIEnabled={core.isFullPDFEnabled()}
      currentPage={currentPage}
      printQuality={printQuality}
      isGrayscale={isGrayscale}
      setIsGrayscale={setIsGrayscale}
      setIsCurrentView={setIsCurrentView}
      shouldFlatten={shouldFlatten}
      setShouldFlatten={setShouldFlatten}
      isCurrentViewDisabled={isCurrentViewDisabled}
      checkCurrentView={checkCurrentView}
      includeAnnotations={includeAnnotations}
      setIncludeAnnotations={setIncludeAnnotations}
      includeComments={includeComments}
      setIncludeComments={setIncludeComments}
      isWatermarkModalVisible={isWatermarkModalVisible}
      setIsWatermarkModalVisible={setIsWatermarkModalVisible}
      watermarkModalOptions={watermarkModalOptions}
      existingWatermarksRef={existingWatermarksRef}
      setAllowWatermarkModal={setAllowWatermarkModal}
      closePrintModal={closePrintModal}
      createPagesAndPrint={createPagesAndPrint}
      pagesToPrint={pagesToPrint}
      setPagesToPrint={setPagesToPrint}
      count={count}
      isPrinting={isPrinting}
      pageLabels={pageLabels}
      layoutMode={layoutMode}
      useEmbeddedPrint={useEmbeddedPrint}
    />
  );
};

export default PrintModalContainer;
