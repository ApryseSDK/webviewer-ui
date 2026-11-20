import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import rootReducer from 'src/redux/reducers/rootReducer';
import actions from 'actions';
import CustomModal, { ModalSection } from './CustomModal';

describe('CustomModal', () => {
  function renderOpenModal(modalOptions) {
    const store = configureStore({ reducer: rootReducer() });
    store.dispatch(actions.addCustomModal({ dataElement: 'testCustomModal', ...modalOptions }));
    store.dispatch(actions.openElement('testCustomModal'));
    return render(
      <Provider store={store}>
        <CustomModal />
      </Provider>
    );
  }

  it('should render a ModalSection with content when section data is provided', () => {
    const { getByText } = renderOpenModal({ header: { title: 'My header' } });
    expect(getByText('My header')).toBeInTheDocument();
  });

  it('should not render a ModalSection body when no body data is provided', () => {
    const { container, getByText } = renderOpenModal({ header: { title: 'My header' } });
    expect(getByText('My header')).toBeInTheDocument();
    // Nothing else is passed, so the header text is the only content a user would see.
    expect(container.textContent).toBe('My header');
  });

  it('should not throw a hook-order error when a mounted ModalSection goes from having data to having none', () => {
    const { getByText, queryByText, rerender } = render(<ModalSection type="body" data={{ title: 'My body' }} />);
    expect(getByText('My body')).toBeInTheDocument();

    expect(() => {
      rerender(<ModalSection type="body" data={undefined} />);
    }).not.toThrow();

    expect(queryByText('My body')).not.toBeInTheDocument();
  });
});
