import React, { useEffect, forwardRef } from 'react';
import '../../Button/Button.scss';
import './StatefulButton.scss';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import FlyoutItemContainer from '../FlyoutItemContainer';
import { getIconDOMElement } from 'helpers/itemToFlyoutHelper';

const StatefulButton = forwardRef((props, ref) => {
  const { dataElement, disabled, mount, unmount, states, style, className, isFlyoutItem = false } = props;
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const [activeState, setActiveState] = React.useState(props.initialState);

  useEffect(() => {
    if (mount) {
      mount(update);
    }
    return function() {
      if (unmount) {
        unmount();
      }
    };
  });

  const update = (newState) => {
    if (newState) {
      setActiveState(newState);
    } else {
      forceUpdate();
    }
  };

  const onClick = () => {
    const { dispatch } = props;

    states[activeState].onClick(
      update,
      states[activeState],
      dispatch,
    );
  };

  const { title, img, getContent, isActive } = states[activeState];
  const content = getContent ? getContent(states[activeState]) : '';
  const buttonClasses = [
    'StatefulButton',
    states[activeState].className ? states[activeState].className : '',
    [className],
  ].join(' ').trim();

  const flyoutOnClick = (...args) => (e) => {
    onClick();
    props?.onClickHandler?.(...args)(e);
  };

  return isFlyoutItem ? (
    <FlyoutItemContainer
      {...props}
      ref={ref}
      label={content || title}
      additionalClass={isActive && isActive(props.flyoutItem) ? 'active' : ''}
      icon={getIconDOMElement({ icon: img }, props.items)}
      onClickHandler={flyoutOnClick}
      title={title}
      dataElement={dataElement}
      disabled={disabled}
    />
  ) : (
    <Button
      className={classNames({
        'CustomButton': true,
        'Button': true,
        [buttonClasses]: true,
      })}
      isActive={isActive && isActive(props)}
      img={img}
      label={content}
      title={title}
      dataElement={dataElement}
      onClick={onClick}
      disabled={disabled}
      style={style}
    ></Button>
  );
});

StatefulButton.propTypes = {
  dataElement: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  isFlyoutItem: PropTypes.bool,
  onClickHandler: PropTypes.func,
  flyoutItem: PropTypes.object,
  items: PropTypes.array,
  initialState: PropTypes.string.isRequired,
  mount: PropTypes.func.isRequired,
  unmount: PropTypes.func,
  style: PropTypes.object,
  className: PropTypes.string,
  states: PropTypes.shape({
    activeState: PropTypes.shape({
      img: PropTypes.string,
      label: PropTypes.string,
      onClick: PropTypes.func.isRequired,
      title: PropTypes.string.isRequired,
      getContent: PropTypes.func.isRequired,
    }),
    AnotherState: PropTypes.shape({
      img: PropTypes.string,
      label: PropTypes.string,
      onClick: PropTypes.func.isRequired,
      title: PropTypes.string.isRequired,
      getContent: PropTypes.func.isRequired,
    }),
  }),
};

StatefulButton.displayName = 'StatefulButton';

export default React.memo(StatefulButton);
