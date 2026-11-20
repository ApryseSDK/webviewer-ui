import { renderHook, act } from '@testing-library/react-hooks';
import { useSelector } from 'react-redux';
import actions from 'actions';
import DataElements from 'constants/dataElement';
import { OFFICE_EDITOR_SPELL_CHECK_KEY } from 'constants/officeEditor';
import useOnContextMenuOpen from './useOnContextMenuOpen';

const mockGetAnnotationsByMouseEvent = jest.fn();
const mockOnRightClick = jest.fn();
const mockIsOfficeEditorMode = jest.fn();

jest.mock('core', () => ({
  getAnnotationsByMouseEvent: () => mockGetAnnotationsByMouseEvent(),
  getOfficeEditor: () => ({ onRightClick: (...args) => mockOnRightClick(...args) }),
}));
jest.mock('helpers/officeEditor', () => ({ isOfficeEditorMode: () => mockIsOfficeEditorMode() }));
jest.mock('actions', () => ({
  openElement: jest.fn((element) => ({ type: 'OPEN_ELEMENT', payload: element })),
}));

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch,
}));

const mockUseOnRightClick = jest.fn();
jest.mock('hooks/useOnRightClick', () => (...args) => mockUseOnRightClick(...args));

const createAnnotation = (customData = {}, contents = '') => ({
  getCustomData: (key) => customData[key],
  getContents: () => contents,
});

const getState = (overrides = {}) => ({
  viewer: {
    activeDocumentViewerKey: 1,
    enableRightClickAnnotationPopup: false,
    modularPopups: { contextMenuPopup: ['item1'] },
    ...overrides,
  },
});

const openContextMenuAction = actions.openElement(DataElements.CONTEXT_MENU_POPUP);
const rightClickEvent = { pageX: 100, pageY: 200 };
const MISSPELLED_WORD = 'wrold';

describe('useOnContextMenuOpen', () => {
  const rightClick = async () => {
    // Use the latest registered handler, as the hook re-registers it whenever its dependencies change
    const handler = mockUseOnRightClick.mock.lastCall[0];
    await act(async () => {
      await handler(rightClickEvent);
    });
  };

  const setState = (state) => {
    useSelector.mockImplementation((callback) => callback(state));
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAnnotationsByMouseEvent.mockReturnValue([]);
    mockIsOfficeEditorMode.mockReturnValue(false);
    setState(getState());
  });

  it('should open the context menu at the click position when right-click annotation popup is disabled', async () => {
    const { result } = renderHook(() => useOnContextMenuOpen());
    await rightClick();

    expect(mockDispatch).toHaveBeenCalledWith(openContextMenuAction);
    expect(result.current.clickPosition).toEqual({ left: 100, top: 200 });
  });

  it('should not open the context menu when it has no items', async () => {
    setState(getState({ modularPopups: { contextMenuPopup: [] } }));
    renderHook(() => useOnContextMenuOpen());
    await rightClick();

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should not open the context menu when right-click annotation popup is enabled and an annotation is present', async () => {
    setState(getState({ enableRightClickAnnotationPopup: true }));
    mockGetAnnotationsByMouseEvent.mockReturnValue([createAnnotation()]);
    renderHook(() => useOnContextMenuOpen());
    await rightClick();

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should open the context menu and notify the office editor of the right-click in office editor mode', async () => {
    setState(getState({ enableRightClickAnnotationPopup: true }));
    mockGetAnnotationsByMouseEvent.mockReturnValue([createAnnotation()]);
    mockIsOfficeEditorMode.mockReturnValue(true);
    renderHook(() => useOnContextMenuOpen());
    await rightClick();

    expect(mockOnRightClick).toHaveBeenCalledWith(rightClickEvent);
    expect(mockDispatch).toHaveBeenCalledWith(openContextMenuAction);
  });

  describe('spelling error', () => {
    beforeEach(() => {
      mockIsOfficeEditorMode.mockReturnValue(true);
    });

    it('should return the spelling error id and misspelled word under the mouse in office editor mode', async () => {
      // Id 0 is valid, so it must not be dropped when the spelling error is flattened into props
      mockGetAnnotationsByMouseEvent.mockReturnValue([createAnnotation({ [OFFICE_EDITOR_SPELL_CHECK_KEY]: '0' }, MISSPELLED_WORD)]);
      const { result } = renderHook(() => useOnContextMenuOpen());
      await rightClick();

      expect(result.current.spellingErrorId).toBe(0);
      expect(result.current.misspelledWord).toBe(MISSPELLED_WORD);
    });

    it('should clear the spelling error when the next right-click is not on a misspelling', async () => {
      mockGetAnnotationsByMouseEvent.mockReturnValue([createAnnotation({ [OFFICE_EDITOR_SPELL_CHECK_KEY]: '7' }, MISSPELLED_WORD)]);
      const { result } = renderHook(() => useOnContextMenuOpen());
      await rightClick();

      mockGetAnnotationsByMouseEvent.mockReturnValue([]);
      await rightClick();

      expect(result.current.spellingErrorId).toBeNull();
      expect(result.current.misspelledWord).toBeNull();
    });
  });
});
