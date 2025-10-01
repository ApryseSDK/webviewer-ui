import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userEvent from '@testing-library/user-event';
import InsertImageButton from './index';
import PropTypes from 'prop-types';

const mockState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    featureFlags: {},
    activeDocumentViewerKey: 1,
    shortcutKeyMap: {},
    activeFlyout: null,
  },
};

const mockReducer = (state = mockState) => state;

const mockStore = configureStore({
  reducer: {
    viewer: mockReducer,
  },
  preloadedState: {
    viewer: mockState.viewer,
  },
  devTools: false,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

const TestWrapper = ({ children }) => (
  <Provider store={mockStore}>
    {children}
  </Provider>
);

TestWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

describe('InsertImageButton Integration Tests', () => {
  const defaultProps = {
    dataElement: 'test-insert-image-button',
    title: 'Insert Image',
    icon: 'test-icon.svg',
    label: 'Insert Image',
    onFileInputChange: jest.fn(),
    filePickerId: 'test-insert-image-button-file-picker',
    acceptedFormats: '.jpg,.jpeg,.png,.bmp',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render successfully with default props', () => {
      render(
        <TestWrapper>
          <InsertImageButton {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText('Insert Image')).toBeInTheDocument();
    });

    it('should not render the text label when no label is passed from the props', () => {
      const propsWithoutLabel = {
        dataElement: 'test-insert-image-button',
        title: 'Insert Image',
        icon: 'test-icon.svg',
      };
      render(
        <TestWrapper>
          <InsertImageButton {...propsWithoutLabel} />
        </TestWrapper>
      );
      expect(screen.queryByText('Insert Image')).not.toBeInTheDocument();
    });

    it('should render the image (icon) from given source', () => {
      render(
        <TestWrapper>
          <InsertImageButton {...defaultProps} />
        </TestWrapper>
      );
      const icon = screen.getByRole('img');
      expect(icon).toHaveAttribute('src', 'test-icon.svg');
    });

    it('should render as flyout item when isFlyoutItem is true', () => {
      render(
        <TestWrapper>
          <InsertImageButton {...defaultProps} isFlyoutItem={true} icon={<img src="test-icon.svg" alt="test icon" />} />
        </TestWrapper>
      );

      expect(screen.getByRole('listitem')).toBeInTheDocument();
      expect(screen.getByRole('img')).toBeInTheDocument();
      expect(screen.getByText('Insert Image')).toBeInTheDocument();
    });

    it('should render with file picker component', () => {
      render(
        <TestWrapper>
          <InsertImageButton
            {...defaultProps}
            filePickerMode="officeEditor"
            filePickerId="test-file-picker"
            acceptedFormats=".jpg,.png"
            onFileInputChange={jest.fn()}
          />
        </TestWrapper>
      );

      expect(screen.getByText('Insert Image')).toBeInTheDocument();
      const fileInput = screen.getByDisplayValue('');
      expect(fileInput).toHaveAttribute('type', 'file');
      expect(fileInput).toHaveAttribute('accept', '.jpg,.png');
    });
  });

  describe('User Interactions', () => {
    const renderTestComponent = (isFlyoutItem) => {
      const { container } = render(
        <TestWrapper>
          <InsertImageButton {...defaultProps} isFlyoutItem={isFlyoutItem} />
        </TestWrapper>
      );
      return container;
    };

    const testCases = [
      {
        description: 'should trigger picker when button is clicked',
        testFunction: async (isFlyoutItem) => {
          const mockClick = jest.fn();
          jest.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(mockClick);
          renderTestComponent(isFlyoutItem);

          const button = screen.getByText('Insert Image');
          await userEvent.click(button);

          expect(mockClick).toHaveBeenCalled();
          mockClick.mockRestore();
        }
      },
      {
        description: 'should handle file uploaded in file picker and process with the given fileInputHandler',
        testFunction: async (isFlyoutItem) => {
          const container = renderTestComponent(isFlyoutItem);
          const fileInput = container.querySelector('#test-insert-image-button-file-picker');
          const testFile = new File(['test content'], 'test.jpg', {
            type: 'image/jpeg'
          });

          await userEvent.upload(fileInput, testFile);
          expect(defaultProps.onFileInputChange).toHaveBeenCalledTimes(1);

          const [event] = defaultProps.onFileInputChange.mock.calls[0];
          expect(event.target).toBe(fileInput);
          expect(event.target.files).toHaveLength(1);
          expect(event.target.files[0].name).toBe('test.jpg');
        }
      },
      {
        description: 'should only accept the given formats of files',
        testFunction: (isFlyoutItem) => {
          const container = renderTestComponent(isFlyoutItem);
          const fileInput = container.querySelector('#test-insert-image-button-file-picker');
          expect(fileInput).toHaveAttribute('accept', '.jpg,.jpeg,.png,.bmp');
        }
      },
    ];

    const scenarios = [
      'Action Button',
      'Flyout item',
    ];

    const createTestsFromTestCases = (isFlyoutItem) => {
      testCases.map((test) => {
        return it(test.description, async () => {
          await test.testFunction(isFlyoutItem);
          jest.clearAllMocks();
        });
      });
    };

    scenarios.map((scenario) => {
      return describe(`with ${scenario}`, () => {
        let isFlyoutItem = scenario === 'Flyout item';
        createTestsFromTestCases(isFlyoutItem);
      });
    });
  });

  it('should handle custom styling and classes', () => {
    render(
      <TestWrapper>
        <InsertImageButton
          {...defaultProps}
          style={{ backgroundColor: 'red' }}
          className="custom-class"
        />
      </TestWrapper>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveStyle({ backgroundColor: 'red' });
    expect(button).toHaveClass('custom-class');
    expect(screen.getByText('Insert Image')).toBeInTheDocument();
  });
});