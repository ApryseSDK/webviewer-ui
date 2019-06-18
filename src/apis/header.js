/**
 * A class which contains APIs to cutomize header UI.
 * @name WebViewer#header
 * @class
 * @example // applying changes on the root of header
WebViewer(...)
  .then(function(instance) {
    instance.header.someAPI();
  });

 // applying changes on a group
WebViewer(...)
  .then(function(instance) {
    instance.header.group(<dataElement>).someAPI();
  })
 * 
 */

import actions from 'actions';

export default store => new header(store);
 
class header {
  constructor(store) {
    this.store = store;
  }
  /**
   * Adds items to the current header
   * @param {object|Array.<object>} newItems Either one or array of button objects
   * @param {number} [index] Index of newItems
   */
  addItems(newItems, index) {
    this.store.dispatch(actions.addItems(newItems, index));
  }
  /**
   * Deletes items with matching index or dataElement
   * @param {(number|string)|Array.<number>|Array.<string>} itemList Index or dataElement of button objects
   * @returns {<object>} Deleted object
   */
  removeItems(itemList) {
    this.store.dispatch(actions.removeItems(itemList));
  }
  /**
   * Updates existing properties of a button object
   * @param {string} dataElement Button object to be updated
   * @param {object} newProps New properties
   */
  updateItem(dataElement, newProps) {
    this.store.dispatch(actions.updateItem(dataElement, newProps));
  }
  /**
   * Replaces existing header array with new arrays
   * @param {Array.<object>} items 
   */
  setItems(items) {
    this.store.dispatch(actions.setItems(items));
  }
  /**
   * Returns items in current header
   * @returns {Array.<object>} Items in current header
   */
  getItems() {
    return this.store.getState().viewer.header;
  }
  /**
   * Applies header APIs on a nested group
   * @param {string} dataElement dataElement of group 
   */
  group(dataElement) {
    const defaultHeader = this.store.getState().viewer.header;
    let group;
    defaultHeader.forEach(buttonObject => {
      if (buttonObject.dataElement === dataElement) {
        group = buttonObject;
      }
      if (buttonObject.children) {
        buttonObject.children.forEach(childObject => {
          if (childObject.dataElement === dataElement) {
            group = childObject;
          }
        });
      }
    });
    if (!group) {
      console.warn(`${dataElement} is not a valid group button`);
      return;
    }
    let me = this;
    return {
      getItems() {
        return group.children;
      },
      addItems(newItems, index) {
        me.store.dispatch(actions.addItems(newItems, index, group));
      },
      removeItems(itemList) {
        me.store.dispatch(actions.removeItems(itemList, group));
      },
      updateItem(dataElement, newProps) {
        me.store.dispatch(actions.updateItem(dataElement, newProps, group));
      },
      setItems(items) {
        me.store.dispatch(actions.setItems(items, group));
      }
    };
  }
}