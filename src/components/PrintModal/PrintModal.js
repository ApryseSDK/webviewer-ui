import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import Input from 'components/Input';
import WatermarkModal from 'components/PrintModal/WatermarkModal';

import core from 'core';
import getPageArrayFromString from 'helpers/getPageArrayFromString';
import getClassName from 'helpers/getClassName';
import { getSortStrategies } from 'constants/sortStrategies';
import { mapAnnotationToKey, getDataWithKey } from 'constants/map';
import LayoutMode from 'constants/layoutMode';
import actions from 'actions';
import selectors from 'selectors';
import { isSafari, isChromeOniOS } from 'helpers/device';

import { Swipeable } from 'react-swipeable';

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
    t: PropTypes.func.isRequired,
    sortStrategy: PropTypes.string.isRequired,
    colorMap: PropTypes.object.isRequired,
    layoutMode: PropTypes.string.isRequired,
    isApplyWatermarkDisabled: PropTypes.bool,
  };

  constructor() {
    super();
    this.allPages = React.createRef();
    this.currentPage = React.createRef();
    this.customPages = React.createRef();
    this.customInput = React.createRef();
    this.includeComments = React.createRef();
    this.pendingCanvases = [];
    this.state = {
      allowWatermarkModal: false,
      count: -1,
      pagesToPrint: [],
      isWatermarkModalVisible: false,
      watermarkModalOption: null,
      existingWatermarks: null,
    };
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.onChange();
      this.props.closeElements([
        'signatureModal',
        'loadingModal',
        'progressModal',
        'errorModal',
      ]);
      core.getWatermark().then(watermark => {
        this.setState({
          allowWatermarkModal:
            watermark === undefined ||
            watermark === null ||
            Object.keys(watermark).length === 0,
          existingWatermarks: watermark,
        });
      });
    }

    if (prevProps.isOpen && !this.props.isOpen) {
      core.setWatermark(this.state.existingWatermarks);
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
    }

    this.setState({ pagesToPrint });
  };

  onFocus = () => {
    this.customPages.current.checked = true;
    this.onChange();
  };

  createPagesAndPrint = e => {
    e.preventDefault();

    if (this.state.pagesToPrint.length < 1) {
      return;
    }

    this.setState({ count: 0 });
    this.setPrintQuality();

    if (this.state.allowWatermarkModal) {
      core.setWatermark(this.state.watermarkModalOption);
    } else {
      core.setWatermark(this.state.existingWatermarks);
    }

    const creatingPages = this.creatingPages();
    Promise.all(creatingPages)
      .then(pages => {
        this.printPages(pages);
        this.resetPrintQuality();
      })
      .catch(e => {
        console.error(e);
        this.setState({ count: -1 });
      });
  };

  setPrintQuality = () => {
    window.utils.setCanvasMultiplier(this.props.printQuality);
  };

  creatingPages = () => {
    const creatingPages = [];

    this.pendingCanvases = [];
    this.state.pagesToPrint.forEach(pageNumber => {
      creatingPages.push(this.creatingImage(pageNumber));

      const printableAnnotations = this.getPrintableAnnotations(pageNumber);
      if (this.includeComments.current.checked && printableAnnotations.length) {
        const sortedNotes = getSortStrategies()[
          this.props.sortStrategy
        ].getSortedNotes(printableAnnotations);
        creatingPages.push(this.creatingNotesPage(sortedNotes, pageNumber));
      }
    });

    return creatingPages;
  };

  creatingImage = pageNumber =>
    new Promise(resolve => {
      const pageIndex = pageNumber - 1;
      const zoom = 1;
      const printRotation = this.getPrintRotation(pageIndex);
      const onCanvasLoaded = canvas => {
        this.pendingCanvases = this.pendingCanvases.filter(
          pendingCanvas => pendingCanvas !== id,
        );
        this.positionCanvas(canvas, pageIndex);
        this.drawAnnotationsOnCanvas(canvas, pageNumber).then(() => {
          const img = document.createElement('img');
          img.src = canvas.toDataURL();
          img.onload = () => {
            this.setState(({ count }) => ({
              count: count < 0 ? -1 : count + 1,
            }));
            resolve(img);
          };
        });
      };

      const id = core.getDocument().loadCanvasAsync({
        pageNumber,
        zoom,
        pageRotation: printRotation,
        drawComplete: onCanvasLoaded,
      });
      this.pendingCanvases.push(id);
    });

  getPrintRotation = pageIndex => {
    const { width, height } = core.getPageInfo(pageIndex + 1);
    const documentRotation = this.getDocumentRotation(pageIndex);
    let printRotation = (4 - documentRotation) % 4;

    // automatically rotate pages so that they fill up as much of the printed page as possible
    if (printRotation % 2 === 0 && width > height) {
      printRotation++;
    } else if (printRotation % 2 === 1 && height > width) {
      printRotation--;
    }

    return printRotation;
  };

  positionCanvas = (canvas, pageIndex) => {
    const { width, height } = core.getPageInfo(pageIndex + 1);
    const documentRotation = this.getDocumentRotation(pageIndex);
    const ctx = canvas.getContext('2d');

    switch (documentRotation) {
      case 1:
        ctx.translate(width, 0);
        break;
      case 2:
        ctx.translate(width, height);
        break;
      case 3:
        ctx.translate(0, height);
        break;
    }

    ctx.rotate((documentRotation * 90 * Math.PI) / 180);
  };

  getDocumentRotation = pageIndex => {
    const pageNumber = pageIndex + 1;
    const completeRotation = core.getCompleteRotation(pageNumber);
    const viewerRotation = core.getRotation(pageNumber);

    return (completeRotation - viewerRotation + 4) % 4;
  };

  drawAnnotationsOnCanvas = (canvas, pageNumber) => {
    const annotations = core
      .getAnnotationsList()
      .filter(
        annot =>
          annot.PageNumber === pageNumber && annot instanceof window.Annotations.WidgetAnnotation
      );

    if (annotations.length === 0) {
      return core.drawAnnotations(pageNumber, canvas);
    }

    const widgetContainer = this.createWidgetContainer(pageNumber - 1);
    return core.drawAnnotations(pageNumber, canvas, true, widgetContainer).then(() => {
      document.body.appendChild(widgetContainer);

      return import(/* webpackChunkName: 'html2canvas' */ 'html2canvas').then(
        ({ default: html2canvas }) => {
          return html2canvas(widgetContainer, {
            canvas,
            backgroundColor: null,
            scale: 1,
            logging: false,
          }).then(() => {
            document.body.removeChild(widgetContainer);
          });
        }
      );
    });
  };

  createWidgetContainer = pageIndex => {
    const { width, height } = core.getPageInfo(pageIndex + 1);
    const widgetContainer = document.createElement('div');

    widgetContainer.id = 'printWidgetContainer';
    widgetContainer.style.width = width;
    widgetContainer.style.height = height;
    widgetContainer.style.position = 'relative';
    widgetContainer.style.top = '-10000px';

    return widgetContainer;
  };

  getPrintableAnnotations = pageNumber =>
    core
      .getAnnotationsList()
      .filter(
        annotation =>
          annotation.Listable &&
          annotation.PageNumber === pageNumber &&
          !annotation.isReply() &&
          !annotation.isGrouped() &&
          annotation.Printable,
      );

  creatingNotesPage = (annotations, pageNumber) =>
    new Promise(resolve => {
      const container = document.createElement('div');
      container.className = 'page__container';

      const header = document.createElement('div');
      header.className = 'page__header';
      header.innerHTML = `Page ${pageNumber}`;

      container.appendChild(header);
      annotations.forEach(annotation => {
        const note = this.getNote(annotation);

        container.appendChild(note);
      });

      resolve(container);
    });

  getNote = annotation => {
    const note = document.createElement('div');
    note.className = 'note';

    const noteRoot = document.createElement('div');
    noteRoot.className = 'note__root';

    const noteRootInfo = document.createElement('div');
    noteRootInfo.className = 'note__info--with-icon';

    const noteIcon = this.getNoteIcon(annotation);

    noteRootInfo.appendChild(noteIcon);
    noteRootInfo.appendChild(this.getNoteInfo(annotation));
    noteRoot.appendChild(noteRootInfo);
    noteRoot.appendChild(this.getNoteContent(annotation));

    note.appendChild(noteRoot);
    annotation.getReplies().forEach(reply => {
      const noteReply = document.createElement('div');
      noteReply.className = 'note__reply';
      noteReply.appendChild(this.getNoteInfo(reply));
      noteReply.appendChild(this.getNoteContent(reply));

      note.appendChild(noteReply);
    });

    return note;
  };

  getNoteIcon = annotation => {
    const { colorMap } = this.props;
    const key = mapAnnotationToKey(annotation);
    const iconColor = colorMap[key] && colorMap[key].iconColor;
    const icon = getDataWithKey(key).icon;
    const isBase64 = icon && icon.trim().indexOf('data:') === 0;

    let noteIcon;
    if (isBase64) {
      noteIcon = document.createElement('img');
      noteIcon.src = icon;
    } else {
      let innerHTML;
      if (icon) {
        const isInlineSvg = icon.indexOf('<svg') === 0;
        /* eslint-disable global-require */
        innerHTML = isInlineSvg ? icon : require(`../../../assets/${icon}.svg`);
      } else {
        innerHTML = annotation.Subject;
      }

      noteIcon = document.createElement('div');
      noteIcon.innerHTML = innerHTML;
    }

    noteIcon.className = 'note__icon';
    noteIcon.style.color = iconColor && annotation[iconColor].toHexString();
    return noteIcon;
  };

  getNoteInfo = annotation => {
    const info = document.createElement('div');

    info.className = 'note__info';
    info.innerHTML = `
      Author: ${core.getDisplayAuthor(annotation) || ''} &nbsp;&nbsp;
      Subject: ${annotation.Subject} &nbsp;&nbsp;
      Date: ${dayjs(annotation.DateCreated).format('D/MM/YYYY h:mm:ss A')}
    `;
    return info;
  };

  getNoteContent = annotation => {
    const contentElement = document.createElement('div');
    const contentText = annotation.getContents();

    contentElement.className = 'note__content';
    if (contentText) {
      // ensure that new lines are preserved and rendered properly
      contentElement.style.whiteSpace = 'pre-wrap';
      contentElement.innerHTML = `${contentText}`;
    }
    return contentElement;
  };

  printPages = pages => {
    const printHandler = document.getElementById('print-handler');
    printHandler.innerHTML = '';

    const fragment = document.createDocumentFragment();
    pages.forEach(page => {
      fragment.appendChild(page);
    });

    printHandler.appendChild(fragment);

    if (isSafari && !isChromeOniOS) {
      // Print for Safari browser. Makes Safari 11 consistently work.
      document.execCommand('print');
    } else {
      window.print();
    }
    this.closePrintModal();
  };

  resetPrintQuality = () => {
    window.utils.unsetCanvasMultiplier();
  };

  closePrintModal = () => {
    this.setState({ count: -1 });
    this.props.closeElement('printModal');
  };

  cancelPrint = () => {
    const doc = core.getDocument();
    this.pendingCanvases.forEach(id => doc.cancelLoadCanvas(id));
    this.setState({ count: -1 });
  };

  setWatermarkModalVisibility = visible => {
    this.setState({
      isWatermarkModalVisible: visible,
    });
  };

  setWatermarkModalOption = watermarkOptions => {
    this.setState({
      watermarkModalOption: watermarkOptions,
    });
  };

  render() {
    const { isDisabled, t, isApplyWatermarkDisabled } = this.props;

    if (isDisabled) {
      return null;
    }

    const { count, pagesToPrint } = this.state;
    const isPrinting = count >= 0;
    const className = getClassName('Modal PrintModal', this.props);
    const customPagesLabelElement = (
      <input
        ref={this.customInput}
        type="text"
        placeholder={t('message.customPrintPlaceholder')}
        onFocus={this.onFocus}
        disabled={isPrinting}
      />
    );

    return (
      <Swipeable
        onSwipedUp={this.closePrintModal}
        onSwipedDown={this.closePrintModal}
        preventDefaultTouchmoveEvent
      >
        <React.Fragment>
          <WatermarkModal
            isVisible={this.state.isWatermarkModalVisible}
            // pageIndex starts at index 0 and getCurrPage number starts at index 1
            pageIndexToView={this.props.currentPage - 1}
            modalClosed={this.setWatermarkModalVisibility}
            formSubmitted={this.setWatermarkModalOption}
          />
          <div
            className={className}
            data-element="printModal"
            onClick={() => {
              this.cancelPrint();
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
                  <Input
                    ref={this.allPages}
                    id="all-pages"
                    name="pages"
                    type="radio"
                    label={t('option.print.all')}
                    defaultChecked
                    disabled={isPrinting}
                  />
                  <Input
                    ref={this.currentPage}
                    id="current-page"
                    name="pages"
                    type="radio"
                    label={t('option.print.current')}
                    disabled={isPrinting}
                  />
                  <Input
                    ref={this.customPages}
                    id="custom-pages"
                    name="pages"
                    type="radio"
                    label={customPagesLabelElement}
                    disabled={isPrinting}
                  />
                  <Input
                    ref={this.includeComments}
                    id="include-comments"
                    name="comments"
                    type="checkbox"
                    label={t('option.print.includeComments')}
                    disabled={isPrinting}
                  />
                </form>
                <div className="total">
                  {isPrinting ? (
                    <div>{`${t('message.processing')} ${count}/${
                      pagesToPrint.length
                    }`}</div>
                  ) : (
                    <div>
                      {t('message.printTotalPageCount', {
                        count: pagesToPrint.length,
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
        </React.Fragment>
      </Swipeable>
    );
  }
}

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'printModal'),
  isApplyWatermarkDisabled: selectors.isElementDisabled(
    state,
    'applyWatermark',
  ),
  isOpen: selectors.isElementOpen(state, 'printModal'),
  currentPage: selectors.getCurrentPage(state),
  printQuality: selectors.getPrintQuality(state),
  pageLabels: selectors.getPageLabels(state),
  sortStrategy: selectors.getSortStrategy(state),
  colorMap: selectors.getColorMap(state),
  layoutMode: selectors.getDisplayMode(state),
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  closeElement: dataElement => dispatch(actions.closeElement(dataElement)),
  closeElements: dataElements => dispatch(actions.closeElements(dataElements)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(PrintModal));
