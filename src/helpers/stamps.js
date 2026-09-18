import getCurrentT from 'helpers/getCurrentT';

export const getDefaultCustomStampCategory = () => {
  return 'option.customStampModal.customStamp';
};

export const getDefaultStandardStampCategory = () => {
  return 'rubberStampPanel.standard';
};

export const getCategoryLabel = (category) => {
  const t = getCurrentT();
  return t(category, { defaultValue: category });
};

const getCustomDataFromAnnotation = (annotation) => {
  const customData = annotation.getCustomData?.('trn-custom-stamp');
  if (customData) {
    try {
      const parsedCustomData = JSON.parse(customData);
      return parsedCustomData;
    } catch (e) {
      console.warn('Failed to parse custom stamp data', e);
    }
  }
  return null;
};

const getCustomDataPropertyFromAnnotation = (annotation, property) => {
  const parsedCustomData = getCustomDataFromAnnotation(annotation);
  return parsedCustomData?.[property] || null;
};

export const getCustomStampCategoryFromAnnotation = (annotation) => {
  const customDataCategory = getCustomDataPropertyFromAnnotation(annotation, 'category');
  return customDataCategory || annotation['category'] || annotation.__params?.['category'] || getDefaultCustomStampCategory();
};

export const getStandardStampCategoryFromAnnotation = (annotation) => {
  return annotation['category'] || getDefaultStandardStampCategory();
};

export const getCustomStampCategory = (stamp) => {
  return getCustomStampCategoryFromAnnotation(stamp.annotation);
};

export const getStandardStampCategory = (stamp) => {
  return getStandardStampCategoryFromAnnotation(stamp.annotation);
};

export const getCustomStampsByCategory = (stamps, category) => {
  return stamps.filter((stamp) => getCustomStampCategory(stamp) === category);
};

export const getStandardStampsByCategory = (stamps, category) => {
  return stamps.filter((stamp) => getStandardStampCategory(stamp) === category);
};

export const sortCategoriesByLocalizedName = (categories) => {
  const t = getCurrentT();
  return [...categories].sort((firstCategory, secondCategory) => (
    t(firstCategory, { defaultValue: firstCategory }).localeCompare(t(secondCategory, { defaultValue: secondCategory }))
  ));
};

const getStampTextFromAnnotation = (annotation) => {
  return annotation?.getStampText?.() || annotation?.['stampText'] || '';
};

const getStampTitleFromAnnotation = (annotation) => {
  const customDataTitle = getCustomDataPropertyFromAnnotation(annotation, 'title');
  return customDataTitle || annotation['title'] || annotation.__params?.['title'] || '';
};

const getStampSubtitleFromAnnotation = (annotation) => {
  const customDataSubtitle = getCustomDataPropertyFromAnnotation(annotation, 'subtitle');
  return customDataSubtitle || annotation['subtitle'] || annotation.__params?.['subtitle'] || '';
};

export const getStampText = (stamp) => {
  return stamp?.stampText || getStampTextFromAnnotation(stamp.annotation);
};

export const getStampTitle = (stamp) => {
  return stamp?.title || getStampTitleFromAnnotation(stamp.annotation);
};

export const getStampSubtitle = (stamp) => {
  return stamp?.subtitle || getStampSubtitleFromAnnotation(stamp.annotation);
};