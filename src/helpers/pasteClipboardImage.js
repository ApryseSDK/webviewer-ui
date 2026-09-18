import core from 'core';

const SUPPORTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png']);
const EXPECTED_CLIPBOARD_ERROR_NAMES = new Set(['NotAllowedError', 'NotFoundError', 'SecurityError']);

const getImageFile = (clipboardData) => {
  const file = Array.from(clipboardData?.files || [])
    .find((clipboardFile) => SUPPORTED_IMAGE_TYPES.has(clipboardFile.type));
  if (file) {
    return file;
  }

  return Array.from(clipboardData?.items || [])
    .filter((item) => item.kind === 'file')
    .map((item) => item.getAsFile())
    .find((clipboardFile) => clipboardFile && SUPPORTED_IMAGE_TYPES.has(clipboardFile.type));
};

const findHtmlTagEnd = (html, tagStart) => {
  let quote = null;
  for (let index = tagStart + 1; index < html.length; index++) {
    const character = html[index];
    if (quote) {
      if (character === quote) {
        quote = null;
      }
      continue;
    }

    if (character === '"' || character === "'") {
      quote = character;
    } else if (character === '>') {
      return index;
    }
  }

  return -1;
};

const getHtmlTagsAndText = (html) => {
  const tags = [];
  const textParts = [];
  let index = 0;

  while (index < html.length) {
    const tagStart = html.indexOf('<', index);
    if (tagStart === -1) {
      textParts.push(html.slice(index));
      break;
    }

    textParts.push(html.slice(index, tagStart));
    if (html.startsWith('<!--', tagStart)) {
      const commentEnd = html.indexOf('-->', tagStart + 4);
      index = commentEnd === -1 ? html.length : commentEnd + 3;
      continue;
    }

    const tagEnd = findHtmlTagEnd(html, tagStart);
    if (tagEnd === -1) {
      textParts.push(html.slice(tagStart));
      break;
    }

    tags.push(html.slice(tagStart, tagEnd + 1));
    index = tagEnd + 1;
  }

  return {
    tags,
    text: textParts.join('').replace(/&(?:nbsp|#160|#x0*a0);/gi, ' ').trim(),
  };
};

const getImageFileFromHtml = (html) => {
  if (!html) {
    return null;
  }

  const { tags, text } = getHtmlTagsAndText(html);
  const imageTags = tags.filter((tag) => /^<img(?:\s|\/?>)/i.test(tag));
  if (imageTags.length !== 1 || text) {
    return null;
  }

  const source = imageTags[0].match(/\bsrc\s*=\s*(["'])(.*?)\1/is)?.[2];
  const dataUrlMatch = source?.match(/^data:(image\/(?:jpeg|png));base64,(.+)$/is);
  const imageType = dataUrlMatch?.[1].toLowerCase();
  if (!SUPPORTED_IMAGE_TYPES.has(imageType)) {
    return null;
  }

  try {
    const decodedImage = atob(dataUrlMatch[2]);
    const image = new Uint8Array(decodedImage.length);
    for (let index = 0; index < decodedImage.length; index++) {
      image[index] = decodedImage.codePointAt(index);
    }
    const extension = imageType === 'image/png' ? 'png' : 'jpg';
    return new File([image], `clipboard-image.${extension}`, { type: imageType });
  } catch {
    return null;
  }
};

const getNavigatorClipboardImage = async () => {
  try {
    const clipboardItems = await navigator.clipboard?.read?.();
    for (const item of clipboardItems || []) {
      const imageType = item.types.find((type) => SUPPORTED_IMAGE_TYPES.has(type));
      if (imageType) {
        const image = await item.getType(imageType);
        const extension = imageType === 'image/png' ? 'png' : 'jpg';
        return new File([image], `clipboard-image.${extension}`, { type: imageType });
      }

      if (item.types.includes('text/html')) {
        const html = await item.getType('text/html').then((blob) => blob.text());
        const image = getImageFileFromHtml(html);
        if (image) {
          return image;
        }
      }
    }
  } catch (error) {
    if (!EXPECTED_CLIPBOARD_ERROR_NAMES.has(error?.name)) {
      console.warn('Failed to read an image from the navigator clipboard.', error);
    }
  }

  return null;
};

export default async function pasteClipboardImage(event, documentViewerKey) {
  const eventFile = getImageFile(event.clipboardData);
  const eventHtml = event.clipboardData?.getData?.('text/html');
  const file = eventFile || getImageFileFromHtml(eventHtml) || await getNavigatorClipboardImage();
  if (!file) {
    return false;
  }

  const documentViewer = core.getDocumentViewer(documentViewerKey);
  const annotationManager = documentViewer.getAnnotationManager();
  if (annotationManager.isReadOnlyModeEnabled()) {
    return false;
  }

  const pageCoordinates = documentViewer.getViewerCoordinatesFromMouseLocation();
  if (!pageCoordinates) {
    return false;
  }

  event.preventDefault();
  const stampTool = documentViewer.getTool(window.Core.Tools.ToolNames.STAMP);
  const annotation = await stampTool.createAnnotationFromFile(
    file,
    pageCoordinates,
  );
  if (!annotation) {
    return false;
  }

  annotationManager.deselectAllAnnotations();
  annotationManager.selectAnnotation(annotation);
  return true;
}