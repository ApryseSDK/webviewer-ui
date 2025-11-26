import i18next from 'i18next';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import { VIEWER_CONFIGURATIONS } from 'constants/customizationVariables';

const useIsRTL = () => {
  const currentUIConfiguration = useSelector(selectors.getUIConfiguration);
  const isSpreadsheetEditorModeEnabled = currentUIConfiguration === VIEWER_CONFIGURATIONS.SPREADSHEET_EDITOR;

  const getDir = () => {
    if (isSpreadsheetEditorModeEnabled) {
      return 'ltr';
    }
    return i18next.dir();
  };

  const [isRTL, setIsRTL] = useState(getDir() === 'rtl');

  useEffect(() => {
    const handler = () => {
      setIsRTL(getDir() === 'rtl');
    };

    i18next.on('languageChanged', handler);
    return () => i18next.off('languageChanged', handler);
  }, []);

  return isRTL;
};

export default useIsRTL;