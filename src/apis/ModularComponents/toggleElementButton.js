import Item from './item';

class ToggleElementButton extends Item {
  constructor(props) {
    const { isActive, label, img, toggleElement } = props;
    super(props);
    this.isActive = isActive;
    this.label = label;
    this.img = img;
    this.toggleElement = toggleElement;
    this.isActive = isActive;
  }
}

export default ToggleElementButton;