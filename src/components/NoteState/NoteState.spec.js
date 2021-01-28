import React from 'react';
import { createStore } from "redux";
import { Provider } from "react-redux";
import { render, fireEvent } from '@testing-library/react';
import NoteStateWithOutI18n from "./NoteState";
import { Basic, PopupOpen } from "./NoteState.stories";

const NoteState = withI18n(NoteStateWithOutI18n);

function getAnnotationWithStatus(status = 'Accepted', isReply=false) {
  return {
    getStatus: () => status,
    isReply: () => isReply,
  };
}

function createReduxWrapper(dataElement, disabled) {
  const currentState = { viewer: { disabledElements: {} } };
  currentState.viewer.disabledElements[dataElement] = { disabled };
  function rootReducer(state = currentState, action) { // eslint-disable-line no-unused-vars
    return state;
  }
  const store = createStore(rootReducer);
  return function ReduxWrapper(props) {
    const { children } = props; // eslint-disable-line react/prop-types
    return (
      <Provider store={store}>
        {children}
      </Provider>
    );
  };
}

describe('NoteState', () => {
  it('Should not throw errors if no props given', () => {
    expect(() => {
      render(<NoteState />);
    }).not.toThrow();
  });

  it('Should not throw errors for basic story', () => {
    const BasicStory = withI18n(Basic);
    expect(() => {
      render(<BasicStory />);
    }).not.toThrow();
  });

  it('Should not throw errors for popup open story', () => {
    const PopupOpenStory = withI18n(PopupOpen);
    expect(() => {
      render(<PopupOpenStory />);
    }).not.toThrow();
  });

  it('Should include NoteState element when not disabled', () => {
    const annotation = getAnnotationWithStatus('Accepted');
    const { container } = render( <NoteState annotation={annotation} isSelected /> );
    const noteStateElement = container.querySelector('.NoteState');
    expect(noteStateElement).toBeInTheDocument();
    expect(noteStateElement).toHaveAttribute('data-element', 'noteState');
  });
  it('Should include all states in popup', () => {
    const annotation = getAnnotationWithStatus('Accepted');
    const { container } = render( <NoteState annotation={annotation} isSelected openOnInitialLoad/> );

    expect(container.querySelector('.note-state-options')).toBeInTheDocument();
    expect(container.querySelector('div[data-element="notePopupState"]')).toBeInTheDocument();

    expect(container.querySelector('div[data-element="notePopupStateAccepted"]')).toBeInTheDocument();
    let svg = container.querySelector('div[data-element="notePopupStateAccepted"] .Icon svg');
    expect(svg).toHaveAttribute('data-filename', expect.stringContaining('icon-annotation-status-accepted.svg'));

    expect(container.querySelector('div[data-element="notePopupStateRejected"]')).toBeInTheDocument();
    svg = container.querySelector('div[data-element="notePopupStateRejected"] .Icon svg');
    expect(svg).toHaveAttribute('data-filename', expect.stringContaining('icon-annotation-status-rejected.svg'));

    expect(container.querySelector('div[data-element="notePopupStateCancelled"]')).toBeInTheDocument();
    svg = container.querySelector('div[data-element="notePopupStateCancelled"] .Icon svg');
    expect(svg).toHaveAttribute('data-filename', expect.stringContaining('icon-annotation-status-cancelled.svg'));

    expect(container.querySelector('div[data-element="notePopupStateCompleted"]')).toBeInTheDocument();
    svg = container.querySelector('div[data-element="notePopupStateCompleted"] .Icon svg');
    expect(svg).toHaveAttribute('data-filename', expect.stringContaining('icon-annotation-status-completed.svg'));

    expect(container.querySelector('div[data-element="notePopupStateNone"]')).toBeInTheDocument();
    svg = container.querySelector('div[data-element="notePopupStateNone"] .Icon svg');
    expect(svg).toHaveAttribute('data-filename', expect.stringContaining('icon-annotation-status-none.svg'));

    expect(container.querySelector('div[data-element="notePopupStateMarked"]')).toBeInTheDocument();
    svg = container.querySelector('div[data-element="notePopupStateMarked"] .Icon svg');
    expect(svg).toHaveAttribute('data-filename', expect.stringContaining('icon-annotation-status-marked.svg'));

    expect(container.querySelector('div[data-element="notePopupStateUnmarked"]')).toBeInTheDocument();
    svg = container.querySelector('div[data-element="notePopupStateUnmarked"] .Icon svg');
    expect(svg).toHaveAttribute('data-filename', expect.stringContaining('icon-annotation-status-unmarked.svg'));
  });

  it('Should not show notePopupState element when it is disabled', () => {
    const annotation = getAnnotationWithStatus();
    const ReduxWrapper = createReduxWrapper('notePopupState', true);
    const { container } = render(
      <ReduxWrapper>
        <NoteState annotation={annotation} isSelected openOnInitialLoad/>
      </ReduxWrapper>
    );
    expect(container.querySelector('.note-state-options')).toBeInTheDocument();
    expect(container.querySelector('div[data-element="notePopupState"]')).not.toBeInTheDocument();
  });

  it('Should not show Accepted state when it is disabled', () => {
    const annotation = getAnnotationWithStatus('Rejected');
    const ReduxWrapper = createReduxWrapper('notePopupStateAccepted', true);
    const { container } = render(
      <ReduxWrapper>
        <NoteState annotation={annotation} isSelected openOnInitialLoad/>
      </ReduxWrapper>
    );
    expect(container.querySelector('.note-state-options')).toBeInTheDocument();
    expect(container.querySelector('div[data-element="notePopupStateAccepted"]')).not.toBeInTheDocument();
  });
  it('Should not show Rejected state when it is disabled', () => {
    const annotation = getAnnotationWithStatus();
    const ReduxWrapper = createReduxWrapper('notePopupStateRejected', true);
    const { container } = render(
      <ReduxWrapper>
        <NoteState annotation={annotation} isSelected openOnInitialLoad/>
      </ReduxWrapper>
    );
    //debug()
    expect(container.querySelector('.note-state-options')).toBeInTheDocument();
    expect(container.querySelector('div[data-element="notePopupStateRejected"]')).not.toBeInTheDocument();
  });
  it('Should not show Cancelled state when it is disabled', () => {
    const annotation = getAnnotationWithStatus();
    const ReduxWrapper = createReduxWrapper('notePopupStateCancelled', true);
    const { container } = render(
      <ReduxWrapper>
        <NoteState annotation={annotation} isSelected openOnInitialLoad/>
      </ReduxWrapper>
    );
    expect(container.querySelector('.note-state-options')).toBeInTheDocument();
    expect(container.querySelector('div[data-element="notePopupStateCancelled"]')).not.toBeInTheDocument();
  });
  it('Should not show Completed state when it is disabled', () => {
    const annotation = getAnnotationWithStatus();
    const ReduxWrapper = createReduxWrapper('notePopupStateCompleted', true);
    const { container } = render(
      <ReduxWrapper>
        <NoteState annotation={annotation} isSelected openOnInitialLoad/>
      </ReduxWrapper>
    );
    expect(container.querySelector('.note-state-options')).toBeInTheDocument();
    expect(container.querySelector('div[data-element="notePopupStateCompleted"]')).not.toBeInTheDocument();
  });
  it('Should not show None state when it is disabled', () => {
    const annotation = getAnnotationWithStatus();
    const ReduxWrapper = createReduxWrapper('notePopupStateNone', true);
    const { container } = render(
      <ReduxWrapper>
        <NoteState annotation={annotation} isSelected openOnInitialLoad/>
      </ReduxWrapper>
    );
    expect(container.querySelector('.note-state-options')).toBeInTheDocument();
    expect(container.querySelector('div[data-element="notePopupStateNone"]')).not.toBeInTheDocument();
  });
  it('Should not show Marked state when it is disabled', () => {
    const annotation = getAnnotationWithStatus();
    const ReduxWrapper = createReduxWrapper('notePopupStateMarked', true);
    const { container } = render(
      <ReduxWrapper>
        <NoteState annotation={annotation} isSelected openOnInitialLoad/>
      </ReduxWrapper>
    );
    expect(container.querySelector('.note-state-options')).toBeInTheDocument();
    expect(container.querySelector('div[data-element="notePopupStateMarked"]')).not.toBeInTheDocument();
  });
  it('Should not show Unmarked state when it is disabled', () => {
    const annotation = getAnnotationWithStatus();
    const ReduxWrapper = createReduxWrapper('notePopupStateUnmarked', true);
    const { container } = render(
      <ReduxWrapper>
        <NoteState annotation={annotation} isSelected openOnInitialLoad/>
      </ReduxWrapper>
    );
    expect(container.querySelector('.note-state-options')).toBeInTheDocument();
    expect(container.querySelector('div[data-element="notePopupStateUnmarked"]')).not.toBeInTheDocument();
  });

  it('Should not render component if annotation state is "None" and not selected', () => {
    const annotation = getAnnotationWithStatus('None');
    const { container } = render( <NoteState annotation={annotation} isSelected={false} /> );
    expect(container.querySelector('div[data-element="noteState"]')).not.toBeInTheDocument();
  });

  it('Should not render component if annotation is reply', () => {
    const annotation = getAnnotationWithStatus('Accepted', true);
    const { container } = render(
      <NoteState annotation={annotation} isSelected />
    );
    expect(container.querySelector('div[data-element="noteState"]')).not.toBeInTheDocument();
  });
  it('State selection popup should be closed by default', () => {
    const annotation = getAnnotationWithStatus('Accepted');
    const { container } = render( <NoteState annotation={annotation} /> );
    expect(container.querySelector('.note-state-options')).not.toBeInTheDocument();
  });
  it('Should open popup when noteState element clicked', () => {
    const annotation = getAnnotationWithStatus('Accepted');
    const { container } = render( <NoteState annotation={annotation} /> );
    expect(container.querySelector('.note-state-options')).not.toBeInTheDocument();
    const noteState = container.querySelector('div[data-element="noteState"]');
    expect(noteState).toBeInTheDocument();
    fireEvent.click(noteState);
    expect(container.querySelector('.note-state-options')).toBeInTheDocument();
  });

  it('Should close popup when closed clicked outside of popup menu', () => {
    const annotation = getAnnotationWithStatus('Accepted');
    const { container } = render(
      <React.Fragment>
        <div id="elementOutside">This is outside</div>
        <NoteState annotation={annotation} openOnInitialLoad/>
      </React.Fragment>
    );
    expect(container.querySelector('.note-state-options')).toBeInTheDocument();
    const outsideDiv = container.querySelector('#elementOutside');
    fireEvent.mouseDown(outsideDiv);
    expect(container.querySelector('.note-state-options')).not.toBeInTheDocument();
  });

  function verifyNoteStateChangedCorrectlyAfterClick(dataElement, stateValue){
    const annotation = getAnnotationWithStatus('UnitTest');
    const handleStateChangeMock = jest.fn();
    const { container } = render(
      <NoteState annotation={annotation} openOnInitialLoad handleStateChange={handleStateChangeMock} />
    );
    const noteState = container.querySelector(`div[data-element="${dataElement}"]`);
    expect(noteState).toBeInTheDocument();
    fireEvent.click(noteState);
    expect(handleStateChangeMock).toBeCalledWith(stateValue);
  }

  it('Should have correct arguments when Accepted element clicked', () => {
    verifyNoteStateChangedCorrectlyAfterClick('notePopupStateAccepted', 'Accepted');
  });
  it('Should have correct arguments when Rejected element clicked', () => {
    verifyNoteStateChangedCorrectlyAfterClick('notePopupStateRejected', 'Rejected');
  });
  it('Should have correct arguments when Cancelled element clicked', () => {
    verifyNoteStateChangedCorrectlyAfterClick('notePopupStateCancelled', 'Cancelled');
  });
  it('Should have correct arguments when Completed element clicked', () => {
    verifyNoteStateChangedCorrectlyAfterClick('notePopupStateCompleted', 'Completed');
  });
  it('Should have correct arguments when None element clicked', () => {
    verifyNoteStateChangedCorrectlyAfterClick('notePopupStateNone', 'None');
  });
  it('Should have correct arguments when Marked element clicked', () => {
    verifyNoteStateChangedCorrectlyAfterClick('notePopupStateMarked', 'Marked');
  });
  it('Should have correct arguments when Unmarked element clicked', () => {
    verifyNoteStateChangedCorrectlyAfterClick('notePopupStateUnmarked', 'Unmarked');
  });
});
