import core from 'core';
import downloadPdf from './downloadPdf';
import { getReplyDraftsForExport } from 'helpers/replyDraftExportStore';
import { BEFORE_FILE_DOWNLOAD, AFTER_FILE_DOWNLOAD } from 'constants/downloads';

jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));

jest.mock('core', () => ({
  getDocument: jest.fn(),
  getDocumentViewer: jest.fn(),
  exportAnnotations: jest.fn(),
  getCurrentUser: jest.fn(),
  getAnnotationsList: jest.fn(),
}));

jest.mock('helpers/device', () => ({
  isIE: false,
}));

jest.mock('helpers/fireEvent', () => jest.fn());

jest.mock('constants/events', () => ({
  FILE_DOWNLOADED: 'fileDownloaded',
}));

jest.mock('actions', () => ({
  openElement: jest.fn(() => ({ type: 'OPEN_ELEMENT' })),
  closeElement: jest.fn(() => ({ type: 'CLOSE_ELEMENT' })),
}));

jest.mock('helpers/rasterPrint', () => ({
  createRasterizedPrintPages: jest.fn(),
}));

jest.mock('selectors', () => ({
  getSortStrategy: jest.fn(),
  getPrintedNoteDateFormat: jest.fn(),
  getCurrentLanguage: jest.fn(),
  getPrintQuality: jest.fn(),
  getColorMap: jest.fn(),
}));

jest.mock('constants/map', () => ({
  mapAnnotationToKey: jest.fn(),
  getDataWithKey: jest.fn(),
}));

jest.mock('constants/types', () => ({
  workerTypes: {
    PDF: 'pdf',
    OFFICE: 'office',
    SPREADSHEET_EDITOR: 'spreadsheetEditor',
    LEGACY_OFFICE: 'legacyOffice',
    OFFICE_EDITOR: 'officeEditor',
  },
}));

jest.mock('./officeEditor', () => ({
  isOfficeEditorMode: jest.fn(() => false),
  isSpreadsheetEditorMode: jest.fn(() => false),
}));

jest.mock('src/constants/dataElement', () => ({
  LOADING_MODAL: 'loadingModal',
}));

jest.mock('./downloadHelper', () => ({
  getDownloadFilename: jest.fn((filename) => filename),
  getDocumentFileExtension: jest.fn(() => 'pdf'),
}));

jest.mock('helpers/replyDraftExportStore', () => ({
  getReplyDraftsForExport: jest.fn(),
}));

describe('downloadPdf', () => {
  const dispatch = jest.fn();
  const documentViewerKey = 7;
  let doc;
  let documentViewer;
  let annotationManager;

  const setupCoreMocks = () => {
    const existingAnnotation = {
      Id: 'annot-1',
      X: 10,
      Y: 20,
      PageNumber: 1,
    };

    annotationManager = {
      getAnnotationsList: jest.fn(() => [existingAnnotation]),
      exportAnnotations: jest.fn(() => Promise.resolve('xfdf-with-drafts')),
    };

    documentViewer = {
      getWatermark: jest.fn(() => Promise.resolve({})),
      setWatermark: jest.fn(),
      getAnnotationManager: jest.fn(() => annotationManager),
    };

    doc = {
      getFilename: jest.fn(() => 'test.pdf'),
      getPageCount: jest.fn(() => 1),
      getType: jest.fn(() => 'pdf'),
      getFileData: jest.fn(() => Promise.resolve(new Uint8Array([1, 2, 3]).buffer)),
      enableWatermarkApplied: jest.fn(),
    };

    core.getDocument.mockReturnValue(doc);
    core.getDocumentViewer.mockImplementation(() => documentViewer);
    core.exportAnnotations.mockResolvedValue('xfdf-from-core-export');
    core.getCurrentUser.mockReturnValue('test-user');
    core.getAnnotationsList.mockReturnValue([]);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    setupCoreMocks();

    window.Core = {
      SaveOptions: {
        INCREMENTAL: 1,
      },
      Annotations: {
        SignatureWidgetAnnotation: class SignatureWidgetAnnotation {},
        StickyAnnotation: class StickyAnnotation {
          constructor() {
            this.customData = {};
          }

          setContents = jest.fn((contents) => {
            this.contents = contents;
          });

          setCustomData = jest.fn((key, value) => {
            this.customData[key] = value;
          });
        },
      },
    };
  });

  it('includes draft replies in exported annotations when export drafts exist', async () => {
    getReplyDraftsForExport.mockReturnValue([
      {
        parentAnnotationId: 'annot-1',
        replyText: 'Draft reply from autosave',
        plainTextValue: 'Draft reply from autosave',
        isMentionEnabled: false,
        ids: [],
      },
    ]);

    await downloadPdf(dispatch, {}, documentViewerKey);

    expect(annotationManager.exportAnnotations).toHaveBeenCalledTimes(1);
    const exportOptions = annotationManager.exportAnnotations.mock.calls[0][0];
    expect(exportOptions.annotationList).toHaveLength(2);
    const draftReplyAnnotation = exportOptions.annotationList.find(
      (annotation) => annotation.InReplyTo === 'annot-1'
    );
    expect(draftReplyAnnotation).toBeDefined();
    expect(draftReplyAnnotation.Author).toBe('test-user');
    expect(draftReplyAnnotation.contents).toBe('Draft reply from autosave');
    expect(core.exportAnnotations).not.toHaveBeenCalled();
  });

  it('does not duplicate draft replies already present as autosave-draft annotations', async () => {
    const autosaveDraftReplyAnnotation = {
      Id: 'reply-draft-1',
      getCustomData: jest.fn((key) => key === 'trn-autosave-draft-reply' ? 'true' : ''),
    };
    annotationManager.getAnnotationsList.mockReturnValue([
      {
        Id: 'annot-1',
        X: 10,
        Y: 20,
        PageNumber: 1,
      },
      autosaveDraftReplyAnnotation,
    ]);
    getReplyDraftsForExport.mockReturnValue([
      {
        parentAnnotationId: 'annot-1',
        replyText: 'Draft reply from autosave',
        plainTextValue: 'Draft reply from autosave',
        isMentionEnabled: false,
        ids: [],
      },
    ]);

    await downloadPdf(dispatch, {}, documentViewerKey);

    const exportOptions = annotationManager.exportAnnotations.mock.calls[0][0];
    expect(exportOptions.annotationList).toHaveLength(2);
    expect(exportOptions.annotationList).not.toContain(autosaveDraftReplyAnnotation);
  });

  it('falls back to core export when there are no draft replies to export', async () => {
    getReplyDraftsForExport.mockReturnValue([]);

    await downloadPdf(dispatch, {}, documentViewerKey);

    expect(core.exportAnnotations).toHaveBeenCalledWith({ useDisplayAuthor: false }, documentViewerKey);
    expect(annotationManager.exportAnnotations).not.toHaveBeenCalled();
  });

  it('emits a pre-download event with the active documentViewerKey', async () => {
    getReplyDraftsForExport.mockReturnValue([]);
    const onBeforeDownload = jest.fn();

    window.addEventListener(BEFORE_FILE_DOWNLOAD, onBeforeDownload);

    try {
      await downloadPdf(dispatch, {}, documentViewerKey);

      expect(onBeforeDownload).toHaveBeenCalledTimes(1);
      expect(onBeforeDownload.mock.calls[0][0].detail).toEqual({
        documentViewerKey,
      });
    } finally {
      window.removeEventListener(BEFORE_FILE_DOWNLOAD, onBeforeDownload);
    }
  });

  it('emits a post-download event with the active documentViewerKey on success', async () => {
    getReplyDraftsForExport.mockReturnValue([]);
    const onAfterDownload = jest.fn();

    window.addEventListener(AFTER_FILE_DOWNLOAD, onAfterDownload);

    try {
      await downloadPdf(dispatch, {}, documentViewerKey);

      expect(onAfterDownload).toHaveBeenCalledTimes(1);
      expect(onAfterDownload.mock.calls[0][0].detail).toEqual({
        documentViewerKey,
      });
    } finally {
      window.removeEventListener(AFTER_FILE_DOWNLOAD, onAfterDownload);
    }
  });

  it('emits wv-after-file-download even when the download fails', async () => {
    getReplyDraftsForExport.mockReturnValue([]);
    doc.getFileData.mockRejectedValue(new Error('download failed'));
    const onAfterDownload = jest.fn();

    window.addEventListener('wv-after-file-download', onAfterDownload);

    try {
      await downloadPdf(dispatch, {}, documentViewerKey);

      expect(onAfterDownload).toHaveBeenCalledTimes(1);
      expect(onAfterDownload.mock.calls[0][0].detail).toEqual({
        documentViewerKey,
      });
    } finally {
      window.removeEventListener('wv-after-file-download', onAfterDownload);
    }
  });

  afterEach(() => {
    window.Core = undefined;
  });
});
