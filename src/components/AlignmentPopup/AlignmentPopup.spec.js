import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Basic } from './AlignmentPopup.stories';
import { setClickMiddleWare } from 'helpers/clickTracker';

const alignmentConfig = [];
const distributeConfig = [];
const TestAlignmentPopup = withProviders(Basic);

function renderPopup() {
  render(
    <TestAlignmentPopup
      alignmentConfig={alignmentConfig}
      alignmentOnClick={jest.fn()}
      backToMenuOnClick={jest.fn()}
      distributeConfig={distributeConfig}
      distributeOnClick={jest.fn()}
    />
  );
}

function setupMiddleWare() {
  const middleware = jest.fn();
  setClickMiddleWare(middleware);
  return middleware;
}

describe('AlignmentPopup Component', () => {
  it('Should not throw any errors when rendering storybook component', () => {
    expect(() => {
      render(<TestAlignmentPopup />);
    }).not.toThrow();
  });

  it('Should call Align Left when Align Left button is pressed', () => {
    const middleware = setupMiddleWare();
    renderPopup();
    const alignLeftButton = screen.getByRole('button', { name: 'Align Left' });

    fireEvent.click(alignLeftButton);
    expect(middleware).toHaveBeenCalledTimes(1);
  });

  it('Should call Align Right when Align Right button is pressed', () => {
    const middleware = setupMiddleWare();
    renderPopup();
    const alignRightButton = screen.getByRole('button', { name: 'Align Right' });

    fireEvent.click(alignRightButton);
    expect(middleware).toHaveBeenCalledTimes(1);
  });

  it('Should call Align Top when Align Top button is pressed', () => {
    const middleware = setupMiddleWare();
    renderPopup();
    const alignTopButton = screen.getByRole('button', { name: 'Align Top' });

    fireEvent.click(alignTopButton);
    expect(middleware).toHaveBeenCalledTimes(1);
  });

  it('Should call Align Bottom when Align Bottom button is pressed', () => {
    const middleware = setupMiddleWare();
    renderPopup();
    const alignBottomButton = screen.getByRole('button', { name: 'Align Bottom' });

    fireEvent.click(alignBottomButton);
    expect(middleware).toHaveBeenCalledTimes(1);
  });

  it('Should call Align Horizontal Center when Align Horizontal Center button is pressed', () => {
    const middleware = setupMiddleWare();
    renderPopup();
    const alignHorizontalCenterButton = screen.getByRole('button', { name: 'Align Horizontal Center' });

    fireEvent.click(alignHorizontalCenterButton);
    expect(middleware).toHaveBeenCalledTimes(1);
  });

  it('Should call Align Vertical Center when Align Vertical Center button is pressed', () => {
    const middleware = setupMiddleWare();
    renderPopup();
    const alignVerticalCenterButton = screen.getByRole('button', { name: 'Align Vertical Center' });

    fireEvent.click(alignVerticalCenterButton);
    expect(middleware).toHaveBeenCalledTimes(1);
  });

  it('Should call Distribute Horizontally when Distribute Horizontally button is pressed', () => {
    const middleware = setupMiddleWare();
    renderPopup();
    const distributeHorizontalButton = screen.getByRole('button', { name: 'Distribute Horizontally' });

    fireEvent.click(distributeHorizontalButton);
    expect(middleware).toHaveBeenCalledTimes(1);
  });

  it('Should call Distribute Vertically when Distribute Vertically button is pressed', () => {
    const middleware = setupMiddleWare();
    renderPopup();
    const distributeVerticalButton = screen.getByRole('button', { name: 'Distribute Vertically' });

    fireEvent.click(distributeVerticalButton);
    expect(middleware).toHaveBeenCalledTimes(1);
  });
});