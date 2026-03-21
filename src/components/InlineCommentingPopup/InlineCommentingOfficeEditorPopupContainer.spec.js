import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import InlineCommentingOfficeEditorPopupContainer from './InlineCommentingOfficeEditorPopupContainer';
import InlineCommentingPopup from './InlineCommentingPopup';
import InlineCommentingOfficeEditorTabs from './InlineCommentingOfficeEditorTabs';
import useCore from 'hooks/useCore';
import { useSelector } from 'react-redux';
import { getOverlappingOfficeEditorAnnotations } from 'helpers/inlineCommentingOfficeEditorOverlap';
import { annotationMapKeys, mapAnnotationToKey } from 'constants/map';

jest.mock('hooks/useCore', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  shallowEqual: jest.fn(),
}));

jest.mock('helpers/inlineCommentingOfficeEditorOverlap', () => ({
  getOverlappingOfficeEditorAnnotations: jest.fn(),
}));

jest.mock('./InlineCommentingPopup', () => jest.fn(() => null));

jest.mock('react-i18next', () => ({
  useTranslation: () => [(key) => key],
}));

jest.mock('constants/map', () => ({
  annotationMapKeys: {
    OFFICE_EDITOR_COMMENT: 'officeEditorComment',
    TRACKED_CHANGE: 'trackedChange',
  },
  mapAnnotationToKey: jest.fn(),
}));

const baseProps = {
  isMobile: false,
  isUndraggable: false,
  isNotesPanelClosed: false,
  popupRef: { current: null },
  position: { top: 0, left: 0 },
  closeAndReset: () => {},
  contextValue: {},
  annotationForAttachment: undefined,
  addAttachments: () => {},
};

describe('InlineCommentingOfficeEditorPopupContainer', () => {
  const setup = () => {
    const core = {
      getAnnotationsList: jest.fn(() => []),
      deselectAllAnnotations: jest.fn(),
      selectAnnotation: jest.fn(),
    };
    useCore.mockReturnValue({ core });
    useSelector.mockImplementation((selector) => selector({
      viewer: {
        isMultiViewerMode: false,
        activeDocumentViewerKey: 1,
        openElements: {},
        disabledElements: {},
      },
    }));
    return core;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('selects the clicked annotation when it differs from the current one', () => {
    const core = setup();
    const commentingAnnotation = { id: 'c-1' };
    const trackedChangeAnnotation = { id: 'tc-1' };

    mapAnnotationToKey.mockReturnValue(annotationMapKeys.OFFICE_EDITOR_COMMENT);
    getOverlappingOfficeEditorAnnotations.mockReturnValue({
      trackedChangeAnnotation,
      commentAnnotation: commentingAnnotation,
    });

    render(
      <InlineCommentingOfficeEditorPopupContainer
        {...baseProps}
        commentingAnnotation={commentingAnnotation}
      />
    );

    const tabsElement = InlineCommentingPopup.mock.calls[0][0].renderTabs();
    const { getByRole } = render(
      <InlineCommentingOfficeEditorTabs {...tabsElement.props} />
    );
    fireEvent.click(getByRole('tab', { name: 'officeEditor.changes' }));

    expect(core.deselectAllAnnotations).toHaveBeenCalled();
    expect(core.selectAnnotation).toHaveBeenCalledWith(trackedChangeAnnotation);
  });
});
