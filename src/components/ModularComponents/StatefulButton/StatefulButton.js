import React, { useEffect } from 'react';
import '../../Button/Button.scss';
import './StatefulButton.scss';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Button from 'components/Button';

const StatefulButton = (props) => {
  const { dataElement, disabled, mount, unmount, states } = props;
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
  const className = [
    'StatefulButton',
    states[activeState].className ? states[activeState].className : '',
  ].join(' ').trim();

  return (
    <Button
      className={classNames({
        'CustomButton': true,
        'Button': true,
        [className]: className
      })}
      isActive={isActive && isActive(props)}
      img={img}
      label={content}
      title={title}
      dataElement={dataElement}
      onClick={onClick}
      disabled={disabled}
    ></Button>
  );
};

StatefulButton.propTypes = {
  initialState: PropTypes.string.isRequired,
  mount: PropTypes.func.isRequired,
  unmount: PropTypes.func,
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

export default React.memo(StatefulButton);
