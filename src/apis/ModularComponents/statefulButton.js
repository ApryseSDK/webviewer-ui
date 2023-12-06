import { ITEM_TYPE } from 'src/constants/customizationVariables';
import Item from './item';

const { checkTypes, TYPES } = window.Core;

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
    this.dataElement = dataElement;
    this.title = title;
    this.hidden = hidden;
    this.states = states;
  }
}

export default StatefulButton;