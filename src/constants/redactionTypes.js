export const redactionTypeMap = {
  REGION: 'region',
  TEXT: 'text',
  FULL_PAGE: 'fullPage',
  FULL_VIDEO_FRAME: 'fullVideoFrame',
  AUDIO_REDACTION: 'audioRedaction',
  FULL_VIDEO_FRAME_AND_AUDIO: 'fullVideoFrameAndAudio',
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
  [redactionTypeMap['FULL_VIDEO_FRAME']]: {
    icon: 'ic-full-frame-video-redact',
    label: 'redactionPanel.redactionItem.fullVideoFrameRedaction',
  },
  [redactionTypeMap['AUDIO_REDACTION']]: {
    icon: 'ic-audio-redact',
    label: 'redactionPanel.redactionItem.audioRedaction',
  },
  [redactionTypeMap['FULL_VIDEO_FRAME_AND_AUDIO']]: {
    icon: 'ic-full-frame-video-and-audio-redact',
    label: 'redactionPanel.redactionItem.fullVideoFrameAndAudioRedaction',
  },
  [redactionTypeMap['TEXT']]: {
    icon: 'icon-text-redaction',
  },
  [redactionTypeMap['IMAGE']]: {
    icon: 'redact-icons-image',
    label: 'redactionPanel.redactionItem.image',
  }
};

export const mapAnnotationToRedactionType = (annotation) => {
  const isTextRedaction = annotation.IsText;
  if (isTextRedaction) {
    return redactionTypeMap['TEXT'];
  }

  const { type = 'region' } = annotation;
  return type;
};