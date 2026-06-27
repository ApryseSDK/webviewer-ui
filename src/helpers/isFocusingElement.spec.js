import core from 'core';
import getRootNode from './getRootNode';
import isFocusingElement from './isFocusingElement';

jest.mock('core');
jest.mock('./getRootNode');

describe('isFocusingElement', () => {
  let originalCore;

  beforeEach(() => {
    jest.clearAllMocks();

    originalCore = window.Core;
    window.Core = {
      Annotations: {
        FreeTextAnnotation: class FreeTextAnnotation {},
      },
    };
  });

  afterEach(() => {
    window.Core = originalCore;
  });

  it('uses getExistingEditor and does not call getEditor for freetext focus checks', () => {
    const freeTextAnnot = new window.Core.Annotations.FreeTextAnnotation();
    const getExistingEditorMock = jest.fn().mockReturnValue({ hasFocus: () => false });
    const getEditorMock = jest.fn();

    core.getAnnotationsList.mockReturnValue([freeTextAnnot]);
    core.getAnnotationManager.mockReturnValue({
      getEditBoxManager: () => ({
        getExistingEditor: getExistingEditorMock,
        getEditor: getEditorMock,
      }),
    });
    getRootNode.mockReturnValue({ activeElement: document.createElement('div') });

    const result = isFocusingElement();

    expect(result).toBe(false);
    expect(getExistingEditorMock).toHaveBeenCalledWith(freeTextAnnot);
    expect(getEditorMock).not.toHaveBeenCalled();
  });
});
