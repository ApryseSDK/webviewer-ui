/**
 * An instance of PageManipulationOverlay that can be used to add, update, or retrieve page manipulation operations in the overlay
 * @name UI.pageManipulationOverlay
 * @type {UI.PageManipulationOverlay}
 * @example
WebViewer(...)
  .then(function (instance) {
    // Add a custom page operation to the overlay
    instance.UI.pageManipulationOverlay.add([{
      type: 'customPageOperation',
      header: 'Custom options',
      dataElement: 'customPageOperations',
      operations: [{
        title: 'Alert me',
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
 * A class which contains PageManipulationOverlay APIs. <br/><br/>
 * <span style="color: red; font-size: 1.2em; font-weight: bold">⚠</span> If you want to remove an item in the PageManipulationOverlay, use {@link UI.disableElements disableElements}.
 * @interface UI.PageManipulationOverlay
 */
import actions from 'actions';
import selectors from 'selectors';
import { isMobile } from 'helpers/device';
import DataElements from 'constants/dataElement';
import {
  getPageAdditionalControls,
  getPageRotationControls,
  getPageManipulationControls,
  getPageNumbers
} from 'helpers/pageManipulationFlyoutHelper';

export default (store) => Object.create(PageManipulationOverlayAPI).initialize(store);

const PageManipulationOverlayAPI = {
  initialize(store) {
    this.store = store;
    return this;
  },
  /**
   * @typedef {Object} UI.PageManipulationOverlay.PageManipulationSection
   * @property {string} type The type of section. Use 'customPageOperation' for custom operations or 'divider' for separators.
   * @property {string} [header] Header text to be displayed in the UI for this section. Required if type is 'customPageOperation'.
   * @property {string} [dataElement] Unique data element identifier. Required if type is 'customPageOperation'.
   * @property {Array.<UI.PageManipulationOverlay.PageOperation>} [operations] The operations that will be available under this section. Required if type is 'customPageOperation'.
   */
  /**
   * @typedef {Object} UI.PageManipulationOverlay.PageOperation
   * @property {string} title Title to be displayed for the operation
   * @property {string} img Path to the image to be used as an icon for the operation
   * @property {function(Array.<number>): void} onClick Click handler function that receives an array of selected page numbers as a parameter
   * @property {string} dataElement Unique data element identifier for this operation
   */
  /**
   * Adds page manipulation operations to the overlay. If a dataElement parameter is provided, the new operations will be added after that element. Otherwise, they will be added at the beginning.
   * @method UI.PageManipulationOverlay#add
   * @memberof UI.PageManipulationOverlay
   * @param {Array.<UI.PageManipulationOverlay.PageManipulationSection>} operations Array of sections to be added, each with its individual operations
   * @param {string} [dataElementToInsertAfter] The data element of the item to insert after. Can be 'pageRotationControls', 'pageManipulationControls', or a custom data element. If not provided, items will be added at the beginning. Call {@link UI.PageManipulationOverlay#getItems getItems} to see existing items and their data elements.
   * @returns {UI.PageManipulationOverlay} The PageManipulationOverlay instance for chaining
   * @example
WebViewer(...)
  .then(function (instance) {
    instance.UI.pageManipulationOverlay.add([
      {
        type: 'customPageOperation',
        header: 'Custom options',
        dataElement: 'customPageOperations',
        operations: [
          {
            title: 'Alert me of selected thumbnail page numbers',
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
    const flyoutItems = [];
    for (const item of items) {
      flyoutItems.push(...convertItemToFlyoutList(item, this.store));
    }
    this.store.dispatch(actions.updateFlyout(DataElements.PAGE_MANIPULATION, {
      dataElement: DataElements.PAGE_MANIPULATION,
      className: DataElements.PAGE_MANIPULATION,
      items: flyoutItems,
    }));

    return this;
  },

  /**
   * Replaces all operations in the PageManipulationOverlay with a new list of operations
   * To update an individual item, use {@link UI.updateElement}.
   * @method UI.PageManipulationOverlay#update
   * @memberof UI.PageManipulationOverlay
   * @param {Array.<UI.PageManipulationOverlay.PageManipulationSection>} operations The list of page manipulation sections that will be rendered in the overlay. If not provided, the overlay will be cleared.
   * @returns {UI.PageManipulationOverlay} The PageManipulationOverlay instance for chaining
   * @see UI.updateElement
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
    this.store.dispatch(actions.setPageManipulationOverlayItems(operations));
    const flyoutItems = [];
    for (const item of operations) {
      flyoutItems.push(...convertItemToFlyoutList(item, this.store));
    }
    this.store.dispatch(actions.updateFlyout(DataElements.PAGE_MANIPULATION, {
      dataElement: DataElements.PAGE_MANIPULATION,
      className: DataElements.PAGE_MANIPULATION,
      items: flyoutItems,
    }));

    return this;
  },

  /**
   * Returns the current array of items in the PageManipulationOverlay
   * @method UI.PageManipulationOverlay#getItems
   * @memberof UI.PageManipulationOverlay
   * @returns {Array.<UI.PageManipulationOverlay.PageManipulationSection>} The current page manipulation sections in the overlay
   * @example
WebViewer(...)
  .then(function(instance) {
    const items = instance.UI.pageManipulationOverlay.getItems();
    console.log('Current page manipulation items:', items);
  });
   */
  getItems() {
    const flyout = selectors.getFlyout(this.store.getState(), DataElements.PAGE_MANIPULATION);
    return [...convertFlyoutListToItems(flyout.items)];
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
   * Disables the Page Manipulation Overlay from opening through right-click on thumbnails
   * @method UI.PageManipulationOverlay#disableOpeningByRightClick
   * @memberof UI.PageManipulationOverlay
   * @see UI.PageManipulationOverlay#enableOpeningByRightClick
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
   * Enables the Page Manipulation Overlay to open through right-click on thumbnails.
   * @method UI.PageManipulationOverlay#enableOpeningByRightClick
   * @memberof UI.PageManipulationOverlay
   * @see UI.PageManipulationOverlay#disableOpeningByRightClick
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

function convertItemToFlyoutList(item, store) {
  if (item.type === 'divider') {
    return ['divider'];
  }

  const prebuiltElements = ['pageAdditionalControls', 'pageRotationControls', 'pageManipulationControls'];
  if (item.dataElement && prebuiltElements.includes(item.dataElement)) {
    if (item.dataElement === 'pageAdditionalControls') {
      return getPageAdditionalControls(store);
    } else if (item.dataElement === 'pageRotationControls') {
      return getPageRotationControls(store);
    } else if (item.dataElement === 'pageManipulationControls') {
      return getPageManipulationControls(store);
    }
  }

  const items = [];
  items.push(item.header);
  for (const operation of item.operations) {
    items.push({
      dataElement: operation.dataElement,
      label: operation.title,
      title: operation.title,
      icon: operation.img,
      onClick: () => {
        operation.onClick(getPageNumbers(store));
        isMobile() && store.dispatch(actions.closeElement(DataElements.PAGE_MANIPULATION));
      },
    });
  }
  return items;
}

function convertFlyoutListToItems(flyoutList) {
  const items = [];
  let currentSection;
  let skipCount = 0;
  for (const item of flyoutList) {
    if (skipCount > 0) {
      skipCount--;
      continue;
    }
    if (item === 'divider') {
      items.push({ type: 'divider' });
      continue;
    }

    if (typeof item === 'string') {
      if (item === 'option.thumbnailsControlOverlay.move') {
        currentSection = { dataElement: 'pageAdditionalControls' };
        skipCount = 2;
      } else if (item === 'action.rotate') {
        currentSection = { dataElement: 'pageRotationControls' };
        skipCount = 2;
      } else if (item === 'action.pageManipulation') {
        currentSection = { dataElement: 'pageManipulationControls' };
        skipCount = 4;
      } else {
        currentSection = {
          type: 'customPageOperation',
          header: item,
          dataElement: item,
          operations: [],
        };
      }
      items.push(currentSection);
    } else {
      currentSection.operations.push({
        title: item.title,
        img: item.icon,
        dataElement: item.dataElement,
        onClick: item.onClick,
      });
    }
  }
  return items;
}

