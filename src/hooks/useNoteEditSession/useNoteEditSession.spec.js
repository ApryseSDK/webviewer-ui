import { renderHook } from '@testing-library/react-hooks';
import useNoteEditSession from './useNoteEditSession';
import { clearAllBaselinesForViewer, getEditSessionBaseline } from 'components/NoteContent/NoteContentEditSession';

const mockCore = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};
jest.mock('hooks/useCore', () => () => ({ core: mockCore }));

const createAnnotation = () => ({
  Id: 'note-1',
  getContents: () => 'original note',
  getCustomData: () => '',
});

const renderEditSession = (initialProps) => renderHook((props) => useNoteEditSession(props), { initialProps });

describe('useNoteEditSession', () => {
  afterEach(() => {
    clearAllBaselinesForViewer(1);
    clearAllBaselinesForViewer(2);
    jest.clearAllMocks();
  });

  it('keeps the baseline when the note remounts in the same turn', async () => {
    const props = { annotation: createAnnotation(), isEditing: true, isSelected: true, activeDocumentViewerKey: 1 };
    const firstMount = renderEditSession(props);
    expect(getEditSessionBaseline(1, 'note-1')).toBeDefined();

    // Autosave can remount the note; the new mount must cancel the scheduled cleanup.
    firstMount.unmount();
    renderEditSession(props);
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(getEditSessionBaseline(1, 'note-1')?.contents).toBe('original note');
  });

  it('clears the baseline when editing ends', () => {
    const props = { annotation: createAnnotation(), isEditing: true, isSelected: true, activeDocumentViewerKey: 1 };
    const { rerender } = renderEditSession(props);
    expect(getEditSessionBaseline(1, 'note-1')).toBeDefined();

    rerender({ ...props, isEditing: false });

    expect(getEditSessionBaseline(1, 'note-1')).toBeUndefined();
  });

  it('moves document teardown listeners to the new viewer and removes them on unmount', () => {
    const props = { annotation: createAnnotation(), isEditing: false, isSelected: false, activeDocumentViewerKey: 1 };
    const { rerender, unmount } = renderEditSession(props);
    const [[, onTeardown]] = mockCore.addEventListener.mock.calls;

    rerender({ ...props, activeDocumentViewerKey: 2 });

    expect(mockCore.removeEventListener).toHaveBeenCalledWith('beforeDocumentLoaded', onTeardown, 1);
    expect(mockCore.removeEventListener).toHaveBeenCalledWith('documentUnloaded', onTeardown, 1);
    expect(mockCore.addEventListener).toHaveBeenCalledWith('beforeDocumentLoaded', expect.any(Function), undefined, 2);
    expect(mockCore.addEventListener).toHaveBeenCalledWith('documentUnloaded', expect.any(Function), undefined, 2);

    unmount();

    expect(mockCore.removeEventListener).toHaveBeenCalledWith('beforeDocumentLoaded', expect.any(Function), 2);
    expect(mockCore.removeEventListener).toHaveBeenCalledWith('documentUnloaded', expect.any(Function), 2);
  });
});
