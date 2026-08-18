import React, { useEffect } from 'react';
import core from 'core';
import initialState from 'src/redux/initialState';
import Theme from 'constants/theme';
import RubberStampPanel from './RubberStampPanel';
import { userEvent, within } from 'storybook/test';
import { MockApp } from 'helpers/storybookHelper';
import { mobileStoryParameters, disableRtlModeParameters } from 'helpers/storybookParams';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';

export default {
  title: 'ModularComponents/RubberStampPanel',
  component: RubberStampPanel,
};

const RubberStampPanelInApp = (isModular, context, location) => {
  const { addonRtl } = context.globals;
  const storybookTheme = context.globals.theme;
  const activeTheme = Object.values(Theme).includes(storybookTheme) ? storybookTheme : Theme.LIGHT;

  const mockState = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      isInDesktopOnlyMode: false,
      genericPanels: [{
        dataElement: 'rubberStampPanel',
        render: 'rubberStampPanel',
        location: location,
      }],
      openElements: {
        ...initialState.viewer.openElements,
        contextMenuPopup: false,
        rubberStampPanel: true,
      },
      activeGroupedItems: ['insertGroupedItems'],
      activeCustomRibbon: 'toolbarGroup-Insert',
      activeToolName: 'AnnotationCreateRubberStamp',
      activeTheme,
    },
    featureFlags: {
      customizableUI: true,
      newStampPanel: isModular,
    },
  };

  const RubberStampPanelStory = () => {
    useEffect(() => {
      const originalGetToolMode = core.getToolMode;
      const originalSetToolMode = core.setToolMode;
      let activeTool = 'AnnotationCreateRubberStamp';

      core.getToolMode = () => {
        const toolMode = originalGetToolMode?.call(core);
        if (toolMode?.name) {
          activeTool = toolMode.name;
          return toolMode;
        }
        return { name: activeTool };
      };

      core.setToolMode = (toolName) => {
        activeTool = toolName;
      };

      return () => {
        core.getToolMode = originalGetToolMode;
        core.setToolMode = originalSetToolMode;
      };
    }, []);

    return <MockApp initialState={mockState} initialDirection={addonRtl} />;
  };

  return <RubberStampPanelStory />;
};

export const RubberStampPanelInleft = (args, context) => RubberStampPanelInApp(false, context, 'left');
export const RubberStampPanelInRight = (args, context) => RubberStampPanelInApp(false, context, 'right');
RubberStampPanelInRight.parameters = disableRtlModeParameters;

export const RubberStampPanelInMobile = (args, context) => RubberStampPanelInApp(false, context, 'mobile');

export const ModularRubberStampPanelInleft = (args, context) => RubberStampPanelInApp(true, context, 'left');

RubberStampPanelInleft.parameters = {
  layout: 'fullscreen',
};
RubberStampPanelInRight.parameters = {
  layout: 'fullscreen',
};
ModularRubberStampPanelInleft.parameters = {
  layout: 'fullscreen',
};
RubberStampPanelInMobile.parameters = mobileStoryParameters;
