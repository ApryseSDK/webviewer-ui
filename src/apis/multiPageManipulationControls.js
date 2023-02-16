/**
 * An instance of MultiPageManipulationControls that can be used to edit the items included in the overlay
 * @name UI.multiPageManipulationControls
 * @type {UI.MultiPageManipulationControls}
 * @example
 WebViewer(...)
  .then(function (instance) {
    instance.UI.multiPageManipulationControls.someAPI();
  })
 */

/**
 * A class which contains MultiPageManipulationControls APIs. <br/><br/>
 * <span style="color: red; font-size: 1.2em; font-weight: bold">⚠</span> If you want to remove an item in the MultiPageManipulationControls, use {@link UI.disableElements disableElements}.
 * @class
 * @name UI.MultiPageManipulationControls
 */
/**
 * @typedef UI.MultiPageManipulationControls.PageManipulationSection
 * @type {object}
 * @property {string} type Required type of 'customPageOperation' or 'divider'.
 * @property {string} header Header to be displayed in the UI for this section
 * @property {string} dataElement Unique dataElement
 * @property {UI.MultiPageManipulationControls.PageOperation[]} operations the operations that will be available under this section
 */
/**
 * @typedef UI.MultiPageManipulationControls.PageOperation
 * @type {object}
 * @property {string} title Title to be displayed for the operation
 * @property {string} img Path to image to be used as an icon for the operation
 * @property {function} onClick onClick handler, which takes as a parameter an array of selected page numbers
 * @property {string} dataElement Unique dataElement for this operation
 */
import actions from 'actions';
import selectors from 'selectors';

export default (store) => Object.create(MultiPageManipulationControls).initialize(store);

const MultiPageManipulationControls = {
  initialize(store) {
    this.store = store;
    return this;
  },
  /**
   * Adds an array of page manipulation operations to the default operations. If passed a dataElement parameter, it will
   * add the new operations after this element. Otherwise, they will be appended to the start of the existing list
   * of operations.
   * @method UI.MultiPageManipulationControls#add
   * @param {Array.<UI.MultiPageManipulationControls.PageManipulationSection>} pageManipulationSections Array of sections to be added, each with its individual operations. See example below.
   * @param {('leftPanelPageTabsRotate' | 'leftPanelPageTabsOperations' | 'leftPanelPageTabsMore')} [dataElementToInsertAfter] An optional string that determines where in the overlay the new section will be added. If not included, the new page manipulation section will be added to the left.
   * You can call {@link UI.MultiPageManipulationControls#getItems getItems} to get existing items and their dataElements.
   * @returns {UI.MultiPageManipulationControls} The instance itself
   * @example
   // An example of the operation object is shown below.
   // Additionally, to add dividers you can include this in the operations array:
    { type: 'divider' }
    // Example:
    WebViewer(...)
      .then(function (instance) {
        instance.UI.multiPageManipulationControls.add([
          {
            type: 'customPageOperation',
            header: 'Custom options',
            dataElement: 'customPageOperations',
            operations: [
              {
                title: 'Alert me',
                img: '/path-to-image',
                onClick: (selectedPageNumbers) => {
                  alert(`Selected thumbnail pages: ${selectedPageNumbers}`);
                },
                dataElement: 'customPageOperationButton',
              }
            ]
          },
          { type: 'divider' }
        ]);
      });
   */
  add(operations, dataElementToInsertAfter) {
    if (!operations || operations.length === 0) {
      return;
    }

    if (!Array.isArray(operations)) {
      operations = [operations];
    }

    const index = this._getIndexByDataElement(dataElementToInsertAfter);
    const items = this.getItems();
    const indexSmall = this._getIndexByDataElementSmall(dataElementToInsertAfter);
    const itemsSmall = this.getItemsSmall();
    const indexLarge = this._getIndexByDataElementLarge(dataElementToInsertAfter);
    const itemsLarge = this.getItemsLarge();

    items.splice(index + 1, 0, ...operations);
    itemsSmall.splice(indexSmall + 1, 0, ...operations);
    itemsLarge.splice(indexLarge + 1, 0, ...operations);

    this.store.dispatch(actions.setMultiPageManipulationControlsItems(items));
    this.store.dispatch(actions.setMultiPageManipulationControlsItemsSmall(itemsSmall));
    this.store.dispatch(actions.setMultiPageManipulationControlsItemsLarge(itemsLarge));

    return this;
  },

  /**
   * Update all the operations in the MultiPageManipulationControls, essentially replacing them with
   * a new list of operations.
   * To update an individual item, use {@link UI.updateElement updateElement}
   * @method UI.MultiPageManipulationControls#update
   * @param {Array.<UI.MultiPageManipulationControls.PageManipulationSection>} pageManipulationSections The list of PageManipulationSections that will be rendered in the PageManipulation overlay. See the add documentation for an example.
   * @returns {UI.MultiPageManipulationControls} The instance of itself
   * @example
    WebViewer(...)
      .then(function (instance) {
        instance.UI.multiPageManipulationControls.update([
          {
            type: 'customPageOperation',
            header: 'Print Operations',
            dataElement: 'customPageOperations',
            operations: [
              {
                title: 'Print page',
                img: 'icon-header-print-line',
                onClick: (selectedPageNumbers) => {
                  alert(`Selected thumbnail pages: ${selectedPageNumbers}`);
                },
                dataElement: 'printThumbnailPage',
              }
            ]
          },
          { type: 'divider' },
          {
            type: 'customPageOperation',
            header: 'Alert Operations',
            dataElement: 'customPageOperations-2',
            operations: [
              {
                title: 'Alert me',
                img: 'icon-header-print-line',
                onClick: (selectedPageNumbers) => {
                  alert(`Selected thumbnail pages: ${selectedPageNumbers}`);
                },
                dataElement: 'alertPage',
              }
            ]
          }
        ]);
      });
   */
  update(operations) {
    if (!operations) {
      operations = [];
    }
    this.store.dispatch(actions.setMultiPageManipulationControlsItems(operations));
    this.store.dispatch(actions.setMultiPageManipulationControlsItemsSmall(operations));
    this.store.dispatch(actions.setMultiPageManipulationControlsItemsLarge(operations));

    return this;
  },

  /**
   * Return the array of items in the MultiPageManipulationControls.
   * @method UI.MultiPageManipulationControls#getItems
   * @returns {Array.<UI.MultiPageManipulationControls.PageManipulationSection>} Current items in the MultiPageManipulationControls.
   * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.multiPageManipulationControls.getItems();
  });
   */
  getItems() {
    return [...selectors.getMultiPageManipulationControlsItems(this.store.getState())];
  },
  getItemsSmall() {
    return [...selectors.getMultiPageManipulationControlsItemsSmall(this.store.getState())];
  },
  getItemsLarge() {
    return [...selectors.getMultiPageManipulationControlsItemsLarge(this.store.getState())];
  },
  _getIndexByDataElement(dataElement) {
    let index;

    if (typeof dataElement === 'undefined') {
      index = -1;
    } else {
      const state = this.store.getState();
      index = selectors.getMultiPageManipulationControlsItems(state).findIndex((obj) => obj.dataElement === dataElement);
    }

    return index;
  },
  _getIndexByDataElementSmall(dataElement) {
    let index;

    if (typeof dataElement === 'undefined') {
      index = -1;
    } else {
      const state = this.store.getState();
      index = selectors.getMultiPageManipulationControlsItemsSmall(state).findIndex((obj) => obj.dataElement === dataElement);
    }

    return index;
  },
  _getIndexByDataElementLarge(dataElement) {
    let index;

    if (typeof dataElement === 'undefined') {
      index = -1;
    } else {
      const state = this.store.getState();
      index = selectors.getMultiPageManipulationControlsItemsLarge(state).findIndex((obj) => obj.dataElement === dataElement);
    }

    return index;
  },
};
