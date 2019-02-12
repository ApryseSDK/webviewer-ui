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
      core.getTool('AnnotationCreateSignature').on('saveDefault.sigTool', () => {
        update('defaultSignature');
      });
      core.getTool('AnnotationCreateSignature').on('noDefaultSignatures', () => {
        update('newSignature');
      });
      core.getTool('AnnotationCreateSignature').on('prepareSignature', () => {
        document.querySelector('[data-element=signatureToolButton]').click();
      });
    },
    unmount: () => {
      core.getTool('AnnotationCreateSignature').off('saveDefault.sigTool');
      core.getTool('AnnotationCreateSignature').off('noDefaultSignatures');
    },
    states: {
      newSignature: {
        img: 'ic_annotation_signature_black_24px',
        onClick: (update, state, dispatch) => {
          core.setToolMode('AnnotationCreateSignature');
          dispatch(actions.openElement('signatureModal'));
        },
        title: 'annotation.signature'
      },
      defaultSignature: {
        img: 'ic_annotation_signature_black_24px',
        onClick: (update, state, dispatch) => {
          core.setToolMode('AnnotationCreateSignature');
          dispatch(actions.toggleElement('signatureOverlay'));
        },
        title: 'annotation.signature' 
      }
    }
  }
};