import React, { useEffect, useRef, useState } from 'react';
import selectors from 'selectors';
import { useSelector, useDispatch } from 'react-redux';
import actions from 'actions';
import PropTypes from 'prop-types';
import './ToggleElementButton.scss';
import Button from 'components/Button';

const ToggleElementButton = (props) => {
  const buttonRef = useRef();
  const { dataElement, title, disabled, img, label, toggleElement, setFlyoutTriggerRef = null } = props;
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
      if (setFlyoutTriggerRef) {
        setFlyoutTriggerRef();
      } else {
        dispatch(actions.setFlyoutToggleElement(dataElement));
      }
    }
    dispatch(actions.toggleElement(toggleElement));
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
  dataElement: PropTypes.string.isRequired,
  title: PropTypes.string,
  disabled: PropTypes.bool,
  img: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  toggleElement: PropTypes.string.isRequired,
  setFlyoutTriggerRef: PropTypes.func,
};

export default ToggleElementButton;
