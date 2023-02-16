import { ITEM_TYPE } from 'constants/customizationVariables';

export default () => (props) => {
  props.type = ITEM_TYPE.GROUPED_ITEMS;

  return {
    props
  };
};