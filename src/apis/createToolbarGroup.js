/**
 * Creates a new Toolbar group (Ribbon)
 *
 * @method UI.createToolbarGroup
 * @param {object} toolbarGroup
 * @param {string} toolbarGroup.name The label for the new Toolbar Group or the key value to get the label from translation files.
 * <p>Refer to the lib/ui/i18n folder to find the existing keys in the translation files</p>
 * @param {string} toolbarGroup.dataElementSuffix <p>The suffix value you want to use to select your Toolbar group by data element.
 * All toolbar groups have the data element in this format <strong>toolbarGroup-&#60;dataElementSuffix&#62</strong>.</p> <p>For example, if you set the dataElementSuffix as 'Draw',
 * the dataElement of your ribbon will be <strong>toolbarGroup-Draw</strong></p>
 * @param {Array} toolbarGroup.children A list of elements to be added on the toolbar group header.
 * Check [this guide]{@link https://www.pdftron.com/documentation/web/guides/customizing-header/#header-items} to see the available options to be used as a toolbar group child.
 * @param {boolean} [toolbarGroup.useDefaultElements] <p>If true, the common elements used in most toolbar groups will be added to the children list.</p>
 * <p>These elements are a spacer in the beginning and at the end of the header, the undo and redo buttons, and the eraser button.</p>
 * <p>In the example below you can see these elements being added. By default, the value will be false and these elements will not be added.</p>
 * @example
  WebViewer(...)
   .then(function(instance) {
    const { annotationManager, documentViewer } = instance.Core;
    const annotHistoryManager = documentViewer.getAnnotationHistoryManager();

    // In case you want to use the Toolbar Group label with translation, you can
    // set the values with the setTranslations API and use the translation key
    // as the name parameter

    instance.UI.setTranslations('en',
     {
        'option.toolbarGroup.draw': 'Draw'
      }
    );

    instance.UI.createToolbarGroup(
    {
      name: 'option.toolbarGroup.draw',
      dataElementSuffix: 'Draw',
      useDefaultElements: false,
      children: [
        { type: 'spacer' },
        {
          type: 'toolGroupButton',
          toolGroup: 'freeHandTools',
          dataElement: 'freeHandToolGroupButton',
          title: 'annotation.freehand'
        },
        {
          type: 'toolGroupButton',
          toolGroup: 'ellipseAreaTools',
          dataElement: 'ellipseAreaToolGroupButton',
          title: 'annotation.areaMeasurement'
        },
        {
          type: 'toolGroupButton',
          toolGroup: 'rectangleTools',
          dataElement: 'shapeToolGroupButton',
          title: 'annotation.rectangle'
        },
        { type: 'divider'},
        // Undo Button
        {
          type: 'actionButton',
          style: { 'marginLeft': '0px' },
          dataElement: 'undoButton',
          title: 'action.undo',
          img: 'icon-operation-undo',
          onClick: () => {
            annotHistoryManager.undo();
          },
          isNotClickableSelector: () => !annotHistoryManager.canUndo()
        },
        // Redo Button
        {
          type: 'actionButton',
          dataElement: 'redoButton',
          title: 'action.redo',
          img: 'icon-operation-redo',
          onClick: () => {
            annotHistoryManager.redo();
          },
          isNotClickableSelector: () => !annotHistoryManager.canRedo()
        },
        { type: 'toolButton', toolName: 'AnnotationEraserTool' },
        { type: 'spacer', hidden: ['tablet', 'mobile', 'small-mobile'] }
      ]
    })
  }
})
*/

import { undoButton, redoButton } from 'helpers/commonToolbarElements';
import actions from 'actions';

export default store => toolbarGroup => {
  if (toolbarGroup.useDefaultElements) {
    toolbarGroup.children = [
      { type: 'spacer' },
      ...toolbarGroup.children,
      { type: 'divider' },
      undoButton,
      redoButton,
      { type: 'toolButton', toolName: 'AnnotationEraserTool' },
      { type: 'spacer', hidden: ['tablet', 'mobile', 'small-mobile'] }
    ];
  }

  const headerGroup = `toolbarGroup-${toolbarGroup.dataElementSuffix}`;
  store.dispatch(actions.setHeaderItems(headerGroup, toolbarGroup.children));
  store.dispatch(actions.setCustomHeadersAdditionalProperties(headerGroup, { name: toolbarGroup.name }));
};
