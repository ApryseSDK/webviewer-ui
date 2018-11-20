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
    index: PropTypes.number.isRequired,
    currentPage: PropTypes.number,
    canLoad: PropTypes.bool.isRequired,
    onLoad: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    closeElement: PropTypes.func.isRequired,
    customContentRenderer: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.thumbContainer = React.createRef();
  }

  componentDidMount() {
    const { onLoad, index } = this.props;

    onLoad(index, this.thumbContainer.current);
  }

  componentDidUpdate(prevProps) {
    const { onLoad, onCancel, index } = this.props;

    if (!prevProps.canLoad && this.props.canLoad) {
      onLoad(index, this.thumbContainer.current);
    } 
    if (prevProps.canLoad && !this.props.canLoad) {
      onCancel(index);
    }
  }

  componentWillUnmount() {
    const { onRemove, index } = this.props;
    
    onRemove(index);
  }

  handleClick = () => {
    const { index, closeElement} = this.props;

    core.setCurrentPage(index + 1);

    if (isMobile()) {
      closeElement('leftPanel');
    }
  }

  render() {
    const { index, currentPage, customContentRenderer } = this.props;
    const isActive = currentPage === index + 1;

    return (
      <div className={`Thumbnail ${isActive ? 'active' : ''}`}>
        <div className="container" ref={this.thumbContainer} onClick={this.handleClick}></div>
        <div className="page-number">{index + 1}</div>
        { customContentRenderer &&
        <div className="customContent">
          {customContentRenderer(index, React)}
        </div>
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentPage: selectors.getCurrentPage(state),
  customContentRenderer: selectors.getThumbnailCustomContentRenderer(state)
});

const mapDispatchToProps = {
  closeElement: actions.closeElement
};

export default connect(mapStateToProps, mapDispatchToProps)(Thumbnail);