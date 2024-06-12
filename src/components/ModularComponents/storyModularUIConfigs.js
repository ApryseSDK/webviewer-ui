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
            }
          ]
        }
      ]
    }
  }
};