import React, { useEffect, useRef, useState } from 'react';
import selectors from 'selectors';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import actions from 'actions';
import PropTypes from 'prop-types';
import './ToggleElementButton.scss';
import Button from 'components/Button';
import useFocusHandler from 'hooks/useFocusHandler';
import { isMobileSize } from 'helpers/getDeviceSize';
import classNames from 'classnames';

const ToggleElementButton = (props) => {
  const buttonRef = useRef();
  const isMobile = isMobileSize();
  const { dataElement, title, disabled, img, label, toggleElement, setFlyoutTriggerRef = null, onToggle, className } = props;

  const isActive = useSelector((state) => selectors.isElementOpen(state, toggleElement));
  const flyoutMap = useSelector(selectors.getFlyoutMap, shallowEqual);
  const isToggleElementDisabled = useSelector((state) => selectors.isElementDisabled(state, toggleElement));
  const isButtonDisabled = useSelector((state) => selectors.isElementDisabled(state, dataElement));
  const customizableUI = useSelector(selectors.getFeatureFlags)?.customizableUI;

  const [isElementActive, setIsElementActive] = useState(isActive);
  const [isElementDisabled, setIsElementDisabled] = useState(disabled);

  useEffect(() => {
    setIsElementActive(isActive);
    if (onToggle) {
      onToggle(isActive);
    }

  }, [isActive]);

  useEffect(() => {
    setIsElementDisabled(isToggleElementDisabled || disabled);
  }, [isToggleElementDisabled, disabled]);

  const dispatch = useDispatch();

  const onClick = (event) => {
    event.stopPropagation();
    if (flyoutMap[toggleElement]) {
      if (setFlyoutTriggerRef) {
        setFlyoutTriggerRef();
      } else {
        dispatch(actions.setFlyoutToggleElement(dataElement));
      }
    }
    dispatch(actions.toggleElement(toggleElement));
  };

  const onClickFocusWrapped = useFocusHandler(onClick);

  if (isButtonDisabled) {
    return null;
  }

  return (
    <div className={classNames({
      'ToggleElementButton': true,
      'legacy-ui': !customizableUI,
      'is-mobile': isMobile,
    })} ref={buttonRef}>
      <Button
        isActive={isElementActive}
        dataElement={dataElement}
        img={img}
        label={label}
        title={title}
        onClick={onClickFocusWrapped}
        disabled={isElementDisabled}
        className={className}
        ariaPressed={isElementActive}
        ariaExpanded={isElementActive}
        {...props}
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
  className: PropTypes.string,
  onToggle: PropTypes.func,
};

export default ToggleElementButton;
