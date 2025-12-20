/**
 * An instance of MultiPageManipulationControls that can be used to add, update, or retrieve page manipulation controls in the multi-page manipulation overlay
 * @name UI.multiPageManipulationControls
 * @type {UI.MultiPageManipulationControls}
 * @example
WebViewer(...)
  .then(function (instance) {
    // Add a custom page operation control
    instance.UI.multiPageManipulationControls.add([{
      type: 'customPageOperation',
      header: 'Custom options',
      dataElement: 'customPageOperations',
      operations: [{
        title: 'Custom Operation',
        img: '/path-to-image',
        onClick: (selectedPageNumbers) => {
          console.log('Selected pages:', selectedPageNumbers);
        },
        dataElement: 'customPageOperationButton',
      }]
    }]);
  });
 */

/**
 * A class which contains MultiPageManipulationControls APIs. <br/><br/>
 * The MultiPageManipulationControls shows the first 3 sets of controls and the rest in a flyout menu.
 * <span style="color: red; font-size: 1.2em; font-weight: bold">⚠</span> If you want to remove an item in the MultiPageManipulationControls, use {@link UI.disableElements disableElements}.
 * @class
 * @name UI.MultiPageManipulationControls
 */
/**
 * @typedef {Object} UI.MultiPageManipulationControls.PageManipulationSection
 * @property {string} type The type of section. Use 'customPageOperation' for custom operations or 'divider' for separators.
 * @property {string} [header] Header text to be displayed in the UI for this section. Required if type is 'customPageOperation'.
 * @property {string} [dataElement] Unique data element identifier. Required if type is 'customPageOperation'.
 * @property {Array.<UI.MultiPageManipulationControls.PageOperation>} [operations] The operations that will be available under this section. Required if type is 'customPageOperation'.
 */
/**
 * @typedef {Object} UI.MultiPageManipulationControls.PageOperation
 * @property {string} title Title to be displayed for the operation
 * @property {string} img Path to the image to be used as an icon for the operation
 * @property {function(Array.<number>): void} onClick Click handler function that receives an array of selected page numbers as a parameter
 * @property {string} dataElement Unique data element identifier for this operation
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
   * Adds page manipulation operations to the multi-page manipulation controls. If a dataElement parameter is provided, the new operations will be added after that element. Otherwise, they will be added at the beginning.
   * @method UI.MultiPageManipulationControls#add
   * @memberof UI.MultiPageManipulationControls
   * @param {Array.<UI.MultiPageManipulationControls.PageManipulationSection>} pageManipulationSections Array of sections to be added, each with its individual operations
   * @param {string} [dataElementToInsertAfter] The data element of the item to insert after. Can be 'leftPanelPageTabsRotate', 'leftPanelPageTabsOperations', 'leftPanelPageTabsMore', or a custom data element. If not provided, items will be added at the beginning. Call {@link UI.MultiPageManipulationControls#getItems getItems} to see existing items and their data elements.
   * @returns {UI.MultiPageManipulationControls} The MultiPageManipulationControls instance for chaining
   * @example
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

    items.splice(index + 1, 0, ...operations);

    this.store.dispatch(actions.setMultiPageManipulationControlsItems(items));
    return this;
  },

  /**
   * Replaces all operations in the MultiPageManipulationControls with a new list of operations.
   * To update an individual item, use {@link UI.updateElement}.
   * @method UI.MultiPageManipulationControls#update
   * @memberof UI.MultiPageManipulationControls
   * @param {Array.<UI.MultiPageManipulationControls.PageManipulationSection>} pageManipulationSections The list of page manipulation sections that will be rendered in the controls. If not provided, the controls will be cleared.
   * @returns {UI.MultiPageManipulationControls} The MultiPageManipulationControls instance for chaining
   * @see UI.updateElement
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
              console.log('Printing pages:', selectedPageNumbers);
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

    return this;
  },

  /**
   * Returns the current array of items in the MultiPageManipulationControls
   * @method UI.MultiPageManipulationControls#getItems
   * @memberof UI.MultiPageManipulationControls
   * @returns {Array.<UI.MultiPageManipulationControls.PageManipulationSection>} The current page manipulation sections in the controls
   * @example
WebViewer(...)
  .then(function(instance) {
    const items = instance.UI.multiPageManipulationControls.getItems();
    console.log('Current multi-page manipulation items:', items);
  });
   */
  getItems() {
    return [...selectors.getMultiPageManipulationControlsItems(this.store.getState())];
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
};
