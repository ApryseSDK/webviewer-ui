import core from 'core';

/**
 * Signs a specified signature widget with a specified signature.
 * If no signature is provided, select an available signature or start the process to create a new one, and then use it to sign the signature widget.
 * @method UI.signSignatureWidget
 * @param {Core.Annotations.SignatureWidgetAnnotation} signatureWidget The signature widget to sign.
 * @param {Core.Annotations.FreeHandAnnotation|Core.Annotations.StampAnnotation} [signature] The signature annotation to sign with.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.signSignatureWidget(signatureWidget, signature);
  });
 */
export default async (signatureWidget, signature) => {
  if (signatureWidget['fieldFlags'].get('ReadOnly')) {
    throw new Error('Cannot sign READ ONLY signature widget');
  }

  const annotationManager = core.getAnnotationManager();
  const signatureTool = core.getTool('AnnotationCreateSignature');

  const handleSignatureReady = (currentSignature) => {
    signatureWidget.sign(currentSignature);
    signatureTool.removeEventListener('signatureReady.sign', null, {
      allowGlobalRemove: true,
    });
  };

  signatureTool
    .removeEventListener('signatureReady.sign', null, {
      allowGlobalRemove: true,
    })
    .addEventListener('signatureReady.sign', handleSignatureReady);

  if (signatureWidget && !signatureWidget.getAssociatedSignatureAnnotation()) {
    signatureTool.location = {
      x: signatureWidget.getX(),
      y: signatureWidget.getY(),
      pageNumber: signatureWidget.PageNumber,
    };
  } else {
    return;
  }

  if (signature) {
    await signatureTool.setSignature(
      annotationManager.getAnnotationCopy(signature)
    );
    await signatureTool.addSignature();
  } else {
    signatureTool.trigger(
      'locationSelected',
      {
        pageNumber: signatureWidget.PageNumber,
        x: signatureWidget.X,
        y: signatureWidget.Y,
      },
      signatureWidget
    );
  }
};