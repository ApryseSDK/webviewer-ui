import React, { useState, useEffect, useRef } from 'react';
import actions from 'actions';
import selectors from 'selectors';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import DataElements from 'constants/dataElement';

import core from 'core';

import { printPages } from 'helpers/print';
import { createRasterizedPrintPages } from 'helpers/rasterPrint';
import { processEmbeddedPrintOptions, printEmbeddedPDF } from 'helpers/embeddedPrint';
import PrintModal from './PrintModal';
import useFocusOnClose from 'hooks/useFocusOnClose';

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
    useEmbeddedPrint,
  ] = useSelector(
    (state) => [
      selectors.isElementDisabled(state, DataElements.PRINT_MODAL),
      selectors.isElementOpen(state, DataElements.PRINT_MODAL),
      selectors.isElementDisabled(state, 'applyWatermark'),
      selectors.getCurrentPage(state),
      selectors.getPrintQuality(state),
      selectors.getDefaultPrintOptions(state),
      selectors.getPageLabels(state, 'pageLabels'),
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
  const [pagesAreProcessing, setPagesAreProcessing] = useState(false);
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
      embeddedPrinting();
    } else {
      rasterPrinting(e);
    }
  };

  const embeddedPrinting = async () => {
    const isAlwaysPrintAnnotationsInColorEnabled = core.getDocumentViewer().isAlwaysPrintAnnotationsInColorEnabled();
    const printingOptions = {
      isCurrentView,
      includeAnnotations,
      includeComments,
      watermarkModalOptions,
      pagesToPrint,
      isGrayscale,
      isAlwaysPrintAnnotationsInColorEnabled,
    };

    setPagesAreProcessing(true);
    const document = core.getDocument();
    const annotationManager = core.getAnnotationManager();
    const embeddedPrintOptions = await processEmbeddedPrintOptions(printingOptions, document, annotationManager);

    await printEmbeddedPDF(embeddedPrintOptions);

    // The `afterprint` event doesn't seem to get triggered so a slight delay improves the UX
    // Otherwise there's a weird delay between the print modal and the browser's print dialog
    // without the setTimeout
    setTimeout(() => {
      setPagesAreProcessing(false);
      closePrintModalAfterPrint();
    }, 1000);
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

    const createPages = createRasterizedPrintPages(
      pagesToPrint,
      printOptions,
      undefined
    );

    setPagesAreProcessing(true);
    createPages.forEach(async (pagePromise) => {
      await pagePromise;
      setCount(count < pagesToPrint.length && (count !== -1 ? count + 1 : count));
    });

    Promise.all(createPages)
      .then((pages) => {
        printPages(pages);
      })
      .catch((e) => {
        console.error(e);
        setCount(-1);
      }).finally(() => {
        setPagesAreProcessing(false);
        closePrintModalAfterPrint();
      });
  };


  const closePrintModal = () => {
    setCount(-1);
    dispatch(actions.closeElement(DataElements.PRINT_MODAL));
  };

  const closePrintModalAfterPrint = useFocusOnClose(closePrintModal);

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
      isPrinting={isPrinting || pagesAreProcessing}
      pageLabels={pageLabels}
      layoutMode={layoutMode}
      useEmbeddedPrint={useEmbeddedPrint}
    />
  );
};

export default PrintModalContainer;
