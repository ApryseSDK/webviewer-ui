import isString from 'lodash/isString';

const getFilename = (src, options = {}) => {
  if (options?.filename) {
    return options.filename;
  }

  if (!src) {
    return null;
  }

  if (isString(src)) {
    return src.substring(src.lastIndexOf('/') + 1);
  } else if (src instanceof window.Core.Document && src.getFilename && src.getFilename()) {
    return src.getFilename();
  } else if (src instanceof File || Object.prototype.toString.call(src) === '[object File]') {
    return src['name'];
  }

  return null;
};

export default getFilename;