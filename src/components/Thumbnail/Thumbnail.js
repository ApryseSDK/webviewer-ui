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
    pageLabels: PropTypes.array.isRequired,
    canLoad: PropTypes.bool.isRequired,
    onLoad: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    updateAnnotations: PropTypes.func,
    closeElement: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.thumbContainer = React.createRef();
    this.onLayoutChangedHandler = this.onLayoutChanged.bind(this);
  }

  componentDidMount() {
    const { onLoad, index } = this.props;

    onLoad(index, this.thumbContainer.current);
    core.addEventListener('layoutChanged', this.onLayoutChangedHandler);
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
    core.removeEventListener('layoutChanged', this.onLayoutChangedHandler);
    onRemove(index);
  }

  onLayoutChanged(e, changes) {
    const { contentChanged } = changes;
    const { index } = this.props;

    const currentPage = index + 1;
    const didLayoutChange = contentChanged.some(changedPage => currentPage + '' === changedPage);

    if(didLayoutChange) {
      const { thumbContainer } = this;
      const { current } = thumbContainer;

      core.loadThumbnailAsync(index, thumb => {
        thumb.className = 'page-image';
        current.removeChild(current.querySelector('.page-image'));
        current.appendChild(thumb);
        if (this.props.updateAnnotations) {
          this.props.updateAnnotations(index, thumb);
        }
      });
    }
  }

  handleClick = () => {
    const { index, closeElement} = this.props;

    core.setCurrentPage(index + 1);

    if (isMobile()) {
      closeElement('leftPanel');
    }
  }

  render() {
    const { index, currentPage, pageLabels } = this.props;
    const isActive = currentPage === index + 1;
    const pageLabel = pageLabels[index];

    return (
      <div className={`Thumbnail ${isActive ? 'active' : ''}`}>
        <div className="container" ref={this.thumbContainer} onClick={this.handleClick}></div>
        <div className="page-label">{pageLabel}</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentPage: selectors.getCurrentPage(state),
  pageLabels: selectors.getPageLabels(state)
});

const mapDispatchToProps = {
  closeElement: actions.closeElement
};

export default connect(mapStateToProps, mapDispatchToProps)(Thumbnail);