export const supportedPDFExtensions = [
  'pdf', 
  'jpg', 
  'jpeg', 
  'png'
];
export const supportedOfficeExtensions = [
  'docx', 
  'xlsx', 
  'pptx', 
  'md'
];
export const supportedClientOnlyExtensions = [
  'xod',
  ...supportedPDFExtensions, 
  ...supportedOfficeExtensions
];
export const supportedBlackboxExtensions = [
  ...supportedClientOnlyExtensions,
  'doc',
  'xls',
  'csv',
  'ppt',
  'htm',
  'html',
  'tif',
  'tiff',
  'jp2',
  'txt',
  'rtf',
  'odf',
  'odt',
  'odg',
  'odp',
  'ods',
  'dwg',
  'dgn',
  'dxf'
];
export const supportedExtensions = [
  ...supportedClientOnlyExtensions,
  ...supportedBlackboxExtensions
];