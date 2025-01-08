import DataElements from 'constants/dataElement';

const defaultSheetsEditorHeaders = {
  'default-top-header': {
    dataElement: 'default-top-header',
    placement: 'top',
    grow: 0,
    gap: 12,
    position: 'start',
    'float': false,
    stroke: true,
    dimension: {
      paddingTop: 8,
      paddingBottom: 8,
      borderWidth: 1
    },
    style: {},
    items: [
      'menuButton',
    ]
  },
};

const defaultSheetsEditorComponents = {
  'menuButton': {
    dataElement: DataElements.MENU_OVERLAY_BUTTON,
    img: 'ic-hamburger-menu',
    title: 'component.menuOverlay',
    toggleElement: 'MainMenuFlyout',
    type: 'toggleButton',
  },
};
const defaultSheetsEditorPanels = [
];

const defaultSheetFlyoutMap = {
  [DataElements.MAIN_MENU]: {
    dataElement: DataElements.MAIN_MENU,
    'items': [
      'component.mainMenu',
      {
        'dataElement': 'newSheetDocumentButton',
        'type': 'presetButton',
      },
      {
        'dataElement': 'filePickerButton',
        'type': 'presetButton',
      },
      {
        'dataElement': 'fullscreenButton',
        'type': 'presetButton',
      },
      {
        'dataElement': 'saveAsButton',
        'type': 'presetButton',
      },
      'divider',
      {
        'dataElement': 'settingsButton',
        'type': 'presetButton',
      },
    ]
  },
};

export { defaultSheetsEditorHeaders, defaultSheetsEditorComponents, defaultSheetsEditorPanels, defaultSheetFlyoutMap };