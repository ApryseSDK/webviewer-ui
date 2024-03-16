import React, { useState, useEffect, useRef } from 'react';
import actions from 'actions';
import selectors from 'selectors';
import core from 'core';
import getPageArrayFromString from 'helpers/getPageArrayFromString';
import getClassName from 'helpers/getClassName';
import { creatingPages, printPages } from 'helpers/print';
import LayoutMode from 'constants/layoutMode';
import WatermarkModal from 'components/PrintModal/WatermarkModal';
import Choice from 'components/Choice/Choice';
import ModalWrapper from 'components/ModalWrapper';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';
import DataElements from 'constants/dataElement';

import './PrintModal.scss';
import DataElementWrapper from '../DataElementWrapper';

const PrintModal = () => {
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
    timezone
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
      selectors.getTimezone(state)
    ],
    shallowEqual
  );
  const dispatch = useDispatch();
  const [t] = useTranslation();

  const allPages = useRef();
  const currentPageRef = useRef();
  const customPages = useRef();
  const customInputRef = useRef();
  const includeCommentsRef = useRef();
  const currentView = useRef();
  const existingWatermarksRef = useRef();

  const [allowWatermarkModal, setAllowWatermarkModal] = useState(false);
  const [count, setCount] = useState(-1);
  const [pagesToPrint, setPagesToPrint] = useState([]);
  const [isWatermarkModalVisible, setIsWatermarkModalVisible] = useState(false);
  const [includeAnnotations, setIncludeAnnotations] = useState(true);
  const [includeComments, setIncludeComments] = useState(false);
  const [maintainPageOrientation, setMaintainPageOrientation] = useState(false);
  const [isGrayscale, setIsGrayscale] = useState(false);

  useEffect(() => {
    if (defaultPrintOptions) {
      setIncludeAnnotations(defaultPrintOptions.includeAnnotations ?? includeAnnotations);
      setIncludeComments(defaultPrintOptions.includeComments ?? includeComments);
      setMaintainPageOrientation(defaultPrintOptions.maintainPageOrientation ?? maintainPageOrientation);
    }
  }, [defaultPrintOptions]);

  const isPrinting = count >= 0;
  const className = getClassName('Modal PrintModal', { isOpen });
  const customPagesLabelElement = (
    <>
      {t('option.print.specifyPages')}
      <input
        ref={customInputRef}
        hidden={!customPages.current || (customPages.current && !customPages.current.checked)}
        type="text"
        placeholder={t('message.customPrintPlaceholder')}
        aria-label={t('message.customPrintPlaceholder')}
        onChange={onChange}
        disabled={isPrinting}
      />
    </>
  );

  useEffect(() => {
    onChange();
    dispatch(actions.closeElements([
      DataElements.SIGNATURE_MODAL,
      DataElements.LOADING_MODAL,
      DataElements.PROGRESS_MODAL,
      DataElements.ERROR_MODAL,
    ]));
    core.getWatermark().then((watermark) => {
      setAllowWatermarkModal(
        watermark === undefined ||
        watermark === null ||
        Object.keys(watermark).length === 0
      );
      existingWatermarksRef.current = watermark;
    });

    return () => {
      core.setWatermark(existingWatermarksRef.current);
      setIsWatermarkModalVisible(false);
    };
  }, []);

  const onChange = () => {
    let pagesToPrint = [];

    if (allPages.current?.checked) {
      for (let i = 1; i <= core.getTotalPages(); i++) {
        pagesToPrint.push(i);
      }
    } else if (currentPageRef.current?.checked) {
      const pageCount = core.getTotalPages();

      // when displaying 2 pages, "Current" should print both of them
      switch (layoutMode) {
        case LayoutMode.FacingCover:
        case LayoutMode.FacingCoverContinuous:
          if (
            currentPage === 1 ||
            (currentPage === pageCount && pageCount % 2 === 0)
          ) {
            // first page or last page if single page
            pagesToPrint.push(currentPage);
          } else {
            pagesToPrint =
              currentPage % 2
                ? [currentPage - 1, currentPage]
                : [currentPage, currentPage + 1];
          }
          break;
        case LayoutMode.FacingContinuous:
        case LayoutMode.Facing:
          if (currentPage === pageCount && pageCount % 2 === 1) {
            // last page if single page
            pagesToPrint.push(currentPage);
          } else {
            pagesToPrint =
              currentPage % 2
                ? [currentPage, currentPage + 1]
                : [currentPage - 1, currentPage];
          }
          break;
        default:
          pagesToPrint.push(currentPage);
          break;
      }
    } else if (customPages.current?.checked) {
      const customInput = customInputRef.current.value.replace(/\s+/g, '');
      pagesToPrint = getPageArrayFromString(customInput, pageLabels);
    } else if (currentView.current?.checked) {
      pagesToPrint = [currentPage];
    }

    setPagesToPrint(pagesToPrint);
  };

  const createPagesAndPrint = (e) => {
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

    const createPages = creatingPages(
      pagesToPrint,
      includeComments,
      includeAnnotations,
      maintainPageOrientation,
      printQuality,
      sortStrategy,
      colorMap,
      printedNoteDateFormat,
      undefined,
      currentView.current?.checked,
      language,
      false,
      isGrayscale,
      timezone
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

  const setWatermarkModalVisibility = (visible) => {
    setIsWatermarkModalVisible(visible);
  };

  return isDisabled ? null : (
    <>
      <WatermarkModal
        isVisible={!!(isOpen && isWatermarkModalVisible)}
        // pageIndex starts at index 0 and getCurrPage number starts at index 1
        pageIndexToView={currentPage - 1}
        modalClosed={setWatermarkModalVisibility}
        formSubmitted={(value) => dispatch(actions.setWatermarkModalOptions(value))}
        watermarkLocations={watermarkModalOptions}
      />
      <div
        className={className}
        data-element={DataElements.PRINT_MODAL}
      >
        <ModalWrapper
          isOpen={isOpen && !isWatermarkModalVisible} title={'option.print.printSettings'}
          containerOnClick={(e) => e.stopPropagation()} onCloseClick={closePrintModal}
          closeButtonDataElement={'printModalCloseButton'}
          swipeToClose
          closeHandler={closePrintModal}
        >
          <div className="swipe-indicator" />
          <div className="settings">
            <div className="section">
              <div className="section-label">{`${t('option.print.pages')}:`}</div>
              <form
                className="settings-form"
                onChange={onChange}
                onSubmit={createPagesAndPrint}
              >
                <Choice
                  dataElement="allPagesPrintOption"
                  ref={allPages}
                  id="all-pages"
                  name="pages"
                  radio
                  label={t('option.print.all')}
                  defaultChecked
                  disabled={isPrinting}
                  center
                />
                <Choice
                  dataElement="currentPagePrintOption"
                  ref={currentPageRef}
                  id="current-page"
                  name="pages"
                  radio
                  label={t('option.print.current')}
                  disabled={isPrinting}
                  center
                />
                <Choice
                  dataElement="currentViewPrintOption"
                  ref={currentView}
                  id="current-view"
                  name="pages"
                  radio
                  label={t('option.print.view')}
                  disabled={isPrinting}
                  center
                />
                <Choice
                  dataElement="customPagesPrintOption"
                  ref={customPages}
                  id="custom-pages"
                  name="pages"
                  className="specify-pages-choice"
                  radio
                  label={customPagesLabelElement}
                  disabled={isPrinting}
                  center
                />
                <Choice
                  dataElement="commentsPrintOption"
                  ref={includeCommentsRef}
                  id="include-comments"
                  name="comments"
                  label={t('option.print.includeComments')}
                  onChange={() => setIncludeComments((prevState) => !prevState)}
                  disabled={isPrinting}
                  checked={includeComments}
                  center
                />
                <Choice
                  dataElement="annotationsPrintOption"
                  id="include-annotations"
                  name="annotations"
                  label={t('option.print.includeAnnotations')}
                  disabled={isPrinting}
                  onChange={() => setIncludeAnnotations((prevState) => !prevState)}
                  checked={includeAnnotations}
                  center
                />
                <Choice
                  dataElement="grayscalePrintOption"
                  id="print-grayscale"
                  name="grayscale"
                  label={t('option.print.printGrayscale')}
                  disabled={isPrinting}
                  onChange={() => setIsGrayscale((prevState) => !prevState)}
                  checked={isGrayscale}
                  center
                />
              </form>
            </div>
            <DataElementWrapper className="section" dataElement={DataElements.PRINT_QUALITY}>
              <div className="section-label">{`${t('option.print.pageQuality')}:`}</div>
              <label className="printQualitySelectLabel">
                <select
                  className="printQualitySelect"
                  onChange={(e) => dispatch(actions.setPrintQuality(Number(e.target.value)))}
                  value={printQuality}
                >
                  <option value="2">{`${t('option.print.qualityHigh')}`}</option>
                  <option value="1">{`${t('option.print.qualityNormal')}`}</option>
                </select>
              </label>
              <div className="total">
                {isPrinting ? (
                  <div>{`${t('message.processing')} ${count}/${pagesToPrint.length}`}</div>
                ) : (
                  <div>{t('message.printTotalPageCount', { count: pagesToPrint.length })}</div>
                )}
              </div>
            </DataElementWrapper>
            {!isApplyWatermarkDisabled && (
              <DataElementWrapper className="section watermark-section" dataElement={DataElements.PRINT_WATERMARK}>
                <div className="section-label">{t('option.watermark.title')}</div>
                <button
                  data-element="applyWatermark"
                  className="apply-watermark"
                  disabled={isPrinting}
                  onClick={() => {
                    if (!isPrinting) {
                      setWatermarkModalVisibility(true);
                    }
                  }}
                >
                  {t('option.watermark.addNew')}
                </button>
              </DataElementWrapper>
            )}
          </div>
          <div className="divider"></div>
          <div className="buttons">
            <button
              className="button"
              onClick={createPagesAndPrint}
              disabled={isPrinting || pagesToPrint.length < 1}
            >
              {t('action.print')}
            </button>
          </div>
        </ModalWrapper>
      </div>
    </>
  );
};

export default PrintModal;
