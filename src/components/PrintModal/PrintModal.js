import React, { useEffect, useRef, useState } from 'react';
import actions from 'actions';
import PropTypes from 'prop-types';

import getClassName from 'helpers/getClassName';

import core from 'core';

import getPageArrayFromString from 'helpers/getPageArrayFromString';
import LayoutMode from 'constants/layoutMode';
import WatermarkModal from 'components/PrintModal/WatermarkModal';
import Choice from 'components/Choice/Choice';
import ModalWrapper from 'components/ModalWrapper';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import DataElements from 'constants/dataElement';

import './PrintModal.scss';
import DataElementWrapper from '../DataElementWrapper';

const PrintModal = ({
  isDisabled,
  isOpen,
  isApplyWatermarkDisabled,
  isFullAPIEnabled,
  currentPage,
  printQuality,
  isGrayscale,
  setIsGrayscale,
  shouldFlatten,
  setShouldFlatten,
  setIsCurrentView,
  isCurrentViewDisabled,
  includeAnnotations,
  setIncludeAnnotations,
  includeComments,
  setIncludeComments,
  isWatermarkModalVisible,
  setIsWatermarkModalVisible,
  watermarkModalOptions,
  existingWatermarksRef,
  setAllowWatermarkModal,
  closePrintModal,
  createPagesAndPrint,
  pagesToPrint,
  setPagesToPrint,
  count,
  isPrinting,
  pageLabels,
  layoutMode,
  useEmbeddedPrint,
}) => {
  PrintModal.propTypes = {
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    isApplyWatermarkDisabled: PropTypes.bool,
    isFullAPIEnabled: PropTypes.bool,
    currentPage: PropTypes.number,
    printQuality: PropTypes.number,
    isGrayscale: PropTypes.bool,
    setIsGrayscale: PropTypes.func,
    shouldFlatten: PropTypes.bool,
    setShouldFlatten: PropTypes.func,
    setIsCurrentView: PropTypes.func,
    isCurrentViewDisabled: PropTypes.bool,
    includeAnnotations: PropTypes.bool,
    setIncludeAnnotations: PropTypes.func,
    includeComments: PropTypes.bool,
    setIncludeComments: PropTypes.func,
    isWatermarkModalVisible: PropTypes.bool,
    setIsWatermarkModalVisible: PropTypes.func,
    watermarkModalOptions: PropTypes.object,
    existingWatermarksRef: PropTypes.object,
    setAllowWatermarkModal: PropTypes.func,
    closePrintModal: PropTypes.func,
    createPagesAndPrint: PropTypes.func,
    pagesToPrint: PropTypes.array,
    setPagesToPrint: PropTypes.func,
    count: PropTypes.number,
    isPrinting: PropTypes.bool,
    pageLabels: PropTypes.any,
    layoutMode: PropTypes.string,
    useEmbeddedPrint: PropTypes.bool
  };

  const dispatch = useDispatch();
  const [t] = useTranslation();

  const allPages = useRef();
  const currentPageRef = useRef();
  const customPages = useRef();
  const customInputRef = useRef();
  const includeCommentsRef = useRef();
  const currentView = useRef();
  const [embedPrintValid, setEmbedPrintValid] = useState(false);

  const setWatermarkModalVisibility = (visible) => {
    setIsWatermarkModalVisible(visible);
  };

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

  const onChange = () => {
    let pagesToPrint = [];
    setIsCurrentView(currentView.current?.checked);
    if (allPages.current?.checked || (currentView.current?.checked && embedPrintValid)) {
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

  useEffect(() => {
    onChange();

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

  useEffect(() => {
    (core.getDocument().getType() !== 'xod' && useEmbeddedPrint) ? setEmbedPrintValid(true) : setEmbedPrintValid(false);
  }, [useEmbeddedPrint]);

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
                  disabled={isCurrentViewDisabled}
                  center
                  title={t('option.print.printCurrentDisabled')}
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
                  dataElement="annotationsPrintOption"
                  id="include-annotations"
                  name="annotations"
                  label={t('option.print.includeAnnotations')}
                  disabled={isPrinting}
                  onChange={() => setIncludeAnnotations((prevState) => !prevState)}
                  checked={includeAnnotations}
                  center
                />
                {embedPrintValid && (
                  <>
                    {
                      isFullAPIEnabled && (
                        <>
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
                          <Choice
                            dataElement="flattenPrintOption"
                            id="print-flatten"
                            name="flatten"
                            label={t('option.print.flatten')}
                            disabled={isPrinting}
                            onChange={() => setShouldFlatten((prevState) => !prevState)}
                            checked={shouldFlatten}
                            center
                          />
                        </>
                      )
                    }
                  </>
                )}
                {!embedPrintValid && (
                  <>
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
                      dataElement="grayscalePrintOption"
                      id="print-grayscale"
                      name="grayscale"
                      label={t('option.print.printGrayscale')}
                      disabled={isPrinting}
                      onChange={() => setIsGrayscale((prevState) => !prevState)}
                      checked={isGrayscale}
                      center
                    />
                  </>
                )}
              </form>
            </div>
            {!embedPrintValid && (
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
            )}
            {!isApplyWatermarkDisabled && !embedPrintValid && (
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
