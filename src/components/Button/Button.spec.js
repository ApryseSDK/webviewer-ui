import Button from './Button';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { setClickMiddleWare } from 'helpers/clickTracker';

const ButtonWithProviders = withProviders(Button);


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
});
