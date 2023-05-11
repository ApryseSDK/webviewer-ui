import { WIDTH_PLUS_PADDING } from 'constants/flyoutConstants';
import actions from 'actions';

export default function setFlyoutPositionOnElement(element, dispatch) {
  const appRect = document.getElementById('app').getBoundingClientRect();
  const buttonRect = element.getBoundingClientRect();
  let x = buttonRect.x - appRect.x;
  let y = buttonRect.y - appRect.y;
  const parentHeader = element.closest('.ModularHeader');
  if (parentHeader && parentHeader.classList.contains('LeftHeader')) {
    x += buttonRect.width;
  } else if (parentHeader && parentHeader.classList.contains('RightHeader')) {
    x -= WIDTH_PLUS_PADDING;
  } else if (parentHeader && parentHeader.classList.contains('TopHeader')) {
    y += buttonRect.height;
  } else if (parentHeader && parentHeader.classList.contains('BottomHeader')) {
    y -= buttonRect.height;
  }
  dispatch(actions.setFlyoutPosition({ x, y }));
}
