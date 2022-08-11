import { createPortal } from 'react-dom';
import usePortal from 'hooks/usePortal';

const Portal = ({ id, position, children }) => {
  const target = usePortal(id);
  target.style.position = 'absolute';
  target.style.top = position.top === 'auto' ? position.top : `${position.top}px`;
  target.style.left = position.left === 'auto' ? position.left : `${position.left}px`;
  target.style.right = position.right === 'auto' ? position.right : `${position.right}px`;
  target.style.pointerEvents = 'none';
  target.style.zIndex = 999;

  return createPortal(
    children,
    target,
  );
};

export default Portal;