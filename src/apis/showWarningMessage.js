import actions from 'actions';

export default store => options => {
    store.dispatch(actions.showWarningMessage(options));
};
