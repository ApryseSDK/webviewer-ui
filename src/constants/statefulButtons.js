import core from 'core';
import actions from 'actions';

export default {
  fitButton: {
    initialState: 'FitWidth',
    mount: update => {
      const fitModeToState = fitMode => {
        const docViewer = core.getDocumentViewer();
        // the returned state should be the opposite of the new current state
        // as the opposite state is what we want to switch to when the button
        // is pressed next
        if (fitMode === docViewer.FitMode.FitPage) {
          return 'FitWidth';
        } else if (fitMode === docViewer.FitMode.FitWidth) {
          return 'FitPage';
        }
      };

      core.addEventListener('fitModeUpdated.fitbutton', (e, fitMode) => {
        update(fitModeToState(fitMode));
      });
    },
    unmount: () => {
      core.removeEventListener('fitModeUpdated.fitbutton');
    },
    states: {
      FitWidth: {
        img: 'ic_fit_width_black_24px',
        onClick: core.fitToWidth,
        title: 'action.fitToWidth'
      },
      FitPage: {
        img: 'ic_fit_page_black_24px',
        onClick: core.fitToPage,
        title: 'action.fitToPage'
      }
    },
  },
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