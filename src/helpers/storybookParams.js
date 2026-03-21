import { allModes } from '../../.storybook/modes';

export const storybookViewports = {
  Mobile: {
    name: 'Mobile',
    styles: {
      width: '360px',
      height: '800px',
    },
    type: 'mobile',
  },
};

export const mobileStoryParameters = {
  viewport: {
    options: storybookViewports,
    defaultViewport: 'Mobile',
  },
  chromatic: {
    disableSnapshot: true,
    modes: {
      'Mobile light theme': allModes['light mobile'],
      'Mobile dark theme': allModes['dark mobile'],
    },
    delay: 1000,
  },
};

export const mobileStoryGlobals = {
  viewport: {
    value: 'Mobile',
    isRotated: false,
  },
};

export const disableRtlModeParameters = {
  chromatic: {
    modes: {
      'Light theme RTL': { disable: true },
    },
  },
};

export const disableChromaticParameters = {
  chromatic: {
    disableSnapshot: true,
  },
};
