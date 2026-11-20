import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StreamingErrorToast from './StreamingErrorToast';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

describe('StreamingErrorToast', () => {
  it('should render the title and message', () => {
    render(<StreamingErrorToast onDismiss={jest.fn()} />);

    expect(screen.getByText('message.streamingErrorTitle')).toBeTruthy();
    expect(screen.getByText('message.streamingError')).toBeTruthy();
  });

  it('should render with role alert for accessibility', () => {
    const { container } = render(<StreamingErrorToast onDismiss={jest.fn()} />);

    expect(screen.getByRole('alert')).toBeTruthy();
    expect(container.querySelector('.ErrorToast.StreamingErrorToast')).toBeTruthy();
  });

  it('should call onDismiss when the close button is clicked', () => {
    const onDismiss = jest.fn();
    render(<StreamingErrorToast onDismiss={onDismiss} />);

    fireEvent.click(screen.getByRole('button'));

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
