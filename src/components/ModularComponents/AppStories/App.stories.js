import App from 'components/App';
import { mockHeadersNormalized, mockModularComponents, mockLeftHeader } from './mockAppState';
import { userEvent, within, expect, waitFor } from 'storybook/test';
import { defaultModularComponents, defaultModularHeaders } from 'src/redux/modularComponents';
import { createTemplate } from 'helpers/storybookHelper';
import initialState from 'src/redux/initialState';
import actions from 'actions';
import { VIEWER_CONFIGURATIONS } from 'constants/customizationVariables';

export default {
  title: 'ModularComponents/App',
  component: App,
};

export const DefaultUI = createTemplate({ headers: mockHeadersNormalized, components: mockModularComponents });

DefaultUI.play = async ({ canvasElement }) => {
  const canvas = await within(canvasElement);
  const documentContainer = canvas.getByRole('tabpanel');
  expect(documentContainer).not.toHaveAttribute('aria-labelledby');

  // Setting the Ribbon using setActiveGroupedItems API
  window.instance.UI.setActiveGroupedItems('shapesGroupedItems');
  const shapesRibbon = await canvas.findByRole('button', { name: /Shapes/i });
  waitFor(() => {
    expect(shapesRibbon).toHaveAttribute('aria-current', 'true');
  });
  window.instance.UI.setActiveGroupedItems('annotateGroupedItems');
  const annotateRibbon = await canvas.findByRole('button', { name: /Annotate/i });
  await expect(annotateRibbon).toHaveAttribute('aria-current', 'true');

  // Check if dir is being set correctly on Language change
  const appElement = canvasElement.querySelector('.App');
  await expect(appElement).toHaveAttribute('dir', 'ltr');
  window.instance.UI.setLanguage('ur');
  await waitFor(() => {
    expect(appElement).toHaveAttribute('dir', 'rtl');
  });
  window.instance.UI.setLanguage('en');
  await waitFor(() => {
    expect(appElement).toHaveAttribute('dir', 'ltr');
  });
};

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

export const LeftHeaderWithPanel = createTemplate({ headers: headersWithLeftHeader, components: defaultModularComponents });
LeftHeaderWithPanel.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const toolsHeader = canvas.getByLabelText('tools-header');
  expect(toolsHeader).toBeInTheDocument();
  window.instance.UI.openElements(['tabPanel']);
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

export const RightHeaderWithPanel = createTemplate({ headers: headersWithRightHeader, components: defaultModularComponents });
RightHeaderWithPanel.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const toolsHeader = canvas.getByLabelText('tools-header');
  expect(toolsHeader).toBeInTheDocument();
  window.instance.UI.openElements(['searchPanel']);
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

export const bottomHeaderWithPanels = createTemplate({ headers: headersWithBottomHeader, components: defaultModularComponents });
bottomHeaderWithPanels.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const toolsHeader = canvas.getByLabelText('tools-header');
  expect(toolsHeader).toBeInTheDocument();
  window.instance.UI.openElements(['tabPanel', 'searchPanel']);
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

export const UIWithoutRibbons = createTemplate({ headers: mockHeadersNormalized, components: mockModularComponents });

UIWithoutRibbons.play = async ({ canvasElement }) => {
  const canvas = await within(canvasElement);
  const dataElementItems = [
    'toolbarGroup-View',
    'toolbarGroup-Annotate',
    'toolbarGroup-Shapes',
    'toolbarGroup-Insert',
    'toolbarGroup-Edit',
    'toolbarGroup-Forms',
    'toolbarGroup-FillAndSign'
  ];
  window.instance.UI.disableElements(dataElementItems);

  window.instance.UI.setActiveGroupedItems('shapesGroupedItems');
  const ellipseTool = canvas.getByRole('button', { name: 'Ellipse' });
  expect(ellipseTool).toBeInTheDocument();

  window.instance.UI.setActiveGroupedItems('insertGroupedItems');
  const rubberStampTool = canvas.getByRole('button', { name: 'Rubber Stamp' });
  expect(rubberStampTool).toBeInTheDocument();
};

const undoButton = {
  'dataElement': 'myDataElement-undoButton',
  'title': 'Undo!',
  'type': 'presetButton',
  'img': 'apryse-logo',
  'buttonType': 'undoButton'
};

const presetButtonFlyoutMap = {
  ['MainMenuFlyout']: {
    dataElement: 'MainMenuFlyout',
    'items': [
      {
        'dataElement': 'myDataElement-downloadButton',
        'title': 'Download!',
        'type': 'presetButton',
        'img': 'apryse-logo',
        'buttonType': 'downloadButton'
      },
    ]
  },
};

const mockModularComponentsWithPresetButtons = { ...mockModularComponents, undoButton };

export const UIWithPresetButtons = createTemplate({ headers: mockHeadersNormalized, components: mockModularComponentsWithPresetButtons, flyoutMap: presetButtonFlyoutMap });

UIWithPresetButtons.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const body = within(document.body);

  // Hover over the preset Undo button
  const presetUndoButton = canvas.getByRole('button', { name: /Undo!/i });
  await userEvent.hover(presetUndoButton);
  const tooltip = await body.findByText('Undo!');
  await expect(tooltip).toBeInTheDocument();

  // Open the menu flyout and view the preset Download button
  const menuButton = canvas.getByRole('button', { name: 'Menu' });
  await userEvent.click(menuButton);
  const downloadButton = canvas.getByRole('button', { name: /Download/i });
  expect(downloadButton).toBeInTheDocument();
};

let storeRef = { current: null };
export const AppStashSwitchStory = createTemplate({
  headers: mockHeadersNormalized,
  components: mockModularComponents,
  flyoutMap: initialState.viewer.flyoutMap,
  storeRef,
});

AppStashSwitchStory.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const dataElement = 'MainMenuFlyout';

  const getMainMenuItems = () => storeRef.current.getState().viewer.flyoutMap[dataElement]?.items || [];

  // Add new item to the Main Menu Flyout
  const newName = 'New Item 1';
  storeRef.current.dispatch(actions.setFlyoutItems(dataElement, [
    ...getMainMenuItems(),
    {
      icon: 'icon-header-file-picker-line',
      label: newName,
      onClick: () => {
        console.log(`clicked ${newName}`);
      }
    }
  ]));

  // Switch to Spreadsheet Editor mode and ensure item is not visible
  storeRef.current.dispatch(actions.stashComponents(VIEWER_CONFIGURATIONS.DEFAULT));
  storeRef.current.dispatch(actions.restoreComponents(VIEWER_CONFIGURATIONS.SPREADSHEET_EDITOR));
  canvas.getByRole('button', { name: 'Menu' }).click();
  await expect(canvas.queryByRole('button', { name: newName })).not.toBeInTheDocument();

  // Switch back to the default mode
  storeRef.current.dispatch(actions.restoreComponents(VIEWER_CONFIGURATIONS.DEFAULT));
  const newItem = await canvas.findByRole('button', { name: newName });
  await expect(newItem).toBeInTheDocument();
};