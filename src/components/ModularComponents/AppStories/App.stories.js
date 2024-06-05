import App from 'components/App';
import { mockHeadersNormalized, mockModularComponents } from './mockAppState';
import { userEvent, within, expect } from '@storybook/test';
import { createTemplate } from 'helpers/storybookHelper';

export default {
  title: 'ModularComponents/App',
  component: App,
  includeStories: ['DefaultUI', 'ActiveGroupHeaderTest', 'HeaderButtonsWithLabelsAndIcons'],
  excludeStories: ['CreateTemplate'],
};

export const DefaultUI = createTemplate({ headers: mockHeadersNormalized, components: mockModularComponents });

export const ActiveGroupHeaderTest = createTemplate({ headers: mockHeadersNormalized, components: mockModularComponents });
ActiveGroupHeaderTest.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  // We should be able to find the underline button since the default selected group is annotateGroupedItems
  await canvas.findAllByRole('button', { name: 'Underline' });
  // Now if we click on ribbon
  const viewRibbon = await canvas.findByLabelText('View');
  await userEvent.click(viewRibbon);
  // the underline button should not be visible anymore as the header is hidden
  expect(await canvas.queryByRole('button', { name: 'Underline' })).toBeNull();
};

const customHeaders = {
  ...mockHeadersNormalized,
  'default-top-header': {
    ...mockHeadersNormalized['default-top-header'],
    'items': [
      ...mockHeadersNormalized['default-top-header'].items,
      'labelButton',
      'labelAndIconButton'
    ]
  }
};

const labelAndIconButton = {
  'dataElement': 'labelAndIconButton',
  'title': 'Export button',
  'type': 'customButton',
  'label': 'Export',
  'img': 'icon-save',
  'onClick': () => {},
};

const labelButton = {
  'dataElement': 'labelButton',
  'title': 'Toggle the visibility of Flyout',
  'type': 'toggleButton',
  'label': 'Custom Flyout',
  'toggleElement': 'myCustomFlyout'
};

const customComponents = {
  ...mockModularComponents,
  'labelAndIconButton': labelAndIconButton,
  'labelButton': labelButton
};

export const HeaderButtonsWithLabelsAndIcons = createTemplate({ headers: customHeaders, components: customComponents });