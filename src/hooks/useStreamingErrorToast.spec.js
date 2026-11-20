import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import useStreamingErrorToast from './useStreamingErrorToast';
import InstanceIdContext from 'src/context/InstanceIdContext';

const makeEmitter = () => {
  const listeners = {};
  return {
    addEventListener: (event, fn) => {
      listeners[event] = listeners[event] || [];
      listeners[event].push(fn);
    },
    removeEventListener: (event, fn) => {
      if (listeners[event]) {
        listeners[event] = listeners[event].filter((l) => l !== fn);
      }
    },
    emit: (event) => (listeners[event] || []).slice().forEach((fn) => fn()),
  };
};

const makeViewer = (initialDoc = null) => {
  const viewer = makeEmitter();
  let currentDoc = initialDoc;
  viewer.getDocument = () => currentDoc;
  viewer.setDocument = (doc) => {
    currentDoc = doc; viewer.emit('documentLoaded');
  };
  return viewer;
};

let mockViewers = [];
const mockInstanceViewers = new Map();
const mockDefaultCore = { getDocumentViewers: () => mockViewers };
jest.mock('hooks/useCore/useCore', () => ({
  useInstanceCore: () => {
    const React = require('react');
    const InstanceIdContext = require('src/context/InstanceIdContext').default;
    return mockInstanceViewers.get(React.useContext(InstanceIdContext)) || mockDefaultCore;
  },
}));

const TestConsumer = () => {
  const { isVisible, dismiss } = useStreamingErrorToast();
  return (
    <div>
      <span data-testid='visible'>{String(isVisible)}</span>
      <button onClick={dismiss}>dismiss</button>
    </div>
  );
};

const makeStore = (overrides = {}) => configureStore({
  reducer: () => ({
    viewer: {
      isMultiViewerMode: false,
      activeDocumentViewerKey: 1,
      ...overrides,
    },
  }),
});

const renderWithStore = (store) =>
  render(<Provider store={store}><TestConsumer /></Provider>);

describe('useStreamingErrorToast', () => {
  beforeEach(() => {
    mockViewers = [];
    mockInstanceViewers.clear();
  });

  it('should be hidden initially', () => {
    renderWithStore(makeStore());
    expect(screen.getByTestId('visible').textContent).toBe('false');
  });

  it('should become visible when a viewer document fires downloadError', () => {
    const doc = makeEmitter();
    mockViewers = [makeViewer(doc)];

    renderWithStore(makeStore());
    act(() => {
      doc.emit('downloadError');
    });

    expect(screen.getByTestId('visible').textContent).toBe('true');
  });

  it('should hide when dismiss is called', () => {
    const doc = makeEmitter();
    mockViewers = [makeViewer(doc)];

    renderWithStore(makeStore());
    act(() => {
      doc.emit('downloadError');
    });
    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByTestId('visible').textContent).toBe('false');
  });

  describe('going offline', () => {
    const makeStreamedDoc = ({ linearized = true, complete = false } = {}) => Object.assign(makeEmitter(), {
      isLinearized: () => linearized,
      isDocumentComplete: () => complete,
    });
    const goOffline = () => act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    it('should become visible when a streamed document is still downloading', () => {
      mockViewers = [makeViewer(makeStreamedDoc())];
      renderWithStore(makeStore());

      goOffline();

      expect(screen.getByTestId('visible').textContent).toBe('true');
    });

    it.each([
      ['fully downloaded', { complete: true }],
      ['not streamed', { linearized: false }],
    ])('should stay hidden when the document is %s', (_name, options) => {
      mockViewers = [makeViewer(makeStreamedDoc(options))];
      renderWithStore(makeStore());

      goOffline();

      expect(screen.getByTestId('visible').textContent).toBe('false');
    });

    it('should stop listening once unmounted', () => {
      mockViewers = [makeViewer(makeStreamedDoc())];
      const { unmount } = renderWithStore(makeStore());
      const removeSpy = jest.spyOn(window, 'removeEventListener');

      unmount();

      expect(removeSpy).toHaveBeenCalledWith('offline', expect.any(Function));
      removeSpy.mockRestore();
    });
  });

  it('should keep the toast visible when another viewer loads a document', () => {
    const doc = makeEmitter();
    const sibling = makeViewer(makeEmitter());
    mockViewers = [makeViewer(doc), sibling];
    renderWithStore(makeStore());

    act(() => doc.emit('downloadError'));
    act(() => sibling.setDocument(makeEmitter()));

    expect(screen.getByTestId('visible').textContent).toBe('true');
    fireEvent.click(screen.getByRole('button'));
    act(() => doc.emit('downloadError'));
    expect(screen.getByTestId('visible').textContent).toBe('false');
  });

  it('should detach an unloaded document and clear its toast', () => {
    const doc = makeEmitter();
    const viewer = makeViewer(doc);
    mockViewers = [viewer];
    renderWithStore(makeStore());

    act(() => doc.emit('downloadError'));
    act(() => viewer.emit('documentUnloaded'));
    expect(screen.getByTestId('visible').textContent).toBe('false');
    act(() => doc.emit('downloadError'));
    expect(screen.getByTestId('visible').textContent).toBe('false');
  });

  it('should subscribe only to its own WebViewer instance', () => {
    const docA = makeEmitter();
    const docB = makeEmitter();
    mockInstanceViewers.set('a', { getDocumentViewers: () => [makeViewer(docA)] });
    mockInstanceViewers.set('b', { getDocumentViewers: () => [makeViewer(docB)] });
    const renderInstance = (id) => render(
      <InstanceIdContext.Provider value={id}>
        <Provider store={makeStore()}><TestConsumer /></Provider>
      </InstanceIdContext.Provider>
    );
    const instanceA = renderInstance('a');
    const instanceB = renderInstance('b');

    act(() => docA.emit('downloadError'));
    expect(instanceA.container.querySelector('[data-testid="visible"]').textContent).toBe('true');
    expect(instanceB.container.querySelector('[data-testid="visible"]').textContent).toBe('false');

    instanceA.unmount();
    act(() => docA.emit('downloadError'));
    expect(instanceB.container.querySelector('[data-testid="visible"]').textContent).toBe('false');
    act(() => docB.emit('downloadError'));
    expect(instanceB.container.querySelector('[data-testid="visible"]').textContent).toBe('true');
  });

  it('should re-subscribe and pick up a new viewer when isMultiViewerMode changes', () => {
    const doc1 = makeEmitter();
    const viewer1 = makeViewer(doc1);
    mockViewers = [viewer1];

    const store = configureStore({
      reducer: (state = { viewer: { isMultiViewerMode: false, activeDocumentViewerKey: 1 } }, action) => {
        if (action.type === 'SET_MULTI') {
          return { viewer: { isMultiViewerMode: true, activeDocumentViewerKey: 1 } };
        }
        return state;
      },
    });

    renderWithStore(store);
    expect(screen.getByTestId('visible').textContent).toBe('false');

    // Add a second viewer, then trigger a re-subscribe via store update.
    const doc2 = makeEmitter();
    mockViewers = [viewer1, makeViewer(doc2)];
    act(() => {
      store.dispatch({ type: 'SET_MULTI' });
    });

    // The new viewer's doc should now trigger the toast.
    act(() => {
      doc2.emit('downloadError');
    });
    expect(screen.getByTestId('visible').textContent).toBe('true');
  });
});
