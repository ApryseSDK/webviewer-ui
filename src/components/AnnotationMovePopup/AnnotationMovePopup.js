import { debounce } from 'lodash';
import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import PropTypes from 'prop-types';

import Thumbnail from 'components/Thumbnail';

import core from 'core';
import actions from 'actions';
import selectors from 'selectors';

import './AnnotationMovePopup.scss';

const AnnotationMovePopup = props => {
  const [isDisabled, totalPages, currentPage] = useSelector(
    state => [
      selectors.isElementDisabled(state, 'thumbnailsPanel'),
      selectors.getTotalPages(state),
      selectors.getCurrentPage(state),
    ],
    shallowEqual
  );
  const dispatch = useDispatch();
  const { annotation } = props;
  const listRef = useRef();
  const pendingThumbs = useRef([]);
  const thumbs = useRef([]);
  const prevThumbnailPageRef = useRef();

  const [canLoad, setCanLoad] = useState(true);
  const [numberOfColumns, setNumberOfColumns] = useState(1);
  const [thumbnailSize, setThumbnailSize] = useState(150);
  const [thumbnailPage, setThumbnailPage] = useState(annotation.PageNumber);

  useEffect(() => {
    if (
      !isNaN(thumbnailPage) &&
      0 < thumbnailPage &&
      thumbnailPage <= totalPages
    ) {
      prevThumbnailPageRef.current = thumbnailPage;
    }
  });

  // If memory becomes an issue, change this to use pageNumbers.
  // Instead of a debounced drawAnnotations function, perhaps use
  // a function that first checks for the pageNumber in this map
  // before calling drawAnnotations on a page.
  let activeThumbRenders = {};

  const getThumbnailSize = (pageWidth, pageHeight) => {
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
      height,
    };
  };

  const updateAnnotations = pageIndex => {
    const thumbContainer =
      thumbs.current &&
      thumbs.current[pageIndex] &&
      thumbs.current[pageIndex].element;
    if (!thumbContainer) {
      return;
    }

    const pageNumber = pageIndex + 1;
    const pageWidth = core.getPageWidth(pageNumber);
    const pageHeight = core.getPageHeight(pageNumber);

    const { width, height } = getThumbnailSize(pageWidth, pageHeight);

    const annotCanvas =
      thumbContainer.querySelector('.annotation-image') ||
      document.createElement('canvas');
    annotCanvas.className = 'annotation-image';
    annotCanvas.style.maxWidth = `${thumbnailSize}px`;
    annotCanvas.style.maxHeight = `${thumbnailSize}px`;
    const ctx = annotCanvas.getContext('2d');

    let zoom = 1;
    let rotation = core.getCompleteRotation(pageNumber);
    if (rotation < 0) {
      rotation += 4;
    }
    const multiplier = window.Core.getCanvasMultiplier();

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

    const thumb = thumbContainer.querySelector('.page-image');

    if (thumb) {
      options = {
        ...options,
        overridePageRotation: rotation,
        overridePageCanvas: thumb,
      };
    } else {
      return;
    }

    if (!activeThumbRenders[pageNumber]) {
      activeThumbRenders[pageNumber] = debounce(core.drawAnnotations, 112);
    }
    const debouncedDraw = activeThumbRenders[pageNumber];
    debouncedDraw(options);
  };

  useEffect(() => {
    const onBeginRendering = () => {
      setCanLoad(false);
    };

    const onFinishedRendering = needsMoreRendering => {
      if (!needsMoreRendering) {
        setCanLoad(true);
      }
    };

    const onWindowResize = () => {
      setNumberOfColumns(getNumberOfColumns);
    };

    core.addEventListener('beginRendering', onBeginRendering);
    core.addEventListener('finishedRendering', onFinishedRendering);
    window.addEventListener('resize', onWindowResize);

    return () => {
      core.removeEventListener('beginRendering', onBeginRendering);
      core.removeEventListener('finishedRendering', onFinishedRendering);
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

  useEffect(() => {
    listRef.current?.scrollToRow(
      Math.floor((currentPage - 1) / numberOfColumns)
    );
    const onAnnotationChanged = annots => {
      const indices = [];

      annots.forEach(annot => {
        const pageIndex = annot.PageNumber - 1;
        if (!annot.Listable || indices.indexOf(pageIndex) > -1) {
          return;
        }
        indices.push(pageIndex);

        updateAnnotations(pageIndex);
      });
    };

    core.addEventListener('annotationChanged', onAnnotationChanged);
    core.addEventListener('annotationHidden', onAnnotationChanged);

    return () => {
      core.removeEventListener('annotationChanged', onAnnotationChanged);
      core.removeEventListener('annotationHidden', onAnnotationChanged);
    };
  }, [numberOfColumns]);

  useEffect(() => {
    const loadThumbnailAsync = () => {
      if (
        isNaN(thumbnailPage) ||
        !(0 < thumbnailPage && thumbnailPage <= totalPages)
      ) {
        return;
      }
      const index = thumbnailPage - 1;
      const pageNum = index + 1;
      const viewerRotation = core.getRotation(pageNum);
      const doc = core.getDocument();

      if (doc) {
        const id = doc.loadCanvasAsync({
          pageNumber: pageNum,
          zoom: thumbnailSize > 150 ? 1 : 0.5,
          drawComplete: async thumb => {
            const thumbnailContainer = document.getElementById(
              `pageThumb${index}`
            );
            if (thumbnailContainer) {
              const childElement = thumbnailContainer.querySelector(
                '.page-image'
              );
              if (childElement) {
                thumbnailContainer.removeChild(childElement);
              }

              thumb.className = 'page-image';

              const ratio = Math.min(
                thumbnailSize / thumb.width,
                thumbnailSize / thumb.height
              );
              thumb.style.width = `${thumb.width * ratio}px`;
              thumb.style.height = `${thumb.height * ratio}px`;

              if (Math.abs(viewerRotation)) {
                const cssTransform = `rotate(${
                  viewerRotation * 90
                }deg) translate(-50%,-50%)`;
                const cssTransformOrigin = 'top left';
                thumb.style['transform'] = cssTransform;
                thumb.style['transform-origin'] = cssTransformOrigin;
                thumb.style['ms-transform'] = cssTransform;
                thumb.style['ms-transform-origin'] = cssTransformOrigin;
                thumb.style['-moz-transform'] = cssTransform;
                thumb.style['-moz-transform-origin'] = cssTransformOrigin;
                thumb.style['-webkit-transform-origin'] = cssTransformOrigin;
                thumb.style['-webkit-transform'] = cssTransform;
                thumb.style['-o-transform'] = cssTransform;
                thumb.style['-o-transform-origin'] = cssTransformOrigin;
              }

              thumbnailContainer.appendChild(thumb);
            }

            onLoad(index, thumbnailContainer, id);
            updateAnnotations(index);
            removeFromPendingThumbs(index);
          },
          source: 'thumbnail',
          isInternalRender: true,
        });
      }
    };
    loadThumbnailAsync();
  }, [thumbnailPage]);

  const getNumberOfColumns = () => {
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
  };

  const onLoad = (pageIndex, element, id) => {
    if (!thumbIsLoaded(pageIndex) && !thumbIsPending(pageIndex)) {
      thumbs.current[pageIndex] = {
        element,
        loaded: false,
      };

      pendingThumbs.current.push({
        pageIndex,
        id,
      });
    }
  };

  const removeFromPendingThumbs = pageIndex => {
    const index = getPendingThumbIndex(pageIndex);
    if (index !== -1) {
      pendingThumbs.current.splice(index, 1);
    }
  };

  const thumbIsLoaded = pageIndex => thumbs.current[pageIndex]?.loaded;

  const thumbIsPending = pageIndex => getPendingThumbIndex(pageIndex) !== -1;

  const onCancel = pageIndex => {
    const index = getPendingThumbIndex(pageIndex);
    if (index !== -1) {
      core.cancelLoadThumbnail(pendingThumbs.current[index].id);
      pendingThumbs.current.splice(index, 1);
    }
  };

  const getPendingThumbIndex = pageIndex =>
    pendingThumbs.current.findIndex(
      thumbStatus => thumbStatus.pageIndex === pageIndex
    );

  const onRemove = pageIndex => {
    onCancel(pageIndex);
    thumbs.current[pageIndex] = null;
  };

  const handleThumbnailInputChange = e => {
    setThumbnailPage(e.target.value);
  };

  const moveAnnotationToPage = page => {
    annotation.PageNumber = page;
    core.setCurrentPage(page);
    const annotManager = core.getAnnotationManager();
    annotManager.deselectAllAnnotations();
    annotManager.trigger('annotationChanged', [[annotation], 'modify', []]);
    annotManager.trigger('annotationMoved');
  };

  const handleDisabledButtonCheck = () => {
    if (
      !thumbnailPage ||
      isNaN(thumbnailPage) ||
      thumbnailPage > totalPages ||
      thumbnailPage === annotation.PageNumber ||
      thumbnailPage <= 0
    ) {
      return true;
    }
    return false;
  };

  const closeMoveAnnotationPopup = () => {
    dispatch(actions.closeElement('annotationPopup'));
  };

  if (isDisabled) {
    return null;
  }

  return (
    <div className="AnnotationMovePopup" data-element="annotationMovePopup">
      <div className="annotationPreviewContainer">
        <h4 className="header center">Page Selection</h4>
        <p>
          Enter a page number in the destination page field to move the
          annotation.
        </p>
        <label className="destination" htmlFor="destinationPage">
          Destination page
        </label>
        <input
          id="destinationPage"
          type="text"
          value={thumbnailPage}
          onChange={handleThumbnailInputChange}
          className="pageIndexInput"
          placeholder={parseInt(annotation.PageNumber)}
        />
        {!isNaN(thumbnailPage) &&
        0 < thumbnailPage &&
        thumbnailPage <= totalPages ? (
          <Thumbnail
            index={parseInt(thumbnailPage) - 1}
            canLoad={canLoad}
            onLoad={onLoad}
            onCancel={onCancel}
            onRemove={onRemove}
            onFinishLoading={removeFromPendingThumbs}
            currentPage={parseInt(thumbnailPage) - 1}
          />
        ) : (
          <Thumbnail />
        )}
        <p className="center">
          Page {thumbnailPage || currentPage} of {totalPages}
        </p>
      </div>
      <div className="annotationMovePopupActions">
        <button className="btn btn-default" onClick={closeMoveAnnotationPopup}>
          Cancel
        </button>
        <button
          className="btn btn-primary"
          onClick={() => moveAnnotationToPage(thumbnailPage)}
          disabled={handleDisabledButtonCheck()}
        >
          Move
        </button>
      </div>
    </div>
  );
};

AnnotationMovePopup.propTypes = {
  annotation: PropTypes.object.isRequired,
};

export default AnnotationMovePopup;
