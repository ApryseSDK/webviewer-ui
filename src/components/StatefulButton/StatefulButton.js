import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Button from 'components/Button';

import selectors from 'selectors';

class StatefulButton extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    initialState: PropTypes.string.isRequired,
    mount: PropTypes.func.isRequired,
    unmount: PropTypes.func,
    didUpdate: PropTypes.func,
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

  constructor(props) {
    super(props);
    this.state = {
      activeState: this.props.initialState,
    };
  }

  componentDidMount() {
    const { mount } = this.props;
    if (mount) {
      mount(this.update);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { didUpdate, states } = this.props;
    if (didUpdate) {
      didUpdate(
        prevProps,
        this.props,
        states[prevState.activeState],
        states[this.state.activeState],
        this.update,
      );
    }
  }

  componentWillUnmount() {
    const { unmount } = this.props;
    if (unmount) {
      unmount();
    }
  }

  update = newState => {
    if (newState) {
      this.setState({
        activeState: newState,
      });
    } else {
      this.forceUpdate();
    }
  };

  onClick = () => {
    const { activeState } = this.state;
    const { states, dispatch } = this.props;

    this.props.states[activeState].onClick(
      this.update,
      states[activeState],
      dispatch,
    );
  };

  render() {
    const { activeState } = this.state;
    const { states } = this.props;
    const { title, img, getContent, isActive } = states[activeState];
    const content = getContent ? getContent(states[activeState]) : '';
    const className = [
      'StatefulButton',
      states[activeState].className ? states[activeState].className : '',
    ]
      .join(' ')
      .trim();

    return (
      <Button
        {...this.props}
        title={title}
        className={className}
        isActive={isActive && isActive(this.props)}
        img={img}
        label={content}
        onClick={this.onClick}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  isOpen: selectors.isElementOpen(state, ownProps.dataElement),
  openElements: selectors.getOpenElements(state),
});

export default connect(mapStateToProps)(StatefulButton);
