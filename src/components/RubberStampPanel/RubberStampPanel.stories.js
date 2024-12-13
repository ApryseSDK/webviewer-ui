import React from 'react';
import initialState from 'src/redux/initialState';
import RubberStampPanel from './RubberStampPanel';
import { setItemToFlyoutStore } from 'helpers/itemToFlyoutHelper';
import { MockApp, createStore } from 'helpers/storybookHelper';

export default {
  title: 'ModularComponents/RubberStampPanel',
  component: RubberStampPanel,
};

const RubberStampPanelInApp = (context, location) => {
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
      lastPickedToolForGroupedItems: {
        'insertGroupedItems': 'AnnotationCreateRubberStamp'
      },
      activeGroupedItems: ['insertGroupedItems'],
      activeCustomRibbon: 'toolbarGroup-Insert',
      lastPickedToolAndGroup: {
        tool: 'AnnotationCreateRubberStamp',
        group: ['insertGroupedItems', 'insertToolsGroupedItems'],
      },
      activeToolName: 'AnnotationCreateRubberStamp',
      activeTheme: context.globals.theme,
    },
    featureFlags: {
      customizableUI: true,
    },
  };
  const store = createStore(mockState);
  setItemToFlyoutStore(store);

  return <MockApp initialState={mockState} />;
};

export const RubberStampPanelInleft = (args, context) => RubberStampPanelInApp(context, 'left');
export const RubberStampPanelInRight = (args, context) => RubberStampPanelInApp(context, 'right');
export const RubberStampPanelInMobile = (args, context) => RubberStampPanelInApp(context, );

RubberStampPanelInleft.parameters = {
  layout: 'fullscreen',
};
RubberStampPanelInRight.parameters = {
  layout: 'fullscreen',
};
RubberStampPanelInMobile.parameters = window.storybook.MobileParameters;