import actions from 'actions';
import i18next from 'i18next';

export default (dispatch) => () => {
  const boundTranslator = i18next.t.bind(i18next);
  dispatch(actions.setStandardStamps(boundTranslator));
  dispatch(actions.setCustomStamps(boundTranslator));
};
