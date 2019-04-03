import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import core from 'core';
import { isMobile } from 'helpers/device';
import actions from 'actions';
import selectors from 'selectors';

import './Thumbnail.scss';

class Thumbnail extends React.PureComponent {
  static propTypes = {
    currentPage: PropTypes.number,
    pageLabels: PropTypes.array.isRequired,
    canLoad: PropTypes.bool.isRequired,
    onLoad: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    closeElement: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    willFocus: PropTypes.bool.isRequired,
    setLeftPanelIndex: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.thumbContainer = React.createRef();
  }

  componentDidMount() {
    const { onLoad, index, willFocus } = this.props;

    onLoad(index, this.thumbContainer.current);
    if (willFocus) {
      this.focus();
    }
  }

  componentDidUpdate(prevProps) {
    const { onLoad, onCancel, index, willFocus } = this.props;

    if (!prevProps.canLoad && this.props.canLoad) {
      onLoad(index, this.thumbContainer.current);
    }
    if (prevProps.canLoad && !this.props.canLoad) {
      onCancel(index);
    }
    if (willFocus && (willFocus !== prevProps.willFocus)) {
      this.focus();
    }
  }

  componentWillUnmount() {
    const { onRemove, index } = this.props;

    onRemove(index);
  }

  focus = () => {
    this.thumbContainer.current.focus();
  }

  handleClick = () => {
    const { index, closeElement} = this.props;

    core.setCurrentPage(index + 1);

    if (isMobile()) {
      closeElement('leftPanel');
    }
  }

  onKeyPress = e => {
    if (e.nativeEvent.key === 'Enter' || e.nativeEvent.keyCode === 13) {
      this.handleClick();
    }
  }

  render() {
    const { index, currentPage, pageLabels, setLeftPanelIndex } = this.props;
    const isActive = currentPage === index + 1;
    const pageLabel = pageLabels[index];

    return (
      <div className={`Thumbnail ${isActive ? 'active' : ''}`}>
        <div
          tabIndex={-1}
          className="container"
          ref={this.thumbContainer}
          onClick={this.handleClick}
          onKeyPress={this.onKeyPress}
          onFocus={() => {
            setLeftPanelIndex('thumbnailsPanel', index);
          }}
        />
        <div className="page-label">{pageLabel}</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentPage: selectors.getCurrentPage(state),
  pageLabels: selectors.getPageLabels(state),
});

const mapDispatchToProps = {
  closeElement: actions.closeElement,
  setLeftPanelIndex: actions.setLeftPanelIndex,
};

export default connect(mapStateToProps, mapDispatchToProps)(Thumbnail);
