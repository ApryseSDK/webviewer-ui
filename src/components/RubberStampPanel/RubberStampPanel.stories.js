import React from 'react';
import initialState from 'src/redux/initialState';
import RubberStampPanel from './RubberStampPanel';
import { setItemToFlyoutStore } from 'helpers/itemToFlyoutHelper';
import { MockApp, createStore } from 'helpers/storybookHelper';

export default {
  title: 'ModularComponents/RubberStampPanel',
  component: RubberStampPanel,
  parameters: {
    customizableUI: true,
  },
};

const RubberStampPanelInApp = (location,) => {
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
      activeToolName: 'AnnotationCreateRubberStamp'
    },
    featureFlags: {
      customizableUI: true,
    },
  };
  const store = createStore(mockState);
  setItemToFlyoutStore(store);

  return <MockApp initialState={mockState} />;
};

export const RubberStampPanelInleft = () => RubberStampPanelInApp('left');
export const RubberStampPanelInRight = () => RubberStampPanelInApp('right');
export const RubberStampPanelInMobile = () => RubberStampPanelInApp();

RubberStampPanelInleft.parameters = {
  layout: 'fullscreen',
};
RubberStampPanelInRight.parameters = {
  layout: 'fullscreen',
};
RubberStampPanelInMobile.parameters = window.storybook.MobileParameters;