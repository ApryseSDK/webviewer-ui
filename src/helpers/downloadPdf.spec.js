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
}));

jest.mock('./spreadsheetEditor/isSpreadsheetEditorMode', () => ({
  isSpreadsheetEditorMode: jest.fn(() => false),
}));

jest.mock('src/constants/dataElement', () => ({
  LOADING_MODAL: 'loadingModal',
  NotesPanel: {
    DefaultHeader: {
      FILTER_ANNOTATION_BUTTON: 'filterAnnotationButton',
    },
  },
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
  let contentEditManager;

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

    contentEditManager = {
      isInContentEditMode: jest.fn(() => false),
      endContentEditMode: jest.fn(() => Promise.resolve()),
      startContentEditMode: jest.fn(() => Promise.resolve()),
    };

    documentViewer = {
      getWatermark: jest.fn(() => Promise.resolve({})),
      setWatermark: jest.fn(),
      getAnnotationManager: jest.fn(() => annotationManager),
      getContentEditManager: jest.fn(() => contentEditManager),
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

  it('uses incremental saving when a signature widget has a cryptographic signature', async () => {
    getReplyDraftsForExport.mockReturnValue([]);
    const signatureWidget = new window.Core.Annotations.SignatureWidgetAnnotation();
    signatureWidget.hasCryptographicSignature = jest.fn().mockResolvedValue(true);
    core.getAnnotationsList.mockReturnValue([signatureWidget]);

    await downloadPdf(dispatch, {}, documentViewerKey);

    expect(signatureWidget.hasCryptographicSignature).toHaveBeenCalledTimes(1);
    expect(doc.getFileData.mock.calls[0][0].flags).toBe(window.Core.SaveOptions.INCREMENTAL);
  });

  it('does not use incremental saving for an appearance-only signature widget', async () => {
    getReplyDraftsForExport.mockReturnValue([]);
    const signatureWidget = new window.Core.Annotations.SignatureWidgetAnnotation();
    signatureWidget.isSignedByAppearance = jest.fn(() => true);
    signatureWidget.hasCryptographicSignature = jest.fn().mockResolvedValue(false);
    core.getAnnotationsList.mockReturnValue([signatureWidget]);

    await downloadPdf(dispatch, {}, documentViewerKey);

    expect(signatureWidget.hasCryptographicSignature).toHaveBeenCalledTimes(1);
    expect(signatureWidget.isSignedByAppearance).not.toHaveBeenCalled();
    expect(doc.getFileData.mock.calls[0][0].flags).toBeUndefined();
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

  it('ends Content Edit mode preserving history before download and restarts it after, when active', async () => {
    getReplyDraftsForExport.mockReturnValue([]);
    contentEditManager.isInContentEditMode.mockReturnValue(true);

    await downloadPdf(dispatch, {}, documentViewerKey);

    expect(contentEditManager.endContentEditMode).toHaveBeenCalledWith({ preserveHistory: true });
    expect(contentEditManager.endContentEditMode.mock.invocationCallOrder[0])
      .toBeLessThan(doc.getFileData.mock.invocationCallOrder[0]);
    expect(contentEditManager.startContentEditMode).toHaveBeenCalledTimes(1);
  });

  it('does not touch Content Edit mode when it is not active', async () => {
    getReplyDraftsForExport.mockReturnValue([]);
    contentEditManager.isInContentEditMode.mockReturnValue(false);

    await downloadPdf(dispatch, {}, documentViewerKey);

    expect(contentEditManager.endContentEditMode).not.toHaveBeenCalled();
    expect(contentEditManager.startContentEditMode).not.toHaveBeenCalled();
  });

  it('does not throw when restarting Content Edit mode after download fails', async () => {
    getReplyDraftsForExport.mockReturnValue([]);
    contentEditManager.isInContentEditMode.mockReturnValue(true);
    contentEditManager.startContentEditMode.mockRejectedValue(new Error('restart failed'));
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    await downloadPdf(dispatch, {}, documentViewerKey);
    // startContentEditMode's rejection is handled fire-and-forget; flush microtasks to observe it.
    await Promise.resolve();
    await Promise.resolve();

    expect(warnSpy).toHaveBeenCalledWith(new Error('restart failed'));

    warnSpy.mockRestore();
  });

  afterEach(() => {
    window.Core = undefined;
  });
});
