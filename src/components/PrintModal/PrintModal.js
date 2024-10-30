import React, { useEffect, useRef, useState } from 'react';
import actions from 'actions';
import selectors from 'selectors';
import classNames from 'classnames';
import core from 'core';
import PropTypes from 'prop-types';
import getClassName from 'helpers/getClassName';
import LayoutMode from 'constants/layoutMode';
import WatermarkModal from 'components/PrintModal/WatermarkModal';
import Choice from 'components/Choice/Choice';
import ModalWrapper from 'components/ModalWrapper';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import DataElements from 'constants/dataElement';
import DataElementWrapper from '../DataElementWrapper';
import Dropdown from '../Dropdown';
import PageNumberInput from '../PageReplacementModal/PageNumberInput';
import useFocusHandler from 'hooks/useFocusHandler';
import './PrintModal.scss';
import Button from '../Button';

const PrintModal = ({
  isDisabled,
  isOpen,
  isApplyWatermarkDisabled,
  isFullAPIEnabled,
  currentPage,
  printQuality,
  isGrayscale,
  setIsGrayscale,
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
  layoutMode,
  useEmbeddedPrint,
  pageLabels
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
    layoutMode: PropTypes.string,
    useEmbeddedPrint: PropTypes.bool,
    pageLabels: PropTypes.array
  };

  const dispatch = useDispatch();
  const [t] = useTranslation();

  const allPages = useRef();
  const currentPageRef = useRef();
  const customPages = useRef();
  const includeCommentsRef = useRef();
  const currentView = useRef();
  const [embedPrintValid, setEmbedPrintValid] = useState(false);
  const [specifiedPages, setSpecifiedPages] = useState([]);
  const [pageNumberError, setPageNumberError] = useState('');
  const [isCustomPagesChecked, setIsCustomPagesChecked] = useState(false);

  const customizableUI = useSelector((state) => selectors.getFeatureFlags(state)?.customizableUI);

  const printQualityOptions = {
    1: `${t('option.print.qualityNormal')}`,
    2: `${t('option.print.qualityHigh')}`
  };

  const setWatermarkModalVisibility = (visible) => {
    setIsWatermarkModalVisible(visible);
  };

  const className = getClassName('Modal PrintModal', { isOpen });

  const handlePageNumberError = (pageNumber) => {
    if (pageNumber) {
      setPageNumberError(`${t('message.errorPageNumber')} ${core.getTotalPages()}`);
    }
  };

  const handlePageNumberChange = (pageNumbers) => {
    if (pageNumbers.length > 0) {
      setPageNumberError('');
      onChange();
    }
  };

  const customPagesLabelElement = (
    <>
      <label htmlFor="specifyPagesInput" className="specifyPagesChoiceLabel">
        <span>{t('option.print.specifyPages')}</span>
        {isCustomPagesChecked && (
          <span className="specifyPagesExampleLabel">
            - {t('option.thumbnailPanel.multiSelectPagesExample')}
          </span>
        )}
      </label>
      {isCustomPagesChecked && (
        <div className={classNames('page-number-input-container', { error: !!pageNumberError })}>
          <PageNumberInput
            id="specifyPagesInput"
            selectedPageNumbers={specifiedPages}
            pageCount={core.getTotalPages()}
            onSelectedPageNumbersChange={handlePageNumberChange}
            onBlurHandler={setSpecifiedPages}
            onError={handlePageNumberError}
            pageNumberError={pageNumberError}
            customPageLabels={pageLabels}
            enablePageLabels={true}
          />
        </div>
      )}
    </>
  );

  useEffect(() => {
    onChange();
  }, [specifiedPages]);

  const onChange = () => {
    let pagesToPrint = [];
    setIsCurrentView(currentView.current?.checked);
    setIsCustomPagesChecked(customPages.current?.checked);
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
      pagesToPrint = specifiedPages;
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

  const handlePrintQualityChange = (quality) => {
    dispatch(actions.setPrintQuality(Number(quality)));
  };

  const openWaterMarkModalWithFocusTransfer = useFocusHandler(() => {
    if (!isPrinting) {
      setWatermarkModalVisibility(true);
    }
  });

  return isDisabled ? null : (
    <>
      <WatermarkModal
        isVisible={!!(isOpen && isWatermarkModalVisible)}
        // pageIndex starts at index 0 and getCurrPage number starts at index 1
        pageIndexToView={currentPage - 1}
        modalClosed={setWatermarkModalVisibility}
        formSubmitted={(value) => dispatch(actions.setWatermarkModalOptions(value))}
        watermarkLocations={watermarkModalOptions}
        isCustomizableUI={customizableUI}
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
                        </>
                      )
                    }
                  </>
                )}
                {!embedPrintValid && (
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
                  </>
                )}
              </form>
            </div>
            {!embedPrintValid && (
              <DataElementWrapper className="section" dataElement={DataElements.PRINT_QUALITY}>
                <label className="section-label print-quality-section-label" htmlFor="printQualityOptions" id="print-quality-options-label">{`${t('option.print.pageQuality')}:`}</label>
                <Dropdown
                  id="printQualityOptions"
                  labelledById='print-quality-options-label'
                  dataElement="printQualityOptions"
                  items={Object.keys(printQualityOptions)}
                  getDisplayValue={(item) => printQualityOptions[item]}
                  onClickItem={handlePrintQualityChange}
                  currentSelectionKey={printQuality?.toString()}
                  width={274}
                />
                <div className="total">
                  {isPrinting ? (
                    <div>{`${t('message.processing')} ${count}/${pagesToPrint.length}`}</div>
                  ) : (
                    <div>{t('message.printTotalPageCount', { count: pagesToPrint.length })}</div>
                  )}
                </div>
              </DataElementWrapper>
            )}
            {!isApplyWatermarkDisabled && (
              <DataElementWrapper className="section watermark-section" dataElement={DataElements.PRINT_WATERMARK}>
                <div className="section-label">{t('option.watermark.title')}</div>
                <button
                  data-element="applyWatermark"
                  className="apply-watermark"
                  disabled={isPrinting}
                  onClick={openWaterMarkModalWithFocusTransfer}
                >
                  {t('option.watermark.addNew')}
                </button>
              </DataElementWrapper>
            )}
          </div>
          <div className="divider"></div>
          <div className="buttons">
            <Button
              className="button"
              onClick={createPagesAndPrint}
              label={t('action.print')}
            />
          </div>
        </ModalWrapper>
      </div>
    </>
  );
};

export default PrintModal;
