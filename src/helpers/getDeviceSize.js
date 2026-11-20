import { getWebComponentHostWidth } from './device';
import useMedia from 'hooks/useMedia';
import { MOBILE_SIZE, TABLET_SIZE } from 'constants/deviceSizes';

export const isMobileSize = (rootNode) => {
  if (window.isApryseWebViewerWebComponent) {
    return getWebComponentHostWidth(rootNode) <= MOBILE_SIZE;
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks -- window.isApryseWebViewerWebComponent is fixed for the page, so hook order is stable; call from a component's top level only.
  return useMedia(
    // Media queries
    [`(max-width: ${MOBILE_SIZE}px)`],
    [true],
    // Default value
    false,
  );
};

export const isTabletSize = (rootNode) => {
  if (window.isApryseWebViewerWebComponent) {
    const width = getWebComponentHostWidth(rootNode);
    return width > MOBILE_SIZE && width <= TABLET_SIZE;
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks -- window.isApryseWebViewerWebComponent is fixed for the page, so hook order is stable; call from a component's top level only.
  return useMedia(
    // Media queries
    [`(min-width: ${MOBILE_SIZE + 1}px) and (max-width: ${TABLET_SIZE}px)`],
    [true],
    // Default value
    false,
  );
};

export const isTabletAndMobileSize = (rootNode) => {
  if (window.isApryseWebViewerWebComponent) {
    return getWebComponentHostWidth(rootNode) <= TABLET_SIZE;
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks -- window.isApryseWebViewerWebComponent is fixed for the page, so hook order is stable; call from a component's top level only.
  return useMedia(
    // Media queries
    [`(max-width: ${TABLET_SIZE}px)`],
    [true],
    // Default value
    false,
  );
};

export const isDesktopSize = (rootNode) => {
  if (window.isApryseWebViewerWebComponent) {
    return getWebComponentHostWidth(rootNode) > TABLET_SIZE;
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks -- window.isApryseWebViewerWebComponent is fixed for the page, so hook order is stable; call from a component's top level only.
  return useMedia(
    // Media queries
    [`(min-width: ${TABLET_SIZE + 1}px)`],
    [true],
    // Default value
    false,
  );
};