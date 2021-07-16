import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import WatermarkModal from 'components/PrintModal/WatermarkModal';

import core from 'core';
import getPageArrayFromString from 'helpers/getPageArrayFromString';
import getClassName from 'helpers/getClassName';
import { creatingPages, printPages, cancelPrint } from 'helpers/print';
import LayoutMode from 'constants/layoutMode';
import actions from 'actions';
import selectors from 'selectors';

import { Swipeable } from 'react-swipeable';

import './PrintModal.scss';
import Choice from '../Choice/Choice';
import { FocusTrap } from '@pdftron/webviewer-react-toolkit';
import { setPrintQuality } from 'src/apis/setPrintQuality';


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
      watermarkModalOption: null,
      existingWatermarks: null,
      includeAnnotations: true,
      includeComments: false
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

  onInputChange = () => {
    if (!this.customPages.current.checked) {
      this.customPages.current.click();
      this.onChange();
    }
  };

  createPagesAndPrint = e => {
    e.preventDefault();

    if (this.state.pagesToPrint.length < 1) {
      return;
    }

    const { language } = this.props;
    this.setState({ count: 0 });

    if (this.state.allowWatermarkModal) {
      core.setWatermark(this.state.watermarkModalOption);
    } else {
      core.setWatermark(this.state.existingWatermarks);
    }

    const createPages = creatingPages(
      this.state.pagesToPrint,
      this.state.includeComments,
      this.state.includeAnnotations,
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
          this.state.count < this.state.pagesToPrint.length
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

  setWatermarkModalOption = watermarkOptions => {
    this.setState({
      watermarkModalOption: watermarkOptions
    });
  };

  render() {
    const { isDisabled, t, isApplyWatermarkDisabled, isOpen } = this.props;

    if (isDisabled) {
      return null;
    }

    const { count, pagesToPrint, includeAnnotations } = this.state;
    const isPrinting = count >= 0;
    const className = getClassName('Modal PrintModal', this.props);
    const customPagesLabelElement = (
      <input
        ref={this.customInput}
        type="text"
        placeholder={t('message.customPrintPlaceholder')}
        aria-label={t('message.customPrintPlaceholder')}
        onChange={this.onInputChange}
        disabled={isPrinting}
      />
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
            formSubmitted={this.setWatermarkModalOption}
          />
          <FocusTrap locked={isOpen && !this.state.isWatermarkModalVisible}>
            <div
              className={className}
              data-element="printModal"
              onClick={() => {
                cancelPrint();
                this.closePrintModal();
              }}
            >
              <div className="container" onClick={e => e.stopPropagation()}>
                <div className="swipe-indicator" />
                <div className="settings">
                  <div className="col">{`${t('option.print.pages')}:`}</div>
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
                  <div>
                    <div className="col">
                      <label>
                        {`${t('option.print.pageQuality')}:`}
                        <select className="printQualitySelect" onChange={e => this.props.setPrintQuality(Number(e.target.value))} value={this.props.printQuality}>
                          <option value="2">{`${t('option.print.qualityHigh')}`}</option>
                          <option value="1">{`${t('option.print.qualityNormal')}`}</option>
                        </select>
                      </label>
                    </div>
                  </div>
                  <div className="total">
                    {isPrinting ? (
                      <div>{`${t('message.processing')} ${count}/${
                        pagesToPrint.length
                      }`}</div>
                    ) : (
                      <div>
                        {t('message.printTotalPageCount', {
                          count: pagesToPrint.length
                        })}
                      </div>
                    )}
                  </div>
                  {!isApplyWatermarkDisabled && (
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
                      {t('option.print.addWatermarkSettings')}
                    </button>
                  )}
                </div>

                <div className="divider"></div>
                <div className="buttons">
                  <button
                    className="button"
                    onClick={this.createPagesAndPrint}
                    disabled={count > -1}
                  >
                    {t('action.print')}
                  </button>
                </div>
              </div>
            </div>
          </FocusTrap>
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
  pageLabels: selectors.getPageLabels(state),
  sortStrategy: selectors.getSortStrategy(state),
  colorMap: selectors.getColorMap(state),
  layoutMode: selectors.getDisplayMode(state),
  printedNoteDateFormat: selectors.getPrintedNoteDateFormat(state),
  language: selectors.getCurrentLanguage(state),
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  closeElement: dataElement => dispatch(actions.closeElement(dataElement)),
  closeElements: dataElements => dispatch(actions.closeElements(dataElements)),
  setPrintQuality: dataElements => dispatch(actions.setPrintQuality(dataElements)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(PrintModal));