/* eslint-disable no-unsanitized/property */
import i18n from 'i18next';

import actions from 'actions';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

import core from 'core';

import { createRasterizedPrintPages } from 'helpers/rasterPrint';
import { isSafari, isChromeOniOS, isFirefoxOniOS } from 'helpers/device';
import { processEmbeddedPrintOptions, canEmbedPrint, embeddedPrintNoneSupportedOptions, printEmbeddedPDF } from 'helpers/embeddedPrint';

import getRootNode from './getRootNode';

const PRINT_QUALITY = 1;

const printResetStyle = `
#print-handler {
  display: none;
}

@media print {
  * {
    display: none! important;
  }

  @page {
    margin: 0; /* Set all margins to 0 */
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
    margin: 0 !important;
  }

  #print-handler {
    display: block !important;
    height: 100%;
    width: 100%;
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

dayjs.extend(LocalizedFormat);

const getResetPrintStyle = () => {
  const style = document.createElement('style');
  style.id = 'print-handler-css';
  style.textContent = printResetStyle;
  return style;
};

export const printPages = (pages) => {
  const printHandler = getRootNode().getElementById('print-handler');
  printHandler.innerHTML = '';
  const isApryseWebViewerWebComponent = window.isApryseWebViewerWebComponent;

  if (isApryseWebViewerWebComponent) {
    // In the Web component mode, the window.print function uses the top window as target for printing.
    // The approach here is to teleport the print handler div to the top parent and inject some CSS
    // to make it print nicely
    printHandler.parentNode.removeChild(printHandler);
    document.body.appendChild(printHandler);
    if (!document.getElementById('print-handler-css')) {
      const style = getResetPrintStyle();
      document.head.appendChild(style);
    }
  }

  const fragment = document.createDocumentFragment();
  pages.forEach((page) => {
    fragment.appendChild(page);
  });

  printHandler.appendChild(fragment);

  const isNativeSafariBrowser = isSafari && !(isChromeOniOS || isFirefoxOniOS);

  if (!isNativeSafariBrowser) {
    // It looks like both Chrome and Firefox (on iOS) use the top window as target for window.print instead of the frame where it was triggered,
    // so we need to teleport the print handler div to the top parent and inject some CSS to make it print nicely.
    // This can be removed when Chrome and Firefox for iOS respect the origin frame as the actual target for window.print
    if (isChromeOniOS || isFirefoxOniOS) {
      const node = isApryseWebViewerWebComponent ? getRootNode() : window.parent.document;
      if (node.getElementById('print-handler')) {
        node.getElementById('print-handler').remove();
      }
      node.appendChild(printHandler.cloneNode(true));

      if (!node.getElementById('print-handler-css')) {
        const style = getResetPrintStyle();
        const node = isApryseWebViewerWebComponent ? getRootNode() : window.parent.document.head;
        node.appendChild(style);
      }
    }

    if (!window.isApryseWebViewerWebComponent) {
      if (printHandler.children.length === 1) {
        printHandler.parentElement.setAttribute('style', 'height: 99.99%;');
      } else {
        printHandler.parentElement.setAttribute('style', 'height: 100%;');
      }
    }
  }
  printDocument(isNativeSafariBrowser);
};

const printDocument = (isNativeSafariBrowser) => {
  const doc = core.getDocument();
  const tempTitle = window.parent.document.title;

  if (!doc) {
    return;
  }

  const fileName = doc.getFilename();
  const fileNameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;

  const onBeforePrint = () => {
    window.parent.document.title = fileNameWithoutExtension;
  };

  const onAfterPrint = () => {
    window.parent.document.title = tempTitle;

    if (window.isApryseWebViewerWebComponent) {
      const printHandler = document.getElementById('print-handler');
      document.body.removeChild(printHandler);
      const parentElement = getRootNode().querySelector('.PrintHandler');
      parentElement.appendChild(printHandler);
    }
  };

  window.addEventListener('beforeprint', onBeforePrint, { once: true });
  window.addEventListener('afterprint', onAfterPrint, { once: true });
  if (isNativeSafariBrowser) {
    // Print for Safari browser. Makes Safari 11 consistently work.
    document.execCommand('print');
  } else {
    window.print();
  }
};
const pagesToPrintPageArray = (pagesToPrint) => {
  const pageCount = core.getTotalPages();
  return pagesToPrint ?? Array.from({ length: pageCount }, (_, i) => (i + 1));
};

const serverPrint = (bbURLPromise) => {
  const printPage = window.open('', '_blank');
  // eslint-disable-next-line no-unsanitized/method
  printPage.document.write(i18n.t('message.preparingToPrint'));
  bbURLPromise.then((result) => {
    printPage.location.href = result.url;
  });
};

export const print = async (dispatch, useClientSidePrint, isEmbedPrintSupported, sortStrategy, colorMap, options = {}) => {
  const {
    includeAnnotations,
    includeComments,
    maintainPageOrientation,
    onProgress,
    printQuality = PRINT_QUALITY,
    printWithoutModal = false,
    language,
    isPrintCurrentView,
    printedNoteDateFormat: dateFormat,
    isGrayscale = false,
    timezone,
    pagesToPrint,
  } = options;

  const document = core.getDocument();
  const annotationManager = core.getAnnotationManager();

  if (!document) {
    return;
  }

  const bbURLPromise = core.getPrintablePDF();
  const isWebViewerServerDocument = bbURLPromise && typeof bbURLPromise.then === 'function';
  const isServerPrintSupported = !isGrayscale && isWebViewerServerDocument;

  const shouldUseServerPrint = isServerPrintSupported && !useClientSidePrint;

  if (shouldUseServerPrint) {
    serverPrint(bbURLPromise);
    return;
  }

  if (!printWithoutModal) {
    dispatch(actions.openElements(['printModal']));
    return;
  }
  const pageArray = isPrintCurrentView ? [core.getDocumentViewer().getCurrentPage()] : pagesToPrintPageArray(pagesToPrint);
  options.pagesToPrint = pageArray;
  options.isAlwaysPrintAnnotationsInColorEnabled = core.getDocumentViewer().isAlwaysPrintAnnotationsInColorEnabled();

  if (canEmbedPrint(isEmbedPrintSupported)) {
    embeddedPrintNoneSupportedOptions(options);
    printEmbeddedPDF(await processEmbeddedPrintOptions(options, document, annotationManager));
  } else if (includeAnnotations || includeComments || printWithoutModal) {
    const printOptions = {
      includeComments,
      includeAnnotations,
      maintainPageOrientation,
      printQuality,
      sortStrategy,
      colorMap: colorMap,
      dateFormat,
      isPrintCurrentView,
      language,
      timezone,
      createCanvases: false,
      isGrayscale
    };
    const createPages = createRasterizedPrintPages(
      pageArray,
      printOptions,
      onProgress,
    );
    Promise.all(createPages)
      .then((pages) => {
        printPages(pages);
      })
      .catch((e) => {
        console.error(e);
      });
  }
};