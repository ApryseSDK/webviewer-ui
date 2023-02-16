import Item from './item';

class CustomButton extends Item {
  constructor(props) {
    const { isActive, label, img, onClick } = props;
    super(props);
    this.isActive = isActive;
    this.label = label;
    this.img = img;
    this.onClick = onClick;
  }
}

export default CustomButton;