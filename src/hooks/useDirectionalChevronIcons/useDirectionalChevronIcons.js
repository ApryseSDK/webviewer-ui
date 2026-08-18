
import useIsRTL from 'hooks/useIsRTL';

const useDirectionalChevronIcons = (forceLtr = false) => {
  const isRTL = useIsRTL();
  const isRightToLeft = forceLtr ? false : isRTL;
  const startChevronIcon = isRightToLeft ? 'icon-chevron-right' : 'icon-chevron-left';
  const endChevronIcon = isRightToLeft ? 'icon-chevron-left' : 'icon-chevron-right';
  return { startChevronIcon, endChevronIcon };
};

export default useDirectionalChevronIcons;