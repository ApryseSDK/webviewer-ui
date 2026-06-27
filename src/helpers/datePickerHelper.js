const DAYJS_TO_PDF_TOKEN_MAP = {
  YYYY: 'yyyy',
  YY: 'yy',
  MMMM: 'mmmm',
  MMM: 'mmm',
  MM: 'mm',
  M: 'm',
  DD: 'dd',
  D: 'd',
  Do: 'Do',
  dddd: 'dddd',
  ddd: 'ddd',
};

const DAYJS_TOKEN_REGEX = /YYYY|YY|MMMM|MMM|MM|M|DD|Do|D|dddd|ddd/g;
export const DEFAULT_DATE_PICKER_FORMAT = 'm/d/yy';

const convertDayJsFormatToPdfFormat = (format = '') => {
  return format.replace(DAYJS_TOKEN_REGEX, (token) => DAYJS_TO_PDF_TOKEN_MAP[token] || token);
};

const convertDateFormatToPdfFormat = (dateTimeFormat = {}) => {
  const date = convertDayJsFormatToPdfFormat(dateTimeFormat?.date || '').trim();
  return date;
};

export const getDatePickerDateFormats = (dateTimeFormats = []) => {
  const uniqueFormats = new Set();

  // Always include the core date picker default so the initial selected value
  // can be resolved even when configured dateTimeFormats do not contain it.
  uniqueFormats.add(DEFAULT_DATE_PICKER_FORMAT);

  dateTimeFormats.forEach((dateTimeFormat) => {
    const pdfFormat = convertDateFormatToPdfFormat(dateTimeFormat);
    if (pdfFormat) {
      uniqueFormats.add(pdfFormat);
    }
  });

  return [...uniqueFormats];
};