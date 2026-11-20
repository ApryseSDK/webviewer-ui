import {
  getEditSessionBaseline,
  captureEditSessionBaseline,
  clearEditSessionBaseline,
  cancelPendingBaselineCleanup,
  scheduleEditSessionBaselineCleanup,
  clearAllBaselinesForViewer,
} from './NoteContentEditSession';

const createAnnotation = (id, contents, mentionData = '') => ({
  Id: id,
  getContents: jest.fn(() => contents),
  getCustomData: jest.fn(() => mentionData),
});

describe('NoteContent edit-session baseline store', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    clearAllBaselinesForViewer('viewer-1');
    clearAllBaselinesForViewer('viewer-2');
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('captures original content and mention data only once per annotation edit session', () => {
    const annotation = createAnnotation('note', 'original', 'original mentions');
    captureEditSessionBaseline('viewer-1', annotation);
    annotation.getContents.mockReturnValue('autosaved');
    annotation.getCustomData.mockReturnValue('new mentions');
    captureEditSessionBaseline('viewer-1', annotation);

    expect(getEditSessionBaseline('viewer-1', 'note')).toEqual({
      contents: 'original',
      mentionData: 'original mentions',
    });
    clearEditSessionBaseline('viewer-1', 'note');
    captureEditSessionBaseline('viewer-1', annotation);
    expect(getEditSessionBaseline('viewer-1', 'note').contents).toBe('autosaved');
  });

  it('isolates identical annotation IDs across document viewers', () => {
    captureEditSessionBaseline('viewer-1', createAnnotation('note', 'first'));
    captureEditSessionBaseline('viewer-2', createAnnotation('note', 'second'));

    clearEditSessionBaseline('viewer-1', 'note');
    expect(getEditSessionBaseline('viewer-1', 'note')).toBeUndefined();
    expect(getEditSessionBaseline('viewer-2', 'note').contents).toBe('second');
  });

  it('retains a baseline when an immediate remount cancels scheduled cleanup', () => {
    captureEditSessionBaseline('viewer-1', createAnnotation('note', 'before autosave'));
    scheduleEditSessionBaselineCleanup('viewer-1', 'note');
    cancelPendingBaselineCleanup('viewer-1', 'note');
    jest.runOnlyPendingTimers();

    expect(getEditSessionBaseline('viewer-1', 'note').contents).toBe('before autosave');
  });

  it('drops a baseline after a true unmount so a later session starts fresh', () => {
    captureEditSessionBaseline('viewer-1', createAnnotation('note', 'before autosave'));
    scheduleEditSessionBaselineCleanup('viewer-1', 'note');
    jest.runOnlyPendingTimers();

    expect(getEditSessionBaseline('viewer-1', 'note')).toBeUndefined();
    captureEditSessionBaseline('viewer-1', createAnnotation('note', 'autosaved'));
    expect(getEditSessionBaseline('viewer-1', 'note').contents).toBe('autosaved');
  });

  it('clears only the unloading viewer and cancels its pending cleanup', () => {
    captureEditSessionBaseline('viewer-1', createAnnotation('note', 'first'));
    captureEditSessionBaseline('viewer-2', createAnnotation('note', 'second'));
    scheduleEditSessionBaselineCleanup('viewer-1', 'note');
    scheduleEditSessionBaselineCleanup('viewer-2', 'note');

    clearAllBaselinesForViewer('viewer-1');
    captureEditSessionBaseline('viewer-1', createAnnotation('note', 'new first'));
    cancelPendingBaselineCleanup('viewer-2', 'note');
    jest.runOnlyPendingTimers();

    expect(getEditSessionBaseline('viewer-1', 'note').contents).toBe('new first');
    expect(getEditSessionBaseline('viewer-2', 'note').contents).toBe('second');
  });

  it('does not let a cleared annotation timer delete a new baseline', () => {
    captureEditSessionBaseline('viewer-1', createAnnotation('note', 'first'));
    scheduleEditSessionBaselineCleanup('viewer-1', 'note');
    clearEditSessionBaseline('viewer-1', 'note');
    captureEditSessionBaseline('viewer-1', createAnnotation('note', 'new first'));
    jest.runOnlyPendingTimers();

    expect(getEditSessionBaseline('viewer-1', 'note').contents).toBe('new first');
  });

  it('replaces scheduled cleanup for the same annotation', () => {
    captureEditSessionBaseline('viewer-1', createAnnotation('note', 'first'));
    scheduleEditSessionBaselineCleanup('viewer-1', 'note');
    scheduleEditSessionBaselineCleanup('viewer-1', 'note');

    expect(jest.getTimerCount()).toBe(1);
    jest.runOnlyPendingTimers();
    expect(getEditSessionBaseline('viewer-1', 'note')).toBeUndefined();
  });

  it('should keep baselines separate for each instance when both use the same viewer key and annotation id', () => {
    captureEditSessionBaseline('viewer-1', createAnnotation('note', 'first instance'), 1);
    captureEditSessionBaseline('viewer-1', createAnnotation('note', 'second instance'), 2);

    expect(getEditSessionBaseline('viewer-1', 'note', 1).contents).toBe('first instance');
    expect(getEditSessionBaseline('viewer-1', 'note', 2).contents).toBe('second instance');

    clearAllBaselinesForViewer('viewer-1', 1);

    expect(getEditSessionBaseline('viewer-1', 'note', 1)).toBeUndefined();
    expect(getEditSessionBaseline('viewer-1', 'note', 2).contents).toBe('second instance');
    clearAllBaselinesForViewer('viewer-1', 2);
  });
});
