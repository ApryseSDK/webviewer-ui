import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import { VIEWER_CONFIGURATIONS } from 'constants/customizationVariables';

const useIsRTL = () => {
  const { i18n } = useTranslation();
  const currentUIConfiguration = useSelector(selectors.getUIConfiguration);
  const isSpreadsheetEditorModeEnabled = currentUIConfiguration === VIEWER_CONFIGURATIONS.SPREADSHEET_EDITOR;

  const getDir = () => {
    if (isSpreadsheetEditorModeEnabled) {
      return 'ltr';
    }
    try {
      return i18n.dir();
    } catch {
      return 'ltr';
    }
  };

  const [isRTL, setIsRTL] = useState(getDir() === 'rtl');

  useEffect(() => {
    const handler = () => {
      setIsRTL(getDir() === 'rtl');
    };

    i18n.on('languageChanged', handler);
    return () => i18n.off('languageChanged', handler);
  }, [i18n]);

  return isRTL;
};

export default useIsRTL;