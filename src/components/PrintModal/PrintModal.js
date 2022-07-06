import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Swipeable } from 'react-swipeable';
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

import './PrintModal.scss';

class PrintModal extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    currentPage: PropTypes.number,
    printQuality: PropTypes.number.isRequired,
    pageLabels: PropTypes.array.isRequired,
    closeElement: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    closeElements: PropTypes.func.isRequired,
    setPrintQuality: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    sortStrategy: PropTypes.string.isRequired,
    colorMap: PropTypes.object.isRequired,
    layoutMode: PropTypes.string.isRequired,
    isApplyWatermarkDisabled: PropTypes.bool,
    printedNoteDateFormat: PropTypes.string,
    language: PropTypes.string,
    setWatermarkModalOptions: PropTypes.func.isRequired,
    watermarkModalOptions: PropTypes.object,
  };

  constructor() {
    super();
    this.allPages = React.createRef();
    this.currentPage = React.createRef();
    this.customPages = React.createRef();
    this.customInput = React.createRef();
    this.includeComments = React.createRef();
    this.currentView = React.createRef();
    this.pendingCanvases = [];
    this.state = {
      allowWatermarkModal: false,
      count: -1,
      pagesToPrint: [],
      isWatermarkModalVisible: false,
      existingWatermarks: null,
      includeAnnotations: true,
      includeComments: false,
      allowDefaultPrintOptions: true,
      maintainPageOrientation: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.onChange();
      this.props.closeElements([
        'signatureModal',
        'loadingModal',
        'progressModal',
        'errorModal'
      ]);
      core.getWatermark().then(watermark => {
        this.setState({
          allowWatermarkModal:
            watermark === undefined ||
            watermark === null ||
            Object.keys(watermark).length === 0,
          existingWatermarks: watermark
        });
      });
    }

    if (prevProps.isOpen && !this.props.isOpen) {
      core.setWatermark(this.state.existingWatermarks);
      this.setState({
        isWatermarkModalVisible: false
      });
    }
  }

  onChange = () => {
    const { currentPage, pageLabels, layoutMode } = this.props;
    let pagesToPrint = [];

    if (this.allPages.current.checked) {
      for (let i = 1; i <= core.getTotalPages(); i++) {
        pagesToPrint.push(i);
      }
    } else if (this.currentPage.current.checked) {
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
    } else if (this.customPages.current.checked) {
      const customInput = this.customInput.current.value.replace(/\s+/g, '');
      pagesToPrint = getPageArrayFromString(customInput, pageLabels);
    } else if (this.currentView.current.checked) {
      pagesToPrint = [currentPage];
    }

    this.setState({ pagesToPrint });
  };

  createPagesAndPrint = e => {
    e.preventDefault();

    if (this.state.pagesToPrint.length < 1) {
      return;
    }

    const { language } = this.props;
    this.setState({ count: 0 });

    if (this.state.allowWatermarkModal) {
      core.setWatermark(this.props.watermarkModalOptions);
    } else {
      core.setWatermark(this.state.existingWatermarks);
    }

    const createPages = creatingPages(
      this.state.pagesToPrint,
      this.state.includeComments,
      this.state.includeAnnotations,
      this.state.maintainPageOrientation,
      this.props.printQuality,
      this.props.sortStrategy,
      this.props.colorMap,
      this.props.printedNoteDateFormat,
      undefined,
      this.currentView.current?.checked,
      language,
    );
    createPages.forEach(async pagePromise => {
      await pagePromise;
      this.setState({
        count:
          this.state.count < this.state.pagesToPrint.length && this.state.count !== -1
            ? this.state.count + 1
            : this.state.count
      });
    });
    Promise.all(createPages)
      .then(pages => {
        printPages(pages);
        this.closePrintModal();
      })
      .catch(e => {
        console.error(e);
        this.setState({ count: -1 });
      });
  };

  closePrintModal = () => {
    this.setState({ count: -1 });
    this.props.closeElement('printModal');
  };

  setWatermarkModalVisibility = visible => {
    this.setState({
      isWatermarkModalVisible: visible
    });
  };

  render() {
    const { isDisabled, t, isApplyWatermarkDisabled, isOpen } = this.props;

    if (isDisabled) {
      return null;
    }
    if (this.state.allowDefaultPrintOptions && this.props.defaultPrintOptions) {
      this.state.includeAnnotations = this.props.defaultPrintOptions.includeAnnotations ?? this.state.includeAnnotations;
      this.state.includeComments = this.props.defaultPrintOptions.includeComments ?? this.state.includeComments;
      this.state.maintainPageOrientation = this.props.defaultPrintOptions.maintainPageOrientation ?? this.state.maintainPageOrientation;
      this.state.allowDefaultPrintOptions = false;
    }
    const { count, pagesToPrint, includeAnnotations, includeComments } = this.state;
    const isPrinting = count >= 0;
    const className = getClassName('Modal PrintModal', this.props);
    const customPagesLabelElement = (
      <>
      {t('option.print.specifyPages')}
        <input
          ref={this.customInput}
          hidden={!this.customPages.current || (this.customPages.current && !this.customPages.current.checked)}
          type="text"
          placeholder={t('message.customPrintPlaceholder')}
          aria-label={t('message.customPrintPlaceholder')}
          onChange={this.onChange}
          disabled={isPrinting}
        />
      </>
    );

    return (
      <Swipeable
        onSwipedUp={this.closePrintModal}
        onSwipedDown={this.closePrintModal}
        preventDefaultTouchmoveEvent
      >
        <>
          <WatermarkModal
            isVisible={!!(isOpen && this.state.isWatermarkModalVisible)}
            // pageIndex starts at index 0 and getCurrPage number starts at index 1
            pageIndexToView={this.props.currentPage - 1}
            modalClosed={this.setWatermarkModalVisibility}
            formSubmitted={this.props.setWatermarkModalOptions}
          />
          <div
            className={className}
            data-element="printModal"
          >
            <ModalWrapper isOpen={isOpen && !this.state.isWatermarkModalVisible} title={'option.print.printSettings'}
              containerOnClick={e => e.stopPropagation()} onCloseClick={this.closePrintModal}
              closeButtonDataElement={'printModalCloseButton'}>
              <div className="swipe-indicator" />
              <div className="settings">
                <div className="section">
                  <div className="section-label">{`${t('option.print.pages')}:`}</div>
                  <form
                    className="settings-form"
                    onChange={this.onChange}
                    onSubmit={this.createPagesAndPrint}
                  >
                    <Choice
                      dataElement="allPagesPrintOption"
                      ref={this.allPages}
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
                      ref={this.currentPage}
                      id="current-page"
                      name="pages"
                      radio
                      label={t('option.print.current')}
                      disabled={isPrinting}
                      center
                    />
                    <Choice
                      dataElement="currentViewPrintOption"
                      ref={this.currentView}
                      id="current-view"
                      name="pages"
                      radio
                      label={t('option.print.view')}
                      disabled={isPrinting}
                      center
                    />
                    <Choice
                      dataElement="customPagesPrintOption"
                      ref={this.customPages}
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
                      ref={this.includeComments}
                      id="include-comments"
                      name="comments"
                      label={t('option.print.includeComments')}
                      onChange={() =>
                        this.setState(state => ({
                          includeComments: !state.includeComments
                        }))
                      }
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
                      onChange={() =>
                        this.setState(state => ({
                          includeAnnotations: !state.includeAnnotations
                        }))
                      }
                      checked={includeAnnotations}
                      center
                    />
                  </form>
                </div>
                <div className="section">
                  <div className="section-label">{`${t('option.print.pageQuality')}:`}</div>
                  <label className="printQualitySelectLabel">
                    <select className="printQualitySelect" onChange={e => this.props.setPrintQuality(Number(e.target.value))} value={this.props.printQuality}>
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
                </div>
                {!isApplyWatermarkDisabled && (
                  <div className="section watermark-section">
                    <div className="section-label">{t('option.watermark.title')}</div>
                    <button
                      data-element="applyWatermark"
                      className="apply-watermark"
                      disabled={isPrinting}
                      onClick={() => {
                        if (!isPrinting) {
                          this.setWatermarkModalVisibility(true);
                        }
                      }}
                    >
                      {t('option.watermark.addNew')}
                    </button>
                  </div>
                )}
              </div>
              <div className="divider"></div>
              <div className="buttons">
                <button
                  className="button"
                  onClick={this.createPagesAndPrint}
                  disabled={isPrinting || pagesToPrint.length < 1}
                >
                  {t('action.print')}
                </button>
              </div>
            </ModalWrapper>
          </div>
        </>
      </Swipeable>
    );
  }
}

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'printModal'),
  isApplyWatermarkDisabled: selectors.isElementDisabled(
    state,
    'applyWatermark'
  ),
  isOpen: selectors.isElementOpen(state, 'printModal'),
  currentPage: selectors.getCurrentPage(state),
  printQuality: selectors.getPrintQuality(state),
  defaultPrintOptions: selectors.getDefaultPrintOptions(state),
  pageLabels: selectors.getPageLabels(state),
  sortStrategy: selectors.getSortStrategy(state),
  colorMap: selectors.getColorMap(state),
  layoutMode: selectors.getDisplayMode(state),
  printedNoteDateFormat: selectors.getPrintedNoteDateFormat(state),
  language: selectors.getCurrentLanguage(state),
  watermarkModalOptions: selectors.getWatermarkModalOptions(state),
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  closeElement: dataElement => dispatch(actions.closeElement(dataElement)),
  closeElements: dataElements => dispatch(actions.closeElements(dataElements)),
  setPrintQuality: dataElements => dispatch(actions.setPrintQuality(dataElements)),
  setWatermarkModalOptions: dataElements => dispatch(actions.setWatermarkModalOptions(dataElements)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(PrintModal));