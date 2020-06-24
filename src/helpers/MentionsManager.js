import core from 'core';
import actions from 'actions';
import selectors from 'selectors';

/**
 * @typedef {Object} WebViewerInstance.MentionsManager.Mention
 * @property {string} email The email of the mentioned person. This is passed from setUserData.
 * @property {string} value The value(display name) of the mentioned person. This is passed from setUserData.
 * @property {string} type The type of the mentioned person. This is passed from setUserData.
 * @property {string} id The id of the mentioned person. This is passed from setUserData.
 * @property {string} annotId The id of the annotation in which the contents contain the mentions.
 */

/**
 * @typedef {Object} mentionData
 * @property {WebViewerInstance.MentionsManager.Mention} mentions an array of mentions that an annotation contains
 * @property {string} contentWithoutMentions the content of an annotation, but without mentions
 * @ignore
 */

/**
 * @typedef {Object.<string, string>} WebViewerInstance.MentionsManager.UserData
 * @property {string} value The display name of the user, which will be displayed in the suggestion overlay.
 * @property {string} [id] The unique id of the user. Default to `value`.
 * @property {string} [email] The email of the user, which will be displayed under `value` in the suggestion overlay, if present.
 */

/**
 * @class
 * @name MentionsManager
 * @memberof WebViewerInstance
 * @extends EventHandler
 */
class MentionsManager {
  initialize(store, annotManager) {
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
    this.allowedTrailingCharacters = [' '];

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
      const mentionData = this.extractMentionDataFromAnnot(annotation);

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
      const prevMentionData = this.idMentionDataMap[annotation.Id] || {
        mentions: [],
        contentWithoutMentions: '',
      };
      const currMentionData = this.extractMentionDataFromAnnot(annotation);
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
   * @param {string} str a string to extract mention data from
   * @returns {object} returns an object that contains the following properties
   * plainTextValue: a string that has been transformed to not have the markups in the incoming string
   * ids: an array of strings that contains the mentioned ids
   * @ignore
   */
  extractMentionDataFromStr(str) {
    // the value of the markup is defined at https://github.com/signavio/react-mentions#configuration
    const markupRegex = /@\[(.*?)\]\((.*?)\)/g;
    const ids = [];
    let match;
    let plainTextValue = str;

    // iterate through the matches, extract ids and build the plainTextValue
    // after the iteration finishes, if the incoming string is Hello! @[Zhijie Zhang](zzhang@pdftron.com), then we should have:
    // {
    //   plainTextValue: Hello! Zhijie Zhang,
    //   ids: ['zzhang@pdftron.com'],
    // }
    while ((match = markupRegex.exec(str)) !== null) {
      const [wholeMatch, displayName, id] = match;

      ids.push(id);
      plainTextValue = plainTextValue.replace(
        // keep the @ and only replace the remaining text
        wholeMatch.slice(1),
        displayName,
      );
    }

    return {
      plainTextValue,
      ids,
    };
  }

  /**
   * @param {string} content
   * @returns {mentionData}
   * @ignore
   */
  extractMentionDataFromAnnot(annotation) {
    const mentionData = annotation.getCustomData('trn-mention');
    const userData = this.getUserData();
    const contents = annotation.getContents();
    const result = {
      mentions: [],
      contentWithoutMentions: contents,
    };

    if (!mentionData) {
      return result;
    }

    userData.forEach(user => {
      if (mentionData.ids.includes(user.id) && this.isValidMention(contents, user.value)) {
        result.mentions.push({
          ...user,
          annotId: annotation.Id,
        });

        result.contentWithoutMentions = result.contentWithoutMentions.replace(`@${user.value}`, '');
      }
    });

    return result;
  }

  isValidMention(content, value) {
    value = `@${value}`;

    const startIndex = content.indexOf(value);
    const nextChar = content[startIndex + value.length];
    const isEndOfString = typeof nextChar === 'undefined';
    const allowedChars = this.getAllowedTrailingCharacters();

    return isEndOfString || allowedChars === '*' || allowedChars.includes(nextChar);
  }

  isSameMention(prevMention, currMention) {
    for (const key in prevMention) {
      if (prevMention[key] !== currMention[key]) {
        return false;
      }
    }

    return true;
  }

  createMentionReply(annotation, value) {
    const { plainTextValue, ids } = this.extractMentionDataFromStr(value);

    const replyAnnot = new Annotations.StickyAnnotation();
    replyAnnot['InReplyTo'] = annotation['Id'];
    replyAnnot['X'] = annotation['X'];
    replyAnnot['Y'] = annotation['Y'];
    replyAnnot['PageNumber'] = annotation['PageNumber'];
    replyAnnot['Author'] = core.getCurrentUser();
    replyAnnot.setContents(plainTextValue || '');
    replyAnnot.setCustomData('trn-mention', {
      contents: value,
      ids,
    });

    annotation.addReply(replyAnnot);

    core.addAnnotations([replyAnnot]);
  }

  /**
   * Sets the user data that will be displayed in the suggestions overlay when an @ is entered in the textarea.
   * @method WebViewerInstance.MentionsManager#setUserData
   * @param {WebViewerInstance.MentionsManager.UserData[]} userData An array of user data
   * @example
WebViewer(...)
  .then(function(instance) {
    instance.mentions.setUserData([
      {
        value: 'John Doe',
      },
      {
        value: 'Jane Doe',
        email: 'jDoe@gmail.com'
      }
    ]);
  });
   */
  setUserData(userData) {
    userData = userData.map(user => ({
      ...user,
      id: user.id || user.email || user.value,
    }));

    this.store.dispatch(actions.setUserData(userData));
  }

  /**
   * Gets the user data
   * @method WebViewerInstance.MentionsManager#getUserData
   * @returns {WebViewerInstance.MentionsManager.UserData[]} An array of user data
   */
  getUserData() {
    return selectors.getUserData(this.store.getState());
  }

  /**
   * Sets the characters that can follow a mention, while not invalidating it
   * By default, a mention can only be followed by a space, or is located at the end of the string
   * @method WebViewerInstance.MentionsManager#setAllowedTrailingCharacters
   * @param {string[]|'*'} chars An array of characters. If `*` is passed, then a mention can be followed by any characters
   * @example
WebViewer(...)
  .then(function(instance) {
    instance.mentions.setUserData([
      {
        value: 'John Doe',
      },
    ]);

    // this is considered as a mention, because `@John Doe` is at the end of the string
    'Hello, @John Doe'

    // this is considered as a mention, because `@John Doe` is followed by a space
    'Hello, @John Doe How are you?'

    // this is NOT considered as a mention, because `@John Doe` is followed by a comma
    '@John Doe, Hello!'

    instance.mentions.setAllowedTrailingCharacters([' ', ',']);

    // this is now considered as a mention, because comma is an allowed trailing character
    '@John Doe, Hello!'
  });
   */
  setAllowedTrailingCharacters(chars) {
    this.allowedTrailingCharacters = chars;
  }

  /**
   * Gets the allowed trailing characters
   * @method WebViewerInstance.MentionsManager#getAllowedTrailingCharacters
   * @returns {string[]|'*'} An array of trailing characters, or '*'
   */
  getAllowedTrailingCharacters() {
    return this.allowedTrailingCharacters;
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

  one(eventName, fn) {
    const origFn = fn;

    fn = (...args) => {
      this.off(eventName, fn);

      origFn.apply(this, args);
    };

    return this.on(eventName, fn);
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

/**
 * Triggered when a mention or mentions have been changed (added, deleted, modified).
 * Attach like instance.mentions.on('mentionChanged', callback)
 * @name WebViewerInstance.MentionsManager#mentionChanged
 * @event
 * @param {WebViewerInstance.MentionsManager.Mention} mentions The mentions that were changed
 * @param {'add'|'modify'|'delete'} action The action that occurred (add, delete, modify)
 */

export default new MentionsManager();
export {
  MentionsManager
};
