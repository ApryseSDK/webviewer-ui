import action from 'actions';

export default store => annotationContentOverlayHandler => {
  store.dispatch(action.setAnnotationContentOverlayHandler(annotationContentOverlayHandler));
};