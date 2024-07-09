import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import PageRedactionModal from 'components/PageRedactionModal/PageRedactionModal';

const PageRedactionModalWithProviders = withProviders(PageRedactionModal);

const noop = () => {};

const defaultProps = {
  closeModal: noop,
  pageLabels: ['1', '2', '3'],
  selectedIndexes: [1],
  currentPage: 1,
  markPages: noop,
  redactPages: noop,
  evenDisabled: false,
  renderCanvases: noop,
  isOpen: true,
};

describe('Page Redaction Modal Component', () => {
  it('should render 4 input options and 1 canvas container with a canvas', () => {
    const mockRenderCanvases = jest.fn();
    const { container } = render(<PageRedactionModalWithProviders {...defaultProps} renderCanvases={mockRenderCanvases} />);
    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBe(4);
    const canvasContainer = container.querySelector('.canvas-container');
    expect(canvasContainer).toBeInTheDocument();
    // Should render the canvas for the first page
    expect(mockRenderCanvases).toHaveBeenCalled();
    expect(mockRenderCanvases).toHaveBeenCalledWith({ current: canvasContainer }, [1]);
  });
  it('should render 4 input options with 1 disabled when page count < 1', () => {
    const mockRenderCanvases = jest.fn();
    const { container } = render(<PageRedactionModalWithProviders {...defaultProps} evenDisabled renderCanvases={mockRenderCanvases} pageLabels={[1]}/>);
    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBe(4);
    expect(inputs[3]).toBeDisabled();
    const canvasContainer = container.querySelector('.canvas-container');
    expect(canvasContainer).toBeInTheDocument();
  });
  it('should render canvases for selection option specify', () => {
    const mockRenderCanvases = jest.fn();
    const { container } = render(<PageRedactionModalWithProviders {...defaultProps} renderCanvases={mockRenderCanvases} />);
    const inputs = container.querySelectorAll('input');
    const canvasContainer = container.querySelector('.canvas-container');
    // Should render the canvas for the first page
    expect(mockRenderCanvases).toHaveBeenCalled();
    expect(mockRenderCanvases).toHaveBeenCalledWith({ current: canvasContainer }, [1]);
    // Should render the canvases for the specified pages
    fireEvent.click(inputs[1]);
    const pageInput = container.querySelector('.page-number-input');
    fireEvent.change(pageInput, { target: { value: '1-3' } });
    fireEvent.blur(pageInput);
    expect(mockRenderCanvases).toHaveBeenCalledWith({ current: canvasContainer }, [1, 2, 3]);
  });
  it('should render canvases for selection option odd', () => {
    const mockRenderCanvases = jest.fn();
    const { container } = render(<PageRedactionModalWithProviders {...defaultProps} renderCanvases={mockRenderCanvases} />);
    const inputs = container.querySelectorAll('input');
    const canvasContainer = container.querySelector('.canvas-container');
    // Should render the canvas for the first page
    expect(mockRenderCanvases).toHaveBeenCalled();
    expect(mockRenderCanvases).toHaveBeenCalledWith({ current: canvasContainer }, [1]);
    // Should render the canvas for even pages
    fireEvent.click(inputs[2]);
    expect(mockRenderCanvases).toHaveBeenCalledWith({ current: canvasContainer }, [1, 3]);
  });
  it('should render canvases for selection option even', () => {
    const mockRenderCanvases = jest.fn();
    const { container } = render(<PageRedactionModalWithProviders {...defaultProps} renderCanvases={mockRenderCanvases} />);
    const inputs = container.querySelectorAll('input');
    const canvasContainer = container.querySelector('.canvas-container');
    // Should render the canvas for the first page
    expect(mockRenderCanvases).toHaveBeenCalled();
    expect(mockRenderCanvases).toHaveBeenCalledWith({ current: canvasContainer }, [1]);
    // Should render the canvas for even pages
    fireEvent.click(inputs[3]);
    expect(mockRenderCanvases).toHaveBeenCalledWith({ current: canvasContainer }, [2]);
  });
});