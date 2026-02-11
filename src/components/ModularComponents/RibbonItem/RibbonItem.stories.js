import React from 'react';
import RibbonItem from './RibbonItem';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { mockModularComponents } from '../AppStories/mockAppState';
import { userEvent, within, expect } from 'storybook/test';

export default {
  title: 'ModularComponents/RibbonItem',
  component: RibbonItem,
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    openElements: {},
    customPanels: [],
    genericPanels: [],
    headers: {},
    lastPickedToolForGroup: {},
    lastPickedToolGroup: {},
    toolButtonObjects: {},
    activeCustomRibbon: 'Ribbon Item1',
    activeGroupedItems: [],
    customHeadersAdditionalProperties: {},
    modularComponents: mockModularComponents,
    lastActiveToolForRibbon: {},
  },
};

let currentToolbarGroup = initialState.viewer.toolbarGroup;

const initialStateActive = (toolbarGroup) => {
  currentToolbarGroup = toolbarGroup;
  return ({
    viewer: {
      ...initialState.viewer,
      activeCustomRibbon: toolbarGroup
    }
  });
};

const store = configureStore({
  reducer: (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
      case 'SET_TOOLBAR_GROUP':
        return initialStateActive(payload.toolbarGroup);
      case 'SET_ACTIVE_GROUPED_ITEMS':
        return initialStateActive(currentToolbarGroup);
      default:
        return initialState;
    }
  }
});

const item1Props = {
  dataElement: 'Ribbon Item1',
  img: 'icon-header-pan',
  title: 'icon only',
  activeCustomRibbon: 'toolbarGroup-View',
};
const item2Props = {
  dataElement: 'Ribbon Item2',
  label: 'label only',
  activeCustomRibbon: 'toolbarGroup-Annotate',
};
const item3Props = {
  dataElement: 'Ribbon Item3',
  label: 'icon and label',
  img: 'icon-header-pan',
  activeCustomRibbon: 'toolbarGroup-Shapes',
};
const item4Props = {
  dataElement: 'Ribbon Item1',
  img: 'icon-header-pan',
  title: 'icon only',
  activeCustomRibbon: 'toolbarGroup-Insert',
  direction: 'column',
};
const item5Props = {
  dataElement: 'Ribbon Item2',
  label: 'label only',
  activeCustomRibbon: 'toolbarGroup-Measure',
  direction: 'column',
  justifyContent: 'end',
};
const item6Props = {
  dataElement: 'Ribbon Item3',
  label: 'icon and label',
  img: 'icon-header-pan',
  activeCustomRibbon: 'toolbarGroup-Edit',
  direction: 'column',
};
const item7Props = {
  dataElement: 'Ribbon Item Title & Label',
  label: 'title and label',
  img: 'icon-header-pan',
  activeCustomRibbon: 'toolbarGroup-View',
  title: 'only title appears',
};
const item8Props = {
  dataElement: 'Ribbon Item Title Only',
  img: 'icon-header-pan',
  activeCustomRibbon: 'toolbarGroup-Annotate',
  title: 'title only',
};
const item9Props = {
  dataElement: 'Ribbon Item Label Only',
  label: 'label only',
  img: 'icon-header-pan',
  activeCustomRibbon: 'toolbarGroup-View',
};
const item10Props = {
  dataElement: 'Ribbon Item No Title & Label',
  img: 'icon-header-pan',
  activeCustomRibbon: 'toolbarGroup-View',
};
const item11Props = {
  dataElement: 'Ribbon Item Custom Class',
  img: 'icon-header-pan',
  title: 'custom title',
  label: 'custom label',
  toolbarGroup: 'toolbarGroup-favorites',
  activeCustomRibbon: 'toolbarGroup-favorites',
};



const horizontalRibbon = () => (
  <div style={{ display: 'flex', gap: '8px', backgroundColor: 'white' }}>
    <RibbonItem {...item1Props} />
    <RibbonItem {...item2Props} />
    <RibbonItem {...item3Props} />
  </div>
);

const verticalRibbon = () => (
  <div style={{ margin: '22px', display: 'flex', gap: '8px', flexFlow: 'column', width: '80px', backgroundColor: 'white' }}>
    <RibbonItem {...item4Props} />
    <RibbonItem {...item5Props} />
    <RibbonItem {...item6Props} />
  </div>
);

export const RibbonItems = () => {
  return (
    <Provider store={store}>
      {horizontalRibbon()}
      {verticalRibbon()}
    </Provider>
  );
};

export const RibbonItemsWithHoverState = () => {
  return (
    <Provider store={store}>
      {verticalRibbon()}
      {horizontalRibbon()}
    </Provider>
  );
};

RibbonItemsWithHoverState.parameters = {
  pseudo: { hover: true },
};

export const RibbonItemsWithCustomStyleAndClass = () => {
  return (
    <Provider store={store}>
      <div style={{ display: 'flex', gap: '8px', backgroundColor: 'white' }}>
        <RibbonItem {...item1Props} style={{ borderStyle: 'dotted' }} className='ribbon-class'/>
        <RibbonItem {...item2Props} style={{ color: 'hotpink' }} className='ribbon-class'/>
        <RibbonItem {...item3Props} style={{ border: '2px dotted blue' }} className='ribbon-class'/>
      </div>
    </Provider>
  );
};

RibbonItemsWithCustomStyleAndClass.parameters = {
  pseudo: { hover: true },
};

RibbonItemsWithCustomStyleAndClass.play = async ({ canvasElement }) => {
  const ribbonItems = canvasElement.querySelectorAll('.RibbonItem');
  ribbonItems.forEach((item) => {
    expect(item.classList.contains('ribbon-class')).toBe(true);
  });
};

export const RibbonItemsWithCustomTitlesAndLabels = () => {
  return (
    <Provider store={store}>
      <div style= {{ display: 'flex', gap: '8px', backgroundColor: 'white' }}>
        <RibbonItem {...item7Props} />
        <RibbonItem {...item8Props} />
        <RibbonItem {...item9Props} />
        <RibbonItem {...item10Props} />
        <RibbonItem {...item11Props} />
      </div>
    </Provider>
  );
};

RibbonItemsWithCustomTitlesAndLabels.parameters = {
  chromatic: {
    modes: {
      'Light theme RTL': { disable: true },
      'Dark theme': { disable: true },
    },
  },
  pseudo: { hover: true },
};


RibbonItemsWithCustomTitlesAndLabels.play = async ({ canvasElement }) => {

  const canvas = within(canvasElement);
  const body = within(document.body);

  // Hover over Ribbon with Title and Label
  const ribbonTitleAndLabel = await canvas.findByText('title and label');
  await userEvent.hover(ribbonTitleAndLabel);
  const tooltipTitleAndLabel = await body.findByText('only title appears');
  await expect(tooltipTitleAndLabel).toBeInTheDocument();

  // Hover over Ribbon with Title Only
  const ribbonTitleOnly = await canvas.findByRole('button', { name: 'title only' });
  await userEvent.hover(ribbonTitleOnly);
  const tooltipTitleOnly = await body.findByText('title only');
  await expect(tooltipTitleOnly).toBeInTheDocument();

  //  Hover over Ribbon with Label Only
  const ribbonLabelOnly = await canvas.findByText('label only');
  await userEvent.hover(ribbonLabelOnly);
  const tooltipLabelOnly = await body.findByText('label only', { selector: '.tooltip__content' });
  await expect(tooltipLabelOnly).toBeInTheDocument();

  // Hover over Ribbon with no Title or Label
  const ribbonNoTitleAndLabel = canvasElement.querySelector('[data-element="Ribbon Item No Title & Label"]');
  await userEvent.hover(ribbonNoTitleAndLabel);

  // No tooltip should appear as there is no title or label
  const tooltip = document.querySelector('.tooltip--bottom[data-element="tooltip"]');
  expect(tooltip).toBeFalsy();

  // Hover Over Ribbon with Custom Title and Label and custom Ribbon Class
  const ribbonCustomClass = await canvas.findByText('custom label');
  await userEvent.hover(ribbonCustomClass);
  const tooltipCustomClass = await body.findByText('custom title');
  await expect(tooltipCustomClass).toBeInTheDocument();


};




