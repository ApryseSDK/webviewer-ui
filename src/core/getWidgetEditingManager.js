import getAnnotationManager from './getAnnotationManager';

export default () => {
  const annotManager = getAnnotationManager();

  return annotManager.getWidgetEditingManager();
}