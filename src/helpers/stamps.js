import getCurrentT from 'helpers/getCurrentT';

export const getDefaultStampCategory = () => {
  const t = getCurrentT();
  return t('option.customStampModal.customStamp', {
    lng: 'en',
    defaultValue: 'Custom Stamp',
  });
};