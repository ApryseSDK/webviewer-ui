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
  const [
    isActive,
    flyoutMap,
    isToggleElementDisabled,
    isButtonDisabled,
  ] = useSelector((state) => [
    selectors.isElementOpen(state, toggleElement),
    selectors.getFlyoutMap(state),
    selectors.isElementDisabled(state, toggleElement),
    selectors.isElementDisabled(state, dataElement),
  ]);

  const [isElementActive, setIsElementActive] = useState(isActive);
  const [isElementDisabled, setIsElementDisabled] = useState(disabled);

  useEffect(() => {
    setIsElementActive(isActive);
  }, [isActive]);

  useEffect(() => {
    setIsElementDisabled(isToggleElementDisabled);
  }, [isToggleElementDisabled]);

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

  if (isButtonDisabled) {
    return null;
  }

  return (
    <div className="ToggleElementButton" data-element={dataElement} ref={buttonRef}>
      <Button
        isActive={isElementActive}
        dataElement={dataElement}
        img={img}
        label={label}
        title={title}
        onClick={onClick}
        disabled={isElementDisabled}
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
