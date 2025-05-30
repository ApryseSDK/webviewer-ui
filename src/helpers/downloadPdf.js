import { saveAs } from 'file-saver';
import core from 'core';
import { isIE } from 'helpers/device';
import fireEvent from 'helpers/fireEvent';
import Events from 'constants/events';
import actions from 'actions';
import { createRasterizedPrintPages } from 'helpers/rasterPrint';
import selectors from 'selectors';
import blobStream from 'blob-stream';
import { getSortStrategies } from 'constants/sortStrategies';
import { mapAnnotationToKey, getDataWithKey } from 'constants/map';
import range from 'lodash/range';
import getRootNode from 'helpers/getRootNode';
import { workerTypes } from 'constants/types';
import { isOfficeEditorMode } from './officeEditor';
import DataElements from 'src/constants/dataElement';
import { COMMON_COLORS } from 'constants/commonColors';

let isDownloaded = false;
let previousWatermarkSettings = { };
let previousFileName = '';

export default async (dispatch, options = {}, documentViewerKey = 1) => {
  let doc = core.getDocument(documentViewerKey);
  let temporaryModifiedDoc;

  if (!doc) {
    console.warn('Document is not loaded');
    return;
  }

  if (previousFileName !== doc?.getFilename()) {
    previousFileName = doc?.getFilename();
    isDownloaded = false;
  }

  const documentViewer = core.getDocumentViewer();
  previousWatermarkSettings = await documentViewer.getWatermark();
  if (isDownloaded) {
    documentViewer.setWatermark();
  } else {
    isDownloaded = true;
    doc.enableWatermarkApplied();
  }


  const {
    filename = doc?.getFilename() || 'document',
    includeAnnotations = true,
    externalURL,
    useDisplayAuthor = false,
    store, // Must be defined if includeComments is true
  } = options;
  let pages = options.pages;
  let includeComments = !!options.includeComments;
  const downloadAllPages = !pages || pages.length === doc.getPageCount();

  const downloadDataAsFile = (data, extension, options) => {
    const arr = new Uint8Array(data);
    const { downloadName } = options;
    let file;
    let downloadType = 'application/pdf';

    if (options.downloadType === workerTypes.OFFICE || options.downloadType === workerTypes.SPREADSHEET_EDITOR) {
      const extensionToMimetype = reverseObject(window.Core.mimeTypeToExtension);
      downloadType = extensionToMimetype[extension];
    }
    if (isIE) {
      file = new Blob([arr], { type: downloadType });
    } else {
      file = new File([arr], filename, { type: downloadType });
    }
    saveAs(file, downloadName || filename);

    dispatch(actions.closeElement(DataElements.LOADING_MODAL));
    fireEvent(Events.FILE_DOWNLOADED);
    if (temporaryModifiedDoc) {
      temporaryModifiedDoc.unloadResources();
    }

    documentViewer.setWatermark(previousWatermarkSettings);
  };

  // We currently don't convert to pdf, png, etc. for office editor.
  // Until we can do that we force the download type to be 'office'.
  // Office editor can't include comments either so we force that to false.
  if (isOfficeEditorMode()) {
    includeComments = false;
  }

  if (!options.downloadType) {
    options.downloadType = workerTypes.PDF;
  }
  const downloadAsImage = options.downloadType === 'png';

  dispatch(actions.openElement(DataElements.LOADING_MODAL));

  if (downloadAsImage) {
    if (!pages?.length) {
      pages = range(1, doc.getPageCount() + 1, 1);
    }
    const state = store.getState();
    const [
      sortStrategy,
      dateFormat,
      language,
      printQuality,
      colorMap,
    ] = [
      selectors.getSortStrategy(state),
      selectors.getPrintedNoteDateFormat(state),
      selectors.getCurrentLanguage(state),
      selectors.getPrintQuality(state),
      selectors.getColorMap(state),
    ];
    const id = 'download-handler-css';
    if (!getRootNode().querySelector(`#${id}`)) {
      const style = window.document.createElement('style');
      style.id = id;
      style.textContent = `
        img {
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

        .page__container {
          margin: 10px;
          box-sizing: border-box;
          display: flex !important;
          flex-direction: column;
          padding: 10px;
          min-height: 100%;
          min-width: 100%;
          font-size: 10px;
        }

        .page__container .page__header {
          margin-top: 2rem;
          display: block !important;
          align-self: flex-start;
          font-size: 2rem;
          margin-bottom: 2rem;
          padding-bottom: 0.6rem;
          border-bottom: 0.1rem solid black;
        }

        .page__container .note {
          display: flex !important;
          flex-direction: column;
          padding: 0.6rem;
          border: 0.1rem lightgray solid;
          border-radius: 0.4rem;
          margin-bottom: 0.5rem;
        }

        .page__container .note .note__info {
          display: block !important;
          font-size: 1.3rem;
          margin-bottom: 0.1rem;
        }

        .page__container .note .note__info--with-icon {
          display: flex !important;
        }

        .page__container .note .note__info--with-icon .note__icon {
          display: block !important;
          width: 1.65rem;
          height: 1.65rem;
          margin-top: -0.1rem;
          margin-right: 0.2rem;
        }

        .page__container .note .note__info--with-icon .note__icon path:not([fill=none]) {
          display: block !important;
          fill: currentColor;
        }

        .page__container .note .note__root .note__content {
          display: block !important;
          margin-left: 0.3rem;
        }

        .page__container .note .note__root {
          display: block !important;
        }

        .page__container .note .note__info--with-icon .note__icon svg {
          display: block !important;
        }

        .page__container .note .note__reply {
          display: block !important;
          margin: 0.5rem 0 0 2rem;
        }

        .page__container .note .note__content {
          display: block !important;
          font-size: 1.2rem;
          margin-top: 0.1rem;
        }
      `;
      window.document.head.prepend(style);
    }

    const printingOptions = {
      includeComments,
      includeAnnotations,
      maintainPageOrientation: true,
      printQuality,
      sortStrategy,
      colorMap: colorMap,
      dateFormat,
      isPrintCurrentView: false,
      language,
      createCanvases: true,
      isGrayscale: false
    };
    const createdPages = createRasterizedPrintPages(
      pages,
      printingOptions,
      undefined,
    );
    const addWhiteBackground = (dataURL) => {
      const pagePrintCanvas = document.createElement('canvas');
      const pagePrintContext = pagePrintCanvas.getContext('2d');
      return new Promise((res) => {
        const printImg = new Image();
        printImg.src = dataURL;
        printImg.onload = () => {
          pagePrintCanvas.width = printImg.width;
          pagePrintCanvas.height = printImg.height;
          pagePrintContext.fillStyle = COMMON_COLORS['white'];
          pagePrintContext.fillRect(0, 0, pagePrintCanvas.width, pagePrintCanvas.height);
          pagePrintContext.drawImage(printImg, 0, 0);
          res(pagePrintCanvas.toDataURL());
        };
      });
    };
    const html2canvas = (await import('html2canvas')).default;
    for (let page of createdPages) {
      page = await page;
      let dataURL;
      if (page instanceof HTMLElement) {
        document.body.appendChild(page);
        const canvas = await html2canvas(page, {
          backgroundColor: null,
          scale: 1,
          logging: false,
        });
        dataURL = await addWhiteBackground(canvas.toDataURL());
        document.body.removeChild(page);
      } else {
        if (doc?.getType() === workerTypes.OFFICE || doc?.getType() === workerTypes.LEGACY_OFFICE || doc?.getType() === workerTypes.OFFICE_EDITOR) {
          dataURL = await addWhiteBackground(page);
        } else {
          dataURL = page;
        }
      }
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = `${filename}.png`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    dispatch(actions.closeElement(DataElements.LOADING_MODAL));
    fireEvent(Events.FILE_DOWNLOADED);
    return;
  }

  let annotationsPromise = Promise.resolve();
  const convertToPDF = options.downloadType === workerTypes.PDF && (doc.getType() === workerTypes.OFFICE || isOfficeEditorMode() || doc.getType() === workerTypes.SPREADSHEET_EDITOR);

  if ((isOfficeEditorMode() || doc.getType() === workerTypes.SPREADSHEET_EDITOR) && convertToPDF) {
    const data = await doc.getFileData({
      downloadType: workerTypes.PDF
    });

    downloadDataAsFile(data, workerTypes.PDF, options);
    return;
  }

  if (convertToPDF || includeComments) {
    const xfdfString = await core.exportAnnotations({ fields: true, widgets: true, links: true, useDisplayAuthor }, documentViewerKey);
    const fileData = await doc.getFileData({ xfdfString, includeAnnotations, downloadType: workerTypes.PDF });
    temporaryModifiedDoc = await core.createDocument(fileData, { extension: workerTypes.PDF, filename });
    if (includeComments) {
      const canvas2pdf = await import('canvas2pdf');
      const state = store.getState();
      const [sortStrategy, colorMap] = [selectors.getSortStrategy(state), selectors.getColorMap(state)];
      const pageWidth = 612;
      const pageHeight = 792;
      const titleFontSize = 12;
      const bodyFontSize = 11;
      const cardSpacing = 8;
      const padding = 36;
      const commentPages = {};
      for (const pageNumber of pages) {
        const annotationNotes = getSortStrategies()[sortStrategy].getSortedNotes(core.getAnnotationsList(documentViewerKey).filter((annotation) => annotation.Listable &&
          annotation.PageNumber === pageNumber &&
          !annotation.isReply() &&
          !annotation.isGrouped()
        ));
        if (!annotationNotes?.length) {
          continue;
        }
        const startX = padding;
        let startY = padding;
        let ctx = new canvas2pdf.PdfContext(blobStream(), { font: 'Helvetica' });
        // eslint-disable-next-line no-inner-declarations
        async function savePage() {
          const blob = await new Promise((res) => {
            ctx.stream.on('finish', () => res(ctx.stream.toBlob('application/pdf')));
            ctx.end();
          });
          if (commentPages[pageNumber]) {
            commentPages[pageNumber].push(blob);
          } else {
            commentPages[pageNumber] = [blob];
          }
        }
        let x = startX;
        let y = startY;

        // Draw Title
        const text = `Page ${pageNumber}`;
        ctx.font = `${titleFontSize}px Helvetica`;
        ctx.fillStyle = COMMON_COLORS['black'];
        let textSize = ctx.measureText(text);
        ctx.fillText(text, x, y);
        y += textSize.height;

        for (const annotation of annotationNotes) {
          if (y + 40 > pageHeight) {
            await savePage();
            ctx = new canvas2pdf.PdfContext(blobStream(), { font: 'Helvetica' });
            x = padding;
            y = padding;
          }

          y += cardSpacing;
          startY = y;
          y += cardSpacing;
          x += cardSpacing;

          // eslint-disable-next-line no-loop-func
          let skip;
          // // Draw Image onto canvas
          // eslint-disable-next-line no-loop-func
          await new Promise((resolve) => {
            const key = mapAnnotationToKey(annotation);
            const colorProperty = colorMap[key] && colorMap[key].iconColor;
            const color = annotation[colorProperty || 'StrokeColor'].toString();
            const iconKey = getDataWithKey(key).icon;
            // eslint-disable-next-line global-require,import/no-dynamic-require
            const icon = require(`../../assets/icons/${iconKey}.svg`);
            const blob = new Blob([icon], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const img = new Image();
            img.style.color = color;
            img.src = url;
            img.onload = () => {
              ctx.drawImage(img, x, y, 24, 24);
              URL.revokeObjectURL(url);
              resolve();
            };
          });
          x += 30;
          y += 14;

          // eslint-disable-next-line no-inner-declarations,no-loop-func
          async function drawAnnotationComment(annotation, startX, isReply = false) {
            // For drawing text with wrapped lines on X axis
            async function drawTextAndWrap(text, checkNewLines = true) {
              if (checkNewLines) {
                const textArray = text.split('\n');
                if (textArray.length > 1) {
                  for (const text of textArray) {
                    await drawTextAndWrap(text, false);
                    x = startX;
                  }
                  return;
                }
              }
              const textSize = ctx.measureText(text);
              if (textSize.width + x > pageWidth - padding - cardSpacing) {
                let maxSize = (pageWidth - padding * 2 - cardSpacing * 3);
                if (isReply) {
                  maxSize -= 36;
                }
                const indexOfLastSpaceToFit = text.lastIndexOf(' ', text.length * maxSize / (textSize.width + x));
                extractProperties(await drawText(text.substring(0, indexOfLastSpaceToFit), { x, y }));
                y += textSize.height;
                x = startX;
                await drawTextAndWrap(text.substring(indexOfLastSpaceToFit + 1));
              } else {
                ctx.fillText(text, x, y);
                y += textSize.height;
              }
            }

            // For drawing text with page wrap on Y axis
            async function drawText(text, options = {}) {
              const {
                bold = false,
                fillStyle = COMMON_COLORS['black'],
                size = bodyFontSize,
                font = 'Helvetica',
              } = options;
              let { x, y } = options;
              ctx.fillStyle = fillStyle;
              ctx.font = `${size}px ${font}`;
              const textSize = ctx.measureText(text);
              if (textSize.height + y > pageHeight - padding) {
                drawRoundedRect(ctx, padding, startY, pageWidth - padding * 2, pageHeight - startY - padding, 4, 'bottom');
                await savePage();
                ctx = new canvas2pdf.PdfContext(blobStream(), { font: 'Helvetica' });
                ctx.fillStyle = fillStyle;
                ctx.font = `${size}px ${font}`;
                x = startX;
                y = padding + cardSpacing;
                startY = padding;
                skip = 'top';
              }
              ctx.fillText(text, x, y);
              if (bold) {
                ctx.fillText(text, x + 0.1, y);
                textSize.width += 0.1;
              }
              return { textSize, x, y, startY };
            }

            function extractProperties(newProperties) {
              x = newProperties.x;
              y = newProperties.y;
              startY = newProperties.startY;
              textSize = newProperties.textSize;
            }

            // Draw Author text onto canvas
            extractProperties(await drawText(annotation.Author || 'Guest', { bold: true, x, y }));
            x += textSize.width + cardSpacing;

            // Draw Date text onto canvas
            const date = new Date(annotation.DateCreated);
            const dateText = `- ${date.toLocaleString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            })}`;
            extractProperties(await drawText(dateText, { fillStyle: COMMON_COLORS['gray8'], x, y }));
            x += textSize.width + cardSpacing;

            if (!isReply) {
              // Draw Subject text onto canvas
              const subjectText = `Subject: ${annotation.Subject}`;
              const subjectTextSize = ctx.measureText(subjectText);
              if (subjectTextSize.width < 90) {
                subjectTextSize.width = 90;
              }
              ctx.fillText(subjectText, pageWidth - padding - subjectTextSize.width - cardSpacing, y);
            }

            // Position on next line
            x = startX;
            y += textSize.height + cardSpacing;
            if (!isReply) {
              y += cardSpacing;
            }

            // Draw comment text onto canvas
            ctx.fillStyle = COMMON_COLORS['black'];
            const annotContents = annotation.getContents();
            if (annotContents) {
              await drawTextAndWrap(annotation.getContents());
              y += cardSpacing;
            } else {
              y -= cardSpacing;
            }

            return y - cardSpacing;
          }

          let lastYPos = await drawAnnotationComment(annotation, x - 30);
          x = startX + 36;

          for (const reply of annotation.getReplies()) {
            y += cardSpacing;
            lastYPos = await drawAnnotationComment(reply, x, true);
          }

          drawRoundedRect(ctx, padding, startY, pageWidth - padding * 2, lastYPos - startY + cardSpacing, 4, skip);

          // Reset X Position
          x = startX;
        }

        await savePage();
      }

      let pageOffset = 1;
      for (let page of Object.keys(commentPages)) {
        page = parseInt(page);
        for (const blob of commentPages[page]) {
          const commentPagesDoc = await core.createDocument(blob, { extension: workerTypes.PDF });
          await temporaryModifiedDoc.insertPages(commentPagesDoc, [1], page + pageOffset);
          if (!downloadAllPages) {
            // eslint-disable-next-line no-loop-func
            pages = pages.map((p) => (p >= page + pageOffset ? p + 1 : p));
            pages.push(page + pageOffset);
          }
          pageOffset++;
          commentPagesDoc.unloadResources();
        }
      }

      if (downloadAllPages) {
        pages = undefined;
      } else {
        pages = pages.sort((a, b) => a - b);
      }

      annotationsPromise = Promise.resolve((await temporaryModifiedDoc.extractXFDF({ pages })).xfdfString);
    } else {
      annotationsPromise = Promise.resolve(xfdfString);
    }
  } else if (includeAnnotations && !options.xfdfString && !downloadAsImage) {
    if (options.documentToBeDownloaded) {
      annotationsPromise = Promise.resolve((await options.documentToBeDownloaded.extractXFDF(pages)).xfdfString);
    } else {
      annotationsPromise = core.exportAnnotations({ useDisplayAuthor }, documentViewerKey);
    }
  } else if (!options.xfdfString && !includeAnnotations) {
    options.xfdfString = window.Core.EMPTY_XFDF;
  }

  return annotationsPromise.then(async (xfdfString) => {
    options.xfdfString = options.xfdfString || xfdfString;
    if (!includeAnnotations) {
      options.includeAnnotations = false;
    }

    const getDownloadFilename = (name, extension) => {
      if (!name.toLowerCase().endsWith(extension)) {
        return `${name}${extension}`;
      }
      return name;
    };

    const extension = doc.getFilename().split('.').pop()?.toLowerCase() || '';
    const docType = doc?.getType();

    const isNotPDF =
      docType?.includes('video') ||
      docType === 'audio' ||
      docType === workerTypes.OFFICE ||
      docType === workerTypes.SPREADSHEET_EDITOR ||
      isOfficeEditorMode();

    const shouldUseOriginalExtension = isNotPDF && !convertToPDF;
    const desiredExtension = shouldUseOriginalExtension ? `.${extension}` : '.pdf';

    const downloadName = getDownloadFilename(filename, desiredExtension);

    // Cloning the options object to be able to delete the customDocument property if needed.
    // doc.getFileData(options) will throw an error if this customDocument property is passed in
    const clonedOptions = Object.assign({}, options);
    if (clonedOptions.documentToBeDownloaded) {
      temporaryModifiedDoc = clonedOptions.documentToBeDownloaded;
      delete clonedOptions.documentToBeDownloaded;
    }
    if (clonedOptions.store) {
      delete clonedOptions.store;
    }

    const handleError = (error) => {
      dispatch(actions.closeElement(DataElements.LOADING_MODAL));
      throw new Error(error.message);
    };

    const signatureWidgets = core.getAnnotationsList().filter((a) => a instanceof window.Core.Annotations.SignatureWidgetAnnotation);
    const signedStatues = await Promise.all(signatureWidgets.map((a) => a.isSignedDigitally()));
    const isSignedDigitally = signedStatues.includes(true);
    if (isSignedDigitally) {
      clonedOptions.flags |= window.Core.SaveOptions.INCREMENTAL;
    }

    if (externalURL) {
      const downloadIframe =
        getRootNode().querySelector('#download-iframe') ||
        document.createElement('iframe');
      downloadIframe.width = 0;
      downloadIframe.height = 0;
      downloadIframe.id = 'download-iframe';
      downloadIframe.src = null;
      document.body.appendChild(downloadIframe);
      downloadIframe.src = externalURL;
      dispatch(actions.closeElement(DataElements.LOADING_MODAL));
      fireEvent(Events.FILE_DOWNLOADED);
    } else if (pages && !downloadAllPages) {
      return (temporaryModifiedDoc || doc).extractPages(pages, options.xfdfString).then((data) => downloadDataAsFile(data, extension, { ...options, downloadName }), handleError);
    } else {
      return (temporaryModifiedDoc || doc).getFileData(clonedOptions).then((data) => downloadDataAsFile(data, extension, { ...options, downloadName }), handleError);
    }
  }).catch((error) => {
    console.warn(error);
    dispatch(actions.closeElement(DataElements.LOADING_MODAL));
  });
};

function drawRoundedRect(ctx, x, y, width, height, radius, skip = undefined) {
  const skipTop = skip === 'top';
  const skipBottom = skip === 'bottom';
  ctx.beginPath();
  ctx.strokeStyle = 'lightgray';
  ctx.lineWidth = 1;
  if (skipTop) {
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + height - radius);
    ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
    ctx.lineTo(x + width - radius, y + height);
    ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
    ctx.lineTo(x + width, y);
  } else if (skipBottom) {
    ctx.moveTo(x, y + height);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height);
  } else {
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
  ctx.stroke();
}

function reverseObject(obj) {
  return Object.assign({}, ...(Object.entries(obj).map(([key, value]) => ({ [value]: key }))));
}
