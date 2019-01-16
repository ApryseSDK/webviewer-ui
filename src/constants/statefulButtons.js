import core from 'core';

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
};