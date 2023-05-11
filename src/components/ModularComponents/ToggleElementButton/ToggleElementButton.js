import React, { useEffect, useRef, useState } from 'react';
import selectors from 'selectors';
import { useSelector, useDispatch } from 'react-redux';
import actions from 'actions';
import PropTypes from 'prop-types';
import './ToggleElementButton.scss';
import Button from 'components/Button';
import setFlyoutPositionOnElement from 'helpers/flyoutHelper';

const ToggleElementButton = (props) => {
  const buttonRef = useRef();
  const { dataElement, title, disabled, img, label, toggleElement, onFlyoutToggled = null } = props;
  const [isActive, flyoutMap] = useSelector((state) => [
    selectors.isElementOpen(state, toggleElement),
    selectors.getFlyoutMap(state),
  ]);

  const [isElementActive, setIsElementActive] = useState(isActive);

  useEffect(() => {
    setIsElementActive(isActive);
  }, [isActive]);

  const dispatch = useDispatch();

  const onClick = () => {
    if (flyoutMap[toggleElement]) {
      if (onFlyoutToggled) {
        onFlyoutToggled();
      } else {
        setFlyoutPositionOnElement(buttonRef.current, dispatch);
      }
    }
    if (isElementActive) {
      dispatch(actions.closeElement(toggleElement));
    } else {
      dispatch(actions.openElement(toggleElement));
    }
  };

  return (
    <div className="ToggleElementButton" data-element={dataElement} ref={buttonRef}>
      <Button
        isActive={isElementActive}
        dataElement={dataElement}
        img={img}
        label={label}
        title={title}
        onClick={onClick}
        disabled={disabled}
      >
        {props.children}
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
