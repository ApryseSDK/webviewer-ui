import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import Input from 'components/Input';

import core from 'core';
import getPagesToPrint from 'helpers/getPagesToPrint';
import print from 'helpers/print';
import getClassName from 'helpers/getClassName';
import actions from 'actions';
import selectors from 'selectors';

import './PrintModal.scss';

class PrintModal extends React.PureComponent {
  static propTypes = {
    isEmbedPrintSupported: PropTypes.bool,
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    currentPage: PropTypes.number,
    printQuality: PropTypes.number.isRequired,
    closeElement: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    closeElements: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
  }

  constructor() {
    super();
    this.allPages = React.createRef();
    this.currentPage = React.createRef();
    this.customPages = React.createRef();
    this.customInput = React.createRef();
    this.pendingCanvases = [];
    this.state = {
      count: -1,
      pagesToPrint: []
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.onChange();
      this.props.closeElements([ 'signatureModal', 'loadingModal', 'errorModal' ]);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = e => {
    const { dispatch, isEmbedPrintSupported } = this.props;

    if ((e.metaKey || e.ctrlKey) && e.which === 80) { // (Cmd/Ctrl + P)
      e.preventDefault();
      if (this.props.isDisabled) {
        console.warn('Print has been disabled.');
      } else {
        print(dispatch, isEmbedPrintSupported);
      }
    }
  }

  onChange = () => {
    let pagesToPrint = [];

    if (this.allPages.current.checked) {
      for (let i = 1; i <= core.getTotalPages(); i++) {
        pagesToPrint.push(i);
      }
    } else if (this.currentPage.current.checked) {
      pagesToPrint.push(this.props.currentPage);
    } else if (this.customPages.current.checked) {
      const customInput = this.customInput.current.value.replace(/\s+/g, '');
      pagesToPrint = getPagesToPrint(customInput);
    }

    this.setState({ pagesToPrint });
  }

  onFocus = () => {
    this.customPages.current.checked = true;
    this.onChange();
  }

  createAndPrintImages = e => {
    e.preventDefault();

    if (this.state.pagesToPrint.length < 1) {
      return;
    }

    this.setState({ count: 0 });
    this.setPrintQuality();

    const creatingImages = this.createImages();
    Promise.all(creatingImages).then(images => {
      this.printImages(images);
      window.utils.unsetCanvasMultiplier();
    }).catch(e => {
      console.error(e);
    });
  }

  setPrintQuality = () => {
    window.utils.setCanvasMultiplier(this.props.printQuality);
  }

  createImages = () => {
    const creatingImages = [];

    this.pendingCanvases = [];
    this.state.pagesToPrint.forEach(pageNumber => {
      creatingImages.push(new Promise(resolve => {
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
      }));
    });

    return creatingImages;
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
    const annotations = core.getAnnotationsList().filter(annot => {
      return annot.PageNumber === pageNumber && annot instanceof window.Annotations.WidgetAnnotation;
    });

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
      }).then(function() {
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

  printImages = images => {
    const printHandler = document.getElementById('print-handler');
    printHandler.innerHTML = '';

    const fragment = document.createDocumentFragment();
    images.forEach(image => {
      fragment.appendChild(image);
    });

    printHandler.appendChild(fragment);
    window.print();
    this.closePrintModal();
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
    const isPrinting = count > 0;

    return (
      <div className={className} data-element="printModal">
        <div className="container">
          <div className="settings">
            <div className="col">Pages:</div>
            <form className="col" onChange={this.onChange} onSubmit={this.createAndPrintImages}>
              <Input ref={this.allPages} id="all-pages" name="pages" type="radio" label={t('option.print.all')} defaultChecked />
              <Input ref={this.currentPage} id="current-page" name="pages" type="radio" label={t('option.print.current')} />
              <Input ref={this.customPages} id="custom-pages" name="pages" type="radio" label={customPagesLabelElement} />
            </form>
          </div>
          <div className="total">
            {isPrinting
              ? <div>{`${t('message.processing')} ${count}/${pagesToPrint.length}`}</div>
              : <div>{t('message.printTotalPageCount', { count: pagesToPrint.length })}</div>
            }
          </div>
          <div className="buttons">
            <div className="button" onClick={this.createAndPrintImages} disabled={count > -1}>{t('action.print')}</div>
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
  printQuality: selectors.getPrintQuality(state)
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  closeElement: dataElement => dispatch(actions.closeElement(dataElement)),
  closeElements: dataElements => dispatch(actions.closeElements(dataElements))
});

export default connect(mapStateToProps, mapDispatchToProps)(translate()(PrintModal));