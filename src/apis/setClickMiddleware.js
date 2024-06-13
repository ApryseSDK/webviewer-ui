import { setClickMiddleWare as _setClickMiddleware } from 'helpers/clickTracker';

/**
 * @name UI.ClickedItemTypes
 * @enum {string}
 * @property {string} BUTTON button type
 */

/**
 * @callback UI.clickMiddleware
 * @param {string} dataElement The dataElement of the clicked item
 * @param {object} info
 * @param {string} info.type The type of the clicked item. Will be one of {@link UI.ClickedItemTypes}
 */

/**
 * Sets a function to be called before the default click handler.
 * Can be used to track clicks on buttons in the UI.
 * @method UI.setClickMiddleware
 * @param {UI.clickMiddleware} middleware A callback function that will be called before the default click handler.
 * @example
 WebViewer(...)
   .then(function(instance) {
     instance.UI.setClickMiddleware(function(dataElement, { type }) {
       if (type === instance.UI.ClickedItemTypes.BUTTON) {
        console.log('clicked button: ', dataElement)
       }
     })
   })
 */
export const setClickMiddleware = (middleware) => {
  _setClickMiddleware(middleware);
};
