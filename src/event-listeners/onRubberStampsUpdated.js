import actions from 'actions';
import getCurrentT from 'helpers/getCurrentT';

export default (dispatch) => () => {
  const boundTranslator = getCurrentT();
  dispatch(actions.setStandardStamps(boundTranslator));
  dispatch(actions.setCustomStamps(boundTranslator));
};
