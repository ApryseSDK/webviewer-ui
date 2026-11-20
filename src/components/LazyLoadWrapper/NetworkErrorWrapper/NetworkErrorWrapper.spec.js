import NetworkErrorWrapper from './NetworkErrorWrapper';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';

const NetworkErrorWrapperWithProviders = withProviders(NetworkErrorWrapper);

const ThrowChunkError = ({ errorMessage = 'Failed to fetch dynamically imported module' }) => {
  throw new Error(errorMessage);
};

const SuccessChild = () => <div>Child Component</div>;

describe('NetworkErrorWrapper component', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it('should render children without errors when there is no error', () => {
    const { container } = render(
      <NetworkErrorWrapperWithProviders dataElement="TestPopup">
        <SuccessChild />
      </NetworkErrorWrapperWithProviders>
    );

    expect(container.textContent).toContain('Child Component');
  });

  it('should display error toast when chunk load error is caught', () => {
    const { container } = render(
      <NetworkErrorWrapperWithProviders dataElement="TestPopup">
        <ThrowChunkError />
      </NetworkErrorWrapperWithProviders>
    );

    const errorToast = container.querySelector('.ErrorToast');
    expect(errorToast).toBeTruthy();
    expect(errorToast).toHaveAttribute('role', 'alert');
  });

  it('should detect all browser chunk error patterns', () => {
    const patterns = [
      'Loading chunk',
      'Failed to fetch dynamically imported module',
      'error loading dynamically imported module',
      'Importing a module script failed',
    ];

    patterns.forEach((pattern) => {
      const { container } = render(
        <NetworkErrorWrapperWithProviders dataElement="TestPopup">
          <ThrowChunkError errorMessage={pattern} />
        </NetworkErrorWrapperWithProviders>
      );

      expect(container.querySelector('.ErrorToast')).toBeTruthy();
    });
  });

  it('should dismiss error toast when close button is clicked', () => {
    const { container } = render(
      <NetworkErrorWrapperWithProviders dataElement="TestPopup">
        <ThrowChunkError />
      </NetworkErrorWrapperWithProviders>
    );

    const closeButton = container.querySelector('.ErrorToastClose');
    expect(closeButton).toBeTruthy();

    fireEvent.click(closeButton);

    expect(container.querySelector('.ErrorToast')).toBeFalsy();
    expect(container.textContent).not.toContain('Child Component');
  });

  it('should display dataElement in error message', () => {
    const { container } = render(
      <NetworkErrorWrapperWithProviders dataElement="TextPopup">
        <ThrowChunkError />
      </NetworkErrorWrapperWithProviders>
    );

    const errorToastContent = container.querySelector('.ErrorToastContent');
    expect(errorToastContent.textContent).toContain('TextPopup');
  });

  it('should re-throw non-chunk errors to outer error boundary', () => {
    const ThrowNonChunkError = () => {
      throw new Error('Some random error');
    };

    expect(() => {
      render(
        <NetworkErrorWrapperWithProviders dataElement="TestPopup">
          <ThrowNonChunkError />
        </NetworkErrorWrapperWithProviders>
      );
    }).toThrow('Some random error');
  });
});
