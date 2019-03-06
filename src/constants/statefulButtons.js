import core from 'core';
import actions from 'actions';

export default {
  signatureToolButton: {
    initialState: 'newSignature',
    mount: update => {
      const signatureTool = core.getTool('AnnotationCreateSignature');
      signatureTool.on('saveDefault.sigTool', () => {
        update('defaultSignature');
      });
      signatureTool.on('noDefaultSignatures', () => {
        update('newSignature');
      });
    },
    didUpdate: (prevProps, currProps, prevState, currState, update) => {
      if(prevProps.openElements !== currProps.openElements) {
        update();
      }
    },
    unmount: () => {
      const signatureTool = core.getTool('AnnotationCreateSignature');
      signatureTool.off('saveDefault.sigTool');
      signatureTool.off('noDefaultSignatures');
    },
    states: {
      newSignature: {
        img: 'ic_annotation_signature_black_24px',
        onClick: (update, state, dispatch) => {
          dispatch(actions.openElement('signatureModal'));
        },
        title: 'annotation.signature',
        // we also consider if signatureOverlay is open in this state because there can be a case where all the default signatures are deleted
        // when signatureOverlay is open and this button's state will become "newSignature" 
        isActive: ({ openElements }) => openElements.signatureModal || openElements.signatureOverlay
      },
      defaultSignature: {
        img: 'ic_annotation_signature_black_24px',
        onClick: (update, state, dispatch) => {
          dispatch(actions.toggleElement('signatureOverlay'));
        },
        title: 'annotation.signature' ,
        isActive: ({ openElements }) => openElements.signatureOverlay,
        className: 'down-arrow'
      }
    }
  }
};