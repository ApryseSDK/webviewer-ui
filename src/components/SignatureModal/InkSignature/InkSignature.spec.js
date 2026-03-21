import React from 'react';
import { render } from '@testing-library/react';
import InkSignature from './InkSignature';
import useCore from 'hooks/useCore';

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

jest.mock('components/ColorPalette', () => () => null);
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
});
