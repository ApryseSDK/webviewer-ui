import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ZoomControls from './ZoomControls';
import core from 'core';

const ZoomControlWithRedux = withProviders(ZoomControls);

const props = {
  getZoom: jest.fn(),
  setZoomHandler: jest.fn(),
  zoomValue: '100',
  zoomTo: jest.fn(),
  zoomIn: jest.fn(),
  zoomOut: jest.fn(),
  isZoomFlyoutMenuActive: false,
  isActive: true,
  dataElement: 'zoom-container',
};

describe('Zoom Container component', () => {
  beforeEach(() => {
    const documentViewer = core.setDocumentViewer(1, new window.Core.DocumentViewer());
    documentViewer.doc = new window.Core.Document('dummy', 'pdf');
  });

  it('it renders the zoomvalue correctly', () => {
    render(<ZoomControlWithRedux {...props} />);
    const input = screen.getByRole('textbox');
    expect(input.value).toEqual(props.zoomValue);
  });

  it('it ignores invalid values that you input', () => {
    render(<ZoomControlWithRedux {...props} />);
    const input = screen.getByRole('textbox');
    userEvent.type(input, 'zoom');
    expect(input.value).toEqual(props.zoomValue);
  });

  it('Should execute zoomIn/zoomOut when zoom in/out button is clicked', async () => {
    render(<ZoomControlWithRedux {...props} />);
    const zoomInButton = screen.getByRole('button', { name: 'Zoom in' });
    const zoomOutButton = screen.getByRole('button', { name: 'Zoom out' });
    expect(zoomInButton).toBeInTheDocument();
    fireEvent.click(zoomInButton);
    expect(props.zoomIn).toHaveBeenCalledTimes(1);
    fireEvent.click(zoomOutButton);
    expect(props.zoomOut).toHaveBeenCalledTimes(1);
    expect(props.getZoom).toHaveBeenCalledTimes(2);
  });

  it('it renders the zoomvalue correctly', () => {
    render(<ZoomControlWithRedux {...props} />);
    const input = screen.getByRole('textbox');
    userEvent.type(input, '66');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(props.zoomTo).toHaveBeenCalledTimes(1);
  });
});