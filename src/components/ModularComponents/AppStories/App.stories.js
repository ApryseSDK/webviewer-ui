import App from 'components/App';
import { mockHeadersNormalized, mockModularComponents, mockLeftHeader } from './mockAppState';
import { userEvent, within, expect } from '@storybook/test';
import { defaultModularComponents, defaultModularHeaders } from 'src/redux/modularComponents';
import { createTemplate } from 'helpers/storybookHelper';

export default {
  title: 'ModularComponents/App',
  component: App,
};

export const DefaultUI = createTemplate({ headers: mockHeadersNormalized, components: mockModularComponents });

const headersWithLeftHeader = {
  ...defaultModularHeaders,
  'tools-header': {
    ...defaultModularHeaders['tools-header'],
    placement: 'left'
  }
};

export const LeftHeader = createTemplate({ headers: headersWithLeftHeader, components: defaultModularComponents });
LeftHeader.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  expect(canvas.getByRole('navigation', { name: 'Top Header' })).toBeInTheDocument();
  expect(canvas.getByRole('navigation', { name: 'Left Header' })).toBeInTheDocument();
  expect(canvas.getByRole('main', { name: 'Document Content' })).toBeInTheDocument();
};

const headersWithRightHeader = {
  ...defaultModularHeaders,
  'tools-header': {
    ...defaultModularHeaders['tools-header'],
    placement: 'right'
  }
};

export const RightHeader = createTemplate({ headers: headersWithRightHeader, components: defaultModularComponents });
RightHeader.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  expect(canvas.getByRole('navigation', { name: 'Top Header' })).toBeInTheDocument();
  expect(canvas.getByRole('navigation', { name: 'Right Header' })).toBeInTheDocument();
  expect(canvas.getByRole('main', { name: 'Document Content' })).toBeInTheDocument();
};

const headersWithBottomHeader = {
  ...defaultModularHeaders,
  'tools-header': {
    ...defaultModularHeaders['tools-header'],
    placement: 'bottom'
  }
};

export const BottomHeader = createTemplate({ headers: headersWithBottomHeader, components: defaultModularComponents });
BottomHeader.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  expect(canvas.getByRole('navigation', { name: 'Top Header' })).toBeInTheDocument();
  expect(canvas.getByRole('navigation', { name: 'Bottom Header' })).toBeInTheDocument();
  expect(canvas.getByRole('main', { name: 'Document Content' })).toBeInTheDocument();
};

export const ActiveGroupHeaderTest = createTemplate({ headers: mockHeadersNormalized, components: mockModularComponents });
ActiveGroupHeaderTest.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  // We should be able to find the underline button since the default selected group is annotateGroupedItems
  await canvas.findAllByRole('button', { name: 'Underline' });
  // Now if we click on ribbon
  const viewRibbon = await canvas.findByLabelText('View');
  await userEvent.click(viewRibbon);
  // the underline button should not be visible anymore as the header is hidden
  expect(viewRibbon.classList.contains('active')).toBe(true);
  expect(await canvas.queryByRole('button', { name: 'Underline' })).toBeNull();
};

ActiveGroupHeaderTest.parameters = {
  test: {
    dangerouslyIgnoreUnhandledErrors: true,
  },
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
  'onClick': () => { },
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

export const MultiTab = createTemplate({
  headers: mockHeadersNormalized,
  components: mockModularComponents,
  isMultiTab: true
});

MultiTab.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  await userEvent.tab();
  const selectedtabButton = await canvas.findByRole('tab', { name: /Selected Document/i });
  await expect(selectedtabButton).toHaveFocus();

  // Tab to the default top header
  await userEvent.tab();
  const menuButton = await canvas.findByRole('button', { name: /Menu/i });
  await expect(menuButton).toHaveFocus();

  // Shift tabbing should focus the Multi Tab header in the 'Selected Document' tab button
  await userEvent.tab({ shift: true });
  await expect(selectedtabButton).toHaveFocus();

  // Using the arrow keys to focus on the Title B File Tab.
  await userEvent.keyboard('{ArrowLeft}');
  await userEvent.keyboard('{ArrowLeft}');
  const titleBButton = await canvas.findByRole('tab', { name: /Title B/i });
  await expect(titleBButton).toHaveFocus();

  // Using the arrow keys to navigate to the last button in the header, passing through the first element.
  for (let i = 0; i < 3; i++) {
    await userEvent.keyboard('{ArrowLeft}');
  }

  const openFileButton = await canvas.findByRole('button', { name: /Open File/i });
  await expect(openFileButton).toHaveFocus();

  // Going back from the last element to the first, using the arrow keys
  await userEvent.keyboard('{ArrowRight}');
  const titleAButton = await canvas.findByRole('tab', { name: /Title A/i });
  await expect(titleAButton).toHaveFocus();
};

MultiTab.parameters = {
  layout: 'fullscreen',
  customizableUI: true,
};

export const HeaderKeyboardNavigationTest = createTemplate({ headers: mockHeadersNormalized, components: mockModularComponents });

HeaderKeyboardNavigationTest.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const defaultTopHeader = await canvas.findByRole('toolbar', { name: 'default-top-header' });
  const ariaOrientation = await defaultTopHeader.getAttribute('aria-orientation');
  await expect(ariaOrientation).toBe('horizontal');

  // Tab to the default top header
  await userEvent.tab();
  const menuButton = await canvas.findByRole('button', { name: 'Menu' });
  await expect(menuButton).toHaveFocus();

  // Arrow over to the Annotate ribbon item
  for (let i = 0; i < 10; i++) {
    await userEvent.keyboard('{ArrowRight}');
  }

  const annotateItem = await canvas.findByRole('button', { name: 'Annotate' });
  await expect(annotateItem).toHaveFocus();

  // Open the Annotate toolbar group
  await userEvent.keyboard('{Enter}');
  await expect(annotateItem).toHaveFocus();

  const toolbarHeader = await canvas.findByRole('toolbar', { name: 'tools-header' });
  await expect(toolbarHeader).toBeVisible();

  const rectangleButton = await canvas.findByRole('button', { name: 'Rectangle' });
  await expect(rectangleButton).toBeVisible();

  // Annotate ribbon item should still be focused
  await expect(annotateItem).toHaveFocus();

  // Tab to the toolbar header
  await userEvent.tab();

  // Arrow over to the Rectangle tool button
  for (let i = 0; i < 2; i++) {
    await userEvent.keyboard('{ArrowRight}');
  }
  await expect(rectangleButton).toHaveFocus();

  // Shift tabbing should focus the Annotate ribbon item again
  await userEvent.tab({ shift: true });
  await expect(annotateItem).toHaveFocus();

  // Pressing Home should focus the first item in the header, in this case, the Menu button
  await userEvent.keyboard('{Home}');
  await expect(menuButton).toHaveFocus();

  // Pressing End should focus the last item in the header, in this case, the Comments button
  await userEvent.keyboard('{End}');
  const commentsButton = await canvas.findByRole('button', { name: 'Comments' });
  await expect(commentsButton).toHaveFocus();

  // Pressing Arrow Right should focus the first item in the header again
  await userEvent.keyboard('{ArrowRight}');
  await expect(menuButton).toHaveFocus();

  // Pressing Arrow Left should focus the last item in the header again
  await userEvent.keyboard('{ArrowLeft}');
  await expect(commentsButton).toHaveFocus();
};

HeaderKeyboardNavigationTest.parameters = {
  test: {
    dangerouslyIgnoreUnhandledErrors: true,
  },
};

export const VerticalHeaderKeyboardNavigationTest = createTemplate({
  headers: mockLeftHeader.modularHeaders,
  components: mockLeftHeader.modularComponents,
});

VerticalHeaderKeyboardNavigationTest.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  // Ensure the default left header is set up correctly with vertical orientation
  const defaultLeftHeader = await canvas.findByRole('toolbar', { name: 'default-left-header' });
  const ariaOrientation = await defaultLeftHeader.getAttribute('aria-orientation');
  expect(ariaOrientation).toBe('vertical');

  // Focus on the Print button in the left header
  for (let i = 0; i < 2; i++) {
    await userEvent.tab();
  }
  const printButton = await canvas.findByRole('button', { name: 'Print' });
  await expect(printButton).toHaveFocus();

  // Arrow down to the Annotate ribbon item
  for (let i = 0; i < 2; i++) {
    await userEvent.keyboard('{ArrowDown}');
  }

  const annotateItem = await canvas.findByRole('button', { name: 'Annotate' });
  await expect(annotateItem).toHaveFocus();

  // Open the Annotate toolbar group
  await userEvent.keyboard('{Enter}');
  await expect(annotateItem).toHaveFocus();

  const underlineButton = await canvas.findByRole('button', { name: 'Underline' });
  await expect(underlineButton).toBeVisible();

  // Annotate ribbon item should still be focused
  await expect(annotateItem).toHaveFocus();

  // Shift+Tab to focus on the toolbar header (tools-header)
  await userEvent.tab({ shift: true });

  // Arrow over to the Underline tool button
  await userEvent.keyboard('{ArrowRight}');
  await expect(underlineButton).toHaveFocus();

  // Tab to move focus back to the left header
  await userEvent.tab();
  // Annotate ribbon item should still be focused
  await expect(annotateItem).toHaveFocus();

  // Press Home to focus the first item in the header (Print button)
  await userEvent.keyboard('{Home}');
  await expect(printButton).toHaveFocus();

  // Press End to focus the last item in the header (Shapes button)
  await userEvent.keyboard('{End}');
  const shapesButton = await canvas.findByRole('button', { name: 'Shapes' });
  await expect(shapesButton).toHaveFocus();

  // Press Arrow Down to focus the first item in the header again
  await userEvent.keyboard('{ArrowDown}');
  await expect(printButton).toHaveFocus();

  // Press Arrow Up to focus the last item in the header again
  await userEvent.keyboard('{ArrowUp}');
  await expect(shapesButton).toHaveFocus();
};

VerticalHeaderKeyboardNavigationTest.parameters = {
  test: {
    dangerouslyIgnoreUnhandledErrors: true,
  },
};
