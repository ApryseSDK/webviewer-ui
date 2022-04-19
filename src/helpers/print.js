import i18n from 'i18next';

import actions from 'actions';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

import { workerTypes } from 'constants/types';
import { getSortStrategies } from 'constants/sortStrategies';
import { mapAnnotationToKey, getDataWithKey } from 'constants/map';
import { isSafari, isChromeOniOS, isFirefoxOniOS } from 'helpers/device';
import core from 'core';

let pendingCanvases = [];
let PRINT_QUALITY = 1;
let colorMap;

dayjs.extend(LocalizedFormat);

export const print = async (dispatch, isEmbedPrintSupported, sortStrategy, colorMap, options = {}) => {
  const {
    includeAnnotations,
    includeComments,
    maintainPageOrientation,
    onProgress,
    printQuality = PRINT_QUALITY,
    printWithoutModal = false,
    language,
    isPrintCurrentView,
    printedNoteDateFormat: dateFormat
  } = options;
  let { pagesToPrint } = options;

  if (!core.getDocument()) {
    return;
  }

  const documentType = core.getDocument().getType();
  const bbURLPromise = core.getPrintablePDF();

  if (bbURLPromise) {
    const printPage = window.open('', '_blank');
    printPage.document.write(i18n.t('message.preparingToPrint'));
    bbURLPromise.then(result => {
      printPage.location.href = result.url;
    });
  } else if (isEmbedPrintSupported && documentType === workerTypes.PDF) {
    dispatch(actions.openElement('loadingModal'));
    printPdf().then(() => {
      dispatch(actions.closeElement('loadingModal'));
    });
  } else if (includeAnnotations || includeComments || printWithoutModal) {
    if (!pagesToPrint) {
      pagesToPrint = [];
      for (let i = 1; i <= core.getTotalPages(); i++) {
        pagesToPrint.push(i);
      }
    }
    if (isPrintCurrentView) {
      pagesToPrint = [core.getDocumentViewer().getCurrentPage()];
    }

    const createPages = creatingPages(
      pagesToPrint,
      includeComments,
      includeAnnotations,
      maintainPageOrientation,
      printQuality,
      sortStrategy,
      colorMap,
      dateFormat,
      onProgress,
      isPrintCurrentView,
      language,
    );
    Promise.all(createPages)
      .then(pages => {
        printPages(pages);
      })
      .catch(e => {
        console.error(e);
      });
  } else {
    dispatch(actions.openElement('printModal'));
  }
};

const printPdf = () =>
  core.exportAnnotations().then(xfdfString => {
    const printDocument = true;
    return core
      .getDocument()
      .getFileData({ xfdfString, printDocument })
      .then(data => {
        const arr = new Uint8Array(data);
        const blob = new Blob([arr], { type: 'application/pdf' });

        const printHandler = document.getElementById('print-handler');
        printHandler.src = URL.createObjectURL(blob);

        return new Promise(resolve => {
          const loadListener = function() {
            printHandler.contentWindow.print();
            printHandler.removeEventListener('load', loadListener);

            resolve();
          };

          printHandler.addEventListener('load', loadListener);
        });
      });
  });

export const creatingPages = (pagesToPrint, includeComments, includeAnnotations, maintainPageOrientation, printQuality, sortStrategy, clrMap, dateFormat, onProgress, isPrintCurrentView, language) => {
  const createdPages = [];
  pendingCanvases = [];
  PRINT_QUALITY = printQuality;
  colorMap = clrMap;

  pagesToPrint.forEach(pageNumber => {
    const printableAnnotationNotes = getPrintableAnnotationNotes(pageNumber);
    createdPages.push(creatingImage(pageNumber, includeAnnotations, maintainPageOrientation, isPrintCurrentView));

    if (onProgress) {
      createdPages[createdPages.length - 1].then(htmlElement => {
        onProgress(pageNumber, htmlElement);
      });
    }

    if (includeComments && printableAnnotationNotes) {
      const sortedNotes = getSortStrategies()[sortStrategy].getSortedNotes(printableAnnotationNotes);
      if (sortedNotes.length) {
        createdPages.push(creatingNotesPage(sortedNotes, pageNumber, dateFormat, language));
      }
      if (onProgress) {
        createdPages[createdPages.length - 1].then(htmlElement => {
          onProgress(pageNumber, htmlElement);
        });
      }
    }
  });

  return createdPages;
};

export const printPages = pages => {
  const printHandler = document.getElementById('print-handler');
  printHandler.innerHTML = '';

  const fragment = document.createDocumentFragment();
  pages.forEach(page => {
    fragment.appendChild(page);
  });

  printHandler.appendChild(fragment);

  if (isSafari && !(isChromeOniOS || isFirefoxOniOS)) {
    // Print for Safari browser. Makes Safari 11 consistently work.
    document.execCommand('print');
  } else {
    // It looks like both Chrome and Firefox (on iOS) use the top window as target for window.print instead of the frame where it was triggered,
    // so we need to teleport the print handler div to the top parent and inject some CSS to make it print nicely.
    // This can be removed when Chrome and Firefox for iOS respect the origin frame as the actual target for window.print
    if (isChromeOniOS || isFirefoxOniOS) {
      if (window.parent.document.getElementById('print-handler')) {
        window.parent.document.getElementById('print-handler').remove();
      }
      window.parent.document.body.appendChild(printHandler.cloneNode(true));

      if (!window.parent.document.getElementById('print-handler-css')) {
        const style = window.parent.document.createElement('style');
        style.id = 'print-handler-css';

        style.textContent = `
          #print-handler {
            display: none;
          }

          @media print {
            * {
              display: none! important;
            }

            html {
              height: 100%;
              display: block! important;
            }

            body {
              height: 100%;
              display: block! important;
              overflow: visible !important;
              padding: 0;
            }

            #print-handler {
              display: block !important;
              height: 100%;
              padding: 0;
              top: 0;
              bottom: 0;
              left: 0;
              right: 0;
              position: absolute;
            }

            #print-handler img {
              display: block !important;
              max-width: 100%;
              max-height: 100%;
              height: 100%;
              width: 100%;
              object-fit: contain;
              page-break-after: always;
              padding: 0;
              margin: 0;
            }

            #print-handler .page__container {
              box-sizing: border-box;
              display: flex !important;
              flex-direction: column;
              padding: 10px;
              min-height: 100%;
              min-width: 100%;
              font-size: 10px;
            }

            #print-handler .page__container .page__header {
              display: block !important;
              align-self: flex-start;
              font-size: 2rem;
              margin-bottom: 2rem;
              padding-bottom: 0.6rem;
              border-bottom: 0.1rem solid black;
            }

            #print-handler .page__container .note {
              display: flex !important;
              flex-direction: column;
              padding: 0.6rem;
              border: 0.1rem lightgray solid;
              border-radius: 0.4rem;
              margin-bottom: 0.5rem;
            }

            #print-handler .page__container .note .note__info {
              display: block !important;
              font-size: 1.3rem;
              margin-bottom: 0.1rem;
            }

            #print-handler .page__container .note .note__info--with-icon {
              display: flex !important;
            }

            #print-handler .page__container .note .note__info--with-icon .note__icon {
              display: block !important;
              width: 1.65rem;
              height: 1.65rem;
              margin-top: -0.1rem;
              margin-right: 0.2rem;
            }

            #print-handler .page__container .note .note__info--with-icon .note__icon path:not([fill=none]) {
              display: block !important;
              fill: currentColor;
            }

            #print-handler .page__container .note .note__root .note__content {
              display: block !important;
              margin-left: 0.3rem;
            }

            #print-handler .page__container .note .note__root {
              display: block !important;
            }

            #print-handler .page__container .note .note__info--with-icon .note__icon svg {
              display: block !important;
            }

            #print-handler .page__container .note .note__reply {
              display: block !important;
              margin: 0.5rem 0 0 2rem;
            }

            #print-handler .page__container .note .note__content {
              display: block !important;
              font-size: 1.2rem;
              margin-top: 0.1rem;
            }

            #app {
              overflow: visible !important;
            }

            .App {
              display: none !important;
            }

            html, body, #app {
              max-width: none !important;
            }
          }
      `;

        window.parent.document.head.appendChild(style);
      }
    }

    window.print();
  }
};

export const cancelPrint = () => {
  const doc = core.getDocument();
  pendingCanvases.forEach(id => doc.cancelLoadCanvas(id));
};

const getPrintableAnnotationNotes = pageNumber =>
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

const creatingImage = (pageNumber, includeAnnotations, maintainPageOrientation, isPrintCurrentView) =>
  new Promise(resolve => {
    const pageIndex = pageNumber - 1;
    let zoom = 1;
    let renderRect;
    const printRotation = getPrintRotation(pageIndex, maintainPageOrientation);
    const onCanvasLoaded = async canvas => {
      pendingCanvases = pendingCanvases.filter(pendingCanvas => pendingCanvas !== id);
      positionCanvas(canvas, pageIndex);
      let printableAnnotInfo = [];
      if (!includeAnnotations) {
        // according to Adobe, even if we exclude annotations, it will still draw widget annotations
        const annotatationsToPrint = core.getAnnotationsList().filter(annotation => {
          return annotation.PageNumber === pageNumber && !(annotation instanceof window.Annotations.WidgetAnnotation);
        });
        // store the previous Printable value so that we can set it back later
        printableAnnotInfo = annotatationsToPrint.map(annotation => ({
          annotation, printable: annotation.Printable
        }));
        // set annotations to false so that it won't show up in the printed page
        annotatationsToPrint.forEach(annotation => {
          annotation.Printable = false;
        });
      }

      if (core.getDocumentViewer().isGrayscaleModeEnabled()) {
        const ctx = canvas.getContext('2d');
        ctx.globalCompositeOperation = 'color';
        ctx.fillStyle = 'white';
        ctx.globalAlpha = 1;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'source-over';
      }

      await drawAnnotationsOnCanvas(canvas, pageNumber);

      printableAnnotInfo.forEach(info => {
        info.annotation.Printable = info.printable;
      });

      const img = document.createElement('img');
      img.src = canvas.toDataURL();
      img.onload = () => {
        resolve(img);
      };
    };

    if (isPrintCurrentView) {
      const displayMode = core.getDisplayModeObject();
      const containerElement = core.getScrollViewElement();
      const documentElement = core.getViewerElement();
      const headerElement = document.querySelector('.Header');
      const headerItemsElements = document.querySelector('.HeaderToolsContainer');

      const headerHeight = headerElement?.clientHeight + headerItemsElements?.clientHeight;
      const coordinates = [];
      coordinates[0] = displayMode.windowToPageNoRotate({
        x: Math.max(containerElement.scrollLeft, documentElement.offsetLeft),
        y: Math.max(containerElement.scrollTop + headerHeight, 0)
      }, pageNumber);
      coordinates[1] = displayMode.windowToPageNoRotate({
        x: Math.min(window.innerWidth, documentElement.offsetLeft + documentElement.offsetWidth) + containerElement.scrollLeft,
        y: window.innerHeight + containerElement.scrollTop
      }, pageNumber);
      const x1 = Math.min(coordinates[0].x, coordinates[1].x);
      const y1 = Math.min(coordinates[0].y, coordinates[1].y);
      const x2 = Math.max(coordinates[0].x, coordinates[1].x);
      const y2 = Math.max(coordinates[0].y, coordinates[1].y);

      zoom = core.getZoom();
      renderRect = { x1, y1, x2, y2 };
    }

    const id = core.getDocument().loadCanvas({
      pageNumber,
      zoom,
      pageRotation: printRotation,
      drawComplete: onCanvasLoaded,
      multiplier: PRINT_QUALITY,
      'print': true,
      renderRect
    });
    pendingCanvases.push(id);
  });

const creatingNotesPage = (annotations, pageNumber, dateFormat, language) =>
  new Promise(resolve => {
    const container = document.createElement('div');
    container.className = 'page__container';

    const header = document.createElement('div');
    header.className = 'page__header';
    header.innerHTML = `${i18n.t('option.shared.page')} ${pageNumber}`;

    container.appendChild(header);
    annotations.forEach(annotation => {
      const note = getNote(annotation, dateFormat, language);

      container.appendChild(note);
    });

    resolve(container);
  });

const getPrintRotation = (pageIndex, maintainPageOrientation) => {
  if (!maintainPageOrientation) {
    const { width, height } = core.getPageInfo(pageIndex + 1);
    const documentRotation = getDocumentRotation(pageIndex);
    let printRotation = (4 - documentRotation) % 4;

    // automatically rotate pages so that they fill up as much of the printed page as possible
    if (printRotation % 2 === 0 && width > height) {
      printRotation++;
    } else if (printRotation % 2 === 1 && height > width) {
      printRotation--;
    }
    return printRotation;
  }

  return 0;
};

const positionCanvas = (canvas, pageIndex) => {
  const { width, height } = core.getPageInfo(pageIndex + 1);
  const documentRotation = getDocumentRotation(pageIndex);
  const ctx = canvas.getContext('2d');

  const printRotation = (4 - documentRotation) % 4;
  // To check if automatic print rotation will be applied
  const isAutoRotated = ((printRotation % 2 === 0 && width > height) || (printRotation % 2 === 1 && height > width));

  // If this is pdf js and auto rotated, apply different transform
  if (window.utils.isPdfjs && isAutoRotated) {
    switch (documentRotation) {
      case 0:
        ctx.translate(height, 0);
        ctx.rotate((90 * Math.PI) / 180);
        break;
      case 1:
        ctx.translate(0, height);
        ctx.rotate((270 * Math.PI) / 180);
        break;
      case 2:
        ctx.translate(height, 0);
        ctx.rotate((-270 * Math.PI) / 180);
        break;
      case 3:
        ctx.translate(0, height);
        ctx.rotate((270 * Math.PI) / 180);
        break;
    }
  } else if (!window.utils.isPdfjs) {
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
  }
};

const drawAnnotationsOnCanvas = (canvas, pageNumber) => {
  if (core.getDocumentViewer().isGrayscaleAnnotationsModeEnabled()) {
    const ctx = canvas.getContext('2d');
    ctx.filter = 'grayscale(1)';
  }

  const widgetAnnotations = core
    .getAnnotationsList()
    .filter(annotation => annotation.PageNumber === pageNumber && annotation instanceof window.Annotations.WidgetAnnotation);
  // just draw markup annotations
  if (widgetAnnotations.length === 0) {
    return core.drawAnnotations(pageNumber, canvas);
  }
  // draw all annotations
  const widgetContainer = createWidgetContainer(pageNumber - 1);
  return core.drawAnnotations(pageNumber, canvas, true, widgetContainer).then(() => {
    document.body.appendChild(widgetContainer);
    return import(/* webpackChunkName: 'html2canvas' */ 'html2canvas').then(({ default: html2canvas }) => {
      return html2canvas(widgetContainer, {
        canvas,
        backgroundColor: null,
        scale: 1,
        logging: false,
      }).then(() => {
        document.body.removeChild(widgetContainer);
      });
    });
  });
};

const getDocumentRotation = pageIndex => {
  const pageNumber = pageIndex + 1;
  const completeRotation = core.getCompleteRotation(pageNumber);
  const viewerRotation = core.getRotation(pageNumber);

  return (completeRotation - viewerRotation + 4) % 4;
};

const getNote = (annotation, dateFormat, language) => {
  const note = document.createElement('div');
  note.className = 'note';

  const noteRoot = document.createElement('div');
  noteRoot.className = 'note__root';

  const noteRootInfo = document.createElement('div');
  noteRootInfo.className = 'note__info--with-icon';

  const noteIcon = getNoteIcon(annotation);

  noteRootInfo.appendChild(noteIcon);
  noteRootInfo.appendChild(getNoteInfo(annotation, dateFormat, language));
  noteRoot.appendChild(noteRootInfo);
  noteRoot.appendChild(getNoteContent(annotation));

  note.appendChild(noteRoot);
  annotation.getReplies().forEach(reply => {
    const noteReply = document.createElement('div');
    noteReply.className = 'note__reply';
    noteReply.appendChild(getNoteInfo(reply, dateFormat, language));
    noteReply.appendChild(getNoteContent(reply));

    note.appendChild(noteReply);
  });

  return note;
};

const getNoteIcon = annotation => {
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
      innerHTML = isInlineSvg ? icon : require(`../../assets/icons/${icon}.svg`);
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

const getNoteInfo = (annotation, dateFormat, language) => {
  const info = document.createElement('div');
  let date = dayjs(annotation.DateCreated).format(dateFormat);

  if (language) {
    date = dayjs(annotation.DateCreated).locale(language).format(dateFormat);
  }

  info.className = 'note__info';
  if (annotation.Subject === '' || annotation.Subject === null || annotation.Subject === undefined) {
    info.innerHTML = `
      ${i18n.t('option.printInfo.author')}: ${core.getDisplayAuthor(annotation['Author']) || ''} &nbsp;&nbsp;
      ${i18n.t('option.printInfo.date')}: ${date}
    `;
  } else {
    info.innerHTML = `
      ${i18n.t('option.printInfo.author')}: ${core.getDisplayAuthor(annotation['Author']) || ''} &nbsp;&nbsp;
      ${i18n.t('option.printInfo.subject')}: ${annotation.Subject} &nbsp;&nbsp;
      ${i18n.t('option.printInfo.date')}: ${date}
    `;
  }

  return info;
};

const getNoteContent = annotation => {
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

const createWidgetContainer = pageIndex => {
  const { width, height } = core.getPageInfo(pageIndex + 1);
  const widgetContainer = document.createElement('div');

  widgetContainer.id = 'printWidgetContainer';
  widgetContainer.style.width = width;
  widgetContainer.style.height = height;
  widgetContainer.style.position = 'relative';
  widgetContainer.style.top = '-10000px';

  return widgetContainer;
};
