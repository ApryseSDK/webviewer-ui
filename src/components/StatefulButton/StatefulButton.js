import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Button from 'components/Button';

import selectors from 'selectors';

class StatefulButton extends React.PureComponent {
  static propTypes = {
    mount: PropTypes.func.isRequired,
    unmount: PropTypes.func,
    states: PropTypes.shape({
      activeState: PropTypes.shape({
        img: PropTypes.string,
        label: PropTypes.string,
        onClick: PropTypes.func.isRequired,
        title: PropTypes.string.isRequired,
        getContent: PropTypes.func.isRequired
      }),
      AnotherState: PropTypes.shape({
        img: PropTypes.string,
        label: PropTypes.string,
        onClick: PropTypes.func.isRequired,
        title: PropTypes.string.isRequired,
        getContent: PropTypes.func.isRequired
      })
    })
  }

  constructor(props) {
    super(props);
    this.state = {
      activeState: props.mount(this.update)
    };
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
        activeState: newState
      });
    } else {
      this.forceUpdate();
    }
  }

  onClick = e => {
    e.stopPropagation();

    const { activeState } = this.state;
    this.props.states[activeState].onClick(this.update, this.props.states[activeState]);
  }

  render() {
    const { activeState } = this.state;
    const { title, img, getContent } = this.props.states[activeState];
    const content = getContent ? getContent(this.props.states[activeState]) : '';

    return (
      <Button {...this.props} title={title} img={img} label={content} onClick={this.onClick} />
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  className: 'StatefulButton',
  isDisabled: selectors.isElementDisabled(state, ownProps.dataElement),
});

export default connect(mapStateToProps)(StatefulButton);