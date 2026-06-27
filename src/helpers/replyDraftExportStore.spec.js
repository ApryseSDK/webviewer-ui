import {
  setReplyDraftForExport,
  clearReplyDraftForExport,
  getReplyDraftsForExport,
} from './replyDraftExportStore';

describe('replyDraftExportStore', () => {
  const viewerKey1 = 'viewer-key-1';
  const viewerKey2 = 'viewer-key-2';
  const parent1 = 'parent-1';
  const parent2 = 'parent-2';

  afterEach(() => {
    clearReplyDraftForExport(viewerKey1, parent1);
    clearReplyDraftForExport(viewerKey1, parent2);
    clearReplyDraftForExport(viewerKey2, parent1);
    clearReplyDraftForExport(viewerKey2, parent2);
  });

  it('stores and retrieves draft replies per viewer', () => {
    setReplyDraftForExport(viewerKey1, parent1, {
      replyText: 'draft 1',
      plainTextValue: 'draft 1',
      isMentionEnabled: false,
      ids: [],
    });

    setReplyDraftForExport(viewerKey2, parent2, {
      replyText: 'draft 2',
      plainTextValue: 'draft 2',
      isMentionEnabled: false,
      ids: [],
    });

    expect(getReplyDraftsForExport(viewerKey1)).toEqual([
      {
        parentAnnotationId: parent1,
        replyText: 'draft 1',
        plainTextValue: 'draft 1',
        isMentionEnabled: false,
        ids: [],
      },
    ]);

    expect(getReplyDraftsForExport(viewerKey2)).toEqual([
      {
        parentAnnotationId: parent2,
        replyText: 'draft 2',
        plainTextValue: 'draft 2',
        isMentionEnabled: false,
        ids: [],
      },
    ]);
  });

  it('clears drafts and returns empty array when viewer has no drafts', () => {
    setReplyDraftForExport(viewerKey1, parent1, {
      replyText: 'draft',
      plainTextValue: 'draft',
      isMentionEnabled: false,
      ids: [],
    });

    clearReplyDraftForExport(viewerKey1, parent1);
    expect(getReplyDraftsForExport(viewerKey1)).toEqual([]);
  });
});
