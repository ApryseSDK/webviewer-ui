import { ITEM_TYPE } from 'constants/customizationVariables';
import actions from 'actions';
import Flyout from './ModularComponents/flyout';
import selectors from 'selectors/index';

/**
 * @ignore
 * Namespace used to add, remove, and interact with flyouts in the UI
 * @namespace UI.Flyouts
 * @example
 * WebViewer(...).then(function(instance) {
 *  instance.UI.Flyouts.setActiveFlyout('customFlyout');
 * });
 */

/**
 * @ignore
 * Adds new flyout to the Flyout List
 * @method UI.Flyouts.addFlyouts
 * @param {Array<UI.Components.Flyout>} flyoutList Array of flyouts to add
 * @example
 * WebViewer(...).then(function(instance) {
 *  const flyout = new instance.UI.Components.Flyout({
 *    dataElement: 'customFlyout',
 *    draggable: true,
 *    items: [{
 *      label: 'Custom Flyout Item',
 *      onClick: () => console.log('Custom Flyout Item clicked'),
 *      icon: 'icon-save',
 *    }],
 *  });
 *  instance.UI.Flyouts.addFlyouts([ flyout ]);
 * });
 */

/**
 * @ignore
 * Removes flyout from the Flyout List
 * @method UI.Flyouts.removeFlyout
 * @param {string} dataElement Data element of the flyout to remove
 * @example
 * WebViewer(...).then(function(instance) {
 *  instance.UI.Flyouts.removeFlyout('customFlyout');
 * });
 */

/**
 * @ignore
 * Sets the active flyout, set to null to hide the flyout
 * @method UI.Flyouts.setActiveFlyout
 * @param {string} dataElement Data element of the flyout to set as active
 * @example
 * WebViewer(...).then(function(instance) {
 *  instance.UI.Flyouts.setActiveFlyout('customFlyout');
 * });
 */

/**
 * @ignore
 * Sets the position of the active flyout, (use UI.Flyouts.setActiveFlyout to show the flyout)
 * Position is relative to the root element of WebViewer
 * Coordinates going out of the WebViewer UI will be clamped
 * @method UI.Flyouts.setFlyoutPosition
 * @param {Object} position Position of the flyout
 * @param {number} position.x X position of the flyout
 * @param {number} position.y Y position of the flyout
 * @example
 * WebViewer(...).then(function(instance) {
 *  instance.UI.Flyouts.setFlyoutPosition({ x: 100, y: 100 });
 *  instance.UI.Flyouts.setActiveFlyout('customFlyout');
 * });
 */

/**
 * @ignore
 * @method UI.Flyouts.getFlyout
 * @param {string} dataElement Data element of the flyout to get
 * @returns {UI.Components.Flyout} Flyout with the given data element
 */

/**
 * @ignore
 * @method UI.Flyouts.getFlyouts
 * @returns {Array<UI.Components.Flyout>} Array of all flyouts registered with the UI
 */

export default (store) => {
  const { checkTypes, TYPES } = window.Core;
  const addFlyouts = (flyoutList) => {
    for (const flyout of flyoutList) {
      if (!flyout || !flyout.properties || flyout.type !== ITEM_TYPE.FLYOUT) {
        return console.error('Invalid Flyout item passed to addFlyout: ', JSON.stringify(flyout));
      }
      const { properties } = flyout;

      store.dispatch(actions.addFlyout(properties));
    }
  };

  const removeFlyout = (dataElement) => {
    checkTypes([dataElement], [TYPES.STRING], 'Flyouts.removeFlyout');
    store.dispatch(actions.removeFlyout(dataElement));
  };

  const setActiveFlyout = (dataElement) => {
    checkTypes([dataElement], [TYPES.OPTIONAL(TYPES.STRING)], 'Flyouts.setActiveFlyout');
    store.dispatch(actions.setActiveFlyout(dataElement));
  };

  const setFlyoutPosition = (position) => {
    checkTypes([position], [TYPES.OBJECT({ x: TYPES.NUMBER, y: TYPES.NUMBER })], 'Flyouts.setFlyoutPosition');
    store.dispatch(actions.setFlyoutPosition(position));
  };

  const getFlyout = (dataElement) => {
    checkTypes([dataElement], [TYPES.STRING], 'Flyouts.getFlyout');
    const flyout = selectors.getFlyoutMap(store.getState())[dataElement];
    if (!flyout) {
      return null;
    }
    return new (Flyout(store))(flyout);
  };

  const getAllFlyouts = () => {
    const flyoutMap = selectors.getFlyoutMap(store.getState());
    const flyouts = [];
    for (const dataElement in flyoutMap) {
      flyouts.push(getFlyout(dataElement));
    }
    return flyouts;
  };

  return {
    addFlyouts,
    removeFlyout,
    setActiveFlyout,
    setFlyoutPosition,
    getFlyout,
    getAllFlyouts,
  };
};
