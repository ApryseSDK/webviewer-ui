import App from 'components/App';
import { mockHeadersNormalized, mockModularComponents } from './mockAppState';
import { createTemplate } from 'helpers/storybookHelper';
import { expect, within } from 'storybook/test';
import core from 'core';
import actions from 'actions';
import selectors from 'selectors';
import viewOnlyWhitelist from 'src/redux/viewOnlyWhitelist';
import { panelNames } from 'src/constants/panel';
import { PRESET_BUTTON_TYPES } from 'constants/customizationVariables';
import DataElements from 'constants/dataElement';
import { defaultFlyoutMap } from 'src/redux/modularComponents';

export default {
  title: 'ModularComponents/ViewOnly',
  component: App,
};

const storeRef = { current: null };
export const ViewOnlyApp = createTemplate({
  headers: mockHeadersNormalized,
  components: mockModularComponents,
  flyoutMap: {
    ...defaultFlyoutMap,
    emptyFlyout: {
      dataElement: 'emptyFlyout',
      items: [],
    },
    presetDisabledFlyout: {
      dataElement: 'presetDisabledFlyout',
      items: [{
        'dataElement': DataElements.CREATE_PORTFOLIO_BUTTON,
        'presetDataElement': 'createPortfolioPresetButton',
        'icon': 'icon-pdf-portfolio',
        'label': 'portfolio.createPDFPortfolio',
        'title': 'portfolio.createPDFPortfolio',
        'isActive': false,
        'type': 'presetButton',
        'buttonType': 'createPortfolioButton'
      }],
    }
  },
  storeRef,
});

ViewOnlyApp.play = async ({ canvasElement }) => {
  const originalFFCMode = core.getFormFieldCreationManager().endFormFieldCreationMode;
  const originalContentEditMode = core.getContentEditManager().endContentEditMode;
  let calls = 0;
  core.getFormFieldCreationManager().endFormFieldCreationMode = () => calls++;
  core.getContentEditManager().endContentEditMode = () => calls++;

  // Should always be false before entering view-only mode
  let shouldBeFalse = selectors.isDisabledViewOnly(storeRef.current.getState(), 'rectangleToolButton');
  expect(shouldBeFalse).toBe(false);

  // These elements should be closed when entering view-only mode
  storeRef.current.dispatch(actions.openElements(['mainMenuFlyout', 'searchPanel', 'randomElement']));
  window.instance.UI.enableViewOnlyMode();

  // Should enable core readOnly
  expect(core.getIsReadOnly()).toBe(true);

  // Should always be false if dataElement is undefined or not a component type that we have a whitelist for
  shouldBeFalse = selectors.isDisabledViewOnly(storeRef.current.getState(), 'randomElement');
  expect(shouldBeFalse).toBe(false);
  shouldBeFalse = selectors.isDisabledViewOnly(storeRef.current.getState(), undefined);
  expect(shouldBeFalse).toBe(false);
  shouldBeFalse = selectors.isDisabledViewOnly(storeRef.current.getState(), null);
  expect(shouldBeFalse).toBe(false);
  // Should be false if it is a modular component type but not in the whitelisted types
  shouldBeFalse = selectors.isDisabledViewOnly(storeRef.current.getState(), 'divider-0.1');
  expect(shouldBeFalse).toBe(false);
  // Should be true if it is a divider and a recursive call (this will cause containers to hide if the only element left is dividers)
  let shouldBeTrue = selectors.isDisabledViewOnly(storeRef.current.getState(), 'divider-0.1', true);
  expect(shouldBeTrue).toBe(true);
  // Should be true for empty flyouts
  shouldBeTrue = selectors.isDisabledViewOnly(storeRef.current.getState(), 'emptyFlyout');
  expect(shouldBeTrue).toBe(true);
  // Should be true for flyouts recursively if all their children are disabled
  shouldBeTrue = selectors.isDisabledViewOnly(storeRef.current.getState(), 'presetDisabledFlyout');
  expect(shouldBeTrue).toBe(true);

  core.getFormFieldCreationManager().endFormFieldCreationMode = originalFFCMode;
  core.getContentEditManager().endContentEditMode = originalContentEditMode;

  expect(calls >= 2).toBe(true);
  const state = storeRef.current.getState();
  expect(selectors.isElementOpen(state, 'mainMenuFlyout')).toBe(false);
  expect(selectors.isElementOpen(state, 'searchPanel')).toBe(false);
  expect(selectors.isElementOpen(state, 'randomElement')).toBe(false);

  const panels = Object.values(panelNames);
  panels.forEach(async (panel) => {
    storeRef.current.dispatch(actions.openElement(panel));
    const state = storeRef.current.getState();
    const isWhitelisted = viewOnlyWhitelist.panel.includes(panel);
    expect(await selectors.isElementOpen(state, panel)).toBe(isWhitelisted);
    storeRef.current.dispatch(actions.closeElement(panel));
  });

  const modalElements = [
    DataElements.SCALE_MODAL,
    DataElements.CONTENT_EDIT_LINK_MODAL,
    DataElements.SIGNATURE_MODAL,
    DataElements.PRINT_MODAL,
    DataElements.ERROR_MODAL,
    DataElements.PASSWORD_MODAL,
    DataElements.CUSTOM_STAMP_MODAL,
    DataElements.PAGE_REPLACEMENT_MODAL,
    DataElements.LINK_MODAL,
    DataElements.FILTER_MODAL,
    DataElements.PAGE_REDACT_MODAL,
    DataElements.CALIBRATION_MODAL,
    DataElements.SETTINGS_MODAL,
    DataElements.SAVE_MODAL,
    DataElements.INSERT_PAGE_MODAL,
    DataElements.LOADING_MODAL,
    DataElements.WARNING_MODAL,
    DataElements.MODEL3D_MODAL,
    DataElements.COLOR_PICKER_MODAL,
    DataElements.OPEN_FILE_MODAL,
    DataElements.CUSTOM_MODAL,
    DataElements.SIGNATURE_VALIDATION_MODAL,
    DataElements.CREATE_PORTFOLIO_MODAL,
    DataElements.HEADER_FOOTER_OPTIONS_MODAL,
    DataElements.OFFICE_EDITOR_MARGINS_MODAL,
    DataElements.OFFICE_EDITOR_COLUMNS_MODAL,
  ];
  for (let modal of modalElements) {
    const shouldBeWhitelisted = viewOnlyWhitelist.modal.includes(modal);
    const isDisabled = selectors.isDisabledViewOnly(state, modal);
    expect(isDisabled).toBe(!shouldBeWhitelisted);
  }

  // Should be disabled for headers, ribbons, and GroupedItems by recursively checking their children
  const canvas = within(canvasElement);
  const headers = await canvas.findAllByRole('toolbar');
  // Second header is hidden
  expect(headers.length).toBe(1);
  const ribbonItems = canvasElement.querySelectorAll('.RibbonItem');
  // Ribbons are all hidden (this is a recursive check since ribbons contain GroupedItems which contain toolButtons)
  expect(ribbonItems.length).toBe(0);
};

const storeRef2 = { current: null };
export const ViewOnlyWhitelist = createTemplate({
  headers: mockHeadersNormalized,
  components: mockModularComponents,
  flyoutMap: {
    ...defaultFlyoutMap,
    emptyFlyout: {
      dataElement: 'emptyFlyout',
      items: [],
    },
    presetDisabledFlyout: {
      dataElement: 'presetDisabledFlyout',
      items: [{
        'dataElement': DataElements.CREATE_PORTFOLIO_BUTTON,
        'presetDataElement': 'createPortfolioPresetButton',
        'icon': 'icon-pdf-portfolio',
        'label': 'portfolio.createPDFPortfolio',
        'title': 'portfolio.createPDFPortfolio',
        'isActive': false,
        'type': 'presetButton',
        'buttonType': 'createPortfolioButton'
      }],
    }
  },
  storeRef: storeRef2,
});
ViewOnlyWhitelist.play = async ({ canvasElement }) => {
  // should be able to whitelist ribbons
  window.instance.UI.addToViewOnlyWhitelist(['toolbarGroup-View', 'toolbarGroup-Annotate']);
  // Should be able to whitelist buttons and recursively their parents
  window.instance.UI.addToViewOnlyWhitelist(['ellipseToolButton']);
  // Should be able to blacklist elements
  window.instance.UI.removeFromViewOnlyWhitelist(['panToolButton']);

  window.instance.UI.enableViewOnlyMode();

  const ribbonItems = canvasElement.querySelectorAll('.RibbonItem');
  expect(ribbonItems.length).toBe(3);

  // Annotate ribbon should not show header since no buttons are whitelisted
  const canvas = within(canvasElement);
  await canvas.getByRole('button', { name: 'Annotate' }).click();
  const headers = await canvas.findAllByRole('toolbar');
  expect(headers.length).toBe(1);

  await canvas.getByRole('button', { name: 'Shapes' }).click();
  await expect(await canvas.findByRole('button', { name: 'Ellipse' })).toBeInTheDocument();

  // should be able to update hotkeys whitelist
  window.instance.UI.updateViewOnlyShortcuts([window.instance.UI.Shortcuts.RECTANGLE]);
  const newShortcuts = window.instance.UI.getViewOnlyShortcuts();
  expect(newShortcuts.length).toBe(1);
  expect(newShortcuts[0]).toBe(window.instance.UI.Shortcuts.RECTANGLE);
};

const toolComponents = {};
Object.values(window.Core.Tools.ToolNames).forEach((toolName) => {
  toolComponents[`${toolName}Button`] = { dataElement: `${toolName}Button`, type: 'toolButton', toolName };
});
export const ToolButtonsHeader = createTemplate({
  headers: {
    ToolButtonsHeader: {
      dataElement: 'ToolButtonsHeader',
      placement: 'top',
      grow: 0,
      gap: 0,
      position: 'start',
      'float': false,
      stroke: true,
      dimension: {
        paddingTop: 8,
        paddingBottom: 8,
        borderWidth: 1
      },
      style: {},
      items: Object.keys(toolComponents).reverse(), // Reverse to put whitelisted buttons outside flyout
    }
  },
  components: toolComponents,
});
ToolButtonsHeader.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  window.instance.UI.enableViewOnlyMode();
  const toolButtons = await canvas.findAllByRole('button');
  expect(toolButtons.length).toBe(3);
};
ToolButtonsHeader.parameters = window.storybook.disableRtlMode;

const presetComponents = {};
Object.values(PRESET_BUTTON_TYPES).forEach((presetType) => {
  presetComponents[presetType] = { dataElement: presetType, type: 'presetButton', buttonType: presetType };
});
export const PresetButtonsHeader = createTemplate({
  headers: {
    PresetButtonsHeader: {
      dataElement: 'PresetButtonsHeader',
      placement: 'top',
      grow: 0,
      gap: 0,
      position: 'start',
      'float': false,
      stroke: true,
      dimension: {
        paddingTop: 8,
        paddingBottom: 8,
        borderWidth: 1
      },
      style: {},
      items: Object.keys(presetComponents)
    }
  },
  components: presetComponents,
});
PresetButtonsHeader.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  window.instance.UI.enableViewOnlyMode();
  const presetButtons = await canvas.findAllByRole('button');
  expect(presetButtons.length).toBe(6); // Compare and Filepicker are disabled by default
};
PresetButtonsHeader.parameters = window.storybook.disableRtlMode;
