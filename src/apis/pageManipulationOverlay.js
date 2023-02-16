/**
 * An  instance of PageManipulationOverlay that can be used to edit the items included in the overlay
 * @name UI.pageManipulationOverlay
 * @implements {UI.PageManipulationOverlay}
 * @type {UI.PageManipulationOverlay}
 * @example
 WebViewer(...)
  .then(function (instance) {
    instance.UI.pageManipulationOverlay.someAPI();
  })
 */

/**
 * A class which contains PageManipulationOverlay APIs. <br/><br/>
 * <span style="color: red; font-size: 1.2em; font-weight: bold">⚠</span> If you want to remove an item in the PageManipulationOverlay, use {@link UI.disableElements disableElements}.
 * @interface UI.PageManipulationOverlay
 */
import actions from 'actions';
import selectors from 'selectors';

export default (store) => Object.create(PageManipulationOverlayAPI).initialize(store);

const PageManipulationOverlayAPI = {
  initialize(store) {
    this.store = store;
    return this;
  },
  /**
   * @typedef UI.PageManipulationOverlay.PageManipulationSection
   * @type {object}
   * @property {string} type Required type of 'customPageOperation'
   * @property {string} header Header to be displayed in the UI for this section
   * @property {string} dataElement Unique dataElement
   * @property {UI.PageManipulationOverlay.PageOperation[]} operations the operations that will be available under this section
   */
  /**
   * @typedef UI.PageManipulationOverlay.PageOperation
   * @type {object}
   * @property {string} title Title to be displayed for the operation
   * @property {string} img path to imge to be used as an icon for the operation
   * @property {function} onClick onClick handler, which takes as a parameter an array of selected page numbers
   * @property {string} dataElement Unique dataElement for this operation
   */
  /**
   * Adds an array of page manipulation operations to the default operations. If passed a dataElement parameter, it will
   * add the new operations after this element. Otherwise, they will be appended to the start of the existing list
   * of operations.
   * @method UI.PageManipulationOverlay#add
   * @param {Array.<UI.PageManipulationOverlay.PageManipulationSection>} PageManipulationSection Array of sections to be added, each with its individual operations. See example below.
   * @param {('pageRotationControls' | 'pageManipulationControls')} [dataElementToInsertAfter] An optional string that determines where in the overlay the new section will be added. If not included, the new page manipulation section will be added at the top.
   * You can call {@link UI.PageManipulationOverlay#getItems getItems} to get existing items and their dataElements.
   * @returns {UI.PageManipulationOverlay} The instance itself
   * @example
   * // Each object in the operations array shall consist of the following:
    {
      type: 'customPageOperation', // Required type of 'customPageOperation'
      header: 'Custom options', // Header to be displayed in the UI
      dataElement: 'customPageOperations', // Unique dataElement
      // Each new section can have one more more operations.
      // The onClick handler for each operation gets passed an array of the currently selected
      // thumbnail page numbers.
      operations: [
        {
          title: 'Alert me of selected thumbnail page numbers',
          img: '/path-to-image',
          onClick: (selectedPageNumbers) => {
            alert(`Selected thumbnail pages: ${selectedPageNumbers}`);
          },
          dataElement: 'customPageOperationButton', // Each operation must have a dataElement
        }
      ]
    }

    // Additionally, to add dividers you can include this in the operations array:
    { type: 'divider' }
    // Example:
    WebViewer(...)
      .then(function (instance) {
        instance.UI.pageManipulationOverlay.add([
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

    this.store.dispatch(actions.setPageManipulationOverlayItems(items));

    return this;
  },

  /**
   * Update all the operations in the PageManipulationOverlay, essentially replacing them with
   * a new list of operations.
   * To update an individual item, use {@link UI.updateElement updateElement}
   * @method UI.PageManipulationOverlay#update
   * @param {Array.<UI.PageManipulationOverlay.PageManipulationSection>} PageManipulationSection The list of PageManipulationSections that will be rendered in the PageManipulation overlay. See the add documentation for an example.
   * @returns {UI.PageManipulationOverlay} The instance of itself
   * @example
    WebViewer(...)
      .then(function (instance) {
        instance.UI.pageManipulationOverlay.update([
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
    this.store.dispatch(actions.setPageManipulationOverlayItems(operations));

    return this;
  },

  /**
   * Return the array of items in the PageManipulationOverlay.
   * @method UI.PageManipulationOverlay#getItems
   * @returns {Array.<UI.PageManipulationOverlay.PageManipulationSection>} Current items in the PageManipulationOverlay.
   * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.pageManipulationOverlay.getItems();
  });
   */
  getItems() {
    return [...selectors.getPageManipulationOverlayItems(this.store.getState())];
  },
  _getIndexByDataElement(dataElement) {
    let index;

    if (typeof dataElement === 'undefined') {
      index = -1;
    } else {
      const state = this.store.getState();
      index = selectors.getPageManipulationOverlayItems(state).findIndex((obj) => obj.dataElement === dataElement);
    }

    return index;
  },
  /**
   * Disables the Page Manipulation Overlay opening through right-click.
   * @method UI.PageManipulationOverlay#disableOpeningByRightClick
   * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.pageManipulationOverlay.disableOpeningByRightClick();
  });
   */
  disableOpeningByRightClick() {
    this.store.dispatch(actions.setPageManipulationOverlayOpenByRightClick(false));
  },
  /**
   * Enables the Page Manipulation Overlay opening through right-click.
   * @method UI.PageManipulationOverlay#enableOpeningByRightClick
   * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.pageManipulationOverlay.enableOpeningByRightClick();
  });
   */
  enableOpeningByRightClick() {
    this.store.dispatch(actions.setPageManipulationOverlayOpenByRightClick(true));
  }
};
