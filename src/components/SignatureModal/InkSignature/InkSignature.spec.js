import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import InkSignature from './InkSignature';
import useCore from 'hooks/useCore';
import SignatureModes from 'constants/signatureModes';
import setToolStyles from 'helpers/setToolStyles';

const noop = () => {};

jest.mock('hooks/useCore', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('react-measure', () => ({
  __esModule: true,
  default: ({ children }) => children({ measureRef: noop }),
}));

jest.mock('react-swipeable', () => ({
  Swipeable: ({ children }) => children,
}));

let capturedOnStyleChange = null;
let capturedPalette = null;
let capturedColor = null;
jest.mock('components/ColorPalette', () => (props) => {
  capturedOnStyleChange = props.onStyleChange;
  capturedPalette = props.overridePalette2;
  capturedColor = props.color;
  return null;
});

jest.mock('components/Dropdown', () => () => null);
jest.mock('helpers/setToolStyles', () => jest.fn());

const createMockSignatureTool = () => ({
  /* eslint-disable-next-line custom/no-hex-colors */
  defaults: { StrokeColor: '#000000' },
  setSignatureCanvas: jest.fn(),
  setInitialsCanvas: jest.fn(),
  clearSignatureCanvas: jest.fn(),
  clearInitialsCanvas: jest.fn(),
  resizeCanvas: jest.fn().mockResolvedValue(undefined),
  isEmptySignature: jest.fn().mockResolvedValue(true),
  isEmptyInitialsSignature: jest.fn().mockResolvedValue(true),
  getFullSignatureAnnotation: jest.fn().mockReturnValue(null),
  getInitialsAnnotation: jest.fn().mockReturnValue(null),
  setSignature: jest.fn(),
  setInitials: jest.fn(),
});

const createMockCore = () => {
  const signatureTool = createMockSignatureTool();
  const documentViewer = { getTool: jest.fn(() => signatureTool) };
  return {
    getTool: jest.fn(() => signatureTool),
    getDocumentViewer: jest.fn(() => documentViewer),
    getToolsFromAllDocumentViewers: jest.fn(() => [signatureTool]),
  };
};

describe('InkSignature', () => {
  let mockUseCore;

  beforeEach(() => {
    capturedOnStyleChange = null;
    capturedPalette = null;
    capturedColor = null;
    const core = createMockCore();
    mockUseCore = jest.fn().mockReturnValue({ core, documentViewer: core.getDocumentViewer() });
    useCore.mockImplementation(mockUseCore);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('sets canvases on the current instance tool when another instance is globally active', () => {
    const currentInstanceTool = createMockSignatureTool();
    const otherInstanceTool = createMockSignatureTool();
    const currentDocumentViewer = { getTool: jest.fn(() => currentInstanceTool) };
    const mockCore = createMockCore();
    mockCore.getToolsFromAllDocumentViewers.mockReturnValue([otherInstanceTool]);

    mockUseCore = jest.fn().mockReturnValue({ core: mockCore, documentViewer: currentDocumentViewer });
    useCore.mockImplementation(mockUseCore);

    render(
      <InkSignature
        isModalOpen={false}
        isTabPanelSelected={false}
        disableCreateButton={noop}
        enableCreateButton={noop}
      />
    );

    expect(mockUseCore).toHaveBeenCalledWith();
    expect(currentDocumentViewer.getTool).toHaveBeenCalledWith('AnnotationCreateSignature');
    expect(currentInstanceTool.setSignatureCanvas).toHaveBeenCalled();
    expect(currentInstanceTool.setInitialsCanvas).toHaveBeenCalled();
    expect(otherInstanceTool.setSignatureCanvas).not.toHaveBeenCalled();
    expect(otherInstanceTool.setInitialsCanvas).not.toHaveBeenCalled();
  });

  it('sets canvases on the first viewer tool in MultiViewer mode', () => {
    const firstViewerTool = createMockSignatureTool();
    const secondViewerTool = createMockSignatureTool();
    const mockCore = createMockCore();
    mockCore.getToolsFromAllDocumentViewers.mockReturnValue([firstViewerTool, secondViewerTool]);

    mockUseCore = jest.fn().mockReturnValue({ core: mockCore, documentViewer: mockCore.getDocumentViewer() });
    useCore.mockImplementation(mockUseCore);

    render(
      <InkSignature
        isModalOpen={false}
        isTabPanelSelected={false}
        disableCreateButton={noop}
        enableCreateButton={noop}
        isMultiViewerMode
      />
    );

    expect(mockCore.getToolsFromAllDocumentViewers).toHaveBeenCalledWith('AnnotationCreateSignature');
    expect(firstViewerTool.setSignatureCanvas).toHaveBeenCalled();
    expect(firstViewerTool.setInitialsCanvas).toHaveBeenCalled();
    expect(secondViewerTool.setSignatureCanvas).not.toHaveBeenCalled();
    expect(secondViewerTool.setInitialsCanvas).not.toHaveBeenCalled();
  });

  it('uses the configured signature modal colors', () => {
    /* eslint-disable custom/no-hex-colors */
    const colors = ['#000000', '#008000'];

    render(
      <InkSignature
        isModalOpen={false}
        isTabPanelSelected={false}
        disableCreateButton={noop}
        enableCreateButton={noop}
        signatureModalColors={colors}
      />
    );

    expect(capturedPalette).toBe(colors);
  });

  it('uses the shared selected signature color', () => {
    /* eslint-disable-next-line custom/no-hex-colors */
    const selectedSignatureColor = new window.Core.Annotations.Color('#008000');

    render(
      <InkSignature
        isModalOpen={false}
        isTabPanelSelected={false}
        disableCreateButton={noop}
        enableCreateButton={noop}
        signatureModalColors={['#000000', '#008000']}
        selectedSignatureColor={selectedSignatureColor}
      />
    );

    expect(capturedColor).toBe(selectedSignatureColor);
  });

  it('selects the first configured color when the current color is unavailable', async () => {
    render(
      <InkSignature
        isModalOpen={false}
        isTabPanelSelected={false}
        disableCreateButton={noop}
        enableCreateButton={noop}
        signatureModalColors={['#008000', '#800080']}
      />
    );

    await waitFor(() => {
      expect(setToolStyles).toHaveBeenCalledWith(
        'AnnotationCreateSignature',
        'StrokeColor',
        expect.objectContaining({})
      );
    });

    const selectedColor = setToolStyles.mock.calls[0][2];
    expect(selectedColor.toHexString()).toBe('#008000');
    /* eslint-enable custom/no-hex-colors */
  });

  it('handles errors when applying the first configured color', async () => {
    const mockCore = createMockCore();
    const signatureTool = mockCore.getTool();
    const error = new Error('Unable to resize');
    signatureTool.getFullSignatureAnnotation.mockReturnValue({ StrokeColor: null, getPaths: jest.fn() });
    signatureTool.resizeCanvas.mockRejectedValue(error);
    useCore.mockReturnValue({ core: mockCore, documentViewer: mockCore.getDocumentViewer() });
    jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <InkSignature
        isModalOpen={false}
        isTabPanelSelected={false}
        disableCreateButton={noop}
        enableCreateButton={noop}
        /* eslint-disable-next-line custom/no-hex-colors */
        signatureModalColors={['#008000']}
      />
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Unable to update the ink signature color.', error);
    });

    console.error.mockRestore();
  });

  it('does not resize a typed signature when synchronizing the shared color', async () => {
    const mockCore = createMockCore();
    const signatureTool = mockCore.getTool();
    const typedSignatureAnnotation = { StrokeColor: null, getImageData: jest.fn() };
    signatureTool.getFullSignatureAnnotation.mockReturnValue(typedSignatureAnnotation);
    useCore.mockReturnValue({ core: mockCore, documentViewer: mockCore.getDocumentViewer() });
    /* eslint-disable-next-line custom/no-hex-colors */
    const selectedSignatureColor = new window.Core.Annotations.Color('#008000');

    render(
      <InkSignature
        isModalOpen
        isTabPanelSelected={false}
        disableCreateButton={noop}
        enableCreateButton={noop}
        /* eslint-disable-next-line custom/no-hex-colors */
        signatureModalColors={['#000000', '#008000']}
        selectedSignatureColor={selectedSignatureColor}
      />
    );

    await waitFor(() => {
      expect(setToolStyles).toHaveBeenCalledWith('AnnotationCreateSignature', 'StrokeColor', selectedSignatureColor);
    });
    expect(typedSignatureAnnotation.StrokeColor).toBeNull();
    expect(signatureTool.resizeCanvas).not.toHaveBeenCalled();
  });

  it('calls resizeCanvas with INITIALS type when changing color with only initials drawn', async () => {
    const mockCore = createMockCore();
    const signatureTool = mockCore.getTool();
    const mockInitialsAnnotation = { StrokeColor: null, getPaths: jest.fn() };

    // Only initials are drawn, no full signature
    signatureTool.getFullSignatureAnnotation.mockReturnValue(null);
    signatureTool.getInitialsAnnotation.mockReturnValue(mockInitialsAnnotation);

    mockUseCore = jest.fn().mockReturnValue({ core: mockCore, documentViewer: mockCore.getDocumentViewer() });
    useCore.mockImplementation(mockUseCore);

    render(
      <InkSignature
        isModalOpen={false}
        isTabPanelSelected={false}
        disableCreateButton={noop}
        enableCreateButton={noop}
      />
    );

    expect(capturedOnStyleChange).not.toBeNull();

    /* eslint-disable-next-line custom/no-hex-colors */
    await act(async () => capturedOnStyleChange('StrokeColor', '#FF0000'));

    expect(signatureTool.resizeCanvas).toHaveBeenCalledTimes(1);
    expect(signatureTool.resizeCanvas).toHaveBeenCalledWith(SignatureModes.INITIALS);
  });

  it('calls resizeCanvas for both types when changing color with both signatures drawn', async () => {
    const mockCore = createMockCore();
    const signatureTool = mockCore.getTool();
    const mockFullAnnotation = { StrokeColor: null, getPaths: jest.fn() };
    const mockInitialsAnnotation = { StrokeColor: null, getPaths: jest.fn() };

    signatureTool.getFullSignatureAnnotation.mockReturnValue(mockFullAnnotation);
    signatureTool.getInitialsAnnotation.mockReturnValue(mockInitialsAnnotation);

    mockUseCore = jest.fn().mockReturnValue({ core: mockCore, documentViewer: mockCore.getDocumentViewer() });
    useCore.mockImplementation(mockUseCore);

    render(
      <InkSignature
        isModalOpen={false}
        isTabPanelSelected={false}
        disableCreateButton={noop}
        enableCreateButton={noop}
      />
    );

    expect(capturedOnStyleChange).not.toBeNull();

    /* eslint-disable-next-line custom/no-hex-colors */
    await act(async () => capturedOnStyleChange('StrokeColor', '#FF0000'));

    expect(signatureTool.resizeCanvas).toHaveBeenCalledTimes(2);
    expect(signatureTool.resizeCanvas).toHaveBeenCalledWith(SignatureModes.FULL_SIGNATURE);
    expect(signatureTool.resizeCanvas).toHaveBeenCalledWith(SignatureModes.INITIALS);
  });

  it('awaits resizeCanvas calls sequentially when changing color', async () => {
    const mockCore = createMockCore();
    const signatureTool = mockCore.getTool();
    const mockFullAnnotation = { StrokeColor: null, getPaths: jest.fn() };
    const mockInitialsAnnotation = { StrokeColor: null, getPaths: jest.fn() };

    signatureTool.getFullSignatureAnnotation.mockReturnValue(mockFullAnnotation);
    signatureTool.getInitialsAnnotation.mockReturnValue(mockInitialsAnnotation);

    const callOrder = [];
    const deferrals = [];
    signatureTool.resizeCanvas.mockImplementation((type) => {
      callOrder.push({ type, time: 'start' });
      return new Promise((resolve) => {
        deferrals.push(() => {
          callOrder.push({ type, time: 'end' });
          resolve();
        });
      });
    });

    mockUseCore = jest.fn().mockReturnValue({ core: mockCore, documentViewer: mockCore.getDocumentViewer() });
    useCore.mockImplementation(mockUseCore);

    render(
      <InkSignature
        isModalOpen={false}
        isTabPanelSelected={false}
        disableCreateButton={noop}
        enableCreateButton={noop}
      />
    );

    expect(capturedOnStyleChange).not.toBeNull();

    /* eslint-disable-next-line custom/no-hex-colors */
    const colorChangePromise = act(async () => capturedOnStyleChange('StrokeColor', '#FF0000'));

    await act(async () => deferrals[0]());
    await act(async () => deferrals[1]());
    await colorChangePromise;

    expect(callOrder[0]).toEqual({ type: SignatureModes.FULL_SIGNATURE, time: 'start' });
    expect(callOrder[1]).toEqual({ type: SignatureModes.FULL_SIGNATURE, time: 'end' });
    expect(callOrder[2]).toEqual({ type: SignatureModes.INITIALS, time: 'start' });
    expect(callOrder[3]).toEqual({ type: SignatureModes.INITIALS, time: 'end' });
  });
});
