/**
 * Customize header. Refer to <a href='https://www.pdftron.com/documentation/web/guides/customizing-header' target='_blank'>Customizing header</a> for details.
 * @method CoreControls.ReaderControl#setHeaderItems
 * @param {CoreControls.ReaderControl~headerCallback} headerCallback Callback function to perform different operations on the header.
 * @example // Adding save annotations button
instance.setHeaderItems(function(header) {
  header.push({
    type: 'actionButton',
    img: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>',
    onClick: function() {
      instance.saveAnnotations();
    }
  });
});
 * @example // Removing existing buttons
instance.setHeaderItems(function(header) {
  var items = header.getItems().slice(9, -3);
  header.update(items);
});
 * @example // Appending logo and shifting existing buttons to the right
instance.setHeaderItems(function(header) {
  header.delete(9);
  header.unshift({
    type: 'customElement',
    render: function() {
      var logo = document.createElement('img');
      logo.src = 'https://www.pdftron.com/downloads/logo.svg';
      logo.style.width = '200px';
      logo.style.marginLeft = '10px';
      logo.style.cursor = 'pointer';
      logo.onclick = function() {
        window.open('https://www.pdftron.com', '_blank');
      }
      return logo;
    }
  }, {
    type: 'spacer'
  });
});
 */
/**
 * Callback that gets passed to {@link CoreControls.ReaderControl#setHeaderItems setHeaderItems}.
 * @callback CoreControls.ReaderControl~headerCallback
 * @param {CoreControls.ReaderControl.Header} header Header instance with helper functions
 */

import actions from 'actions';

export default store => callback => {
  const state = store.getState();
  const headerGroups = Object.keys(state.viewer.headers);
  let header = Object.create(Header).initialize(state.viewer, headerGroups);

  callback(header);
  headerGroups.forEach(headerGroup => {
    store.dispatch(actions.setHeaderItems(headerGroup, [ ...header.headers[headerGroup] ]));
  });
};

/**
 * A class which contains header APIs.<br/><br/>
 * <span style="color: red; font-size: 1.2em; font-weight: bold">⚠</span> You must NOT instantiate this yourself. Access the header instance in {@link CoreControls.ReaderControl#setHeaderItems setHeaderItems} as follows:
 * @name CoreControls.ReaderControl.Header
 * @class
 * @example var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer({ ... }, viewerElement);

viewerElement.addEventListener('ready', () => {
  var instance = viewer.getInstance();
  instance.setHeaderItems(header => {
    // instance of Header is passed to the callback
    // header.someMethod();
  });
});
 */
const Header = {
  initialize(viewerState) {
    this.headers = viewerState.headers;
    this.toolButtonObjects = viewerState.toolButtonObjects;
    this.headerGroup = 'default'; 
    this.index = -1;

    return this;
  },
  /**
   * Select a button from header to edit.
   * @method CoreControls.ReaderControl.Header#get
   * @param {string} dataElement data-element of the button.
   * @returns {CoreControls.ReaderControl.Header} Header object for chaining. You can call {@link CoreControls.ReaderControl.Header#insertBefore insertBefore}, {@link CoreControls.ReaderControl.Header#insertAfter insertAfter} and {@link CoreControls.ReaderControl.Header#delete delete} to perform an operation on the button.
   */
  get(dataElement) {
    if (this.index !== -1) {
      // get(dataElement) has been called before so we need to reset this
      const item = this.headers[this.headerGroup][this.index];
      Object.keys(item).forEach(key => {
        delete this[key];
      });
    }

    this._setIndex(dataElement);

    if (this.index === -1) {
      console.warn(`${dataElement} does not exist in ${this.headerGroup} header`);
    } else {
      const item = this.headers[this.headerGroup][this.index];
      Object.keys(item).forEach(key => this[key] = item[key]);
    }

    return this;
  },
  /**
   * Get all list of header items from a group selected from {@link CoreControls.ReaderControl.Header#getHeader getHeader}. By default, it returns the items from 'default' group.
   * @method CoreControls.ReaderControl.Header#getItems
   * @returns {Array.<object>} List of header item objects. You can edit it using normal array operations and update the whole header by passing it to {@link CoreControls.ReaderControl.Header#update update}.
   */
  getItems() {
    return this.headers[this.headerGroup];
  },
  /**
   * Select a header group to edit.
   * @method CoreControls.ReaderControl.Header#getHeader
   * @param {string} headerGroup Name of the header group. By default, 'default' and 'tools' are accepted.
   * @returns {CoreControls.ReaderControl.Header} Header object for chaining. You can call {@link CoreControls.ReaderControl.Header#get get}, {@link CoreControls.ReaderControl.Header#getItems getItems}, {@link CoreControls.ReaderControl.Header#shift shift}, {@link CoreControls.ReaderControl.Header#unshift unshift}, {@link CoreControls.ReaderControl.Header#push push}, {@link CoreControls.ReaderControl.Header#pop pop} and {@link CoreControls.ReaderControl.Header#update update}.
   */
  getHeader(headerGroup) {
    const headerGroups = Object.keys(this.headers);

    if (headerGroups.includes(headerGroup)) {
      this.headerGroup = headerGroup;
      this._resetIndex();
    } else {
      console.warn(`Header must be one of: ${headerGroups.join(' or ')}.`);
    }
    
    return this;
  },
  /**
   * Insert a button before the selected button from {@link CoreControls.ReaderControl.Header#get get}.
   * @method CoreControls.ReaderControl.Header#insertBefore
   * @returns {CoreControls.ReaderControl.Header} Header object for chaining. You can call {@link CoreControls.ReaderControl.Header#get get}, {@link CoreControls.ReaderControl.Header#getItems getItems}, {@link CoreControls.ReaderControl.Header#shift shift}, {@link CoreControls.ReaderControl.Header#unshift unshift}, {@link CoreControls.ReaderControl.Header#push push}, {@link CoreControls.ReaderControl.Header#pop pop} and {@link CoreControls.ReaderControl.Header#update update}.
   */
  insertBefore(newItem) {
    if (this.index === -1) {
      console.warn('Please use .get(dataElement) first before using insertBefore');
    } else {
      this.headers[this.headerGroup].splice(this.index, 0, newItem);
    }

    return this;
  },
  /**
   * Insert a button after the selected button from {@link CoreControls.ReaderControl.Header#get get}.
   * @method CoreControls.ReaderControl.Header#insertAfter
   * @returns {CoreControls.ReaderControl.Header} Header object for chaining. You can call {@link CoreControls.ReaderControl.Header#get get}, {@link CoreControls.ReaderControl.Header#getItems getItems}, {@link CoreControls.ReaderControl.Header#shift shift}, {@link CoreControls.ReaderControl.Header#unshift unshift}, {@link CoreControls.ReaderControl.Header#push push}, {@link CoreControls.ReaderControl.Header#pop pop} and {@link CoreControls.ReaderControl.Header#update update}.
   */
  insertAfter(newItem) {
    if (this.index === -1) {
      console.warn('Please use .get(dataElement) first before using insertAfter');
    } else {
      this.index++;
      this.headers[this.headerGroup].splice(this.index, 0, newItem);
    }

    return this;
  },
  /**
   * Delete a button.
   * @method CoreControls.ReaderControl.Header#delete
   * @param {(number|string)} [id] You can either pass an index or `data-element` of the button to delete. If you already selected a button from {@link CoreControls.ReaderControl.Header#get get}, passing null would delete the selected button.
   * @returns {CoreControls.ReaderControl.Header} Header object for chaining. You can call {@link CoreControls.ReaderControl.Header#get get}, {@link CoreControls.ReaderControl.Header#getItems getItems}, {@link CoreControls.ReaderControl.Header#shift shift}, {@link CoreControls.ReaderControl.Header#unshift unshift}, {@link CoreControls.ReaderControl.Header#push push}, {@link CoreControls.ReaderControl.Header#pop pop} and {@link CoreControls.ReaderControl.Header#update update}.
   */
  delete(arg) {
    let index;

    if (typeof arg === 'number') {
      index = arg;
    } else if (typeof arg === 'string') {
      if (this._getIndexOfElement(arg) === -1) {
        console.warn(`${arg} does not exist in ${this.headerGroup} header`);
      } else {
        index = this._getIndexOfElement(arg);
      }
    } else if (typeof arg === 'undefined') {
      if (this.index === -1) {
        console.warn('Please use .get(dataElement) first before using delete()');
      } else {
        index = this.index;
      }
    } else if (Array.isArray(arg)) {
      arg.forEach(arg => {
        if (typeof arg === 'number' || typeof arg === 'string') {
          this.delete(arg);
        }
      });
    } else {
      console.warn('Argument must be empty, a number, a string or an array');
    }

    if (index) {
      this.headers[this.headerGroup].splice(index, 1);
      this._resetIndex();
    }
  },
  /**
   * Removes the first button in the header.
   * @method CoreControls.ReaderControl.Header#shift
   * @returns {CoreControls.ReaderControl.Header} Header object for chaining. You can call {@link CoreControls.ReaderControl.Header#get get}, {@link CoreControls.ReaderControl.Header#getItems getItems}, {@link CoreControls.ReaderControl.Header#shift shift}, {@link CoreControls.ReaderControl.Header#unshift unshift}, {@link CoreControls.ReaderControl.Header#push push}, {@link CoreControls.ReaderControl.Header#pop pop} and {@link CoreControls.ReaderControl.Header#update update}.
   */
  shift() {
    this.headers[this.headerGroup].shift();
    
    return this;
  },
  /**
   * Adds a button (or buttons) to the beginning of the header.
   * @method CoreControls.ReaderControl.Header#unshift
   * @param {object|Array.<object>} obj Either one or array of header objects. See <a href='https://www.pdftron.com/documentation/web/guides/customizing-header#header-items' target='_blank'>Header items</a> for details.
   * @returns {CoreControls.ReaderControl.Header} Header object for chaining. You can call {@link CoreControls.ReaderControl.Header#get get}, {@link CoreControls.ReaderControl.Header#getItems getItems}, {@link CoreControls.ReaderControl.Header#shift shift}, {@link CoreControls.ReaderControl.Header#unshift unshift}, {@link CoreControls.ReaderControl.Header#push push}, {@link CoreControls.ReaderControl.Header#pop pop} and {@link CoreControls.ReaderControl.Header#update update}.
   */
  unshift(...newItem) {
    this.headers[this.headerGroup].unshift(...newItem);
    
    return this;
  },
  /**
   * Adds a button (or buttons) to the end of the header.
   * @method CoreControls.ReaderControl.Header#push
   * @param {object|Array.<object>} obj Either one or array of header objects. See <a href='https://www.pdftron.com/documentation/web/guides/customizing-header#header-items' target='_blank'>Header items</a> for details.
   * @returns {CoreControls.ReaderControl.Header} Header object for chaining. You can call {@link CoreControls.ReaderControl.Header#get get}, {@link CoreControls.ReaderControl.Header#getItems getItems}, {@link CoreControls.ReaderControl.Header#shift shift}, {@link CoreControls.ReaderControl.Header#unshift unshift}, {@link CoreControls.ReaderControl.Header#push push}, {@link CoreControls.ReaderControl.Header#pop pop} and {@link CoreControls.ReaderControl.Header#update update}.
   */
  push(...newItem) {
    if (newItem[0].group) {
      if (this.headers[this.headerGroup].find(buttonObject => buttonObject.toolGroup === newItem[0].group)){
        const buttonIndex = this.headers[this.headerGroup].findIndex(buttonObject=> buttonObject.toolGroup === newItem[0].group);
        this.headers[this.headerGroup][buttonIndex].children.push(...newItem);
      } else {
        console.warn(`${newItem[0].group} is not a valid group.`)
      }
    } else {
      this.headers[this.headerGroup].push(...newItem);
    }
    return this;
  },
  /**
   * Removes the last button in the header.
   * @method CoreControls.ReaderControl.Header#pop
   * @returns {CoreControls.ReaderControl.Header} Header object for chaining. You can call {@link CoreControls.ReaderControl.Header#get get}, {@link CoreControls.ReaderControl.Header#getItems getItems}, {@link CoreControls.ReaderControl.Header#shift shift}, {@link CoreControls.ReaderControl.Header#unshift unshift}, {@link CoreControls.ReaderControl.Header#push push}, {@link CoreControls.ReaderControl.Header#pop pop} and {@link CoreControls.ReaderControl.Header#update update}.
   */
  pop() {
    this.headers[this.headerGroup].pop();
    
    return this;
  },
  /**
   * Updates the header with new list of header items.
   * @method CoreControls.ReaderControl.Header#update
   * @param {Array.<object>} headerObjects List of header objects to replace the exising header. You can use {@link CoreControls.ReaderControl.Header#getItems getItems} to refer to existing header objects.
   * @returns {CoreControls.ReaderControl.Header} Header object for chaining. You can call {@link CoreControls.ReaderControl.Header#get get}, {@link CoreControls.ReaderControl.Header#getItems getItems}, {@link CoreControls.ReaderControl.Header#shift shift}, {@link CoreControls.ReaderControl.Header#unshift unshift}, {@link CoreControls.ReaderControl.Header#push push}, {@link CoreControls.ReaderControl.Header#pop pop} and {@link CoreControls.ReaderControl.Header#update update}.
   */
  update(arg) {
    if (Array.isArray(arg)) {
      this._updateItems(arg);
    } else {
      console.warn('Argument must be an array');
    }

    return this;
  },
  _updateItems(items) {
    this.headers[this.headerGroup] = items;
    
    return this;
  },
  _setIndex(dataElement) {
    this.index = this._getIndexOfElement(dataElement);
  },
  _getIndexOfElement(dataElement) {
    return this.headers[this.headerGroup].findIndex(item => {
      let dataElementOfItem;
      
      if (item.type === 'toolButton') {
        dataElementOfItem = this.toolButtonObjects[item.toolName].dataElement;
      } else {
        dataElementOfItem = item.dataElement;
      }
      
      return dataElementOfItem === dataElement;
    }); 
  },
  _resetIndex() {
    this.index = -1;
  }
};
