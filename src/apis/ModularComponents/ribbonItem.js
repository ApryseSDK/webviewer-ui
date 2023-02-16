import Item from './item';

class RibbonItem extends Item {
  constructor(props) {
    const { isActive, label, img, toolbarGroup } = props;
    super(props);
    this.isActive = isActive;
    this.label = label;
    this.img = img;
    this.toolbarGroup = toolbarGroup;
  }
}

export default RibbonItem;