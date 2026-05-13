import React from 'react';
import { render, screen } from '@testing-library/react';
import FilePickerPanel from './FilePickerPanel';
import useCore from 'hooks/useCore';

const TestFilePickerPanel = withProviders(FilePickerPanel);

let filePickerProps;
let previousCore;
let hadOwnCore;

jest.mock('hooks/useCore');

jest.mock('components/FilePicker', () => {
  function MockFilePicker(props) {
    filePickerProps = props;
    return <div>Browse Files</div>;
  }

  MockFilePicker.displayName = 'MockFilePicker';

  return MockFilePicker;
});

function MockCoreDocument() {
  this.isMockCoreDocument = true;
}

describe('FilePickerPanel', () => {
  beforeEach(() => {
    filePickerProps = null;
    hadOwnCore = Object.prototype.hasOwnProperty.call(window, 'Core');
    previousCore = window.Core;
    window.Core = {
      Document: MockCoreDocument,
    };
  });

  afterEach(() => {
    if (hadOwnCore) {
      window.Core = previousCore;
      return;
    }

    delete window.Core;
  });

  describe('Component', () => {
    it('renders component correctly with an input for a file', () => {
      useCore.mockReturnValue({
        core: {
          getAllowedFileExtensions: jest.fn(() => '.pdf,.docx'),
          createDocument: jest.fn(),
        },
      });

      render(<TestFilePickerPanel onFileProcessed={jest.fn()} />);

      expect(screen.getByText('Browse Files')).toBeInTheDocument();
    });

    it('loads mixed office and pdf files as pdf-backed documents before merging', async () => {
      const insertPages = jest.fn().mockResolvedValue();
      const mergedDocument = {
        getPageCount: jest.fn(() => 2),
        insertPages,
      };
      const sourceDocument = {
        getPageCount: jest.fn(() => 3),
        insertPages: jest.fn(),
      };
      const createDocument = jest.fn()
        .mockResolvedValueOnce(mergedDocument)
        .mockResolvedValueOnce(sourceDocument);
      const onFileProcessed = jest.fn();

      useCore.mockReturnValue({
        core: {
          getAllowedFileExtensions: jest.fn(() => '.pdf,.docx'),
          createDocument,
        },
      });

      render(<TestFilePickerPanel onFileProcessed={onFileProcessed} allowMultiple />);

      const officeFile = new File(['office'], 'source.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      const pdfFile = new File(['pdf'], 'target.pdf', { type: 'application/pdf' });

      await filePickerProps.onChange([officeFile, pdfFile]);

      expect(createDocument).toHaveBeenNthCalledWith(1, officeFile, { loadAsPDF: true });
      expect(createDocument).toHaveBeenNthCalledWith(2, pdfFile, { loadAsPDF: true });
      expect(insertPages).toHaveBeenCalledWith(sourceDocument, [1, 2, 3], 3);
      expect(onFileProcessed).toHaveBeenCalledWith(mergedDocument);
    });

    it('reuses existing documents when mixed document instances are merged', async () => {
      const insertPages = jest.fn().mockResolvedValue();
      const officeDocument = new MockCoreDocument();
      const pdfDocument = new MockCoreDocument();
      officeDocument.getPageCount = jest.fn(() => 1);
      officeDocument.insertPages = insertPages;
      pdfDocument.getPageCount = jest.fn(() => 2);
      pdfDocument.insertPages = jest.fn();
      const createDocument = jest.fn();
      const onFileProcessed = jest.fn();

      useCore.mockReturnValue({
        core: {
          getAllowedFileExtensions: jest.fn(() => '.pdf,.docx'),
          createDocument,
        },
      });

      render(<TestFilePickerPanel onFileProcessed={onFileProcessed} allowMultiple />);

      await filePickerProps.onChange([officeDocument, pdfDocument]);

      expect(createDocument).not.toHaveBeenCalled();
      expect(insertPages).toHaveBeenCalledWith(pdfDocument, [1, 2], 2);
      expect(onFileProcessed).toHaveBeenCalledWith(officeDocument);
    });
  });
});