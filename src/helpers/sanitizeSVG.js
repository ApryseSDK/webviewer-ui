import DOMPurify from 'dompurify';

const SVG_MIME_TYPE = 'image/svg+xml';

const hasFileSize = (file) => {
  return file.size !== undefined;
};

// Taken from https://github.com/mattkrick/sanitize-svg/blob/master/src/sanitizeSVG.ts#L31
const readAsText = (svg) => {
  return new Promise((resolve) => {
    if (!hasFileSize(svg)) {
      resolve(svg.toString('utf-8'));
    } else {
      const fileReader = new FileReader();
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.readAsText(svg);
    }
  });
};

export const isSVG = (file) => {
  return file.type === SVG_MIME_TYPE;
};

export const sanitizeSVG = async (file) => {
  const svgText = await readAsText(file);
  if (!svgText) {
    return { svg: file };
  }

  const forbiddenTags = [];
  DOMPurify.addHook('uponSanitizeElement', (_, hookEvent) => {
    const { tagName, allowedTags } = hookEvent;
    if (!allowedTags[tagName]) {
      forbiddenTags.push(tagName);
    }
  });

  const clean = DOMPurify.sanitize(svgText);
  const svg = new Blob([clean], { type: SVG_MIME_TYPE });
  return { svg, isDirty: forbiddenTags.length > 0 };
};