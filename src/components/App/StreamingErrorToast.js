import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Toast shown once when a PDF streaming chunk fails to download.
 * Dismissed by clicking the close button.
 * @ignore
 */
const StreamingErrorToast = ({ onDismiss }) => {
  const { t } = useTranslation();
  return (
    <div role='alert' className='ErrorToast StreamingErrorToast'>
      <div className='ErrorToastContent'>
        <div>{t('message.streamingErrorTitle')}</div>
        <div>{t('message.streamingError')}</div>
      </div>
      <button
        type='button'
        className='ErrorToastClose'
        onClick={onDismiss}
        aria-label={t('action.close')}
      >
        ×
      </button>
    </div>
  );
};

export default StreamingErrorToast;
