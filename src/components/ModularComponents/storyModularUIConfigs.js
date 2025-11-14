import DataElements from 'constants/dataElement';

export const uiWithFlyout = {
  'modularComponents': {
    'flyoutToggle': {
      'dataElement': 'flyoutToggle',
      'title': 'Flyout Toggle',
      'type': 'toggleButton',
      'label': 'Flyout Toggle',
      'toggleElement': 'myCustomFlyout'
    },
  },
  'modularHeaders': {
    'default-top-header': {
      'dataElement': 'default-top-header',
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
      'dataElement': 'myCustomFlyout',
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
    'dataElement': 'rubberStampFlyout',
    'toggleElement': 'rubberStampToolButton',
    'items': [
      {
        'dataElement': 'rubber-stamp-flyout',
        'render': 'rubberStampPanel',
      },
    ]
  },
  'signatureListFlyout': {
    'dataElement': 'signatureListFlyout',
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
      'dataElement': 'stylePanelFlyoutToggle',
      'title': 'action.style',
      'type': 'toggleButton',
      'img': 'icon-style-panel-toggle',
      'toggleElement': 'stylePanelFlyout'
    },
    'anotherstylePanelFlyout': {
      'type': 'customButton',
      'dataElement': 'anotherstylePanelFlyout',
      'label': 'Other Item',
      'onClick': 'otherItemClick',
      'children': [{
        'dataElement': 'submenuItem',
        'render': 'stylePanel'
      }]
    },
    'rubberStampToolButton': {
      'dataElement': 'rubberStampToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreateRubberStamp'
    },
    'signatureCreateToolButton': {
      'dataElement': 'signatureCreateToolButton',
      'type': 'toolButton',
      'toolName': 'AnnotationCreateSignature'
    },
  },
  'modularHeaders': {
    'default-top-header': {
      'dataElement': 'default-top-header',
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
        'stylePanelFlyoutToggle',
        'rubberStampToolButton',
        'signatureCreateToolButton',
      ]
    },
  },
  'flyouts': {
    'stylePanelFlyout': {
      'dataElement': 'stylePanelFlyout',
      'items': [
        {
          'dataElement': 'mystylePanel',
          'render': 'stylePanel'
        },
        'anotherstylePanelFlyout',
      ]
    },
    ...panelsInFlyouts,
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
  }
};

export const panelsInFlyoutMap = {
  'myCustomFlyout': {
    'dataElement': 'myCustomFlyout',
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