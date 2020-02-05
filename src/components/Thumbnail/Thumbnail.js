import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import core from 'core';
import { isMobile } from 'helpers/device';
import actions from 'actions';
import selectors from 'selectors';
import ThumbnailControls from 'components/ThumbnailControls';

import './Thumbnail.scss';

export const THUMBNAIL_SIZE = 150;

class Thumbnail extends React.PureComponent {
  static propTypes = {
    index: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    pageLabels: PropTypes.array.isRequired,
    canLoad: PropTypes.bool.isRequired,
    isSelected: PropTypes.bool,
    isThumbnailMultiselectEnabled: PropTypes.bool,
    onLoad: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    updateAnnotations: PropTypes.func,
    closeElement: PropTypes.func.isRequired,
    onDragStart: PropTypes.func,
    onDragOver: PropTypes.func,
    setSelectedPageThumbnails: PropTypes.func,
    selectedPageIndexes: PropTypes.arrayOf(PropTypes.number),
    isDraggable: PropTypes.bool,
  };

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
    const { index, pageLabels } = this.props;

    const currentPage = index + 1;
    const currentPageStr = `${currentPage}`;

    const isPageAdded = added.indexOf(currentPage) > -1;
    const didPageChange = contentChanged.some(
      changedPage => currentPageStr === changedPage,
    );
    const didPageMove = Object.keys(moved).some(
      movedPage => currentPageStr === movedPage,
    );
    const isPageRemoved = removed.indexOf(currentPage) > -1;
    const newPageCount = pageLabels.length - removed.length;

    if (removed.length > 0 && index + 1 > newPageCount) {
      // don't load thumbnail if it's going to be removed
      return;
    }

    if (isPageAdded || didPageChange || didPageMove || isPageRemoved) {
      const { thumbContainer } = this;
      const { current } = thumbContainer;

      core.loadThumbnailAsync(index, thumb => {
        const currentThumbnail = current?.querySelector('.page-image');
        if (currentThumbnail) {
          current.removeChild(currentThumbnail);
        }

        thumb.className = 'page-image';
        thumb.style.maxWidth = `${THUMBNAIL_SIZE}px`;
        thumb.style.maxHeight = `${THUMBNAIL_SIZE}px`;

        current.appendChild(thumb);
        if (this.props.updateAnnotations) {
          this.props.updateAnnotations(index);
        }
      });
    }
  }

  handleClick = e => {
    const { index, closeElement, selectedPageIndexes, setSelectedPageThumbnails, isThumbnailMultiselectEnabled } = this.props;

    if (isThumbnailMultiselectEnabled && (e.ctrlKey || e.metaKey)) {
      let updatedSelectedPages = [...selectedPageIndexes];
      if (selectedPageIndexes.indexOf(index) > -1) {
        updatedSelectedPages = selectedPageIndexes.filter(pageIndex => index !== pageIndex);
      } else {
        updatedSelectedPages.push(index);
      }

      setSelectedPageThumbnails(updatedSelectedPages);
    } else if (isMobile()) {
      closeElement('leftPanel');
    }

    core.setCurrentPage(index + 1);
  };

  onDragStart = e => {
    const { index, onDragStart } = this.props;
    onDragStart(e, index);
  };

  onDragOver = e => {
    const { index, onDragOver } = this.props;
    onDragOver(e, index);
  };

  render() {
    const { index, currentPage, pageLabels, isDraggable, isSelected } = this.props;
    const isActive = currentPage === index + 1;
    const pageLabel = pageLabels[index];

    return (
      <div
        className={classNames({
          Thumbnail: true,
          active: isActive,
          selected: isSelected,
        })}
        onClick={this.handleClick}
        onDragOver={this.onDragOver}
      >
        <div
          className="container"
          style={{
            width: THUMBNAIL_SIZE,
            height: THUMBNAIL_SIZE,
          }}

          onDragStart={this.onDragStart}
          draggable={isDraggable}
        >
          <div ref={this.thumbContainer} className="thumbnail" />
        </div>
        <div className="page-label">{pageLabel}</div>
        {isActive && <ThumbnailControls index={index} />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentPage: selectors.getCurrentPage(state),
  pageLabels: selectors.getPageLabels(state),
  selectedPageIndexes: selectors.getSelectedThumbnailPageIndexes(state),
  isThumbnailMultiselectEnabled: selectors.getIsThumbnailMultiselectEnabled(state),
});

const mapDispatchToProps = {
  closeElement: actions.closeElement,
  setSelectedPageThumbnails: actions.setSelectedPageThumbnails,
};

export default connect(mapStateToProps, mapDispatchToProps)(Thumbnail);
