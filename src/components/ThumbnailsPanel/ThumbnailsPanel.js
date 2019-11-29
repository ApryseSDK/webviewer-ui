import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List } from 'react-virtualized';
import Measure from 'react-measure';
import Thumbnail from 'components/Thumbnail';

import core from 'core';
import selectors from 'selectors';
import actions from 'actions';

import './ThumbnailsPanel.scss';

class ThumbnailsPanel extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    totalPages: PropTypes.number,
    display: PropTypes.string.isRequired,
    currentPage: PropTypes.number,
    isThumbnailMergingEnabled: PropTypes.bool,
    isThumbnailReorderingEnabled: PropTypes.bool,
    dispatch: PropTypes.func,
  }

  constructor() {
    super();
    this.pendingThumbs = [];
    this.thumbs = [];
    this.listRef = React.createRef();
    this.thumbnailHeight = 180; // refer to Thumbnail.scss
    this.afterMovePageNumber = null;
    this.state = {
      numberOfColumns: this.getNumberOfColumns(),
      canLoad: true,
      height: 0,
      width: 0,
      draggingOverPageIndex: null,
      isDraggingOverTopHalf: false,
    };
  }

  componentDidMount() {
    core.addEventListener('beginRendering', this.onBeginRendering);
    core.addEventListener('finishedRendering', this.onFinishedRendering);
    core.addEventListener('annotationChanged', this.onAnnotationChanged);
    core.addEventListener('pageNumberUpdated', this.onPageNumberUpdated);
    core.addEventListener('pageComplete', this.onPageComplete);
    core.addEventListener('annotationHidden', this.onAnnotationChanged);
    window.addEventListener('resize', this.onWindowResize);
  }

  componentWillUnmount() {
    core.removeEventListener('beginRendering', this.onBeginRendering);
    core.removeEventListener('finishedRendering', this.onFinishedRendering);
    core.removeEventListener('annotationChanged', this.onAnnotationChanged);
    core.removeEventListener('pageNumberUpdated', this.onPageNumberUpdated);
    core.removeEventListener('pageComplete', this.onPageComplete);
    core.removeEventListener('annotationHidden', this.onAnnotationChanged);
    window.removeEventListener('resize', this.onWindowResize);
  }

  onBeginRendering = () => {
    this.setState({
      canLoad: false,
    });
  }

  onDragEnd = () => {
    const { currentPage } = this.props;
    const { draggingOverPageIndex, isDraggingOverTopHalf } = this.state;
    if (draggingOverPageIndex !== null) {
      const targetPageNumber = isDraggingOverTopHalf ? draggingOverPageIndex + 1 : draggingOverPageIndex + 2;
      let afterMovePageNumber = null;

      if (currentPage < targetPageNumber) {
        // moving page down so target page number will decrease
        afterMovePageNumber = targetPageNumber - 1;
      } else {
        // moving page up
        afterMovePageNumber = targetPageNumber;
      }

      this.afterMovePageNumber = afterMovePageNumber;
      core.movePages([currentPage], targetPageNumber);
    }

    this.setState({ draggingOverPageIndex: null });
  }

  onPageComplete = () => {
    if (this.afterMovePageNumber) {
      core.setCurrentPage(this.afterMovePageNumber);
      this.afterMovePageNumber = null;
    }
  }

  onDragOver = (e, index) => {
    // 'preventDefault' to prevent opening pdf dropped in and 'stopPropagation' to keep parent from opening pdf
    e.preventDefault();
    e.stopPropagation();

    const { isThumbnailReorderingEnabled, isThumbnailMergingEnabled } = this.props;

    if (!isThumbnailReorderingEnabled && !isThumbnailMergingEnabled) {
      return;
    }

    const thumbnail = e.target.getBoundingClientRect();

    this.setState({
      draggingOverPageIndex: index,
      isDraggingOverTopHalf: !(e.pageY > (thumbnail.y + thumbnail.height / 2)),
    });
  }

  onDragStart = (e, index) => {
    const { currentPage } = this.props;

    // need to set 'text' to empty for drag to work in FireFox and mobile
    e.dataTransfer.setData('text', '');

    if (currentPage !== (index + 1)) {
      core.setCurrentPage(index + 1);
    }
  }

  onDrop = e => {
    e.preventDefault();
    const { isThumbnailMergingEnabled, dispatch } = this.props;
    const { draggingOverPageIndex, isDraggingOverTopHalf } = this.state;
    const { files } = e.dataTransfer;

    if (isThumbnailMergingEnabled && files.length) {
      const file = files[0];
      const insertTo = isDraggingOverTopHalf ? draggingOverPageIndex + 1 : draggingOverPageIndex + 2;

      dispatch(actions.openElement('loadingModal'));

      core.mergeDocument(file, insertTo).then(() => {
        dispatch(actions.closeElement('loadingModal'));
        core.setCurrentPage(insertTo);
      }).catch(() => {
        dispatch(actions.closeElement('loadingModal'));
      });

      this.setState({ draggingOverPageIndex: null });
    }
  }

  onFinishedRendering = needsMoreRendering => {
    if (!needsMoreRendering) {
      this.setState({
        canLoad: true,
      });
    }
  }

  onAnnotationChanged = annots => {
    const indices = [];

    annots.forEach(annot => {
      const pageIndex = annot.PageNumber - 1;
      if (!annot.Listable || indices.indexOf(pageIndex) > -1) {
        return;
      }
      indices.push(pageIndex);

      this.updateAnnotations(pageIndex);
    });
  }

  onPageNumberUpdated = pageNumber => {
    this.listRef.current?.scrollToRow(pageNumber - 1);
  }

  onWindowResize = () => {
    this.setState({
      numberOfColumns: this.getNumberOfColumns(),
    });
  }

  getNumberOfColumns = () => {
    const thumbnailContainerSize = 180;
    const desktopBreakPoint = 640;
    const { innerWidth } = window;
    let numberOfColumns;

    if (innerWidth >= desktopBreakPoint) {
      numberOfColumns = 1;
    } else if (innerWidth >= 3 * thumbnailContainerSize) {
      numberOfColumns = 3;
    } else if (innerWidth >= 2 * thumbnailContainerSize) {
      numberOfColumns = 2;
    } else {
      numberOfColumns = 1;
    }

    return numberOfColumns;
  }

  updateAnnotations = pageIndex => {
    const thumbContainer = this.thumbs[pageIndex] && this.thumbs[pageIndex].element;
    if (!thumbContainer) {
      return;
    }

    const pageWidth = core.getPageWidth(pageIndex);
    const pageHeight = core.getPageHeight(pageIndex);
    const pageNumber = pageIndex + 1;

    const { width, height } = this.getThumbnailSize(pageWidth, pageHeight);

    const annotCanvas = thumbContainer.querySelector('.annotation-image') || document.createElement('canvas');
    annotCanvas.className = 'annotation-image';
    const ctx = annotCanvas.getContext('2d');

    let zoom = 1;
    let rotation = core.getCompleteRotation(pageNumber) - core.getRotation(pageNumber);
    if (rotation < 0) {
      rotation += 4;
    }
    const multiplier = window.utils.getCanvasMultiplier();

    if (rotation % 2 === 0) {
      annotCanvas.width = width;
      annotCanvas.height = height;
      zoom = annotCanvas.width / pageWidth;
      zoom /= multiplier;
    } else {
      annotCanvas.width = height;
      annotCanvas.height = width;

      zoom = annotCanvas.height / pageWidth;
      zoom /= multiplier;
    }

    thumbContainer.appendChild(annotCanvas);
    core.setAnnotationCanvasTransform(ctx, zoom, rotation);

    let options = {
      pageNumber,
      overrideCanvas: annotCanvas,
      namespace: 'thumbnails',
    };

    var thumb = thumbContainer.querySelector('.page-image');

    if (thumb) {
      options = {
        ...options,
        overridePageRotation: rotation,
        overridePageCanvas: thumb,
      };
    } else {
      return;
    }

    core.drawAnnotations(options);
  }

  getThumbnailSize = (pageWidth, pageHeight) => {
    let width; let height; let
      ratio;

    if (pageWidth > pageHeight) {
      ratio = pageWidth / 150;
      width = 150;
      height = Math.round(pageHeight / ratio);
    } else {
      ratio = pageHeight / 150;
      width = Math.round(pageWidth / ratio); // Chrome has trouble displaying borders of non integer width canvases.
      height = 150;
    }

    return {
      width,
      height,
    };
  }

  onLoad = (pageIndex, element) => {
    if (!this.thumbIsLoaded(pageIndex) && !this.thumbIsPending(pageIndex)) {
      this.thumbs[pageIndex] = {
        element,
        loaded: false,
      };

      const id = core.loadThumbnailAsync(pageIndex, thumb => {
        thumb.className = 'page-image';
        if (this.thumbs[pageIndex]) {
          this.thumbs[pageIndex].element.appendChild(thumb);
          this.thumbs[pageIndex].loaded = true;
          this.thumbs[pageIndex].updateAnnotationHandler = this.updateAnnotations.bind(this);
          this.removeFromPendingThumbs(pageIndex);
          this.updateAnnotations(pageIndex);
        }
      });

      this.pendingThumbs.push({
        pageIndex,
        id,
      });
    }
  }

  removeFromPendingThumbs = pageIndex => {
    const index = this.getPendingThumbIndex(pageIndex);
    if (index !== -1) {
      this.pendingThumbs.splice(index, 1);
    }
  }

  thumbIsLoaded = pageIndex => this.thumbs[pageIndex]?.loaded

  thumbIsPending = pageIndex => this.getPendingThumbIndex(pageIndex) !== -1

  onCancel = pageIndex => {
    const index = this.getPendingThumbIndex(pageIndex);
    if (index !== -1) {
      core.cancelLoadThumbnail(this.pendingThumbs[index].id);
      this.pendingThumbs.splice(index, 1);
    }
  }

  getPendingThumbIndex = pageIndex => this.pendingThumbs.findIndex(thumbStatus => thumbStatus.pageIndex === pageIndex)

  onRemove = pageIndex => {
    this.onCancel(pageIndex);
    this.thumbs[pageIndex] = null;
  }

  renderThumbnails = ({ index, key, style }) => {
    const {
      numberOfColumns,
      canLoad,
      draggingOverPageIndex,
      isDraggingOverTopHalf,
    } = this.state;
    const { isThumbnailReorderingEnabled, isThumbnailMergingEnabled } = this.props;
    const { thumbs } = this;

    return (
      <div className="row" key={key} style={style}>
        {
          new Array(numberOfColumns).fill().map((_, columnIndex) => {
            const thumbIndex = index * numberOfColumns + columnIndex;
            const updateHandler = thumbs && thumbs[thumbIndex] ? thumbs[thumbIndex].updateAnnotationHandler : null;
            const showPlaceHolder = (isThumbnailMergingEnabled || isThumbnailReorderingEnabled) && draggingOverPageIndex === index;

            return (
              thumbIndex < this.props.totalPages
                ? <div key={thumbIndex} onDragEnd={this.onDragEnd}>
                  {showPlaceHolder && isDraggingOverTopHalf && <hr className="thumbnailPlaceholder" />}
                  <Thumbnail
                    isDraggable={isThumbnailReorderingEnabled}
                    index={thumbIndex}
                    canLoad={canLoad}
                    onLoad={this.onLoad}
                    onCancel={this.onCancel}
                    onRemove={this.onRemove}
                    onDragStart={this.onDragStart}
                    onDragOver={this.onDragOver}
                    updateAnnotations={updateHandler}
                  />
                  {showPlaceHolder && !isDraggingOverTopHalf && <hr className="thumbnailPlaceholder" />}
                </div>
                : null
            );
          })
        }
      </div>
    );
  }

  render() {
    const { isDisabled, totalPages, display } = this.props;
    const { numberOfColumns, height, width } = this.state;
    if (isDisabled) {
      return null;
    }

    return (
      <div
        className="Panel ThumbnailsPanel"
        style={{ display }}
        data-element="thumbnailsPanel"

        onDrop={this.onDrop}
      >
        <Measure
          bounds
          onResize={({ bounds }) => {
            this.setState({
              height: bounds.height,
              width: bounds.width,
            });
          }}
        >
          {({ measureRef }) => (
            <div ref={measureRef} className="virtualized-thumbnails-container" >
              <List
                ref={this.listRef}
                height={height}
                width={width}
                rowHeight={this.thumbnailHeight}
                // Round it to a whole number because React-Virtualized list library doesn't round it for us and throws errors when rendering non whole number rows
                // use ceiling rather than floor so that an extra row can be created in case the items can't be evenly distributed between rows
                rowCount={Math.ceil(totalPages / numberOfColumns)}
                rowRenderer={this.renderThumbnails}
                overscanRowCount={10}
                style={{ outline: 'none' }}
              />
            </div>
          )}
        </Measure>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch,
});

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'thumbnailsPanel'),
  totalPages: selectors.getTotalPages(state),
  currentPage: selectors.getCurrentPage(state),
  isThumbnailMergingEnabled: selectors.getIsThumbnailMergingEnabled(state),
  isThumbnailReorderingEnabled: selectors.getIsThumbnailReorderingEnabled(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(ThumbnailsPanel);