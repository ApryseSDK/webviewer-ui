import { renderHook } from '@testing-library/react-hooks';
import useDirectionalChevronIcons from './useDirectionalChevronIcons';

let languageChangeHandler;
const mockI18n = {
  dir: jest.fn().mockReturnValue('ltr'),
  on: jest.fn((event, handler) => {
    if (event === 'languageChanged') {
      languageChangeHandler = handler;
    }
  }),
  off: jest.fn(),
};

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ i18n: mockI18n }),
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn().mockReturnValue(null),
}));

const simulateLanguageChange = (newDir) => {
  mockI18n.dir.mockReturnValue(newDir);
  languageChangeHandler();
};

describe('useDirectionalChevronIcons', () => {
  beforeEach(() => {
    mockI18n.dir.mockReturnValue('ltr');
    languageChangeHandler = undefined;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns LTR icons when language is LTR', () => {
    const { result } = renderHook(() => useDirectionalChevronIcons());
    expect(result.current.startChevronIcon).toBe('icon-chevron-left');
    expect(result.current.endChevronIcon).toBe('icon-chevron-right');
  });

  it('returns RTL icons when language is RTL', () => {
    mockI18n.dir.mockReturnValue('rtl');
    const { result } = renderHook(() => useDirectionalChevronIcons());
    expect(result.current.startChevronIcon).toBe('icon-chevron-right');
    expect(result.current.endChevronIcon).toBe('icon-chevron-left');
  });

  it('updates both icons when language changes from LTR to RTL', () => {
    const { result } = renderHook(() => useDirectionalChevronIcons());
    expect(result.current.startChevronIcon).toBe('icon-chevron-left');
    expect(result.current.endChevronIcon).toBe('icon-chevron-right');

    simulateLanguageChange('rtl');

    expect(result.current.startChevronIcon).toBe('icon-chevron-right');
    expect(result.current.endChevronIcon).toBe('icon-chevron-left');
  });

  it('updates both icons when language changes from RTL back to LTR', () => {
    mockI18n.dir.mockReturnValue('rtl');
    const { result } = renderHook(() => useDirectionalChevronIcons());
    expect(result.current.startChevronIcon).toBe('icon-chevron-right');
    expect(result.current.endChevronIcon).toBe('icon-chevron-left');

    simulateLanguageChange('ltr');

    expect(result.current.startChevronIcon).toBe('icon-chevron-left');
    expect(result.current.endChevronIcon).toBe('icon-chevron-right');
  });

  it('always returns LTR icons when forceLtr is true, regardless of language', () => {
    const { result } = renderHook(() => useDirectionalChevronIcons(true));
    expect(result.current.startChevronIcon).toBe('icon-chevron-left');
    expect(result.current.endChevronIcon).toBe('icon-chevron-right');
    simulateLanguageChange('rtl');
    expect(result.current.startChevronIcon).toBe('icon-chevron-left');
    expect(result.current.endChevronIcon).toBe('icon-chevron-right');
  });
});
