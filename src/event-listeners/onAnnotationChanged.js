import core from 'core';
import getAnnotationStyles from 'helpers/getAnnotationStyles';
import { mapAnnotationToKey } from 'constants/map';


export default () => (e, annotations, action) => {
  if (action === 'delete') {
    deleteReplies(annotations);
  }

  if (
    action === 'modify' &&
    annotations.length === 1 &&
    isSignatureAnnotation(annotations[0])
  ) {
    const styles = getAnnotationStyles(annotations[0]);
    applyStylesToAllSignatureAnnotations(styles);
  }
};

const deleteReplies = annotations => {
  annotations.forEach(annotation => {
    core.deleteAnnotations(annotation.getReplies());
  });
};

const applyStylesToAllSignatureAnnotations = styles => {
  const signatureAnnotations = core.getAnnotationsList().filter(isSignatureAnnotation);
  
  // we are not using core.setAnnotationStyles to set signature annotation's styles 
  // because that method will trigger annotationChanged event which will call this function again and we will stuck
  signatureAnnotations.forEach(annotation => {
    Object.keys(styles).forEach(key => {
      annotation[key] = styles[key];
    });    
  });

  core.drawAnnotationsFromList(signatureAnnotations);
};

const isSignatureAnnotation = annotation => mapAnnotationToKey(annotation) === 'signature';
