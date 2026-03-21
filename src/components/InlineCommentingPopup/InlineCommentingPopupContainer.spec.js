import React from 'react';
import { render } from '@testing-library/react';
import InlineCommentingPopupContainer from './InlineCommentingPopupContainer';
import useOnClickOutside from 'hooks/useOnClickOutside';
import actions from 'actions';
import DataElements from 'constants/dataElement';
import { useDispatch, useSelector } from 'react-redux';

jest.mock('hooks/useOnClickOutside', () => jest.fn());

jest.mock('hooks/useCore', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('./InlineCommentingPopup', () => jest.fn(() => null));

jest.mock('./InlineCommentingOfficeEditorPopupContainer', () => jest.fn(() => null));

jest.mock('constants/map', () => ({
  annotationMapKeys: {
    OFFICE_EDITOR_COMMENT: 'officeEditorComment',
    TRACKED_CHANGE: 'trackedChange',
  },
  mapAnnotationToKey: jest.fn(() => null),
}));

jest.mock('actions', () => ({
  closeElement: jest.fn((element) => ({ type: 'CLOSE_ELEMENT', payload: element })),
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
  shallowEqual: jest.fn(),
}));

const createAnnotation = (id = '123') => ({
  Id: id,
  getContents: () => '',
});

const renderPopup = (annotation) => {
  return render(
    <InlineCommentingPopupContainer
      annotation={annotation}
      closeAndReset={jest.fn()}
      lastAnnotationsUnderMouse={[]}
    />
  );
};

describe('InlineCommentingPopupContainer', () => {
  const dispatchMock = jest.fn();
  // Mock selector tuple so we can render without a Redux store; tests only need click-outside behavior.
  const selectorResult = [
    false, // isNotesPanelOpen
    false, // notesInLeftPanel
    false, // isLeftPanelOpen
    '', // activeLeftPanel
    false, // showAnnotationNumbering
    'position', // sortStrategy
    false, // isDocumentReadOnly
    1, // activeDocumentViewerKey
    false, // isOfficeEditorMode
  ];

  beforeEach(() => {
    dispatchMock.mockClear();
    useDispatch.mockReturnValue(dispatchMock);
    useSelector.mockReturnValue(selectorResult);
    require('hooks/useCore').default.mockReturnValue({
      core: {
        canModifyContents: () => true,
        getDocument: () => null,
      },
    });
    useOnClickOutside.mockClear();
    actions.closeElement.mockClear();
    document.body.innerHTML = '';
  });

  it('does not close when clicking note popup flyout items', () => {
    const annotation = createAnnotation('123');
    renderPopup(annotation);

    const flyout = document.createElement('div');
    flyout.setAttribute('data-element', 'notePopupFlyout-123-inlineCommentPopup');
    const flyoutItem = document.createElement('button');
    flyout.appendChild(flyoutItem);
    document.body.appendChild(flyout);

    const handler = useOnClickOutside.mock.calls[0][1];
    handler({ target: flyoutItem });

    expect(dispatchMock).not.toHaveBeenCalled();
    expect(actions.closeElement).not.toHaveBeenCalled();
  });

  it('does not close when clicking note state flyout items', () => {
    const annotation = createAnnotation('456');
    renderPopup(annotation);

    const flyout = document.createElement('div');
    flyout.setAttribute('data-element', 'noteStateFlyout-456-inlineCommentPopup');
    const flyoutItem = document.createElement('button');
    flyout.appendChild(flyoutItem);
    document.body.appendChild(flyout);

    const handler = useOnClickOutside.mock.calls[0][1];
    handler({ target: flyoutItem });

    expect(dispatchMock).not.toHaveBeenCalled();
    expect(actions.closeElement).not.toHaveBeenCalled();
  });

  it('closes when clicking outside protected areas', () => {
    const annotation = createAnnotation('789');
    renderPopup(annotation);

    const handler = useOnClickOutside.mock.calls[0][1];
    handler({ target: document.body });

    expect(dispatchMock).toHaveBeenCalledWith(
      actions.closeElement(DataElements.INLINE_COMMENT_POPUP)
    );
  });
});
