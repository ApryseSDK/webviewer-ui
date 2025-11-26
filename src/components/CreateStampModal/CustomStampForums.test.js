import CustomStampForums from 'components/CreateStampModal/CustomStampForums';
import CreateStampModal from 'components/CreateStampModal/CreateStampModal';
import { render, fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

const ModalBodyWithI18n = withProviders(CustomStampForums);

const noop = () => { };

const props = {
  dateTimeFormats: [
    {
      date: 'DD/MM/YYYY',
      time: 'h:mm A',
      timeFirst: false,
    },
    {
      date: 'DD/MM/YYYY',
      time: 'HH:mm',
      timeFirst: false,
    }
  ],
  fonts: [
    'Arial',
    'Times New Roman',
  ],
  getCustomColorAndRemove: noop,
  openColorPicker: noop,
  openDeleteModal: noop,
  setEmptyInput: noop,
  setState: noop,
  stampTool: {
    drawCustomStamp: noop,
  },
  /* eslint-disable custom/no-hex-colors */
  state: {
    bold: true,
    color: '#2A85D0',
    dataURL: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=',
    font: 'Tahoma',
    height: 100,
    italic: false,
    strikeout: false,
    subtitle: '[$currentUser] DD MMM YYYY HH:mm',
    textColor: '#FFFFFF',
    title: 'Draft',
    underline: false,
    width: 300,
  },
  /* eslint-enable custom/no-hex-colors */
  userName: 'Guest',
};

const initialState = {
  user: {
    name: 'Guest',
  },
  viewer: {
    activeDocumentViewerKey: 1,
    disabledElements: {},
    customElementOverrides: {},
    openElements: {
      customStampModal: true
    },
  },
  stampTool: {
    drawCustomStamp: noop,
  },
};

function rootReducer(state = initialState, action) { // eslint-disable-line no-unused-vars
  return state;
}

// Apply the thunk middleware
const store = createStore(rootReducer, applyMiddleware(thunk));

function withMockRedux(Component) {
  return function WithMockReduxWrapper(props) {
    return (
      <Provider store={store}>
        <Component {...props} />
      </Provider>
    );
  };
}

const ModalCustomStamp = withMockRedux(CreateStampModal);
const mockCustomStampTool = {
  drawCustomStamp: () => 0
};

jest.mock('core', () => ({
  getToolsFromAllDocumentViewers: () => [
    mockCustomStampTool
  ],
  deselectAllAnnotations: noop,
  getCurrentUser: () => 'Guest'
}));

describe('Custom Stamp Modal Body Tests', () => {
  it('should render correctly', () => {
    render(<ModalBodyWithI18n {...props} />);
    // Correctly adds a alt text to the image
    screen.getByRole('img', { name: /Preview of Draft, Guest/ });

    // should have two dropdowns, 1 input, 3 checkboxes
    const dropdowns = screen.getAllByRole('combobox');
    expect(dropdowns.length).toBe(2);
    const textInput = screen.getAllByRole('textbox');
    expect(textInput.length).toBe(1);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBe(3);
  });

  it('Should change state and call draw canvas', () => {
    const setStateMock = jest.fn();
    const stampToolMock = {
      drawCustomStamp: jest.fn(),
    };
    const { container } = render(
      <ModalBodyWithI18n
        {...props} setState={setStateMock} stampTool={stampToolMock}
      />
    );
    // Fire interaction events and check if setState and drawCustomStamp are called
    let expectedCalls = 1; // Calls 1 time on intial Render
    const textInput = container.querySelector('input[type="text"]');
    fireEvent.change(textInput, { target: { value: 'test' } });
    expectedCalls++;
    for (const checkbox of container.querySelectorAll('input[type="checkbox"]')) {
      fireEvent.click(checkbox);
      expectedCalls++;
    }
    for (const button of container.querySelectorAll('.Button')) {
      fireEvent.click(button);
      expectedCalls++;
    }
    expect(setStateMock).toHaveBeenCalledTimes(expectedCalls);
    expect(stampToolMock.drawCustomStamp).toHaveBeenCalledTimes(expectedCalls);
  });
  it('should render correctly and create button has a role', async () => {
    render(<ModalCustomStamp />);
    const button = screen.getByRole('button', { name: 'Create' });
    expect(button).toBeInTheDocument();
  });
  it('Date Format should have a role and name', async () => {
    render(<ModalBodyWithI18n {...props} />);
    const input = screen.getByRole('button', { name: 'More info about date format' });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-label', 'More info about date format');
  });
  it('should have the subtitle as expected when updating timestamp text checkboxes', async () => {
    const setStateMock = jest.fn();
    const stampToolMock = {
      drawCustomStamp: jest.fn(),
    };
    render(
      <ModalBodyWithI18n
        {...props} setState={setStateMock} stampTool={stampToolMock}
      />
    );
    const usernameCheckbox = screen.getByRole('checkbox', { name: /Username/i });
    const dateCheckbox = screen.getByRole('checkbox', { name: /Date/i });
    fireEvent.click(dateCheckbox);
    fireEvent.click(usernameCheckbox);
    expect(stampToolMock.drawCustomStamp).toHaveBeenLastCalledWith(
      expect.objectContaining({
        subtitle: props.dateTimeFormats[0].time
      })
    );
  });
});