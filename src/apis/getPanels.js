/**
 * Returns a list of panels that are currently in the UI
 * @method UI.getPanels
 * @return {UI.Components.Panel} Panel object
 * @example
 WebViewer(...)
 .then(function(instance) {
 const panelList = instance.UI.getPanels();
 console.log(panelList);
 });
 */

import selectors from 'selectors';
import actions from 'actions';
import { panelNames } from 'constants/panel';

export default (store) => () => {
  const panels = selectors.getGenericPanels(store.getState());
  return panels.map((panel) => new Panel(store, panel));
};

/**
 * Represents a panel abstraction that can be used to manipulate a panel in the UI
 * @name Panel
 * @memberOf UI.Components
 * @class UI.Components.Panel
 * @example
 WebViewer(...)
 .then(function(instance) {
 // Returns a list of instances of the panel, each instance can be used to manipulate the panel in the UI using the methods below
 const panelList = instance.UI.getPanels();
 });
 *
 */
export class Panel {
  _store;
  _dataElement;
  _render;
  _location;

  constructor(store, panel) {
    this._store = store;
    this._dataElement = panel.dataElement;
    this._render = panel.render;
    this._location = panel.location;
  }

  /**
   * Sets the location of the panel in the UI
   * @method UI.Components.Panel#setLocation
   * @param {string} location The location of the panel, setting this will update the panel in the UI. It can be either 'left' or 'right'
   * @example
   * WebViewer(...)
   *  .then(function(instance) {
   *  const panelList = instance.UI.getPanels();
   *  panelList[0].setLocation('right');
   *  });
   */
  setLocation(location) {
    const { TYPES, checkTypes } = window.Core;
    checkTypes([location], [TYPES.ONE_OF('left', 'right')], 'Panel.setLocation');
    this.location = location;
    const panelList = selectors.getGenericPanels(this._store.getState());
    const panel = panelList.find((panel) => panel.dataElement === this._dataElement);
    if (!panel) {
      console.warn(`Cannot set location for panel ${this._dataElement}. It may have been deleted.`);
      return;
    }
    panel.location = location;
    this._store.dispatch(actions.setGenericPanels(panelList));
  }

  /**
   * Deletes the panel from the UI
   * @method UI.Components.Panel#delete
   * @example
   * WebViewer(...)
   * .then(function(instance) {
   * const panelList = instance.UI.getPanels();
   * panelList[0].delete();
   * });
   */
  delete() {
    const panelList = selectors.getGenericPanels(this._store.getState());
    const panelIndex = panelList.findIndex((panel) => panel.dataElement === this._dataElement);
    if (panelIndex === -1) {
      return;
    }
    panelList.splice(panelIndex, 1);
    this._store.dispatch(actions.setGenericPanels(panelList));
  }

  updatePanelInStore(oldDataElement = undefined) {
    const panelList = selectors.getGenericPanels(this._store.getState());
    const panelIndex = panelList.findIndex((panel) => panel.dataElement === (oldDataElement || this._dataElement));
    if (panelIndex === -1) {
      return;
    }
    const [oldPanelObject] = panelList.splice(panelIndex, 1);
    panelList.push({ ...oldPanelObject, ...this.toObject() });
    this._store.dispatch(actions.setGenericPanels(panelList));
  }

  toObject() {
    return {
      dataElement: this._dataElement,
      location: this._location,
      render: this._render,
    };
  }

  get dataElement() {
    return this._dataElement;
  }

  set dataElement(dataElement) {
    const { TYPES, checkTypes } = window.Core;
    checkTypes([dataElement], [TYPES.STRING], 'set Panel.dataElement');
    const oldDataElement = this._dataElement;
    this._dataElement = dataElement;
    this.updatePanelInStore(oldDataElement);
  }

  get render() {
    return this._render;
  }

  set render(render) {
    const { TYPES, checkTypes } = window.Core;
    checkTypes([render], [TYPES.MULTI_TYPE(TYPES.ONE_OF(...Object.values(panelNames)), TYPES.FUNCTION)], 'set Panel.render');
    this._render = render;
    this.updatePanelInStore();
  }

  get location() {
    return this._location;
  }

  set location(location) {
    const { TYPES, checkTypes } = window.Core;
    checkTypes([location], [TYPES.ONE_OF('left', 'right')], 'set Panel.location');
    this._location = location;
    this.updatePanelInStore();
  }
}