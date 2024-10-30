import React from 'react';
import { render, screen } from '@testing-library/react';
import ColorPalette from './ColorPalette';

const ColorPaletteWithProviders = withProviders(ColorPalette);
const customColors = ['000000'];

function noop() {}

describe('ColorPalette', () => {
  it('Component should not throw any errors', () => {
    expect(() => {
      render(<ColorPaletteWithProviders onStyleChange={noop} property={''}/>);
    }).not.toThrow();
  });

  it('Component should have a Color Aria Label', () => {
    render(<ColorPaletteWithProviders onStyleChange={noop} property={''}/>);
    const element = screen.getByLabelText(`Color #${customColors[0]}`);

    expect(element).toBeInTheDocument();
  });

  it('Should have aria-current attribute', () => {
    render(<ColorPaletteWithProviders onStyleChange={noop} property={''}/>);
    const element = screen.getByLabelText(`Color #${customColors[0]}`);

    expect(element).toHaveAttribute('aria-current');
  });
});
