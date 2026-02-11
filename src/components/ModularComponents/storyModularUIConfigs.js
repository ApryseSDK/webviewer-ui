import DataElements from 'constants/dataElement';
import { ITEM_TYPE, PRESET_BUTTON_TYPES } from 'constants/customizationVariables';

export const uiWithFlyout = {
  'modularComponents': {
    'flyoutToggle': {
      'title': 'Flyout Toggle',
      'type': 'toggleButton',
      'label': 'Flyout Toggle',
      'toggleElement': 'myCustomFlyout'
    },
  },
  'modularHeaders': {
    'default-top-header': {
      'placement': 'top',
      'grow': 0,
      'gap': 12,
      'position': 'start',
      'float': false,
      'stroke': true,
      'dimension': {
        'paddingTop': 8,
        'paddingBottom': 8,
        'borderWidth': 1
      },
      'style': {},
      'items': [
        'flyoutToggle',
      ]
    },
  },
  'flyouts': {
    'myCustomFlyout': {
      'items': [
        {
          'dataElement': 'customFlyoutItem',
          'label': 'Custom Flyout Item',
          'onClick': () => {},
          'icon': 'icon-save',
          'type': 'customButton',
          'children': [
            {
              'dataElement': 'submenuItem',
              'label': 'Submenu Item',
              'onClick': () => {},
              'icon': 'icon-save',
              'type': 'customButton',
              'children': [
                {
                  'dataElement': 'submenuItem2',
                  'label': 'Submenu Item 2',
                  'onClick': () => {},
                  'icon': 'icon-save',
                  'type': 'customButton'
                }
              ]
            },
            {
              'dataElement': 'disabledFlyoutItem',
              'label': 'Disabled Flyout Item',
              'onClick': () => {},
              'icon': 'icon-save',
              'type': 'customButton',
              'disabled': true,
              'children': [
                {
                  'dataElement': 'disabledsubmenuItem',
                  'label': 'Disabled Submenu Item',
                  'onClick': () => {},
                  'icon': 'icon-save',
                  'type': 'customButton',
                  'disabled': true,
                }
              ]
            }
          ]
        },
      ]
    }
  }
};

const panelsInFlyouts = {
  'rubberStampFlyout': {
    'toggleElement': 'rubberStampToolButton',
    'items': [
      {
        'dataElement': 'rubber-stamp-flyout',
        'render': 'rubberStampPanel',
      },
    ]
  },
  'signatureListFlyout': {
    'toggleElement': 'signatureCreateToolButton',
    'items': [
      {
        'dataElement': 'signature-list-flyout',
        'render': 'signatureListPanel',
      },
    ]
  },
};

export const uiWithPanelsInFlyout = {
  'modularComponents': {
    'stylePanelFlyoutToggle': {
      'title': 'action.style',
      'type': 'toggleButton',
      'img': 'icon-style-panel-toggle',
      'toggleElement': 'stylePanelFlyout',
    },
    'anotherstylePanelFlyout': {
      'type': 'customButton',
      'label': 'Other Item',
      'onClick': 'otherItemClick',
      'children': [
        {
          'dataElement': 'submenuItem',
          'render': 'stylePanel',
        },
      ],
    },
    'rubberStampToolButton': {
      'type': 'toolButton',
      'toolName': 'AnnotationCreateRubberStamp',
    },
    'signatureCreateToolButton': {
      'type': 'toolButton',
      'toolName': 'AnnotationCreateSignature',
    },
    continuousPageTransitionButton: {
      type: ITEM_TYPE.PRESET_BUTTON,
      buttonType: PRESET_BUTTON_TYPES.CONTINUOUS_PAGE_TRANSITION,
    },
    defaultPageTransitionButton: {
      type: ITEM_TYPE.PRESET_BUTTON,
      buttonType: PRESET_BUTTON_TYPES.DEFAULT_PAGE_TRANSITION,
    },
    readerPageTransitionButton: {
      type: ITEM_TYPE.PRESET_BUTTON,
      buttonType: PRESET_BUTTON_TYPES.READER_PAGE_TRANSITION,
    },
    rotateClockwiseButton: {
      type: ITEM_TYPE.PRESET_BUTTON,
      buttonType: PRESET_BUTTON_TYPES.ROTATE_CLOCKWISE,
    },
    rotateCounterClockwiseButton: {
      type: ITEM_TYPE.PRESET_BUTTON,
      buttonType: PRESET_BUTTON_TYPES.ROTATE_COUNTERCLOCKWISE,
    },
    singleLayoutButton: {
      type: ITEM_TYPE.PRESET_BUTTON,
      buttonType: PRESET_BUTTON_TYPES.SINGLE_LAYOUT,
    },
    doubleLayoutButton: {
      type: ITEM_TYPE.PRESET_BUTTON,
      buttonType: PRESET_BUTTON_TYPES.DOUBLE_LAYOUT,
    },
    coverLayoutButton: {
      type: ITEM_TYPE.PRESET_BUTTON,
      buttonType: PRESET_BUTTON_TYPES.COVER_LAYOUT,
    },
    toggleCompareModeButton: {
      type: ITEM_TYPE.PRESET_BUTTON,
      buttonType: PRESET_BUTTON_TYPES.TOGGLE_MULTI_VIEWER_MODE,
    },
    [DataElements.FULLSCREEN_BUTTON]: {
      type: ITEM_TYPE.PRESET_BUTTON,
      buttonType: PRESET_BUTTON_TYPES.FULLSCREEN,
    },
    [PRESET_BUTTON_TYPES.TOGGLE_ACCESSIBILITY_MODE]: {
      type: ITEM_TYPE.PRESET_BUTTON,
      buttonType: PRESET_BUTTON_TYPES.TOGGLE_ACCESSIBILITY_MODE,
    },
  },
  'modularHeaders': {
    'default-top-header': {
      'placement': 'top',
      'grow': 0,
      'gap': 12,
      'position': 'start',
      'float': false,
      'stroke': true,
      'dimension': {
        'paddingTop': 8,
        'paddingBottom': 8,
        'borderWidth': 1,
      },
      'style': {},
      'items': ['stylePanelFlyoutToggle', 'rubberStampToolButton', 'signatureCreateToolButton'],
    },
  },
  'flyouts': {
    'stylePanelFlyout': {
      'items': [
        {
          'dataElement': 'mystylePanel',
          'render': 'stylePanel',
        },
        'anotherstylePanelFlyout',
      ],
    },
    ...panelsInFlyouts,
    viewControlsFlyout: {
      className: 'ViewControlsFlyout',
      items: [
        'continuousPageTransitionButton',
        'defaultPageTransitionButton',
        'readerPageTransitionButton',
        'divider',
        'rotateClockwiseButton',
        'rotateCounterClockwiseButton',
        'divider',
        'singleLayoutButton',
        'doubleLayoutButton',
        'coverLayoutButton',
        'toggleCompareModeButton',
        'divider',
        'fullscreenButton',
        'divider',
        'toggleAccessibilityModeButton',
      ],
    },
  },
  'panels': {},
  'popups': {
    [DataElements.ANNOTATION_POPUP]: [
      { dataElement: DataElements.VIEW_FILE_BUTTON },
      { dataElement: DataElements.COMMENT_BUTTON },
      { dataElement: DataElements.STYLE_EDIT_BUTTON },
    ],
    [DataElements.TEXT_POPUP]: [
      { dataElement: DataElements.COPY_TEXT_BUTTON },
      { dataElement: DataElements.TEXT_HIGHLIGHT_TOOL_BUTTON },
      { dataElement: DataElements.TEXT_UNDERLINE_TOOL_BUTTON },
    ],
    [DataElements.CONTEXT_MENU_POPUP]: [
      { dataElement: DataElements.PAN_TOOL_BUTTON },
      { dataElement: DataElements.STICKY_TOOL_BUTTON },
    ],
  },
};

export const panelsInFlyoutMap = {
  'myCustomFlyout': {
    'items': [
      {
        'dataElement': 'stylePanelInFlyout',
        'render': 'stylePanel'
      },
      {
        'type': 'customButton',
        'dataElement': 'anotherStylePanelFlyout',
        'label': 'Other Item',
        'onClick': 'otherItemClick',
        'children': [{
          'dataElement': 'submenuStylePanel',
          'render': 'stylePanel'
        }]
      },
    ]
  },
  ...panelsInFlyouts,
};