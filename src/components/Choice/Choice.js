import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import useAccessibleFocus from 'hooks/useAccessibleFocus';
import selectors from 'selectors';
import classNames from 'classnames';
import useFocus from 'hooks/useFocus';
import useID from 'hooks/useID';
import Icon from 'components/Icon';
import './Choice.scss';
import PropTypes from 'prop-types';

const observable = (() => {
  const subscribers = [];

  return {
    subscribe(name, subscriber) {
      subscribers.forEach((s) => {
        if (s.name === name) {
          s.subscriber();
        }
      });

      subscribers.push({ name, subscriber });
      return () => {
        const index = subscribers.findIndex((s) => s.subscriber === subscriber);
        if (index > -1) {
          subscribers.splice(index, 1);
        }
      };
    },
  };
})();


const Choice = forwardRef(({
  label,
  leftLabel,
  className,
  children,
  id,
  radio,
  isSwitch,
  center,
  disabledLabelChange,
  onChange,
  onFocus,
  onBlur,
  checked: controlledChecked,
  disabled,
  name,
  dataElement,
  ...props
}, ref) => {
  const inputRef = useRef(null);
  const isUserTabbing = useAccessibleFocus();
  const { focused, handleOnFocus, handleOnBlur } = useFocus(onFocus, onBlur);
  const choiceID = useID(id);

  const [checked, setChecked] = useState(controlledChecked);
  const isDisabled = useSelector((state) => selectors.isElementDisabled(state, dataElement));

  useImperativeHandle(ref, () => inputRef.current);

  useEffect(() => {
    if (controlledChecked !== undefined) {
      setChecked(controlledChecked);
    }
  }, [controlledChecked]);

  const handleOnChange = (event) => {
    if (controlledChecked === undefined) {
      setChecked(event.target.checked);
    }
    onChange?.(event);
  };

  useEffect(() => {
    if (name && radio) {
      return observable.subscribe(name, () => {
        if (inputRef.current && inputRef.current.checked !== checked) {
          setChecked(inputRef.current.checked);
        }
      });
    }
  }, [checked, name, radio]);

  const choiceClass = classNames(
    'ui__base ui__choice',
    {
      'ui__choice--radio': radio,
      'ui__choice--leftLabel': leftLabel,
      'ui__choice--checked': checked,
      'ui__choice--center': center,
      'ui__choice--disabled': disabled,
    },
    className,
  );

  const inputClass = classNames('ui__choice__input', {
    'ui__choice__input--switch': isSwitch,
  });

  const checkClass = isSwitch
    ? classNames('ui__choice__input__switch', {
      'ui__choice__input__switch--checked': checked,
      'ui__choice__input__switch--disabled': disabled,
      'ui__choice__input__switch--focus': isUserTabbing && focused,
    })
    : classNames('ui__choice__input__check', {
      'ui__choice__input__check--checked': checked,
      'ui__choice__input__check--disabled': disabled,
      'ui__choice__input__check--focus': isUserTabbing && focused,
    });

  const labelClass = classNames('ui__choice__label', {
    'ui__choice__label--disabled': disabled && disabledLabelChange,
  });

  const labelElement = useMemo(() => {
    if (!label) {
      return null;
    }
    return (
      <label className={labelClass} htmlFor={choiceID}>
        {label}
      </label>
    );
  }, [label, labelClass, choiceID]);

  if (isDisabled) {
    return null;
  }

  return (
    <span className={choiceClass}>
      {leftLabel && labelElement}
      <span className={inputClass}>
        {isSwitch ? (
          <div className={checkClass}>
            <div className="ui__choice__input__toggle" />
          </div>
        ) : (
          <div className={checkClass}>
            {checked && !radio && <Icon glyph="icon-check" className="ui__choice__input__icon" />}
          </div>
        )}
        <input
          {...props}
          id={choiceID}
          type={radio ? 'radio' : 'checkbox'}
          ref={inputRef}
          checked={controlledChecked}
          disabled={disabled}
          name={name}
          onChange={handleOnChange}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
        >
          {children}
        </input>
      </span>
      {!leftLabel && labelElement}
    </span>
  );
});

Choice.displayName = 'Choice';

Choice.propTypes = {
  dataElement: PropTypes.string,
  label: PropTypes.node,
  leftLabel: PropTypes.bool,
  radio: PropTypes.bool,
  isSwitch: PropTypes.bool,
  center: PropTypes.bool,
  disabledLabelChange: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  children: PropTypes.node,
};

export default Choice;