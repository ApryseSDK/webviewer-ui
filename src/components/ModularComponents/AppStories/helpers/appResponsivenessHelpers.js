import React from 'react';
import { MockApp } from 'src/helpers/storybookHelper';
import initialState from 'src/redux/initialState';
import { mockHeadersNormalized, mockModularComponents } from '../mockAppState';

/**
 * MockAppTemplate is a functional component that sets up a mock application state
 * with customizable headers, components, and other viewer settings.
 * @param {Object} args - The arguments for configuring the mock application.
 * @param {Array} args.headers - The headers to be used in the mock application.
 * @param {Array} args.components - The components to be used in the mock application.
 * @param {string} args.activeCustomRibbon - The active custom ribbon in the mock application.
 * @param {string} [args.activeToolName='AnnotationCreateTextUnderline'] - The active tool name in the mock application.
 * @param {number} args.width - The width of the mock application.
 * @param {number} args.height - The height of the mock application.
 * @param {boolean} args.isOffset - Whether the mock application should be offset.
 * @param {Object} context - The context for the mock application.
 * @param {Object} context.globals - The global settings for the mock application.
 * @param {string} context.globals.theme - The active theme for the mock application.
 *
 * @returns - The MockApp component with the specified initial state and dimensions.
 * @ignore
 */
const MockAppTemplate = (args, context) => {
  const stateWithHeaders = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      disabledElements: {
        ...initialState.viewer.disabledElements,
        'toolbarGroup-Redact': {
          disabled: false,
          priority: 3
        },
        'toolbarGroup-Measure': {
          disabled: false,
          priority: 3
        },
      },
      modularHeaders: args.headers,
      modularComponents: args.components,
      openElements: {},
      genericPanels: [{
        dataElement: 'stylePanel',
        render: 'stylePanel',
        location: 'left',
      }],
      activeGroupedItems: [
        'annotateGroupedItems',
        'defaultAnnotationUtilities',
      ],
      flyoutMap: {
        annotateGroupedItemsFlyout: {
          items: []
        }
      },
      activeCustomRibbon: args.activeCustomRibbon,
      activeToolName: args.activeToolName || 'AnnotationCreateTextUnderline',
      activeTheme: context.globals.theme,
    },
    featureFlags: {
      customizableUI: true,
    },
  };
  return (
    <MockApp initialState={stateWithHeaders} width={args.width} height={args.height} isOffset={args.isOffset} />
  );
};

/**
 * Creates a mock application template with specified properties.
 * @param {Object} [options={}] - The options for creating the mock app template.
 * @param {string} [options.width='100%'] - The width of the mock app template.
 * @param {string} [options.height='100%'] - The height of the mock app template.
 * @param {Array} [options.headers=mockHeadersNormalized] - The headers for the mock app template.
 * @param {Array} [options.components=mockModularComponents] - The components for the mock app template.
 * @param {string} [options.activeCustomRibbon='toolbarGroup-Annotate'] - The active custom ribbon for the mock app template.
 * @param {string} [options.activeToolName] - The active tool name for the mock app template.
 * @param {boolean} [options.isOffset=false] - Whether the mock app template is offset.
 * @returns {Object} The mock app template.
 * @ignore
 */
export function createMockAppTemplate(
  {
    width = '100%',
    height = '100%',
    headers = mockHeadersNormalized,
    components = mockModularComponents,
    activeCustomRibbon = 'toolbarGroup-Annotate',
    activeToolName,
    isOffset = false,
  } = {},
) {
  const template = MockAppTemplate.bind({});
  template.args = { headers, components, width, height, activeCustomRibbon, activeToolName, isOffset };
  template.parameters = { layout: 'fullscreen' };
  return template;
}