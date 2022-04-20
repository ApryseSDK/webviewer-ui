export const redactionTypeMap = {
  REGION: 'region',
  TEXT: 'text',
  FULL_PAGE: 'fullPage',
  CREDIT_CARD: 'creditCard',
  PHONE: 'phone',
  IMAGE: 'image',
  EMAIL: 'email',
};

export const defaultRedactionTypes = {
  [redactionTypeMap['REGION']]: {
    icon: 'icon-tool-redaction-area',
    label: 'redactionPanel.redactionItem.regionRedaction',
  },
  [redactionTypeMap['FULL_PAGE']]: {
    icon: 'icon-header-page-manipulation-page-transition-page-by-page-line',
    label: 'redactionPanel.redactionItem.fullPageRedaction',
  },
  [redactionTypeMap['TEXT']]: {
    icon: 'icon-form-field-text',
  },
  [redactionTypeMap['IMAGE']]: {
    icon: 'redact-icons-image',
    label: 'redactionPanel.redactionItem.image',
  }
};

export const mapAnnotationToRedactionType = annotation => {
  const isTextRedaction = annotation.IsText;
  if (isTextRedaction) {
    return redactionTypeMap['TEXT'];
  }

  const { type = 'region' } = annotation;
  return type;
};