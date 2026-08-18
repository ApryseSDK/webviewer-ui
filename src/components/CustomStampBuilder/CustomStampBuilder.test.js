import CustomStampBuilder from 'src/components/CustomStampBuilder/CustomStampBuilder';
import CreateStampModal from 'components/CreateStampModal/CreateStampModal';
import { render, fireEvent, screen } from '@testing-library/react';
import React from 'react';

const noop = () => { };

const fonts = [
  'Arial',
  'Times New Roman',
];

const dateTimeFormats = [
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
];

const props = {
  dateTimeFormats: dateTimeFormats,
  fonts: fonts,
  getCustomColorAndRemove: noop,
  openColorPicker: noop,
  openDeleteModal: noop,
  setEmptyInput: noop,
  setStamp: noop,
  stampTool: {
    drawCustomStamp: noop,
  },
  /* eslint-disable custom/no-hex-colors */
  stamp: {
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
    fonts: fonts,
    dateTimeFormats: dateTimeFormats,
  },
  stampTool: {
    drawCustomStamp: noop,
  },
  featureFlags: {
    newStampPanel: true,
  },
};

const ModalBodyWithI18n = withProviders(CustomStampBuilder, initialState);
const ModalCustomStamp = withProviders(CreateStampModal, initialState);
const mockCustomStampTool = {
  drawCustomStamp: () => 0
};

jest.mock('core', () => ({
  getToolsFromAllDocumentViewers: () => [
    mockCustomStampTool
  ],
  deselectAllAnnotations: noop,
  getCurrentUser: () => 'Guest',
  getDocumentViewer: jest.fn(),
}));

describe('Custom Stamp Modal Body Tests', () => {
  it('should render correctly', () => {
    render(<ModalBodyWithI18n {...props} />);
    // Correctly adds a alt text to the image
    screen.getByRole('img', { name: /Preview of Draft, Guest/ });

    // should have 3 dropdowns, 1 input, 3 checkboxes
    const dropdowns = screen.getAllByRole('combobox');
    expect(dropdowns).toHaveLength(3);
    const textInput = screen.getAllByRole('textbox');
    expect(textInput).toHaveLength(1);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(3);
  });

  it('Should change stamp state', () => {
    const setStampMock = jest.fn();
    const stampToolMock = {
      drawCustomStamp: jest.fn(),
    };
    const { container } = render(
      <ModalBodyWithI18n
        {...props} setStamp={setStampMock} stampTool={stampToolMock}
      />
    );
    // Fire interaction events and check if setStamp is called
    let expectedCalls = 1; // Calls 1 time on initial Render
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
    expect(setStampMock).toHaveBeenCalledTimes(expectedCalls);
  });


  it('Should call draw canvas', () => {
    const setStampMock = jest.fn();
    const stampToolMock = {
      drawCustomStamp: jest.fn(),
    };
    const { container } = render(
      <ModalBodyWithI18n
        {...props} setStamp={setStampMock} stampTool={stampToolMock}
      />
    );
    // Fire interaction events and check if drawCustomStamp is called
    let expectedCalls = 2; // Calls 1 time on initial Render and 1 more to update based on timestamp
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
    const setStampMock = jest.fn();
    const stampToolMock = {
      drawCustomStamp: jest.fn(),
    };
    render(
      <ModalBodyWithI18n
        {...props} setStamp={setStampMock} stampTool={stampToolMock}
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