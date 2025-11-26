import App from 'components/App';
import { mockHeadersNormalized, mockModularComponents } from './mockAppState';
import core from 'core';
import { createMockAppTemplate } from './helpers/appResponsivenessHelpers';
import { within, expect } from 'storybook/test';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';
import { createTemplate } from 'src/helpers/storybookHelper';

export default {
  title: 'ModularComponents/App Responsiveness',
  component: App,
  parameters: {
    chromatic: { delay: 500 },
  }
};

core.getToolMode = () => {
  return {
    name: 'AnnotationEraserTool',
  };
};

export const Full = createMockAppTemplate();
export const ExtraLarge = createMockAppTemplate({ width: '1920px', height: '1080px' });
export const Large = createMockAppTemplate({ width: '1024px', height: '768px' });
export const Medium = createMockAppTemplate({ width: '768px', height: '1024px' });
export const Small = createMockAppTemplate({ width: '576px', height: '800px' });
export const ExtraSmall = createMockAppTemplate({ width: '360px', height: '667px', activeToolName: 'AnnotationEraserTool' });
export const TooSmall = createMockAppTemplate({ width: '200px', height: '300px', activeToolName: 'AnnotationEraserTool' });

const ExtraItemsAddedHeaders = {
  ...mockHeadersNormalized,
  'default-top-header': {
    ...mockHeadersNormalized['default-top-header'],
    items: [
      'groupedLeftHeaderButtons',
      'default-ribbon-group',
      'searchPanelToggle',
      'notesPanelToggle',
      'stylePanelToggle',
      'redactionToolButton',
      'filePickerButton', // this button shouldn't render because it start as disabled
      'downloadButton',
      'settingsButton',
      'annotateGroupedItems2',
    ]
  }
};

const ExtraItemsAddedComponents = {
  ...mockModularComponents,
  annotateGroupedItems2: {
    dataElement: 'annotateGroupedItems2',
    items: [
      'underlineToolButton',
      'highlightToolButton',
      'rectangleToolButton',
      'freeTextToolButton',
      'squigglyToolButton',
      'strikeoutToolButton',
      'defaultAnnotationUtilities2'
    ],
    type: 'groupedItems',
    justifyContent: 'center',
    grow: 0,
    gap: 12,
    alwaysVisible: true,
    style: {}
  },
  defaultAnnotationUtilities2: {
    dataElement: 'defaultAnnotationUtilities2',
    items: [
      'divider-0.12046025247094039',
      'stylePanelToggle',
      'divider-0.3460871740070717',
      'undoButton',
      'redoButton',
      'eraserToolButton'
    ],
    type: 'groupedItems',
    grow: 0,
    gap: 12,
    alwaysVisible: true,
    style: {}
  },
};

export const ExtraItemsAdded = createMockAppTemplate({
  headers: ExtraItemsAddedHeaders,
  components: ExtraItemsAddedComponents
});

export const RibbonItemsOverflow = createMockAppTemplate({ width: '690px' });
export const RibbonItemsOverflowActive = createMockAppTemplate({ width: '750px', activeCustomRibbon: 'toolbarGroup-Insert' });
export const RibbonItemsShouldNotLoop = createMockAppTemplate({
  width: '1135px',
  components: {
    ...mockModularComponents,
    'toolbarGroup-Forms': {
      dataElement: 'toolbarGroup-Forms',
      title: 'Forms',
      type: 'ribbonItem',
      label: 'Forms',
      groupedItems: [
        'formsGroupedItems'
      ],
      toolbarGroup: 'toolbarGroup-Forms'
    },
    'default-ribbon-group': {
      ...mockModularComponents['default-ribbon-group'],
      items: [
        'toolbarGroup-View',
        'toolbarGroup-Annotate',
        'toolbarGroup-Shapes',
        'toolbarGroup-Insert',
        'toolbarGroup-Redact',
        'toolbarGroup-Measure',
        'toolbarGroup-Edit',
        'toolbarGroup-FillAndSign',
        'toolbarGroup-Forms',
      ],
    },
  }
});

export const ViewOnly = createTemplate({ headers: mockHeadersNormalized, components: mockModularComponents });

ViewOnly.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  window.instance.UI.enableViewOnlyMode();

  const searchButton = await canvas.findByRole('button', { name: getTranslatedText('component.searchPanel') });
  const commentsButton = await canvas.findByRole('button', { name: getTranslatedText('component.notesPanel') });
  let moreButton = canvas.queryByRole('button', { name: getTranslatedText('action.more') });
  await expect(searchButton).toBeVisible();
  await expect(commentsButton).toBeVisible();
  await expect(moreButton).toBeNull();

  const appElement = canvasElement.querySelector('.App');
  appElement.style.width = '375px';
  appElement.style.height = '667px';
  window.dispatchEvent(new Event('resize'));

  moreButton = await canvas.findByRole('button', { name: getTranslatedText('action.more') });
  await expect(moreButton).toBeVisible();
  await expect(searchButton).toBeVisible();
  await expect(commentsButton).toBeVisible();
};

ViewOnly.parameters = {
  chromatic: {
    modes: {
      'Dark theme': { disable: true },
    },
  },
};