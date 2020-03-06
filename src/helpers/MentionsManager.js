import actions from 'actions';
import selectors from 'selectors';

const NOOP = () => {};

class MentionsManager {

}

export default MentionsManager;

// const MentionsManager = {
//   initialize(store) {
//     this.userData = [];
//     this.mentionsData = [];
//     this.observer = NOOP;
//     this.store = store;

//     return this;
//   },
//   setUserData(userData) {
//     this.store.dispatch(actions.setUserData(userData));
//   },
//   getUserData() {
//     return selectors.getUserData(this.store.getState());
//   },
//   setMentionsData(mentionsData) {
//     this.mentionsData = mentionsData;
//   },
//   getMentionsData() {
//     return this.mentionsData;
//   },
//   subscribe(observer) {
//     if (this.observer !== NOOP) {
//       console.error('hehe');
//       return;
//     }

//     this.observer = observer;
//   },
// };

// export default Object.create(MentionsManager);
