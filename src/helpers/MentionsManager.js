import actions from 'actions';
import selectors from 'selectors';

/**
 * @typedef {Object} mentionData
 * @property {string} email The email of the mentioned person. This is passed from setUserData.
 * @property {string} value The value(display name) of the mentioned person. This is passed from setUserData.
 * @property {string} type The type of the mentioned persion. This is passed from setUserData.
 * @property {string} id The id of the annotation.
 * @ignore
 */

/**
 * The key is an email or 'content'
 * @typedef {Object.<string, mentionData|string>} mentionMap
 */

class MentionsManager {
  constructor(store, annotManager) {
    this.store = store;
    /**
     * the key represents the event name
     * the value is an array of callbacks that will be called when the given key event is triggered
     * @type {Object.<string, Function[]>}
     * @ignore
     */
    this.events = {};
    /**
     * the key represents an annotation's id
     * the value is a mentionMap
     * @type {Object.<string, mentionMap>}
     * @example
     * {
        'aidsfuha-32123123': {
          'cahang@pdftron.com': {
            email: 'cahang@pdftron.com',
            value: 'Edmiz',
            type: 'user',
            id: 'aidsfuha-32123123',
          },
        }
     * }
     * @ignore
     */
    this.mentions = {
      // 'aidsfuha-32123123': {
      // }
    };

    annotManager.on('annotationChanged', (annotations, action, { imported }) => {
      if (imported || !annotations.length || !this.getUserData().length) {
        return;
      }

      if (action === 'add') {
        this.handleAnnotationsAdded(annotations);
      } else if (action === 'modify') {
        this.handleAnnotationsModified(annotations);
      } else if (action === 'delete') {
        this.handleAnnotationsDeleted(annotations);
      }
    });
  }

  handleAnnotationsAdded(annotations) {
    const newMentions = [];

    annotations.forEach(annotation => {
      const mentionMap = this.extractMentionMap(annotation);

      this.mentions[annotation.Id] = mentionMap;
      newMentions.push(...Object.values(mentionMap));
    });

    if (newMentions.length) {
      this.trigger('mentionChanged', [newMentions, 'add']);
    }
  }

  handleAnnotationsModified(annotations) {
    const newMentions = [];
    const deletedMentions = [];

    annotations.forEach(annotation => {
      const prevMentionMap = this.mentions[annotation.Id] || {};
      const currMentionMap = this.extractMentionMap(annotation);

      this.mentions[annotation.Id] = currMentionMap;

      Object.keys(currMentionMap).forEach(key => {
        if (!prevMentionMap[key]) {
          newMentions.push(currMentionMap[key]);
        }
      });

      Object.keys(prevMentionMap).forEach(key => {
        if (!currMentionMap[key]) {
          deletedMentions.push(prevMentionMap[key]);
        }
      });

      // if (
      //   deletedMentions.length === 0 &&
      //   newMentions.length === 0 &&
      //   prevMentionMap.content.length !== currMentionMap.content.length
      // ) {
      //   this.trigger('mentionChanged', [Object.values(currMentionMap), 'modify']);
      // }
    });

    if (newMentions.length) {
      this.trigger('mentionChanged', [newMentions, 'add']);
    }
    if (deletedMentions.length) {
      this.trigger('mentionChanged', [deletedMentions, 'delete']);
    }
  }

  handleAnnotationsDeleted(annotations) {
    const deletedMentions = [];

    annotations.forEach(annotation => {
      if (this.mentions[annotation.Id]) {
        deletedMentions.push(...Object.values(this.mentions[annotation.Id]));
        delete this.mentions[annotation.Id];
      }
    });

    if (deletedMentions.length) {
      this.trigger('mentionChanged', [deletedMentions, 'delete']);
    }
  }

  /**
   * @param {string} content
   * @returns {mentionMap}
   * @ignore
   */
  extractMentionMap(annotation) {
    const content = annotation.getContents();
    const userData = this.getUserData();
    const result = {};

    userData.forEach(({ email, value, type }) => {
      if (content?.includes(`@${value}`)) {
        result[email] = {
          email,
          value,
          type,
          id: annotation.Id,
        };
      }
    });

    result.content = annotation.getContents();

    return result;
  }

  setUserData(userData) {
    this.store.dispatch(actions.setUserData(userData));
  }

  getUserData() {
    return selectors.getUserData(this.store.getState());
  }

  on(eventName, fn) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    this.events[eventName].push(fn);

    return this;
  }

  off(eventName, fn) {
    if (!this.events) {
      return this;
    }

    if (typeof eventName === 'undefined') {
      this.events = {};
    }

    if (!this.events[eventName]) {
      return this;
    }

    if (fn) {
      this.events[eventName] = this.events[eventName].filter(handler => handler !== fn);
    } else {
      this.events[eventName] = [];
    }

    return this;
  }

  trigger(eventName, ...data) {
    if (!this.events) {
      return this;
    }

    if (!this.events[eventName]) {
      return this;
    }

    // normalize data if only an array is passed in as data
    // for example: trigger('mentionChanged', [mentions])
    // data will be passed to the handler: (mentions) => {}
    if (data.length === 1 && Array.isArray(data[0])) {
      data = data[0];
    }

    this.events[eventName].forEach(fn => {
      fn.call(this, ...data);
    });

    return this;
  }

  addEventListener(...args) {
    this.on(...args);
  }

  setEventListener(...args) {
    this.on(...args);
  }

  removeEventListener(...args) {
    this.off(...args);
  }
}

export default MentionsManager;
