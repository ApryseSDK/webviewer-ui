import { createPortal } from 'react-dom';
import usePortal from 'hooks/usePortal';
import React, { useLayoutEffect } from 'react';

/**
 * Handles detecting overflow after createPortal
 * @param {{
 *  children: ReactNode,
 *  target: HTMLDivElement,
 *  containerElementSelector: string | undefined,
 *  offset: number | undefined // offset in pixels
 * }} options
 */
const LayoutContainer = ({ children, target, containerElementSelector, offset }) => {
  useLayoutEffect(() => {

    const targetRect = target.getBoundingClientRect();
    if (!targetRect.width && !targetRect.height) {
      return;
    }

    const containerEle = document.querySelector(containerElementSelector ?? 'body');
    const containerRect = containerEle.getBoundingClientRect();
    const containerOffset = offset ?? 15;

    if (targetRect.right > containerRect.right) {
      target.style.left = `${containerRect.right - targetRect.width - containerOffset}px`;
    }
  });

  return children;
};

const Portal = ({ id, position, children }) => {
  const target = usePortal(id);
  target.style.position = 'absolute';
  target.style.top = position.top === 'auto' ? position.top : `${position.top}px`;
  target.style.left = position.left === 'auto' ? position.left : `${position.left}px`;
  target.style.right = position.right === 'auto' ? position.right : `${position.right}px`;
  target.style.pointerEvents = 'none';
  target.style.zIndex = 999;

  return createPortal(
    <LayoutContainer target={target}>{children}</LayoutContainer>,
    target,
  );
};

export default Portal;