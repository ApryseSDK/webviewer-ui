import getDocumentViewer from './getDocumentViewer';
import core from 'core';

jest.mock('core', () => ({
  getDocumentViewer: jest.fn(),
}));

describe('getDocumentViewer API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return viewer for key 1 when no key is provided', () => {
    const mockViewer = { id: 'viewer-1' };
    core.getDocumentViewer.mockReturnValue(mockViewer);

    const result = getDocumentViewer();

    expect(core.getDocumentViewer).toHaveBeenCalledWith(1);
    expect(result).toBe(mockViewer);
  });

  it('should return viewer for the explicitly requested key when provided', () => {
    const mockViewer = { id: 'viewer-3' };
    core.getDocumentViewer.mockReturnValue(mockViewer);

    const result = getDocumentViewer(3);

    expect(core.getDocumentViewer).toHaveBeenCalledWith(3);
    expect(result).toBe(mockViewer);
  });
});
