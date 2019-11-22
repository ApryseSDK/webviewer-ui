const NOOP = () => {};

const MentionsManager = {
  initialize() {
    this.userData = [];
    this.mentionsData = [];
    this.observer = NOOP;
  },
  setUserData(userData) {
    this.userData = userData;
  },
  getUserData() {
    return this.userData;
  },
  setMentionsData(mentionsData) {
    this.mentionsData = mentionsData;
  },
  getMentionsData() {
    return this.mentionsData;
  },
  subscribe(observer) {
    if (this.observer !== NOOP) {
      console.error('hehe');
      return;
    }

    this.observer = observer;
  },
};

const mentions = Object.create(MentionsManager);
mentions.initialize();

mentions.setUserData([
  {
    id: 'zhijie',
    name: 'Zhijie Zhang',
    display: 'Zhijie Zhang',
    email: 'zhijiezhang0124@gmail.com',
  },
  {
    id: 'qiuyi',
    name: 'Qiuyi Ji',
    display: 'Qiuyi Ji',
    email: 'qiuyiji1006gmail.com',
  },
  {
    id: 'wei',
    name: 'Wei Zhang',
    display: 'Wei Zhang',
    email: 'weizhang1206@gmail.com',
  },
  {
    id: 'qiong',
    name: 'Qiong Shen',
    display: 'Qiong Shen',
    email: 'qiongshen0411@gmail.com',
  },
]);

export default mentions;
