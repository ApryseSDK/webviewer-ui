import React from 'react';
import { render, act } from '@testing-library/react';
import InkSignature from './InkSignature';
import useCore from 'hooks/useCore';
import SignatureModes from 'constants/signatureModes';

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
jest.mock('components/ColorPalette', () => (props) => {
  capturedOnStyleChange = props.onStyleChange;
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
  return {
    getTool: jest.fn(() => signatureTool),
    getToolsFromAllDocumentViewers: jest.fn(() => [signatureTool]),
  };
};

describe('InkSignature', () => {
  let mockUseCore;

  beforeEach(() => {
    capturedOnStyleChange = null;
    mockUseCore = jest.fn().mockReturnValue({ core: createMockCore() });
    useCore.mockImplementation(mockUseCore);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('always calls useCore with viewer key 1 regardless of the active viewer', () => {
    render(
      <InkSignature
        isModalOpen={false}
        isTabPanelSelected={false}
        disableCreateButton={noop}
        enableCreateButton={noop}
      />
    );

    expect(mockUseCore).toHaveBeenCalledWith(1);
  });

  it('calls resizeCanvas with INITIALS type when changing color with only initials drawn', async () => {
    const mockCore = createMockCore();
    const signatureTool = mockCore.getTool();
    const mockInitialsAnnotation = { StrokeColor: null };

    // Only initials are drawn, no full signature
    signatureTool.getFullSignatureAnnotation.mockReturnValue(null);
    signatureTool.getInitialsAnnotation.mockReturnValue(mockInitialsAnnotation);

    mockUseCore = jest.fn().mockReturnValue({ core: mockCore });
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
    const mockFullAnnotation = { StrokeColor: null };
    const mockInitialsAnnotation = { StrokeColor: null };

    signatureTool.getFullSignatureAnnotation.mockReturnValue(mockFullAnnotation);
    signatureTool.getInitialsAnnotation.mockReturnValue(mockInitialsAnnotation);

    mockUseCore = jest.fn().mockReturnValue({ core: mockCore });
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
    const mockFullAnnotation = { StrokeColor: null };
    const mockInitialsAnnotation = { StrokeColor: null };

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

    mockUseCore = jest.fn().mockReturnValue({ core: mockCore });
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
