import React from 'react';
import PropTypes from 'prop-types';
import ReactList from 'react-list';
import { connect } from 'react-redux';

import Thumbnail from 'components/Thumbnail';

import core from 'core';
import selectors from 'selectors';

import './ThumbnailsPanel.scss';

class ThumbnailsPanel extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    totalPages: PropTypes.number,
    display: PropTypes.string.isRequired,
  }

  constructor() {
    super();
    this.pendingThumbs = [];
    this.thumbs = [];
    this.state = {
      numberOfColumns: this.getNumberOfColumns(),
      canLoad: true
    };
  }

  componentDidMount() {
    core.addEventListener('beginRendering', this.onBeginRendering);
    core.addEventListener('finishedRendering', this.onFinishedRendering);
    core.addEventListener('annotationChanged', this.onAnnotationChanged);
    window.addEventListener('resize', this.onWindowResize);
  }
  
  componentWillUnmount() {
    core.removeEventListener('beginRendering', this.onBeginRendering);
    core.removeEventListener('finishedRendering', this.onFinishedRendering);
    core.removeEventListener('annotationChanged', this.onAnnotationChanged);
    window.removeEventListener('resize', this.onWindowResize);
  }

  onBeginRendering = () => {
    this.setState({
      canLoad: false
    });
  }

  onFinishedRendering = (e, needsMoreRendering) => {
    if (!needsMoreRendering) {
      this.setState({
        canLoad: true
      });
    }
  }

  onAnnotationChanged = (e, annots) => {
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

  onWindowResize = () => {
    this.setState({
      numberOfColumns: this.getNumberOfColumns()
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

    let annotCanvas = thumbContainer.querySelector('.annotation-image') || document.createElement('canvas');
    annotCanvas.className = 'annotation-image';
    const ctx = annotCanvas.getContext('2d');

    let zoom = 1;
    let t = null;
    let rotation = core.getCompleteRotation(pageNumber) - core.getRotation(pageNumber);
    if (rotation < 0) {
      rotation += 4;
    }
    let multiplier = window.utils.getCanvasMultiplier();

    if (rotation % 2 === 0) {
      annotCanvas.width = width;
      annotCanvas.height = height;
      zoom = annotCanvas.width / pageWidth;
      zoom /= multiplier;
      t = window.GetPageMatrix(zoom, rotation, { width: annotCanvas.width, height: annotCanvas.height });

      if (rotation === 0) {
        ctx.setTransform(t.m_a, t.m_b, t.m_c, t.m_d, 0, 0);
      } else {
        ctx.setTransform(t.m_a, t.m_b, t.m_c, t.m_d, annotCanvas.width, annotCanvas.height);
      }
    } else {
      annotCanvas.width = height;
      annotCanvas.height = width;

      zoom = annotCanvas.height / pageWidth;
      zoom /= multiplier;

      t = window.GetPageMatrix(zoom, rotation, { width: annotCanvas.width, height: annotCanvas.height });

      if (rotation === 1) {
        ctx.setTransform(t.m_a, t.m_b, t.m_c, t.m_d, annotCanvas.width, 0);
      } else {
        ctx.setTransform(t.m_a, t.m_b, t.m_c, t.m_d, 0, annotCanvas.height);
      }
    }

    thumbContainer.appendChild(annotCanvas);

    core.drawAnnotations({
      pageNumber,
      overrideCanvas: annotCanvas,
      namespace: 'thumbnails'
    });
  }

  getThumbnailSize = (pageWidth, pageHeight) => {
    let width, height, ratio;

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
      height
    };
  }

  onLoad = (pageIndex, element) => {
    if (!this.thumbIsLoaded(pageIndex) && !this.thumbIsPending(pageIndex)) {
      this.thumbs[pageIndex] = {
        element,
        loaded: false
      };

      const id = core.loadThumbnailAsync(pageIndex, thumb => {
        thumb.className = 'page-image';
        if (this.thumbs[pageIndex]) {
          this.thumbs[pageIndex].element.appendChild(thumb);
          this.thumbs[pageIndex].loaded = true;
          this.removeFromPendingThumbs(pageIndex);
          this.updateAnnotations(pageIndex);
        }
      });

      this.pendingThumbs.push({
        pageIndex,
        id
      });
    }
  }

  removeFromPendingThumbs = pageIndex => {
    const index = this.getPendingThumbIndex(pageIndex);
    if (index !== -1) {
      this.pendingThumbs.splice(index, 1);
    }
  }

  thumbIsLoaded = pageIndex => {
    return this.thumbs[pageIndex] && this.thumbs[pageIndex].loaded;
  }

  thumbIsPending = pageIndex => {
    return this.getPendingThumbIndex(pageIndex) !== -1;
  }

  onCancel = pageIndex => {
    const index = this.getPendingThumbIndex(pageIndex);
    if (index !== -1) {
      core.cancelLoadThumbnail(this.pendingThumbs[index].id);
      this.pendingThumbs.splice(index, 1);
    }
  }

  getPendingThumbIndex = pageIndex => {
    return this.pendingThumbs.findIndex(thumbStatus => {
      return thumbStatus.pageIndex === pageIndex;
    });
  }

  onRemove = pageIndex => {
    this.onCancel(pageIndex);
    this.thumbs[pageIndex] = null;
  }

  renderThumbnails = rowIndex => {
    const { numberOfColumns, canLoad } = this.state;

    return (
      <div className="row" key={rowIndex}>
        {
          new Array(numberOfColumns).fill().map((_, columnIndex) => {
            const index = rowIndex * numberOfColumns + columnIndex;
            
            return (
              index < this.props.totalPages 
              ? <Thumbnail
                  key={index}
                  index={index}
                  canLoad={canLoad}
                  onLoad={this.onLoad}
                  onCancel={this.onCancel}
                  onRemove={this.onRemove}
                />
              : null
            );
          })
        }
      </div>
    );
  }

  render() {
    const { isDisabled, totalPages, display } = this.props;

    if (isDisabled) {
      return null;
    }

    return (
      <div className="Panel ThumbnailsPanel" style={{ display }} data-element="thumbnailsPanel">
        <div className="thumbs">
          <ReactList
            key="panel"
            itemRenderer={this.renderThumbnails}
            length={totalPages / this.state.numberOfColumns}
            type="uniform"
            useStaticSize
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'thumbnailsPanel'),
  totalPages: selectors.getTotalPages(state),
});

export default connect(mapStateToProps)(ThumbnailsPanel);