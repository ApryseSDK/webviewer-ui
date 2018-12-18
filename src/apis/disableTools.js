import core from 'core';
import actions from 'actions';

export default store => toolNames => {
  if (toolNames) {
    toolNames.forEach(toolName => {
      core.getTool(toolName).disabled = true;
    });
    store.dispatch(actions.disableTools(toolNames));
  } else {
    const allToolNames = [
      'AnnotationCreateSticky',
      'AnnotationCreateFreeHand',
      'AnnotationCreateFreeHand2', // preset
      'AnnotationCreateFreeHand3', // preset
      'AnnotationCreateFreeHand4', // preset
      'AnnotationCreateTextHighlight',
      'AnnotationCreateTextHighlight2', // preset
      'AnnotationCreateTextHighlight3', // preset
      'AnnotationCreateTextHighlight4', // preset
      'AnnotationCreateTextUnderline',
      'AnnotationCreateTextSquiggly',
      'AnnotationCreateTextStrikeout',
      'AnnotationCreateFreeText',
      'AnnotationCreateCallout',
      'AnnotationCreateSignature',
      'AnnotationCreateLine',
      'AnnotationCreateArrow',
      'AnnotationCreatePolyline',
      'AnnotationCreateStamp',
      'AnnotationCreateRectangle',
      'AnnotationCreateEllipse',
      'AnnotationCreatePolygon',
      'AnnotationCreatePolygonCloud',
    ];
    allToolNames.forEach(toolName => {
      core.getTool(toolName).disabled = true;
    });
    store.dispatch(actions.disableTools(allToolNames));
    
    const allGroupButtons = [
      'freeHandToolGroupButton',
      'textToolGroupButton',
      'shapeToolGroupButton',
      'miscToolGroupButton',
      'toolsButton'
    ];
    store.dispatch(actions.disableElements(allGroupButtons));
  }
};
