import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import i18next from 'i18next';

import core from 'core';
import { isMobile } from 'helpers/device';
import removePage from 'helpers/removePage';
import actions from 'actions';
import selectors from 'selectors';
import ThumbnailControls from 'components/ThumbnailControls';

import './Thumbnail.scss';

class Thumbnail extends React.PureComponent {
  static propTypes = {
    index: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    pageLabels: PropTypes.array.isRequired,
    canLoad: PropTypes.bool.isRequired,
    onLoad: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    updateAnnotations: PropTypes.func,
    closeElement: PropTypes.func.isRequired,
    onDragStart: PropTypes.func,
    onDragOver: PropTypes.func,
    isDraggable: PropTypes.bool,
    removePage: PropTypes.func.isRequired,
    showWarningMessage: PropTypes.func.isRequired,
    isThumbnailControlDisabled: PropTypes.bool,
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

  onLayoutChanged(changes) {
    const { contentChanged, moved, added, removed } = changes;
    const { index } = this.props;

    const currentPage = index + 1;
    const currentPageStr = `${currentPage}`;

    const isPageAdded = added.indexOf(currentPage) > -1;
    const didPageChange = contentChanged.some(changedPage => currentPageStr === changedPage);
    const didPageMove = Object.keys(moved).some(movedPage => currentPageStr === movedPage);
    const isPageRemoved = removed.indexOf(currentPage) > -1;

    if (isPageAdded || didPageChange || didPageMove || isPageRemoved) {
      const { thumbContainer } = this;
      const { current } = thumbContainer;

      core.loadThumbnailAsync(index, thumb => {
        thumb.className = 'page-image';
        current.removeChild(current.querySelector('.page-image'));
        current.appendChild(thumb);
        if (this.props.updateAnnotations) {
          this.props.updateAnnotations(index);
        }
      });
    }
  }

  handleClick = () => {
    const { index, closeElement } = this.props;

    core.setCurrentPage(index + 1);

    if (isMobile()) {
      closeElement('leftPanel');
    }
  }

  handleDelete = () => {
    const { index, removePage, showWarningMessage } = this.props;

    const message = i18next.t('option.thumbnailPanel.deleteWarningMessage');
    const title = i18next.t('option.thumbnailPanel.deleteWarningTitle');
    const confirmBtnText = i18next.t('option.thumbnailPanel.deleteWarningConfirmText');

    const warning = {
      message,
      title,
      confirmBtnText,
      onConfirm: () => removePage(index + 1),
      keepOpen: ['leftPanel'],
    };
    showWarningMessage(warning);
  }

  onDragStart = e => {
    const { index, onDragStart } = this.props;
    onDragStart(e, index);
  }

  onDragOver = e => {
    const { index, onDragOver } = this.props;
    onDragOver(e, index);
  }

  render() {
    const { index, currentPage, pageLabels, isDraggable, isThumbnailControlDisabled } = this.props;
    const isActive = currentPage === index + 1;
    const pageLabel = pageLabels[index];

    return (
      <div className={`Thumbnail ${isActive ? 'active' : ''} `} onDragOver={this.onDragOver}>
        <div className="container" ref={this.thumbContainer} onClick={this.handleClick} onDragStart={this.onDragStart} draggable={isDraggable}></div>
        <div className="page-label">{pageLabel}</div>
        {isActive && !isThumbnailControlDisabled && <ThumbnailControls index={index} data-element="thumbnailControl" handleDelete={this.handleDelete} />}
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
  removePage: pageNumber => removePage(pageNumber),
  showWarningMessage: warning => actions.showWarningMessage(warning),
};

export default connect(mapStateToProps, mapDispatchToProps)(Thumbnail);
