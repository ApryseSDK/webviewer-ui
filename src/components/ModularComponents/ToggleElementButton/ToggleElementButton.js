import React, { useRef } from 'react';
import selectors from 'selectors';
import { useSelector, useDispatch } from 'react-redux';
import actions from 'actions';
import PropTypes from 'prop-types';
import './ToggleElementButton.scss';
import Button from 'components/Button';
import { WIDTH_PLUS_PADDING } from 'constants/flyoutConstants';

const ToggleElementButton = (props) => {
  const buttonRef = useRef();
  const { dataElement, title, disabled, img, label, toggleElement } = props;
  const [isActive, flyoutMap] = useSelector((state) => [
    selectors.isElementOpen(state, toggleElement),
    selectors.getFlyoutMap(state),
  ]);

  const dispatch = useDispatch();

  const onClick = () => {
    if (flyoutMap[toggleElement]) {
      const appRect = document.getElementById('app').getBoundingClientRect();
      const buttonRect = buttonRef.current.getBoundingClientRect();
      let x = buttonRect.x - appRect.x;
      let y = buttonRect.y - appRect.y;
      const parentHeader = buttonRef.current.closest('.ModularHeader');
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
    if (isActive) {
      dispatch(actions.closeElement(toggleElement));
    } else {
      dispatch(actions.openElement(toggleElement));
    }
  };

  return (
    <div className="ToggleElementButton" data-element={dataElement} ref={buttonRef}>
      <Button
        isActive={isActive}
        dataElement={dataElement}
        img={img}
        label={label}
        title={title}
        onClick={onClick}
        disabled={disabled}
      >
      </Button>
    </div>
  );
};

ToggleElementButton.propTypes = {
  isActive: PropTypes.bool,
  closeElement: PropTypes.func,
  openElement: PropTypes.func,
};

export default ToggleElementButton;
