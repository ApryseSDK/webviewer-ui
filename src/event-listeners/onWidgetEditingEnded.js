import actions from 'actions';
import { PRIORITY_ONE } from 'constants/actionPriority';

export default dispatch => () => {
  dispatch(actions.setCustomElementOverrides('downloadButton', { disabled: false }));
  dispatch(actions.setCustomElementOverrides('printButton', { disabled: false }));

  dispatch(actions.setToolbarGroup('toolbarGroup-Edit'));
};
