import actions from 'actions';
import selectors from 'selectors';

/**
 * typedef {Object} mention
 * @property {string} email The email of the mentioned person. This is passed from setUserData.
 * @property {string} value The value(display name) of the mentioned person. This is passed from setUserData.
 * @property {string} type The type of the mentioned persion. This is passed from setUserData.
 * @property {string} id The id of the annotation.
 */

/**
 * @typedef {Object} mentionData
 * @property {mention} mentions an array of mentions that an annotation contains
 * @property {string} contentWithoutMentions the content of an annotation, but without mentions
 * @ignore
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
     * @type {Object.<string, mentionData>}
     * @example
     * {
     *   'eb15d11a-ef1b-6d03-adba-e0eb64bbf6d2': {
     *     mentions: [
     *       {
     *         email: 'cahang@pdftron.com',
     *         value: 'Edmiz',
     *         type: 'user',
     *         id: 'aidsfuha-32123123',
     *       },
     *       ...
     *     ],
     *     contentWithoutMentions: '...'
     *   }
     * }
     * @ignore
     */
    this.idMentionDataMap = {};

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
    let newMentions = [];

    annotations.forEach(annotation => {
      const mentionData = this.extractMentionData(annotation);

      this.idMentionDataMap[annotation.Id] = mentionData;
      newMentions = newMentions.concat(mentionData.mentions);
    });

    if (newMentions.length) {
      this.trigger('mentionChanged', [newMentions, 'add']);
    }
  }

  handleAnnotationsModified(annotations) {
    const newMentions = [];
    let modifiedMentions = [];
    const deletedMentions = [];

    annotations.forEach(annotation => {
      const prevMentionData = this.idMentionDataMap[annotation.Id] || {};
      const currMentionData = this.extractMentionData(annotation);
      const prevMentions = prevMentionData.mentions;
      const currMentions = currMentionData.mentions;

      this.idMentionDataMap[annotation.Id] = currMentionData;

      currMentions.forEach(currMention => {
        const isNewMention = !prevMentions.find(prevMention =>
          this.isSameMention(prevMention, currMention)
        );
        if (isNewMention) {
          newMentions.push(currMention);
        }
      });

      prevMentions.forEach(prevMention => {
        const isDeletedMention = !currMentions.find(currMention =>
          this.isSameMention(prevMention, currMention)
        );
        if (isDeletedMention) {
          deletedMentions.push(prevMention);
        }
      });

      if (
        prevMentions.length &&
        prevMentionData.contentWithoutMentions !== currMentionData.contentWithoutMentions
      ) {
        modifiedMentions = modifiedMentions.concat(currMentions);
      }
    });

    if (newMentions.length) {
      this.trigger('mentionChanged', [newMentions, 'add']);
    }
    if (modifiedMentions.length) {
      this.trigger('mentionChanged', [modifiedMentions, 'modify']);
    }
    if (deletedMentions.length) {
      this.trigger('mentionChanged', [deletedMentions, 'delete']);
    }
  }

  handleAnnotationsDeleted(annotations) {
    let deletedMentions = [];

    annotations.forEach(annotation => {
      if (this.idMentionDataMap[annotation.Id]) {
        deletedMentions = deletedMentions.concat(this.idMentionDataMap[annotation.Id].mentions);
        delete this.idMentionDataMap[annotation.Id];
      }
    });

    if (deletedMentions.length) {
      this.trigger('mentionChanged', [deletedMentions, 'delete']);
    }
  }

  /**
   * @param {string} content
   * @returns {mentionData}
   * @ignore
   */
  extractMentionData(annotation) {
    const content = annotation.getContents();
    const userData = this.getUserData();
    const result = {
      mentions: [],
      contentWithoutMentions: content,
    };

    if (!content) {
      return result;
    }

    userData.forEach(({ email, value, type }) => {
      if (content.includes(`@${value}`)) {
        result.mentions.push({
          email,
          value,
          type,
          id: annotation.Id,
        });

        result.contentWithoutMentions = result.contentWithoutMentions.replace(`@${value}`, '');
      }
    });

    return result;
  }

  isSameMention(prevMention, currMention) {
    for (const key in prevMention) {
      if (prevMention[key] !== currMention[key]) {
        return false;
      }
    }

    return true;
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
