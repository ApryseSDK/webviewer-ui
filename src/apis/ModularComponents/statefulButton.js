import { ITEM_TYPE } from 'src/constants/customizationVariables';
import Item from './item';

const { checkTypes, TYPES } = window.Core;

/**
 * Creates a new instance of StatefulButton.
 * @name StatefulButton
 * @memberOf UI.Components
 * @class UI.Components.StatefulButton
 * @extends UI.Components.Item
 * @param {Object} properties An object that contains the properties of the StatefulButton.
 * @param {Object} [properties.states] An object that contains the states of the button.
 * @param {string} [properties.initialState] The initial state of the button.
 * @param {function} [properties.mount] The function that is called when the button is mounted.
 * @param {function} [properties.unmount] The function that is called when the button is unmounted.
 * @param {string} [properties.dataElement] The data element of the button.
 * @param {string} [properties.title] The title of the button which appears in a tooltip.
 * @param {boolean} [properties.hidden] Whether the button is hidden or not.
 * @example
const myButton = new instance.UI.Components.StatefulButton({
  initialState: 'SinglePage',
  states: {
    SinglePage: {
      img: 'icon-header-page-manipulation-page-layout-single-page-line',
      onClick: (update) => {
        update('DoublePage');
      },
      title: 'Single Page',
    },
    DoublePage: {
      img: 'icon-header-page-manipulation-page-layout-double-page-line',
      onClick: (update) => {
        update('SinglePage');
      },
      title: 'Double Page',
    },
  },
  mount: () => {},
});
 */
class StatefulButton extends Item {
  constructor(props) {
    checkTypes([props], [TYPES.OBJECT({
      initialState: TYPES.STRING,
      mount: TYPES.FUNCTION,
      states: TYPES.OBJECT({}),
      dataElement: TYPES.OPTIONAL(TYPES.STRING),
      unmount: TYPES.OPTIONAL(TYPES.FUNCTION),
      title: TYPES.OPTIONAL(TYPES.STRING),
      hidden: TYPES.OPTIONAL(TYPES.BOOLEAN),
    })], 'Stateful Button Constructor');

    const { initialState, mount, unmount, dataElement, title, hidden, states } = props;
    super(props);
    this.type = ITEM_TYPE.STATEFUL_BUTTON;
    this.initialState = initialState;
    this.mount = mount;
    this.unmount = unmount;
    this._dataElement = dataElement;
    this.title = title;
    this.hidden = hidden;
    this.states = states;
  }
}

export default StatefulButton;