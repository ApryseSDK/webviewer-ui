import React from 'react';
import PropTypes from 'prop-types';

import './OverlayItem.scss';

class OverlayItem extends React.PureComponent {
  static propTypes = {
    onClick: PropTypes.func,
    buttonName: PropTypes.string,
    willFocus: PropTypes.bool
  }
  containerRef = React.createRef();

  componentDidMount() {
    if (this.props.willFocus) {
      this.focus();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.willFocus && (this.props.willFocus !== prevProps.willFocus)) {
      this.focus();
    }
  }

  focus() {
    if (this.containerRef) {
      this.containerRef.current.focus();
    }
  }

  onKeyPress = e => {
    if (e.nativeEvent.key === 'Enter' || e.nativeEvent.code === 'Space') {
      this.props.onClick(e);
    }
  }

  render() {
    const { buttonName } = this.props;
    return (
      <div
        tabIndex={0}
        role="button"
        className="OverlayItem"
        onClick={this.props.onClick}
        onKeyPress={this.onKeyPress}
        ref={this.containerRef}
      >
        <div className="ButtonText">
          { buttonName }
        </div>
      </div>
    );
  }
}

export default OverlayItem;
