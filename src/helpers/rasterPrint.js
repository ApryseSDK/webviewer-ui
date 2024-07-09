import i18n from 'i18next';

import core from 'core';

import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

import { adjustListBoxForPrint } from './printHTMLToCanvasHelper';
import { mapAnnotationToKey, getDataWithKey } from 'constants/map';
import { getGrayscaleDarknessFactor } from './printGrayscaleDarknessFactor';
import { getCurrentViewRect, doesCurrentViewContainEntirePage } from './printCurrentViewHelper';
import { getSortStrategies } from 'constants/sortStrategies';

let pendingCanvases = [];
let colorMap;
let PRINT_QUALITY = 1;

dayjs.extend(LocalizedFormat);

const calculatePageZoom = (pageNumber) => {
  let zoom = 1;

  // cap the size that we render the page at when printing
  const pageInfo = core.getDocument().getPageInfo(pageNumber);
  const pageSize = Math.sqrt(pageInfo.width * pageInfo.height);
  const pageSizeTarget = 2500;

  if (pageSize > pageSizeTarget) {
    zoom = pageSizeTarget / pageSize;
  }

  return zoom;
};

const getNote = (annotation, dateFormat, language, timezone) => {
  const note = document.createElement('div');
  note.className = 'note';

  const noteRoot = document.createElement('div');
  noteRoot.className = 'note__root';

  const noteRootInfo = document.createElement('div');
  noteRootInfo.className = 'note__info--with-icon';

  const noteIcon = getNoteIcon(annotation);

  noteRootInfo.appendChild(noteIcon);
  noteRootInfo.appendChild(getNoteInfo(annotation, dateFormat, language, timezone));
  noteRoot.appendChild(noteRootInfo);
  noteRoot.appendChild(getNoteContent(annotation));

  note.appendChild(noteRoot);
  annotation.getReplies().forEach((reply) => {
    const noteReply = document.createElement('div');
    noteReply.className = 'note__reply';
    noteReply.appendChild(getNoteInfo(reply, dateFormat, language, timezone));
    noteReply.appendChild(getNoteContent(reply));

    note.appendChild(noteReply);
  });

  return note;
};

const getNoteInfo = (annotation, dateFormat, language, timezone) => {
  let dateCreated;
  if (timezone) {
    const datetimeStr = annotation.DateCreated.toLocaleString('en-US', { timeZone: timezone });
    dateCreated = new Date(datetimeStr);
  } else {
    dateCreated = annotation.DateCreated;
  }
  const info = document.createElement('div');
  let date = dayjs(dateCreated).format(dateFormat);

  if (language) {
    date = dayjs(dateCreated).locale(language).format(dateFormat);
  }

  info.className = 'note__info';
  if (annotation.Subject === '' || annotation.Subject === null || annotation.Subject === undefined) {
    info.textContent = `
      ${i18n.t('option.printInfo.author')}: ${core.getDisplayAuthor(annotation['Author']) || ''} 
      ${i18n.t('option.printInfo.date')}: ${date}
    `;
  } else {
    info.textContent = `
      ${i18n.t('option.printInfo.author')}: ${core.getDisplayAuthor(annotation['Author']) || ''} 
      ${i18n.t('option.printInfo.subject')}: ${annotation.Subject} 
      ${i18n.t('option.printInfo.date')}: ${date}
    `;
  }

  return info;
};

const getNoteContent = (annotation) => {
  const contentElement = document.createElement('div');
  const contentText = annotation.getContents();

  contentElement.className = 'note__content';
  if (contentText) {
    // ensure that new lines are preserved and rendered properly
    contentElement.style.whiteSpace = 'pre-wrap';
    contentElement.textContent = `${contentText}`;
  }
  return contentElement;
};

const getNoteIcon = (annotation) => {
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
      // eslint-disable-next-line import/no-dynamic-require
      innerHTML = isInlineSvg ? icon : require(`../../assets/icons/${icon}.svg`);
    } else {
      innerHTML = annotation.Subject;
    }

    const parser = new DOMParser();
    const parsedDoc = parser.parseFromString(innerHTML, 'text/html');
    const newEle = parsedDoc.body.childNodes;

    noteIcon = document.createElement('div');
    newEle.forEach((node) => {
      noteIcon.appendChild(node);
    });
  }

  noteIcon.className = 'note__icon';
  noteIcon.style.color = iconColor && annotation[iconColor].toHexString();
  return noteIcon;
};

export const creatingNotesPage = (annotations, pageNumber, dateFormat, language, timezone) => new Promise((resolve) => {
  const container = document.createElement('div');
  container.className = 'page__container';

  const header = document.createElement('div');
  header.className = 'page__header';
  header.textContent = `${i18n.t('option.shared.page')} ${pageNumber}`;

  container.appendChild(header);
  annotations.forEach((annotation) => {
    const note = getNote(annotation, dateFormat, language, timezone);

    container.appendChild(note);
  });

  resolve(container);
});

const createWidgetContainer = (pageIndex) => {
  const { width, height } = core.getPageInfo(pageIndex + 1);
  const widgetContainer = document.createElement('div');

  widgetContainer.id = 'printWidgetContainer';
  widgetContainer.style.width = width;
  widgetContainer.style.height = height;
  widgetContainer.style.position = 'relative';
  widgetContainer.style.top = '-10000px';

  return widgetContainer;
};

export const getPrintableAnnotationNotes = (pageNumber) => core
  .getAnnotationsList()
  .filter(
    (annotation) => annotation.Listable &&
      annotation.PageNumber === pageNumber &&
      !annotation.isReply() &&
      !annotation.isGrouped() &&
      annotation.Printable,
  );

export const cancelPrint = () => {
  const doc = core.getDocument();
  pendingCanvases.forEach((id) => doc.cancelLoadCanvas(id));
};

const drawAnnotationsOnCanvas = async (canvas, pageNumber, isGrayscale) => {
  if (isGrayscale) {
    const ctx = canvas.getContext('2d');
    ctx.filter = 'grayscale(1)';
  }

  const widgetAnnotations = core
    .getAnnotationsList()
    .filter((annotation) => annotation.PageNumber === pageNumber && annotation instanceof window.Core.Annotations.WidgetAnnotation);

  const hasWidgetAnnotations = widgetAnnotations.length > 0;
  if (!hasWidgetAnnotations) {
    return core.drawAnnotations(pageNumber, canvas);
  }

  const widgetContainer = createWidgetContainer(pageNumber - 1);
  await core.drawAnnotations(pageNumber, canvas, true, widgetContainer);
  adjustListBoxForPrint(widgetContainer);
  document.body.appendChild(widgetContainer);

  const { default: html2canvas } = await import(/* webpackChunkName: 'html2canvas' */ 'html2canvas');

  await html2canvas(widgetContainer, {
    canvas,
    backgroundColor: null,
    scale: 1,
    logging: false
  });

  document.body.removeChild(widgetContainer);
};

const getDocumentRotation = (pageIndex) => {
  const pageNumber = pageIndex + 1;
  const completeRotation = core.getCompleteRotation(pageNumber);
  const viewerRotation = core.getRotation(pageNumber);

  return (completeRotation - viewerRotation + 4) % 4;
};

const positionCanvas = (canvas, pageIndex) => {
  const { width, height } = core.getPageInfo(pageIndex + 1);
  const documentRotation = getDocumentRotation(pageIndex);
  const ctx = canvas.getContext('2d');

  const printRotation = (4 - documentRotation) % 4;
  // To check if automatic print rotation will be applied
  const isAutoRotated = ((printRotation % 2 === 0 && width > height) || (printRotation % 2 === 1 && height > width));

  // If this is pdf js and auto rotated, apply different transform
  if (window.Core.isPdfjs && isAutoRotated) {
    switch (documentRotation) {
      case 0:
        ctx.translate(height, 0);
        ctx.rotate((90 * Math.PI) / 180);
        break;
      case 1:
      case 3:
        ctx.translate(0, height);
        ctx.rotate((270 * Math.PI) / 180);
        break;
      case 2:
        ctx.translate(height, 0);
        ctx.rotate((-270 * Math.PI) / 180);
        break;
    }
  } else if (!window.Core.isPdfjs) {
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

const getPrintRotation = (pageIndex, maintainPageOrientation) => {
  if (!maintainPageOrientation) {
    const { width, height } = core.getPageInfo(pageIndex + 1);
    const documentRotation = getDocumentRotation(pageIndex);
    let printRotation = (4 - documentRotation) % 4;

    // automatically rotate pages so that they fill up as much of the printed page as possible
    if (printRotation % 2 === 0 && width > height) {
      printRotation++;
    } else if (printRotation % 2 === 1 && height > width) {
      printRotation = 0;
    }
    return printRotation;
  }

  return core.getRotation(pageIndex + 1);
};

const creatingImage = (pageNumber, includeAnnotations, maintainPageOrientation, isCurrentView, createCanvases = false, isGrayscale = false) => new Promise((resolve) => {
  const pageIndex = pageNumber - 1;
  const printRotation = getPrintRotation(pageIndex, maintainPageOrientation);
  const onCanvasLoaded = async (canvas) => {
    pendingCanvases = pendingCanvases.filter((pendingCanvas) => pendingCanvas !== id);
    positionCanvas(canvas, pageIndex);
    let printableAnnotInfo = [];
    if (!includeAnnotations) {
      // according to Adobe, even if we exclude annotations, it will still draw widget annotations
      const annotatationsToPrint = core.getAnnotationsList().filter((annotation) => {
        return annotation.PageNumber === pageNumber && !(annotation instanceof window.Core.Annotations.WidgetAnnotation);
      });
      // store the previous Printable value so that we can set it back later
      printableAnnotInfo = annotatationsToPrint.map((annotation) => ({
        annotation, printable: annotation.Printable
      }));
      // set annotations to false so that it won't show up in the printed page
      annotatationsToPrint.forEach((annotation) => {
        annotation.Printable = false;
      });
    }

    const grayscaleDarknessFactor = getGrayscaleDarknessFactor();

    if (isGrayscale && grayscaleDarknessFactor >= 1) {
      const ctx = canvas.getContext('2d');
      // Get the old transform before reset because the annotation canvas will need it
      const oldTransform = ctx.getTransform();
      // Reset underlying transforms. This seems only for DWG (WVS) but could happen elsewhere.
      ctx.resetTransform();
      ctx.globalCompositeOperation = 'color';
      ctx.fillStyle = 'white';
      ctx.globalAlpha = 1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';
      ctx.setTransform(oldTransform);
    } else if (isGrayscale) {
      const ctx = canvas.getContext('2d');
      ctx.globalCompositeOperation = 'source-over';
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { data } = imageData;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255) {
          continue;
        }
        data[i] = data[i + 1] = data[i + 2] = ((data[i] + data[i + 1] + data[i + 2]) / 3) * grayscaleDarknessFactor;
      }
      ctx.putImageData(imageData, 0, 0);
    }

    const alwaysPrintAnnotationsInColor = core.getDocumentViewer().isAlwaysPrintAnnotationsInColorEnabled();
    const drawAnnotationsInGrayscale = isGrayscale && !alwaysPrintAnnotationsInColor;
    await drawAnnotationsOnCanvas(canvas, pageNumber, drawAnnotationsInGrayscale);

    printableAnnotInfo.forEach((info) => {
      info.annotation.Printable = info.printable;
    });

    if (createCanvases) {
      resolve(canvas.toDataURL());
    }

    const img = document.createElement('img');
    img.src = canvas.toDataURL();
    img.onload = () => {
      resolve(img);
    };
  };

  let zoom = 1;
  let renderRect;
  if (isCurrentView) {
    zoom = core.getZoom();
    renderRect = getCurrentViewRect(pageNumber);

    const pageDimensions = core.getDocument().getPageInfo(pageNumber);
    if (doesCurrentViewContainEntirePage(renderRect, pageDimensions)) {
      renderRect = undefined;
    }
  }

  if (!renderRect) {
    zoom = calculatePageZoom(pageNumber);
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

// printOptions = includeComments, includeAnnotations, maintainPageOrientation, printQuality, sortStrategy, colorMap, dateFormat, isCurrentView, language, timezone, createCanvases, isGrayscale
export const creatingPages = (pagesToPrint, printOptions, onProgress) => {
  const createdPages = [];
  pendingCanvases = [];
  PRINT_QUALITY = printOptions?.printQuality;
  colorMap = printOptions?.colorMap;

  pagesToPrint.forEach((pageNumber) => {
    createdPages.push(creatingImage(pageNumber,
      printOptions?.includeAnnotations,
      printOptions?.maintainPageOrientation,
      printOptions?.isCurrentView,
      printOptions?.createCanvases,
      printOptions?.isGrayscale));

    if (onProgress) {
      createdPages[createdPages.length - 1].then((htmlElement) => {
        onProgress(pageNumber, htmlElement);
      });
    }

    const printableAnnotationNotes = getPrintableAnnotationNotes(pageNumber);
    if (printOptions?.includeComments && printableAnnotationNotes) {
      const sortedNotes = getSortStrategies()[printOptions?.sortStrategy].getSortedNotes(printableAnnotationNotes);
      if (sortedNotes.length) {
        createdPages.push(creatingNotesPage(sortedNotes, pageNumber, printOptions?.dateFormat, printOptions?.language, printOptions?.timezone));
      }
      if (onProgress) {
        createdPages[createdPages.length - 1].then((htmlElement) => {
          onProgress(pageNumber, htmlElement);
        });
      }
    }
  });

  return createdPages;
};