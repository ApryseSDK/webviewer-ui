import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List } from 'react-virtualized';
import Measure from 'react-measure';
import classNames from 'classnames';

import Thumbnail, { THUMBNAIL_SIZE } from 'components/Thumbnail';
import DocumentControls from 'components/DocumentControls';

import core from 'core';
import selectors from 'selectors';
import actions from 'actions';

import './ThumbnailsPanel.scss';

class ThumbnailsPanel extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    totalPages: PropTypes.number,
    display: PropTypes.string.isRequired,
    selectedPageIndexes: PropTypes.arrayOf(PropTypes.number),
    setSelectedPageThumbnails: PropTypes.func.isRequired,
    currentPage: PropTypes.number,
    isThumbnailMergingEnabled: PropTypes.bool,
    isThumbnailReorderingEnabled: PropTypes.bool,
    dispatch: PropTypes.func,
    isThumbnailControlDisabled: PropTypes.bool,
  }

  constructor() {
    super();
    this.pendingThumbs = [];
    this.thumbs = [];
    this.listRef = React.createRef();
    this.afterMovePageNumber = null;
    this.state = {
      isDocumentControlHidden: true,
      canLoad: true,
      height: 0,
      width: 0,
      documentControlHeight: 0,
      draggingOverPageIndex: null,
      isDraggingToPreviousPage: false,
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
    const { currentPage, selectedPageIndexes, setSelectedPageThumbnails } = this.props;
    const { draggingOverPageIndex, isDraggingToPreviousPage } = this.state;
    if (draggingOverPageIndex !== null) {
      const targetPageNumber = isDraggingToPreviousPage ? draggingOverPageIndex + 1 : draggingOverPageIndex + 2;
      const pageNumberIncreased = currentPage < targetPageNumber;
      let afterMovePageNumber = null;

      if (pageNumberIncreased) {
        // moving page down so destination page number will decrease by 1 since that page been moved
        afterMovePageNumber = targetPageNumber - 1;
      } else {
        // moving page up
        afterMovePageNumber = targetPageNumber;
      }

      this.afterMovePageNumber = afterMovePageNumber;
      core.movePages([currentPage], targetPageNumber).then(() => {
        const currentPageIndex = currentPage - 1;
        const targetPageIndex = this.afterMovePageNumber - 1;

        // update selected pages affected by the move, exclude the page that was moved
        let updateSelectedPageIndexes = selectedPageIndexes.filter(pageIndex => pageIndex !== currentPageIndex);
        if (pageNumberIncreased) {
          updateSelectedPageIndexes = updateSelectedPageIndexes.map(p => (p > currentPageIndex && p <= targetPageIndex ? p - 1 : p));
        } else {
          updateSelectedPageIndexes = updateSelectedPageIndexes.map(p => (p < currentPageIndex && p >= targetPageIndex ? p + 1 : p));
        }

        if (selectedPageIndexes.includes(currentPageIndex)) {
          updateSelectedPageIndexes.push(targetPageIndex);
        }

        setSelectedPageThumbnails(updateSelectedPageIndexes);
      });
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

    const { numberOfColumns } = this.state;
    const { isThumbnailReorderingEnabled, isThumbnailMergingEnabled } = this.props;

    if (!isThumbnailReorderingEnabled && !isThumbnailMergingEnabled) {
      return;
    }

    const thumbnail = e.target.getBoundingClientRect();
    let isDraggingToPreviousPage = false;
    if (numberOfColumns > 1) {
    // row with more than 1 thumbnail so user are dragging to the left and right
      isDraggingToPreviousPage = !(e.pageX > (thumbnail.x + thumbnail.width / 2));
    } else {
      isDraggingToPreviousPage = !(e.pageY > (thumbnail.y + thumbnail.height / 2));
    }

    this.setState({
      draggingOverPageIndex: index,
      isDraggingToPreviousPage,
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
    const { draggingOverPageIndex, isDraggingToPreviousPage } = this.state;
    const { files } = e.dataTransfer;

    if (isThumbnailMergingEnabled && files.length) {
      const file = files[0];
      const insertTo = isDraggingToPreviousPage ? draggingOverPageIndex + 1 : draggingOverPageIndex + 2;

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
    const numberOfColumns = this.getNumberOfColumns();
    this.listRef.current?.scrollToRow(Math.round((pageNumber) / numberOfColumns) - 1);
  }

  getNumberOfColumns = () => {
    // const desktopBreakPoint = 640;
    // const { innerWidth } = window;
    // let numberOfColumns;

    // if (innerWidth >= desktopBreakPoint) {
    //   numberOfColumns = 1;
    // // TODO: use forwardRef to get the width of the thumbnail div instead of using the magic 20px
    // } else if (innerWidth >= 3 * (THUMBNAIL_SIZE + 20)) {
    //   numberOfColumns = 3;
    // } else if (innerWidth >= 2 * (THUMBNAIL_SIZE + 20)) {
    //   numberOfColumns = 2;
    // } else {
    //   numberOfColumns = 1;
    // }

    // return numberOfColumns;
    const numberOfColumns = Math.min(3, Math.max(1, Math.floor(this.state.width / 160)));
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
    annotCanvas.style.maxWidth = `${THUMBNAIL_SIZE}px`;
    annotCanvas.style.maxHeight = `${THUMBNAIL_SIZE}px`;
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
      ratio = pageWidth / THUMBNAIL_SIZE;
      width = THUMBNAIL_SIZE;
      height = Math.round(pageHeight / ratio);
    } else {
      ratio = pageHeight / THUMBNAIL_SIZE;
      width = Math.round(pageWidth / ratio); // Chrome has trouble displaying borders of non integer width canvases.
      height = THUMBNAIL_SIZE;
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
        thumb.style.maxWidth = `${THUMBNAIL_SIZE}px`;
        thumb.style.maxHeight = `${THUMBNAIL_SIZE}px`;

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
      canLoad,
      draggingOverPageIndex,
      isDraggingToPreviousPage,
    } = this.state;
    const { isThumbnailReorderingEnabled, isThumbnailMergingEnabled, selectedPageIndexes } = this.props;
    const { thumbs } = this;
    const numberOfColumns = this.getNumberOfColumns();
    const className = classNames({
      columnsOfThumbnails: (numberOfColumns > 1),
      row: true,
    });

    return (
      <div className={className} key={key} style={style}>
        {
          new Array(numberOfColumns).fill().map((_, columnIndex) => {
            const thumbIndex = index * numberOfColumns + columnIndex;
            const updateHandler = thumbs && thumbs[thumbIndex] ? thumbs[thumbIndex].updateAnnotationHandler : null;
            const showPlaceHolder = (isThumbnailMergingEnabled || isThumbnailReorderingEnabled) && draggingOverPageIndex === thumbIndex;

            return thumbIndex < this.props.totalPages ? (
              <div key={thumbIndex} onDragEnd={this.onDragEnd}>
                {showPlaceHolder && isDraggingToPreviousPage && (
                  <hr className="thumbnailPlaceholder" />
                )}
                <Thumbnail
                  isDraggable={isThumbnailReorderingEnabled}
                  isSelected={selectedPageIndexes.includes(thumbIndex)}
                  index={thumbIndex}
                  canLoad={canLoad}
                  onLoad={this.onLoad}
                  onCancel={this.onCancel}
                  onRemove={this.onRemove}
                  onDragStart={this.onDragStart}
                  onDragOver={this.onDragOver}
                  updateAnnotations={updateHandler}
                />
                {showPlaceHolder && !isDraggingToPreviousPage && (
                  <hr className="thumbnailPlaceholder" />
                )}
              </div>
            ) : null;
          })
        }
      </div>
    );
  }

  toggleDocumentControl = shouldShowControls => {
    this.props.setSelectedPageThumbnails([]);
    this.setState({
      isDocumentControlHidden: !shouldShowControls,
    });
  }

  render() {
    const { isDisabled, totalPages, display, isThumbnailControlDisabled, selectedPageIndexes } = this.props;
    const { height, width, documentControlHeight, isDocumentControlHidden } = this.state;
    const thumbnailHeight = isThumbnailControlDisabled ? 195 : 225;

    const shouldShowControls = !isDocumentControlHidden || selectedPageIndexes.length > 0;
    const numberOfColumns = this.getNumberOfColumns();

    return isDisabled ? null : (
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
            <div ref={measureRef} className="virtualized-thumbnails-container"
              style={{
                // when 'shouldShowControls' is true but documentControlHeight isn't set yet, add a maxHeight to keep the height from re-measuring
                maxHeight: shouldShowControls && !documentControlHeight ? height : null,
              }}
            >
              <List
                ref={this.listRef}
                height={shouldShowControls ? height - documentControlHeight : height}
                width={width}
                rowHeight={thumbnailHeight}
                // Round it to a whole number because React-Virtualized list library doesn't round it for us and throws errors when rendering non whole number rows
                // use ceiling rather than floor so that an extra row can be created in case the items can't be evenly distributed between rows
                rowCount={Math.ceil(totalPages / numberOfColumns)}
                rowRenderer={this.renderThumbnails}
                overscanRowCount={10}
                className={'thumbnailsList'}
                style={{ outline: 'none' }}
              />
              <Measure
                bounds
                onResize={({ bounds }) => {
                  this.setState({
                    documentControlHeight: Math.ceil(bounds.height),
                  });
                }}
              >
                {({ measureRef: innerMeasureRef }) => (
                  <div ref={innerMeasureRef}>
                    <DocumentControls
                      toggleDocumentControl={this.toggleDocumentControl}
                      shouldShowControls={shouldShowControls}
                    />
                  </div>
                )}
              </Measure>
            </div>
          )}
        </Measure>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch,
  setSelectedPageThumbnails: pages => dispatch(actions.setSelectedPageThumbnails(pages)),
  showWarningMessage: warning => dispatch(actions.showWarningMessage(warning)),
});

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'thumbnailsPanel'),
  totalPages: selectors.getTotalPages(state),
  currentPage: selectors.getCurrentPage(state),
  selectedPageIndexes: selectors.getSelectedThumbnailPageIndexes(state),
  isThumbnailMergingEnabled: selectors.getIsThumbnailMergingEnabled(state),
  isThumbnailReorderingEnabled: selectors.getIsThumbnailReorderingEnabled(state),
  isThumbnailControlDisabled: selectors.isElementDisabled(state, 'thumbnailControl'),
});

export default connect(mapStateToProps, mapDispatchToProps)(ThumbnailsPanel);
