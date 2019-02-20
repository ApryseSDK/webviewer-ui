import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import dayjs from 'dayjs';

import Input from 'components/Input';

import core from 'core';
import getPagesToPrint from 'helpers/getPagesToPrint';
import getClassName from 'helpers/getClassName';
import { getSortStrategies } from 'constants/sortStrategies';
import actions from 'actions';
import selectors from 'selectors';

import './PrintModal.scss';
import { mapAnnotationToKey, getDataWithKey } from '../../constants/map';

class PrintModal extends React.PureComponent {
  static propTypes = {
    isEmbedPrintSupported: PropTypes.bool,
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
  }

  constructor() {
    super();
    this.allPages = React.createRef();
    this.currentPage = React.createRef();
    this.customPages = React.createRef();
    this.customInput = React.createRef();
    this.includeComments = React.createRef();
    this.pendingCanvases = [];
    this.state = {
      count: -1,
      pagesToPrint: []
    };
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.onChange();
      this.props.closeElements([ 'signatureModal', 'loadingModal', 'progressModal', 'errorModal' ]);
    }
  }

  onChange = () => {
    const { currentPage, pageLabels } = this.props;
    let pagesToPrint = [];

    if (this.allPages.current.checked) {
      for (let i = 1; i <= core.getTotalPages(); i++) {
        pagesToPrint.push(i);
      }
    } else if (this.currentPage.current.checked) {
      pagesToPrint.push(currentPage);
    } else if (this.customPages.current.checked) {
      const customInput = this.customInput.current.value.replace(/\s+/g, '');
      pagesToPrint = getPagesToPrint(customInput, pageLabels);
    }

    this.setState({ pagesToPrint });
  }

  onFocus = () => {
    this.customPages.current.checked = true;
    this.onChange();
  }

  createPagesAndPrint = e => {
    e.preventDefault();

    if (this.state.pagesToPrint.length < 1) {
      return;
    }

    this.setState({ count: 0 });
    this.setPrintQuality();

    const creatingPages = this.creatingPages();
    Promise.all(creatingPages).then(pages => {
      this.printPages(pages);
      this.resetPrintQuality();
    }).catch(e => {
      console.error(e);
    });
  }

  setPrintQuality = () => {
    window.utils.setCanvasMultiplier(this.props.printQuality);
  }

  creatingPages = () => {
    const creatingPages = [];

    this.pendingCanvases = [];
    this.state.pagesToPrint.forEach(pageNumber => {
      creatingPages.push(this.creatingImage(pageNumber));

      const printableAnnotations = this.getPrintableAnnotations(pageNumber);
      if (this.includeComments.current.checked && printableAnnotations.length) {
        const sortedNotes = getSortStrategies()[this.props.sortStrategy].getSortedNotes(printableAnnotations);
        creatingPages.push(this.creatingNotesPage(sortedNotes, pageNumber));
      }
    });

    return creatingPages;
  }

  creatingImage = pageNumber => {
    return new Promise(resolve => {
      const pageIndex = pageNumber - 1;
      const zoom = 1;
      const printRotation = this.getPrintRotation(pageIndex);
      const onCanvasLoaded = canvas => {
        this.pendingCanvases = this.pendingCanvases.filter(pendingCanvas => pendingCanvas !== id);
        this.positionCanvas(canvas, pageIndex);
        this.drawAnnotationsOnCanvas(canvas, pageNumber).then(() => {
          const img = document.createElement('img');
          img.src = canvas.toDataURL();
          img.onload = () => {
            this.setState(({ count }) => ({
              count: (count < 0) ? -1 : count + 1
            }));
            resolve(img);
          };
        });
      };

      const id = core.getDocument().loadCanvasAsync(pageIndex, zoom, printRotation, onCanvasLoaded);
      this.pendingCanvases.push(id);
    });
  }

  getPrintRotation = pageIndex => {
    const { width, height } = core.getPageInfo(pageIndex);
    const documentRotation = this.getDocumentRotation(pageIndex);
    let printRotation = (4 - documentRotation) % 4;

    // automatically rotate pages so that they fill up as much of the printed page as possible
    if (printRotation % 2 === 0 && width > height) {
      printRotation++;
    } else if (printRotation % 2 === 1 && height > width) {
      printRotation--;
    }

    return printRotation;
  }

  positionCanvas = (canvas, pageIndex) => {
    const { width, height } = core.getPageInfo(pageIndex);
    const documentRotation = this.getDocumentRotation(pageIndex);
    const ctx = canvas.getContext('2d');

    switch(documentRotation) {
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

    ctx.rotate(documentRotation * 90 * Math.PI / 180);
  }

  getDocumentRotation = pageIndex => {
    const pageNumber = pageIndex + 1;
    const completeRotation = core.getCompleteRotation(pageNumber);
    const viewerRotation = core.getRotation(pageNumber);

    return (completeRotation - viewerRotation + 4) % 4;
  }

  drawAnnotationsOnCanvas = (canvas, pageNumber) => {
    const annotations = core.getAnnotationsList().filter(annot => annot.PageNumber === pageNumber && annot instanceof window.Annotations.WidgetAnnotation);

    if (annotations.length === 0) {
      return core.drawAnnotations(pageNumber, canvas);
    }

    // Currently annotationManager expects a jQuery node
    let widgetContainer = $(this.createWidgetContainer(pageNumber-1));
    return core.drawAnnotations(pageNumber, canvas, true, widgetContainer).then(() => {
      document.body.appendChild(widgetContainer[0]);
      return window.html2canvas(widgetContainer[0], {
        canvas,
        backgroundColor: null,
        scale: 1,
        logging: false
      }).then(() => {
        document.body.removeChild(widgetContainer[0]);
      });
    });

  }

  createWidgetContainer = pageIndex => {
    const { width, height } = core.getPageInfo(pageIndex);
    const widgetContainer = document.createElement('div');

    widgetContainer.id = 'printWidgetContainer';
    widgetContainer.style.width = width;
    widgetContainer.style.height = height;
    widgetContainer.style.position = 'relative';
    widgetContainer.style.top = '-10000px';

    return widgetContainer;
  }

  getPrintableAnnotations = pageNumber => {
    return core.getAnnotationsList().filter(annotation => {
      return annotation.Listable && annotation.PageNumber === pageNumber && !annotation.isReply() && annotation.Printable;
    });
  }

  creatingNotesPage = (annotations, pageNumber) => {
    return new Promise(resolve => {
      const container = document.createElement('div');
      container.className = 'page__container';

      const header =  document.createElement('div');
      header.className = 'page__header';
      header.innerHTML = `Page ${pageNumber}`;

      container.appendChild(header);
      annotations.forEach(annotation => {
        const note = this.getNote(annotation);

        container.appendChild(note);
      });

      resolve(container);
    });
  }

  getNote = annotation => {
    const { colorMap } = this.props;

    const note = document.createElement('div');
    note.className = 'note';

    const noteRoot = document.createElement('div');
    noteRoot.className = 'note__root';

    const noteRootInfo = document.createElement('div');
    noteRootInfo.className = 'note__info--with-icon';

    const key = mapAnnotationToKey(annotation);
    const iconColor = colorMap[key] && colorMap[key].iconColor;
    const icon = getDataWithKey(key).icon;
    const innerHTML = icon ? require(`../../../assets/${icon}.svg`) : annotation.Subject;
    const noteIcon = document.createElement('div');
    noteIcon.className = 'note__icon';
    noteIcon.innerHTML = innerHTML;
    noteIcon.style.color = iconColor && annotation[iconColor].toHexString();

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
  }

  getNoteInfo = annotation => {
    const info = document.createElement('div');

    info.className = 'note__info';
    info.innerHTML = `
      Author: ${annotation.Author || ''} &nbsp;&nbsp;
      Subject: ${annotation.Subject} &nbsp;&nbsp;
      Date: ${dayjs(annotation.DateCreated).format('D/MM/YYYY h:mm:ss A')}
    `;
    return info;
  }

  getNoteContent = annotation => {
    const contentElement = document.createElement('div');
    const contentText = annotation.getContents();

    contentElement.className = 'note__content';
    if (contentText) {
      contentElement.innerHTML = `${contentText}`;
    }
    return contentElement;
  }

  printPages = pages => {
    const printHandler = document.getElementById('print-handler');
    printHandler.innerHTML = '';

    const fragment = document.createDocumentFragment();
    pages.forEach(page => {
      fragment.appendChild(page);
    });

    printHandler.appendChild(fragment);
    window.print();
    this.closePrintModal();
  }

  resetPrintQuality = () => {
    window.utils.unsetCanvasMultiplier();
  }

  closePrintModal = () => {
    this.setState({ count: -1 });
    this.props.closeElement('printModal');
  }

  cancelPrint = () => {
    const doc = core.getDocument();
    this.pendingCanvases.forEach(id => doc.cancelLoadCanvas(id));
    this.setState({ count: -1 });
  }

  render() {
    const { isDisabled, t } = this.props;

    if (isDisabled) {
      return null;
    }

    const { count, pagesToPrint } = this.state;
    const className = getClassName('Modal PrintModal', this.props);
    const customPagesLabelElement = <input ref={this.customInput} type="text" placeholder={t('message.customPrintPlaceholder')} onFocus={this.onFocus}/>;
    const isPrinting = count >= 0;

    return (
      <div className={className} data-element="printModal" onClick={this.closePrintModal}>
          <div className="container" onClick={e => e.stopPropagation()}>
          <div className="settings">
            <div className="col">{`${t('option.print.pages')}:`}</div>
            <form className="col" onChange={this.onChange} onSubmit={this.createPagesAndPrint}>
              <Input ref={this.allPages} id="all-pages" name="pages" type="radio" label={t('option.print.all')} defaultChecked />
              <Input ref={this.currentPage} id="current-page" name="pages" type="radio" label={t('option.print.current')} />
              <Input ref={this.customPages} id="custom-pages" name="pages" type="radio" label={customPagesLabelElement} />
              <Input ref={this.includeComments} id="include-comments" name="comments" type="checkbox" label={t('option.print.includeComments')} />
            </form>
          </div>
          <div className="total">
            {isPrinting
              ? <div>{`${t('message.processing')} ${count}/${pagesToPrint.length}`}</div>
              : <div>{t('message.printTotalPageCount', { count: pagesToPrint.length })}</div>
            }
          </div>
          <div className="buttons">
            <div className="button" onClick={this.createPagesAndPrint} disabled={count > -1}>{t('action.print')}</div>
            {isPrinting
              ? <div className="button" onClick={this.cancelPrint}>{t('action.cancel')}</div>
              : <div className="button" onClick={this.closePrintModal}>{t('action.close')}</div>
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isEmbedPrintSupported: selectors.isEmbedPrintSupported(state),
  isDisabled: selectors.isElementDisabled(state, 'printModal'),
  isOpen: selectors.isElementOpen(state, 'printModal'),
  currentPage: selectors.getCurrentPage(state),
  printQuality: selectors.getPrintQuality(state),
  pageLabels: selectors.getPageLabels(state),
  sortStrategy: selectors.getSortStrategy(state),
  colorMap: selectors.getColorMap(state)
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  closeElement: dataElement => dispatch(actions.closeElement(dataElement)),
  closeElements: dataElements => dispatch(actions.closeElements(dataElements))
});

export default connect(mapStateToProps, mapDispatchToProps)(translate()(PrintModal));