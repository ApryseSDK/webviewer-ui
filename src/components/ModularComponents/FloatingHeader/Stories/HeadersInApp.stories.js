import React from 'react';
import App from 'components/App';
import initialState from 'src/redux/initialState';
import {
  defaultLeftHeader,
  defaultTopHeader,
  floatStartHeader,
  secondFloatStartHeader,
  floatCenterHeader,
  floatEndHeader,
  secondFloatStartLeftHeader,
  floatStartLeftHeader,
  floatCenterLeftHeader,
  floatEndLeftHeader,
  defaultRightHeader,
  secondFloatStartRightHeader,
  floatStartRightHeader,
  floatCenterRightHeader,
  floatEndRightHeader,
  defaultBottomHeader,
  floatStartBottomHeader,
  secondFloatStartBottomHeader,
  floatCenterBottomHeader,
  floatEndBottomHeader,
  floatStarTopHeaderStatic,
  floatCenterTopHeaderDynamic,
  floatEndTopHeaderNone,
  mockModularComponents,
} from '../../Helpers/mockHeaders';
import { MockApp } from 'helpers/storybookHelper';

export default {
  title: 'ModularComponents/FloatingHeader/App',
  component: App,
  parameters: {
    customizableUI: true,
  }
};

const Template = (args) => {
  const stateWithHeaders = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      modularHeaders: args.headers,
      modularComponents: mockModularComponents,
      openElements: {},
    },
    featureFlags: {
      customizableUI: true,
    },
  };
  return <MockApp initialState={stateWithHeaders} />;
};

function createTemplate(headers) {
  const template = Template.bind({});
  template.args = { headers };
  template.parameters = {
    layout: 'fullscreen',
    chromatic: { disableSnapshot: true }
  };
  return template;
}

export const TopAndLeftHeaders = createTemplate({
  defaultLeftHeader,
  secondFloatStartLeftHeader,
  floatStartLeftHeader,
  floatCenterLeftHeader,
  floatEndLeftHeader,
  defaultTopHeader,
  floatStartHeader,
  secondFloatStartHeader,
  floatCenterHeader,
  floatEndHeader,
});

export const TopCenterAndLeftHeaders = createTemplate({
  defaultLeftHeader,
  secondFloatStartLeftHeader,
  floatStartLeftHeader,
  floatCenterLeftHeader,
  floatEndLeftHeader,
  defaultTopHeader,
  floatCenterHeader,
  floatEndHeader,
});

export const TopAndRightHeaders = createTemplate({
  defaultRightHeader,
  secondFloatStartRightHeader,
  floatStartRightHeader,
  floatCenterRightHeader,
  floatEndRightHeader,
  defaultTopHeader,
  floatStartHeader,
  secondFloatStartHeader,
  floatCenterHeader,
  floatEndHeader,
});

export const TopCenterAndRightHeaders = createTemplate({
  defaultRightHeader,
  secondFloatStartRightHeader,
  floatStartRightHeader,
  floatCenterRightHeader,
  floatEndRightHeader,
  defaultTopHeader,
  floatCenterHeader,
});

export const BottomAndLeftHeaders = createTemplate({
  defaultLeftHeader,
  secondFloatStartLeftHeader,
  floatStartLeftHeader,
  floatCenterLeftHeader,
  floatEndLeftHeader,
  defaultBottomHeader,
  floatStartBottomHeader,
  secondFloatStartBottomHeader,
  floatCenterBottomHeader,
  floatEndBottomHeader,
});

export const BottomCenterAndLeftHeaders = createTemplate({
  defaultLeftHeader,
  secondFloatStartLeftHeader,
  floatStartLeftHeader,
  floatCenterLeftHeader,
  floatEndLeftHeader,
  defaultBottomHeader,
  floatCenterBottomHeader,
  floatEndBottomHeader,
});

export const BottomAndRightHeaders = createTemplate({
  defaultRightHeader,
  secondFloatStartRightHeader,
  floatStartRightHeader,
  floatCenterRightHeader,
  floatEndRightHeader,
  defaultBottomHeader,
  floatStartBottomHeader,
  secondFloatStartBottomHeader,
  floatCenterBottomHeader,
  floatEndBottomHeader,
});

export const BottomCenterAndRightHeaders = createTemplate({
  defaultRightHeader,
  secondFloatStartRightHeader,
  floatStartRightHeader,
  floatCenterRightHeader,
  floatEndRightHeader,
  defaultBottomHeader,
  floatCenterBottomHeader,
});

export const TopAndBottomHeaders = createTemplate({
  defaultBottomHeader,
  floatStartBottomHeader,
  secondFloatStartBottomHeader,
  floatCenterBottomHeader,
  floatEndBottomHeader,
  defaultTopHeader,
  floatStartHeader,
  secondFloatStartHeader,
  floatCenterHeader,
  floatEndHeader,
});

export const FloatingOnAllSides = createTemplate({
  floatStartHeader,
  secondFloatStartHeader,
  floatCenterHeader,
  floatEndHeader,
  floatStartLeftHeader,
  secondFloatStartLeftHeader,
  floatCenterLeftHeader,
  floatEndLeftHeader,
  floatStartRightHeader,
  secondFloatStartRightHeader,
  floatCenterRightHeader,
  floatEndRightHeader,
  floatStartBottomHeader,
  secondFloatStartBottomHeader,
  floatCenterBottomHeader,
  floatEndBottomHeader,
});

export const FloatiesWithOpacityLevels = createTemplate({
  floatStarTopHeaderStatic,
  floatCenterTopHeaderDynamic,
  floatEndTopHeaderNone,
});

export const AllHeaders = createTemplate({
  defaultTopHeader,
  floatStartHeader,
  secondFloatStartHeader,
  floatCenterHeader,
  floatEndHeader,
  defaultLeftHeader,
  floatStartLeftHeader,
  secondFloatStartLeftHeader,
  floatCenterLeftHeader,
  floatEndLeftHeader,
  defaultRightHeader,
  floatStartRightHeader,
  secondFloatStartRightHeader,
  floatCenterRightHeader,
  floatEndRightHeader,
  defaultBottomHeader,
  floatStartBottomHeader,
  secondFloatStartBottomHeader,
  floatCenterBottomHeader,
  floatEndBottomHeader,
});