import Button from './Button';
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { setClickMiddleWare } from 'helpers/clickTracker';
import userEvent from '@testing-library/user-event';
import { BasicButton } from './Button.stories';

const ButtonWithProviders = withProviders(Button);
const ButtonStory = BasicButton;

describe('Button component', () => {
  it('Triggers middleware when clicked', () => {
    const container = render(<ButtonWithProviders dataElement="test"/>);
    const middleware = jest.fn();
    setClickMiddleWare(middleware);
    const button = container.getByRole('button');
    fireEvent.click(button);
    expect(middleware).toHaveBeenCalledTimes(1);
    expect(middleware).toHaveBeenCalledWith('test', { type: 'button' });
  });

  it('Check aria current', async () => {
    render(<ButtonStory />);
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('aria-current', 'false');

    await userEvent.click(button);

    expect(button).toHaveAttribute('aria-current', 'true');
  });

  it('Check aria selected', async () => {
    render(<ButtonStory />);
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('aria-selected', 'false');

    await userEvent.click(button);

    expect(button).toHaveAttribute('aria-selected', 'true');
  });

  it('Check aria pressed', async () => {
    render(<ButtonStory />);
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('aria-pressed', 'false');

    await userEvent.click(button);

    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('Check aria expanded', async () => {
    render(<ButtonStory />);
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(button);

    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('can render text even when it has a colon', () => {
    render(<ButtonWithProviders label={'The time is 4:20pm'}/>);
    screen.getByText('The time is 4:20pm');
  });
});
