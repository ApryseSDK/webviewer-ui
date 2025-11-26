import { getDocumentFileExtension, getDownloadFilename } from './downloadHelper';
import * as officeEditor from './officeEditor';
import { workerTypes } from 'constants/types';

jest.mock('./officeEditor');
jest.mock('constants/types', () => ({
  workerTypes: {
    PDF: 'pdf',
    OFFICE: 'office',
    SPREADSHEET_EDITOR: 'spreadsheet',
  },
}));

describe('getDocumentFileExtension', () => {
  let mockDoc;

  beforeEach(() => {
    mockDoc = {
      getFilename: jest.fn(),
    };
  });

  it('should extract extension from filename', () => {
    mockDoc.getFilename.mockReturnValue('document.pdf');
    expect(getDocumentFileExtension(mockDoc)).toBe('pdf');
  });

  it('should return lowercase extension', () => {
    mockDoc.getFilename.mockReturnValue('document.PDF');
    expect(getDocumentFileExtension(mockDoc)).toBe('pdf');
  });

  it('should handle multiple dots in filename', () => {
    mockDoc.getFilename.mockReturnValue('my.document.file.xlsx');
    expect(getDocumentFileExtension(mockDoc)).toBe('xlsx');
  });

  it('should return empty string when filename has no extension', () => {
    mockDoc.getFilename.mockReturnValue('document');
    expect(getDocumentFileExtension(mockDoc)).toBe('');
  });

  it('should return empty string when filename is empty', () => {
    mockDoc.getFilename.mockReturnValue('');
    expect(getDocumentFileExtension(mockDoc)).toBe('');
  });
});

describe('getDownloadFilename', () => {
  let mockDoc;

  beforeEach(() => {
    mockDoc = {
      getFilename: jest.fn(),
      getType: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('when converting to PDF', () => {
    beforeEach(() => {
      officeEditor.isOfficeEditorMode.mockReturnValue(false);
    });

    it('should append .pdf when converting OFFICE document to PDF', () => {
      mockDoc.getFilename.mockReturnValue('document.doc');
      mockDoc.getType.mockReturnValue(workerTypes.OFFICE);

      const result = getDownloadFilename('document', mockDoc, workerTypes.PDF);
      expect(result).toBe('document.pdf');
    });

    it('should not append .pdf when filename already ends with .pdf', () => {
      mockDoc.getFilename.mockReturnValue('document.doc');
      mockDoc.getType.mockReturnValue(workerTypes.OFFICE);

      const result = getDownloadFilename('document.pdf', mockDoc, workerTypes.PDF);
      expect(result).toBe('document.pdf');
    });

    it('should append .pdf when converting SPREADSHEET_EDITOR to PDF', () => {
      mockDoc.getFilename.mockReturnValue('spreadsheet.xlsx');
      mockDoc.getType.mockReturnValue(workerTypes.SPREADSHEET_EDITOR);

      const result = getDownloadFilename('spreadsheet', mockDoc, workerTypes.PDF);
      expect(result).toBe('spreadsheet.pdf');
    });

    it('should handle case-insensitive .pdf extension check', () => {
      mockDoc.getFilename.mockReturnValue('document.doc');
      mockDoc.getType.mockReturnValue(workerTypes.OFFICE);

      const result = getDownloadFilename('document.PDF', mockDoc, workerTypes.PDF);
      expect(result).toBe('document.PDF');
    });
  });

  describe('when in Office Editor mode', () => {
    beforeEach(() => {
      officeEditor.isOfficeEditorMode.mockReturnValue(true);
      mockDoc.getType.mockReturnValue(workerTypes.OFFICE);
    });

    it('should append .docx when loading .doc file', () => {
      mockDoc.getFilename.mockReturnValue('document.doc');

      const result = getDownloadFilename('document', mockDoc, workerTypes.OFFICE);
      expect(result).toBe('document.docx');
    });

    it('should not append .docx when filename already has it', () => {
      mockDoc.getFilename.mockReturnValue('document.docx');

      const result = getDownloadFilename('document.docx', mockDoc, workerTypes.OFFICE);
      expect(result).toBe('document.docx');
    });

    it('should append .pdf when converting to PDF', () => {
      mockDoc.getFilename.mockReturnValue('document.doc');

      const result = getDownloadFilename('document', mockDoc, workerTypes.PDF);
      expect(result).toBe('document.pdf');
    });

    it('should handle case-insensitive .docx extension check', () => {
      mockDoc.getFilename.mockReturnValue('document.doc');

      const result = getDownloadFilename('document.DOCX', mockDoc, workerTypes.OFFICE);
      expect(result).toBe('document.DOCX');
    });
  });

  describe('when downloading non-PDF files', () => {
    beforeEach(() => {
      officeEditor.isOfficeEditorMode.mockReturnValue(false);
    });

    it('should use original extension for video files', () => {
      mockDoc.getFilename.mockReturnValue('video.mp4');
      mockDoc.getType.mockReturnValue('video/mp4');

      const result = getDownloadFilename('video', mockDoc, 'video/mp4');
      expect(result).toBe('video.mp4');
    });

    it('should use original extension for audio files', () => {
      mockDoc.getFilename.mockReturnValue('audio.mp3');
      mockDoc.getType.mockReturnValue('audio');

      const result = getDownloadFilename('audio', mockDoc, 'audio');
      expect(result).toBe('audio.mp3');
    });

    it('should use original extension for OFFICE files when not converting to PDF', () => {
      mockDoc.getFilename.mockReturnValue('document.doc');
      mockDoc.getType.mockReturnValue(workerTypes.OFFICE);

      const result = getDownloadFilename('document', mockDoc, workerTypes.OFFICE);
      expect(result).toBe('document.doc');
    });

    it('should not append extension when filename already has it', () => {
      mockDoc.getFilename.mockReturnValue('document.xlsx');
      mockDoc.getType.mockReturnValue(workerTypes.SPREADSHEET_EDITOR);

      const result = getDownloadFilename('document.xlsx', mockDoc, workerTypes.SPREADSHEET_EDITOR);
      expect(result).toBe('document.xlsx');
    });
  });

  describe('edge cases', () => {
    beforeEach(() => {
      officeEditor.isOfficeEditorMode.mockReturnValue(false);
    });

    it('should handle empty filename', () => {
      mockDoc.getFilename.mockReturnValue('document.pdf');
      mockDoc.getType.mockReturnValue('pdf');

      const result = getDownloadFilename('', mockDoc, 'pdf');
      expect(result).toBe('.pdf');
    });

    it('should handle filename with multiple dots', () => {
      mockDoc.getFilename.mockReturnValue('my.document.file.pdf');
      mockDoc.getType.mockReturnValue('pdf');

      const result = getDownloadFilename('my.document.file', mockDoc, 'pdf');
      expect(result).toBe('my.document.file.pdf');
    });

    it('should handle undefined docType', () => {
      mockDoc.getFilename.mockReturnValue('document.pdf');
      mockDoc.getType.mockReturnValue(undefined);

      const result = getDownloadFilename('document', mockDoc, 'pdf');
      expect(result).toBe('document.pdf');
    });
  });
});
