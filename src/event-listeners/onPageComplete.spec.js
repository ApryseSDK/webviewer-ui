import onPageComplete from './onPageComplete';
import core from 'core';
import { prepareAccessibleModeContent } from 'helpers/accessibility';

jest.mock('core', () => ({
  getDocumentViewer: jest.fn(),
  getViewerElement: jest.fn(),
}));

jest.mock('helpers/accessibility', () => ({
  prepareAccessibleModeContent: jest.fn(),
}));

describe('onPageComplete', () => {
  let mockIsStructuredFile;
  let mockViewerElement;

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsStructuredFile = jest.fn().mockResolvedValue(false);
    mockViewerElement = {
      querySelector: jest.fn(() => ({ tabIndex: undefined })),
    };

    core.getDocumentViewer.mockReturnValue({
      getAccessibleReadingOrderManager: () => ({
        isStructuredFile: mockIsStructuredFile,
      }),
    });

    core.getViewerElement.mockReturnValue(mockViewerElement);
  });

  const createStore = (overrides = {}) => ({
    getState: () => ({
      viewer: {
        shouldAddA11yContentToDOM: true,
        activeDocumentViewerKey: 1,
        ...overrides,
      },
    }),
  });

  it('returns early when accessibility content is disabled', async () => {
    const store = createStore({ shouldAddA11yContentToDOM: false });
    const handler = onPageComplete(store);

    await handler(1);

    expect(mockIsStructuredFile).not.toHaveBeenCalled();
    expect(prepareAccessibleModeContent).not.toHaveBeenCalled();
  });

  it('sets tabIndex on the page container when the file is structured', async () => {
    mockIsStructuredFile.mockResolvedValue(true);
    const pageContainer = { tabIndex: undefined };
    mockViewerElement.querySelector.mockReturnValue(pageContainer);

    const handler = onPageComplete(createStore());
    await handler(2);

    expect(pageContainer.tabIndex).toBe(0);
    expect(prepareAccessibleModeContent).not.toHaveBeenCalled();
  });

  it('prepares legacy accessible content when the file is not structured', async () => {
    mockIsStructuredFile.mockResolvedValue(false);
    const store = createStore();
    const handler = onPageComplete(store);

    await handler(3);

    expect(prepareAccessibleModeContent).toHaveBeenCalledWith(store, 3);
  });
});
