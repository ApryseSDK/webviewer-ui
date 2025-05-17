
import isString from 'lodash/isString';

const getFileExtension = (src, options) => {
  if (options?.extension) {
    return options.extension.toLowerCase();
  }

  if (!src) {
    return null;
  }

  if (src instanceof File) {
    return src.name.split('.').pop().toLowerCase();
  }

  const isBinarySource = src instanceof Blob || src instanceof ArrayBuffer;
  if (isBinarySource && options?.filename) {
    return options.filename.split('.').pop().toLowerCase();
  }

  if (isString(src)) {
    // Remove query params and hash fragments before extracting extension
    const cleanSrc = src.split('?')[0].split('#')[0];
    return cleanSrc.split('.').pop().toLowerCase();
  }

  return null;
};

export default getFileExtension;