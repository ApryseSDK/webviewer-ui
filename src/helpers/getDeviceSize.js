import getRootNode from './getRootNode';
import useMedia from 'hooks/useMedia';
import { MOBILE_SIZE, TABLET_SIZE } from 'constants/deviceSizes';

export const isMobileSize = () => {
  if (window.isApryseWebViewerWebComponent) {
    return getRootNode()?.host.clientWidth <= MOBILE_SIZE;
  }
  return useMedia(
    // Media queries
    [`(max-width: ${MOBILE_SIZE}px)`],
    [true],
    // Default value
    false,
  );
};

export const isTabletSize = () => {
  if (window.isApryseWebViewerWebComponent) {
    return getRootNode()?.host.clientWidth > MOBILE_SIZE && getRootNode()?.host.clientWidth <= TABLET_SIZE;
  }
  return useMedia(
    // Media queries
    [`(min-width: ${MOBILE_SIZE + 1}px) and (max-width: ${TABLET_SIZE}px)`],
    [true],
    // Default value
    false,
  );
};

export const isTabletAndMobileSize = () => {
  if (window.isApryseWebViewerWebComponent) {
    return getRootNode()?.host.clientWidth <= TABLET_SIZE;
  }
  return useMedia(
    // Media queries
    [`(max-width: ${TABLET_SIZE}px)`],
    [true],
    // Default value
    false,
  );
};

export const isDesktopSize = () => {
  if (window.isApryseWebViewerWebComponent) {
    return getRootNode()?.host.clientWidth > TABLET_SIZE;
  }
  return useMedia(
    // Media queries
    [`(min-width: ${TABLET_SIZE + 1}px)`],
    [true],
    // Default value
    false,
  );
};