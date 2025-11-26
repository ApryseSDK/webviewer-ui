import { isOfficeEditorMode } from './officeEditor';
import { workerTypes } from 'constants/types';

/**
 * Extracts the file extension from a document's filename.
 * @param {Core.Document} doc - The document object
 * @returns {string} The lowercase file extension without the dot, or empty string if no extension exists
 * @ignore
 * @example
 * getDocumentFileExtension(doc) // returns 'pdf' for 'document.pdf'
 * getDocumentFileExtension(doc) // returns 'xlsx' for 'report.data.xlsx'
 * getDocumentFileExtension(doc) // returns '' for 'document'
 */
export function getDocumentFileExtension(doc) {
  const filename = doc.getFilename();
  const parts = filename.split('.');
  if (parts.length <= 1) {
    return '';
  }

  return parts.pop()?.toLowerCase() || '';
}

/**
 * Determines the appropriate download filename with the correct file extension.
 * Handles special cases for Office Editor mode, PDF conversion, and various document types.
 *
 * @param {string} filename - The base filename for the download
 * @param {Core.Document} doc - The document object
 * @param {string} downloadType - The desired download type (e.g., workerTypes.PDF)
 * @returns {string} The filename with the appropriate extension appended if needed
 * @ignore
 * @description
 * Extension logic:
 * - In Office Editor mode: Uses .docx extension for non-PDF downloads
 * - Converting to PDF: Uses .pdf extension
 * - Video/audio/office files: Preserves original extension when not converting
 * - Case-insensitive extension matching to avoid duplicates
 *
 * @example
 * // Office Editor mode with .doc file
 * getDownloadFilename('report', doc, workerTypes.OFFICE) // returns 'report.docx'
 *
 * // Converting Office document to PDF
 * getDownloadFilename('document', doc, workerTypes.PDF) // returns 'document.pdf'
 *
 * // Video file (preserves extension)
 * getDownloadFilename('video', doc, 'video/mp4') // returns 'video.mp4'
 *
 * // Already has extension
 * getDownloadFilename('file.pdf', doc, workerTypes.PDF) // returns 'file.pdf'
 */
export function getDownloadFilename(filename, doc, downloadType) {
  const extension = getDocumentFileExtension(doc);
  const downloadFileExtensionToUse = isOfficeEditorMode() ? 'docx' : extension;
  const convertToPDF = downloadType === workerTypes.PDF && (doc.getType() === workerTypes.OFFICE || isOfficeEditorMode() || doc.getType() === workerTypes.SPREADSHEET_EDITOR);

  const docType = doc?.getType();

  const isNotPDF =
    docType?.includes('video') ||
    docType === 'audio' ||
    docType === workerTypes.OFFICE ||
    docType === workerTypes.SPREADSHEET_EDITOR ||
    isOfficeEditorMode();

  const shouldUseOriginalExtension = isNotPDF && !convertToPDF;
  const desiredExtension = shouldUseOriginalExtension ? `.${downloadFileExtensionToUse}` : '.pdf';

  if (!filename.toLowerCase().endsWith(desiredExtension)) {
    return `${filename}${desiredExtension}`;
  }
  return filename;
}
