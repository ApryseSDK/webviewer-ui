import i18next from 'i18next';
import { useEffect, useState } from 'react';

const useIsRTL = () => {
  const [isRTL, setIsRTL] = useState(i18next.dir() === 'rtl');

  useEffect(() => {
    const handler = () => {
      setIsRTL(i18next.dir() === 'rtl');
    };

    i18next.on('languageChanged', handler);
    return () => i18next.off('languageChanged', handler);
  }, []);

  return isRTL;
};

export default useIsRTL;