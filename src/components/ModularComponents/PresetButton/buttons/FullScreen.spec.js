import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import FullScreenButton from './FullScreen';
import InstanceRootNodeContext from 'src/context/InstanceRootNodeContext';

jest.mock('react-redux', () => ({
  useSelector: (selector) => selector({}),
  useStore: () => ({}),
}));
jest.mock('selectors', () => ({
  __esModule: true,
  default: {
    isFullScreen: () => false,
    isElementDisabled: () => false,
    getCustomElementOverrides: () => ({}),
    getActiveDocumentViewerKey: () => 1,
  },
}));
jest.mock('components/Tooltip', () => ({ children }) => children);
jest.mock('helpers/device', () => ({
  isIOS: false,
  isIOSFullScreenSupported: true,
}));

describe('FullScreenButton', () => {
  it('requests fullscreen on the host belonging to the clicked instance', () => {
    const firstRequestFullscreen = jest.fn();
    const secondRequestFullscreen = jest.fn();
    const firstRoot = { host: { requestFullscreen: firstRequestFullscreen } };
    const secondRoot = { host: { requestFullscreen: secondRequestFullscreen } };
    Object.setPrototypeOf(firstRoot, ShadowRoot.prototype);
    Object.setPrototypeOf(secondRoot, ShadowRoot.prototype);

    render(
      <>
        <InstanceRootNodeContext.Provider value={firstRoot}>
          <FullScreenButton dataElement="firstFullscreenButton" title="First fullscreen" />
        </InstanceRootNodeContext.Provider>
        <InstanceRootNodeContext.Provider value={secondRoot}>
          <FullScreenButton dataElement="secondFullscreenButton" title="Second fullscreen" />
        </InstanceRootNodeContext.Provider>
      </>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Second fullscreen' }));
    expect(secondRequestFullscreen).toHaveBeenCalledTimes(1);
    expect(firstRequestFullscreen).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'First fullscreen' }));
    expect(firstRequestFullscreen).toHaveBeenCalledTimes(1);
    expect(secondRequestFullscreen).toHaveBeenCalledTimes(1);
  });
});