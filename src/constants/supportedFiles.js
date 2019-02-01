export const supportedPDFExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
export const supportedOfficeExtensions = ['docx', 'xlsx', 'pptx', 'md'];
export const supportedBlackboxExtensions = ['docx', 'xlsx', 'pptx', 'doc', 'xls', 'csv', 'ppt', 'htm', 'html', 'tif', 'tiff', 'jp2', 'md', 'txt', 'pdf', 'jpg', 'jpeg', 'png', 'rtf', 'odf', 'odt', 'odg', 'odp', 'ods', 'dwg', 'dgn', 'dxf'];
export const supportedExtensions = [...supportedPDFExtensions, ...supportedOfficeExtensions, ...supportedBlackboxExtensions, 'xod'].filter((extension, index, self) => self.indexOf(extension) === index);
export const supportedClientOnlyExtensions = [...supportedPDFExtensions, ...supportedOfficeExtensions];