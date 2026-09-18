import React, { useEffect } from 'react';
import core from 'core';
import initialState from 'src/redux/initialState';
import Theme from 'constants/theme';
import RubberStampPanel from './RubberStampPanel';
import { expect, userEvent, within } from 'storybook/test';
import { MockApp, createCustomStamp } from 'helpers/storybookHelper';
import { mobileStoryParameters, disableRtlModeParameters } from 'helpers/storybookParams';
import { getTranslatedText } from 'helpers/testTranslationHelper';
import { getDefaultCustomStampCategory, getDefaultStandardStampCategory } from 'helpers/stamps';

export default {
  title: 'ModularComponents/RubberStampPanel',
  component: RubberStampPanel,
};


const RubberStampPanelInApp = (isModular, context, location, activeTab) => {
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
      tab: {
        ...initialState.viewer.tab,
        ...(activeTab && { rubberStampPanel: activeTab }),
      },
      activeGroupedItems: ['insertGroupedItems'],
      activeCustomRibbon: 'toolbarGroup-Insert',
      activeToolName: 'AnnotationCreateRubberStamp',
      activeTheme,
      ...(activeTab === 'rubberStampPanelCustomTab' && {
        customStamps: [
          createCustomStamp({ title: 'Approved' }),
          createCustomStamp({ title: 'For Review', category: 'Review' }),
        ],
        customStampCategories: [getDefaultCustomStampCategory(), 'Review'],
      }),
    },
    featureFlags: {
      customizableUI: true,
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

export const RubberStampPanelInLeftCustomTab = (args, context) => RubberStampPanelInApp(false, context, 'left', 'rubberStampPanelCustomTab');
export const RubberStampPanelInRightCustomTab = (args, context) => RubberStampPanelInApp(false, context, 'right', 'rubberStampPanelCustomTab');
export const RubberStampPanelInMobileCustomTab = (args, context) => RubberStampPanelInApp(false, context, 'mobile', 'rubberStampPanelCustomTab');

const DocumentStampLoaderStory = (args, context) => {
  const originalGetToolsFromAllDocumentViewers = core.getToolsFromAllDocumentViewers;
  core.getToolsFromAllDocumentViewers = () => [{
    isDocumentStampsLoading: () => true,
    addEventListener: () => {},
    removeEventListener: () => {},
    setStyles: () => {},
  }];

  useEffect(() => {
    return () => {
      core.getToolsFromAllDocumentViewers = originalGetToolsFromAllDocumentViewers;
    };
  }, [originalGetToolsFromAllDocumentViewers]);

  return RubberStampPanelInApp(true, context, 'left');
};

export const ModularRubberStampPanelWithDocumentStampLoader = DocumentStampLoaderStory;

RubberStampPanelInleft.parameters = {
  layout: 'fullscreen',
};
RubberStampPanelInRight.parameters = {
  layout: 'fullscreen',
};
RubberStampPanelInMobile.parameters = mobileStoryParameters;
RubberStampPanelInLeftCustomTab.parameters = {
  layout: 'fullscreen',
};
RubberStampPanelInRightCustomTab.parameters = {
  ...disableRtlModeParameters,
  layout: 'fullscreen',
};
RubberStampPanelInMobileCustomTab.parameters = mobileStoryParameters;
ModularRubberStampPanelWithDocumentStampLoader.parameters = {
  layout: 'fullscreen',
};
ModularRubberStampPanelWithDocumentStampLoader.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  expect(await canvas.findByTestId('document-stamps-loading')).toBeVisible();
};
RubberStampPanelInMobile.parameters = mobileStoryParameters;

const createStandardStamp = (img, category) => {
  return {
    imgSrc: img,
    annotation: {
      DateCreated: '2026-08-18T18:58:41.995Z',
      category: category,
    }
  };
};

const mockStateForCategories = (activeTheme, activeTab) => ({
  ...initialState,
  viewer: {
    ...initialState.viewer,
    isInDesktopOnlyMode: false,
    genericPanels: [{
      dataElement: 'rubberStampPanel',
      render: 'rubberStampPanel',
    }],
    openElements: {
      ...initialState.viewer.openElements,
      contextMenuPopup: false,
      rubberStampPanel: true,
    },
    tab: {
      ...initialState.viewer.tab,
      rubberStampPanel: activeTab,
    },
    activeGroupedItems: ['insertGroupedItems'],
    activeCustomRibbon: 'toolbarGroup-Insert',
    activeToolName: 'AnnotationCreateRubberStamp',
    activeTheme,
  },
  featureFlags: {
    customizableUI: false,
  },
});

export const ModularCustomRubberStampPanelWithFilteredCategories = (args, context) => {
  const { addonRtl } = context.globals;
  const storybookTheme = context.globals.theme;
  const activeTheme = Object.values(Theme).includes(storybookTheme) ? storybookTheme : Theme.LIGHT;
  const defaultCategory = getDefaultCustomStampCategory();

  const mockState = mockStateForCategories(activeTheme, 'rubberStampPanelCustomTab');
  const customStamps = [
    createCustomStamp({ title: 'Approved' }),
    createCustomStamp({ title: 'Approved', category: 'Category 1' }),
  ];
  mockState.viewer.customStamps = customStamps;
  mockState.viewer.customStampCategories = [defaultCategory, 'Category 1', 'Empty'];

  return <MockApp initialState={mockState} initialDirection={addonRtl} />;
};

ModularCustomRubberStampPanelWithFilteredCategories.parameters = {
  layout: 'fullscreen',
};

export const ModularStandardRubberStampPanelWithFilteredCategories = (args, context) => {
  const { addonRtl } = context.globals;
  const storybookTheme = context.globals.theme;
  const activeTheme = Object.values(Theme).includes(storybookTheme) ? storybookTheme : Theme.LIGHT;
  const defaultCategory = getDefaultStandardStampCategory();

  const mockState = mockStateForCategories(activeTheme, 'rubberStampPanelPresetTab');
  const standardStamps = [
    createStandardStamp('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="58" viewBox="0 0 160 58"><rect width="160" height="58" fill="%23ffffff" stroke="%236b7280"/><text x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="14" fill="%231f2937">Standard Stamp 2</text></svg>', ''),
    createStandardStamp('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="58" viewBox="0 0 160 58"><rect width="160" height="58" fill="%23ffffff" stroke="%236b7280"/><text x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="14" fill="%231f2937">Standard Stamp 3</text></svg>', 'Category 1'),
  ];
  mockState.viewer.standardStamps = standardStamps;
  mockState.viewer.standardStampCategories = [defaultCategory, 'Category 1', 'Empty'];

  return <MockApp initialState={mockState} initialDirection={addonRtl} />;
};

ModularCustomRubberStampPanelWithFilteredCategories.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const filterButton = await canvas.findByRole('button', { name: getTranslatedText('rubberStampPanel.filter') });
  filterButton.focus();
  await userEvent.keyboard('{Enter}');
  let filterOverlay = canvasElement.querySelector('.StampSearchOptionsFlyout');

  // Check that the default and non-empty categories are visible and that the empty category is not
  const defaultCategory = getTranslatedText('option.customStampModal.customStamp');
  const defaultButton = canvas.getByRole('button', { name: defaultCategory });
  const category1Button = canvas.getByRole('button', { name: 'Category 1' });
  const emptyButton = canvas.queryByRole('button', { name: 'Empty' });
  expect(defaultButton).toBeVisible();
  expect(category1Button).toBeVisible();
  expect(emptyButton).not.toBeInTheDocument();

  const category1Checkbox = canvas.getByRole('checkbox', { name: 'Category 1' });
  const defaultCheckbox = canvas.getByRole('checkbox', { name: defaultCategory });
  const emptyCheckbox = canvas.queryByRole('checkbox', { name: 'Empty' });
  expect(emptyCheckbox).not.toBeInTheDocument();

  // Navigate up and down through the checkboxes using arrow keys
  expect(category1Checkbox).toHaveFocus();
  await userEvent.keyboard('{ArrowDown}');
  expect(defaultCheckbox).toHaveFocus();
  await userEvent.keyboard('{ArrowUp}');
  expect(category1Checkbox).toHaveFocus();

  // Toggle checkboxes using Space and Enter keys
  await userEvent.keyboard(' ');
  expect(category1Checkbox).not.toBeChecked();
  expect(defaultCheckbox).toBeChecked();
  await userEvent.keyboard(' ');
  expect(category1Checkbox).toBeChecked();
  expect(defaultCheckbox).toBeChecked();
  await userEvent.keyboard('{Enter}');
  expect(category1Checkbox).not.toBeChecked();
  expect(defaultCheckbox).toBeChecked();

  // Exit just the flyout, not the panel, using Escape and Tab keys
  await userEvent.keyboard('{Escape}');
  expect(filterOverlay).not.toBeVisible();
  expect(filterButton).toBeVisible();
  filterButton.focus();
  await userEvent.keyboard('{Enter}');
  filterOverlay = canvas.getByRole('list');
  expect(filterOverlay).toBeVisible();
  await userEvent.keyboard('{Tab}');
  expect(filterOverlay).not.toBeVisible();
  filterButton.focus();
  await userEvent.keyboard('{Enter}');
  filterOverlay = canvas.getByRole('list');
  expect(filterOverlay).toBeVisible();
};

ModularStandardRubberStampPanelWithFilteredCategories.parameters = {
  layout: 'fullscreen',
};

ModularStandardRubberStampPanelWithFilteredCategories.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const filterButton = await canvas.findByRole('button', { name: getTranslatedText('rubberStampPanel.filter') });
  filterButton.focus();
  await userEvent.keyboard('{Enter}');
  let filterOverlay = canvas.getByRole('list');

  // Check that the default and non-empty categories are visible and that the empty category is not
  const defaultCategory = getTranslatedText('rubberStampPanel.standard');
  const category1Button = canvas.getByRole('button', { name: 'Category 1' });
  const defaultButton = canvas.getByRole('button', { name: defaultCategory });
  const emptyButton = canvas.queryByRole('button', { name: 'Empty' });
  expect(category1Button).toBeVisible();
  expect(defaultButton).toBeVisible();
  expect(emptyButton).not.toBeInTheDocument();

  const category1Checkbox = canvas.getByRole('checkbox', { name: 'Category 1' });
  const defaultCheckbox = canvas.getByRole('checkbox', { name: defaultCategory });
  const emptyCheckbox = canvas.queryByRole('checkbox', { name: 'Empty' });
  expect(emptyCheckbox).not.toBeInTheDocument();

  // Navigate up and down through the checkboxes using arrow keys
  expect(category1Checkbox).toHaveFocus();
  await userEvent.keyboard('{ArrowDown}');
  expect(defaultCheckbox).toHaveFocus();
  await userEvent.keyboard('{ArrowUp}');
  expect(category1Checkbox).toHaveFocus();

  // Toggle checkboxes using Space and Enter keys
  await userEvent.keyboard(' ');
  expect(category1Checkbox).not.toBeChecked();
  expect(defaultCheckbox).toBeChecked();
  await userEvent.keyboard(' ');
  expect(category1Checkbox).toBeChecked();
  expect(defaultCheckbox).toBeChecked();
  await userEvent.keyboard('{Enter}');
  expect(category1Checkbox).not.toBeChecked();
  expect(defaultCheckbox).toBeChecked();

  // Exit just the flyout, not the panel, using Escape and Tab keys
  await userEvent.keyboard('{Escape}');
  expect(filterOverlay).not.toBeVisible();
  expect(filterButton).toBeVisible();
  filterButton.focus();
  await userEvent.keyboard('{Enter}');
  filterOverlay = canvas.getByRole('list');
  expect(filterOverlay).toBeVisible();
  await userEvent.keyboard('{Tab}');
  expect(filterOverlay).not.toBeVisible();
  filterButton.focus();
  await userEvent.keyboard('{Enter}');
  filterOverlay = canvas.getByRole('list');
  expect(filterOverlay).toBeVisible();
};