import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ZoomControls from './ZoomControls';
import ZoomControlsContainer from './ZoomControlsContainer';
import core from 'core';
import * as zoomHelpers from 'helpers/zoom';

jest.mock('helpers/zoom', () => ({
  __esModule: true,
  zoomIn: jest.fn(),
  zoomOut: jest.fn(),
  zoomTo: jest.fn(),
}));

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {} unobserve() {} disconnect() {}
  };
  global.MutationObserver = class {
    observe() {} disconnect() {} takeRecords() {
      return [];
    }
  };
});

const ZoomControlWithRedux = withProviders(ZoomControls);

const props = {
  dataElement: 'zoom-container',
  componentProps: {
    setZoomHandler: jest.fn(),
    zoomValue: '100',
    zoomTo: jest.fn(),
    onZoomInClicked: jest.fn(),
    onZoomOutClicked: jest.fn(),
    isZoomFlyoutMenuActive: false,
    isActive: true,
    size: 0,
  }
};

describe('Zoom Container component', () => {
  beforeEach(() => {
    const documentViewer = core.setDocumentViewer(1, new window.Core.DocumentViewer());
    documentViewer.doc = new window.Core.Document('dummy', 'pdf');
  });

  it('it renders the zoomvalue correctly', () => {
    render(<ZoomControlWithRedux {...props} />);
    const input = screen.getByRole('textbox');
    expect(input.value).toEqual(props.componentProps.zoomValue);
  });

  it('it ignores invalid values that you input', () => {
    render(<ZoomControlWithRedux {...props} />);
    const input = screen.getByRole('textbox');
    userEvent.type(input, 'zoom');
    expect(input.value).toEqual(props.componentProps.zoomValue);
  });

  it('Should execute zoomIn/zoomOut when zoom in/out button is clicked', async () => {
    render(<ZoomControlWithRedux {...props} />);
    const zoomInButton = screen.getByRole('button', { name: 'Zoom in' });
    const zoomOutButton = screen.getByRole('button', { name: 'Zoom out' });
    expect(zoomInButton).toBeInTheDocument();
    fireEvent.click(zoomInButton);
    expect(props.componentProps.onZoomInClicked).toHaveBeenCalledTimes(1);
    fireEvent.click(zoomOutButton);
    expect(props.componentProps.onZoomOutClicked).toHaveBeenCalledTimes(1);
  });

  it('it renders the zoomvalue correctly', () => {
    render(<ZoomControlWithRedux {...props} />);
    const input = screen.getByRole('textbox');
    userEvent.type(input, '66');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(props.componentProps.zoomTo).toHaveBeenCalledTimes(1);
  });
});

describe('Multi-viewer zoom', () => {
  const baseViewerState = {
    viewer: {
      isMultiViewerMode: true,
      activeDocumentViewerKey: 1,
      flyoutMap: {},
      openElements: {},
      customElementSizes: {},
    }
  };

  const renderContainer = (viewerOverrides = {}) => {
    const state = { viewer: { ...baseViewerState.viewer, ...viewerOverrides } };
    jest.spyOn(core, 'getDocument').mockReturnValue({ getType: () => 'PDF' });
    jest.spyOn(core, 'addEventListener').mockImplementation(() => {});
    jest.spyOn(core, 'removeEventListener').mockImplementation(() => {});
    const Wrapped = withProviders(ZoomControlsContainer, state);
    return render(<Wrapped />);
  };

  it('routes zoom in/out to the active document viewer key', () => {
    jest.spyOn(core, 'getZoom').mockImplementation((key = 1) => (key === 2 ? 1.75 : 1.25));

    renderContainer({ activeDocumentViewerKey: 2 });

    fireEvent.click(screen.getByRole('button', { name: 'Zoom in' }));
    fireEvent.click(screen.getByRole('button', { name: 'Zoom out' }));

    expect(zoomHelpers.zoomIn).toHaveBeenCalledWith(true, 2);
    expect(zoomHelpers.zoomOut).toHaveBeenCalledWith(true, 2);
  });

  it('displays zoom from the active viewer and updates when the active viewer changes', () => {
    jest.spyOn(core, 'getZoom').mockImplementation((key = 1) => (key === 2 ? 2 : 1.5));

    const { rerender } = renderContainer();

    expect(screen.getByRole('textbox').value).toBe('150');

    const WrappedKey2 = withProviders(ZoomControlsContainer, {
      viewer: {
        ...baseViewerState.viewer,
        activeDocumentViewerKey: 2,
      },
    });

    rerender(<WrappedKey2 />);

    expect(screen.getByRole('textbox').value).toBe('200');
  });
});
