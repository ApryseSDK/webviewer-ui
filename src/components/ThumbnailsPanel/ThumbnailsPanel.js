import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { List } from 'react-virtualized';
import Measure from 'react-measure';
import classNames from 'classnames';

import { isIE11 } from 'helpers/device';

import Thumbnail from 'components/Thumbnail';
import DocumentControls from 'components/DocumentControls';
import Button from 'components/Button';

import core from 'core';
import { extractPagesToMerge, mergeExternalWebViewerDocument, mergeDocument } from 'helpers/pageManipulation';
import { workerTypes } from 'constants/types';
import selectors from 'selectors';
import actions from 'actions';

import './ThumbnailsPanel.scss';

const dataTransferWebViewerFrameKey = 'dataTransferWebViewerFrame';

const ZOOM_RANGE_MIN = "100";
const ZOOM_RANGE_MAX = "1000";
const ZOOM_RANGE_STEP = "50";

const ThumbnailsPanel = () => {
  const [
    isOpen,
    isDisabled,
    totalPages,
    currentPage,
    selectedPageIndexes,
    isThumbnailMergingEnabled,
    isThumbnailReorderingEnabled,
    isMultipleViewerMerging,
    isThumbnailControlDisabled,
    isReaderMode,
  ] = useSelector(
    state => [
      selectors.isElementOpen(state, 'leftPanel'),
      selectors.isElementDisabled(state, 'thumbnailsPanel'),
      selectors.getTotalPages(state),
      selectors.getCurrentPage(state),
      selectors.getSelectedThumbnailPageIndexes(state),
      selectors.getIsThumbnailMergingEnabled(state),
      selectors.getIsThumbnailReorderingEnabled(state),
      selectors.getIsMultipleViewerMerging(state),
      selectors.isElementDisabled(state, 'thumbnailControl'),
      selectors.isReaderMode(state),
    ],
    shallowEqual,
  );

  const listRef = useRef();
  const pendingThumbs = useRef([]);
  const thumbs = useRef([]);
  const afterMovePageNumber = useRef(null);

  const [canLoad, setCanLoad] = useState(true);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [draggingOverPageIndex, setDraggingOverPageIndex] = useState(null);
  const [isDraggingToPreviousPage, setDraggingToPreviousPage] = useState(false);
  const [allowPageOperations, setAllowPageOperations] = useState(true);
  const [numberOfColumns, setNumberOfColumns] = useState(1);

  const [thumbnailSize, setThumbnailSize] = useState(150);

  const dispatch = useDispatch();

  const getThumbnailSize = (pageWidth, pageHeight) => {
    let width;
    let height;
    let ratio;

    if (pageWidth > pageHeight) {
      ratio = pageWidth / thumbnailSize;
      width = thumbnailSize;
      height = Math.round(pageHeight / ratio);
    } else {
      ratio = pageHeight / thumbnailSize;
      width = Math.round(pageWidth / ratio); // Chrome has trouble displaying borders of non integer width canvases.
      height = thumbnailSize;
    }

    return {
      width,
      height,
    };
  };

  const updateAnnotations = pageIndex => {
    const thumbContainer = thumbs.current && thumbs.current[pageIndex] && thumbs.current[pageIndex].element;
    if (!thumbContainer) {
      return;
    }

    const pageNumber = pageIndex + 1;
    const pageWidth = core.getPageWidth(pageNumber);
    const pageHeight = core.getPageHeight(pageNumber);

    const { width, height } = getThumbnailSize(pageWidth, pageHeight);

    const annotCanvas = thumbContainer.querySelector('.annotation-image') || document.createElement('canvas');
    annotCanvas.className = 'annotation-image';
    annotCanvas.style.maxWidth = `${thumbnailSize}px`;
    annotCanvas.style.maxHeight = `${thumbnailSize}px`;
    const ctx = annotCanvas.getContext('2d');

    let zoom = 1;
    let rotation = core.getCompleteRotation(pageNumber);
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

    core.drawAnnotations(options);
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

    const onDocumentLoaded = () => {
      const doc = core.getDocument();
      if (doc.type === workerTypes.PDF || (doc.type === workerTypes.BLACKBOX && !doc.isWebViewerServerDocument())) {
        setAllowPageOperations(true);
      } else {
        setAllowPageOperations(false);
      }
  
      dispatch(actions.setSelectedPageThumbnails([]));
    };

    const onPageComplete = () => {
      if (afterMovePageNumber.current) {
        core.setCurrentPage(afterMovePageNumber.current);
        afterMovePageNumber.current = null;
      }
    };

    core.addEventListener('beginRendering', onBeginRendering);
    core.addEventListener('finishedRendering', onFinishedRendering);
    core.addEventListener('documentLoaded', onDocumentLoaded);
    core.addEventListener('pageComplete', onPageComplete);
    

    // The document might have already been loaded before this component is mounted.
    // If document is already loaded, call 'onDocumentLoaded()' manually to update the state properly.
    if (core.getDocument()) {
      onDocumentLoaded();
    }

    return () => {
      core.removeEventListener('beginRendering', onBeginRendering);
      core.removeEventListener('finishedRendering', onFinishedRendering);
      core.removeEventListener('documentLoaded', onDocumentLoaded);
      core.removeEventListener('pageComplete', onPageComplete);
    };
  }, []);

  useEffect(() => {
    const onLayoutChanged = changes => {
      if (!changes) {
        return;
      }
      let updatedPagesIndexes = Array.from(selectedPageIndexes);

      if (changes.removed) {
        updatedPagesIndexes = updatedPagesIndexes.filter(pageIndex => changes.removed.indexOf(pageIndex + 1) === -1);
      }

      if (changes.moved) {
        updatedPagesIndexes = updatedPagesIndexes.map(pageIndex =>
          changes.moved[pageIndex + 1] ? changes.moved[pageIndex + 1] - 1 : pageIndex,
        );
      }

      dispatch(actions.setSelectedPageThumbnails(updatedPagesIndexes));
    };

    core.addEventListener('layoutChanged', onLayoutChanged);

    return () => core.removeEventListener('layoutChanged', onLayoutChanged);
  }, [selectedPageIndexes]);

  useEffect(() => {
    listRef.current?.scrollToRow(Math.floor((currentPage - 1) / numberOfColumns));
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

    const onPageNumberUpdated = pageNumber => {
      const pageIndex = pageNumber - 1;
      listRef.current?.scrollToRow(Math.floor(pageIndex / numberOfColumns));
    };

    core.addEventListener('pageNumberUpdated', onPageNumberUpdated);
    core.addEventListener('annotationChanged', onAnnotationChanged);
    core.addEventListener('annotationHidden', onAnnotationChanged);

    return () => {
      core.removeEventListener('pageNumberUpdated', onPageNumberUpdated);
      core.removeEventListener('annotationChanged', onAnnotationChanged);
      core.removeEventListener('annotationHidden', onAnnotationChanged);
    }

  }, [thumbnailSize, numberOfColumns]);

  useEffect(() => {
    dispatch(actions.setSelectedPageThumbnails([]));
  }, [isReaderMode]);

  // if disabled or is not open return
  if(isDisabled || !isOpen){
    return null
  }

  const onDragEnd = () => {
    setDraggingOverPageIndex(null);
  };

  const onDragOver = (e, index) => {
    // 'preventDefault' to prevent opening pdf dropped in and 'stopPropagation' to keep parent from opening pdf
    e.preventDefault();
    e.stopPropagation();

    if (!isThumbnailReorderingEnabled && !isThumbnailMergingEnabled) {
      return;
    }

    const thumbnail = e.target.getBoundingClientRect();
    if (numberOfColumns > 1) {
      // row with more than 1 thumbnail so user are dragging to the left and right
      setDraggingToPreviousPage(!(e.pageX > thumbnail.x + thumbnail.width / 2));
    } else {
      setDraggingToPreviousPage(!(e.pageY > thumbnail.y + thumbnail.height / 2));
    }

    setDraggingOverPageIndex(index);
  };

  const onDragStart = (e, index) => {
    const draggingSelectedPage = selectedPageIndexes.some(i => i === index);
    const pagesToMove = draggingSelectedPage ? selectedPageIndexes.map(index => index + 1) : [index + 1];

    // need to set 'text' to empty for drag to work in FireFox and mobile
    e.dataTransfer.setData('text', '');

    if (pagesToMove.length > 1) {
      // can't set to null so set to new instance of an image
      e.dataTransfer.setDragImage(new Image(), 0, 0);
    }

    if (isThumbnailMergingEnabled && isMultipleViewerMerging) {
      e.dataTransfer.dropEffect = 'move';
      e.dataTransfer.effectAllowed = 'all';
      e.dataTransfer.setData(dataTransferWebViewerFrameKey, window.frameElement.id);
      extractPagesToMerge(pagesToMove);
    }

    if (!draggingSelectedPage) {
      dispatch(actions.setSelectedPageThumbnails([index]));
    }

    core.setCurrentPage(index + 1);
  };

  const onDrop = e => {
    e.preventDefault();
    const { files } = e.dataTransfer;
    const insertTo = isDraggingToPreviousPage ? draggingOverPageIndex + 1 : draggingOverPageIndex + 2;

    let externalPageWebViewerFrameId;
    if (!isIE11) {
      // at this time of writing, IE11 does not really have support for getData
      externalPageWebViewerFrameId = e.dataTransfer.getData(dataTransferWebViewerFrameKey);
    }
    const mergingDocument =
      (externalPageWebViewerFrameId && window.frameElement.id !== externalPageWebViewerFrameId) || files.length;
    const currentPageIndex = currentPage - 1;

    if (isThumbnailMergingEnabled && mergingDocument) {
      if (externalPageWebViewerFrameId && window.frameElement.id !== externalPageWebViewerFrameId) {
        dispatch(mergeExternalWebViewerDocument(externalPageWebViewerFrameId, insertTo));
      } else if (files.length) {
        dispatch(mergeDocument(files[0], insertTo));
      }
    } else if (isThumbnailReorderingEnabled && !mergingDocument) {
      if (draggingOverPageIndex !== null) {
        const targetPageNumber = isDraggingToPreviousPage ? draggingOverPageIndex + 1 : draggingOverPageIndex + 2;
        const draggingSelectedPage = selectedPageIndexes.some(i => i === currentPageIndex);
        const pageNumbersToMove = draggingSelectedPage ? selectedPageIndexes.map(i => i + 1) : [currentPage];
        afterMovePageNumber.current = targetPageNumber - pageNumbersToMove.filter(p => p < targetPageNumber).length;
        core.movePages(pageNumbersToMove, targetPageNumber);
      }
    }
    setDraggingOverPageIndex(null);
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
    pendingThumbs.current.findIndex(thumbStatus => thumbStatus.pageIndex === pageIndex);

  const onRemove = pageIndex => {
    onCancel(pageIndex);
    thumbs.current[pageIndex] = null;
  };

  const renderThumbnails = ({ index, key, style }) => {
    const className = classNames({
      columnsOfThumbnails: numberOfColumns > 1,
      row: true,
    });
    const allowPageOperationsUI = allowPageOperations && !isReaderMode;

    return (
      <div role="row" aria-label="row" className={className} key={key} style={style}>
        {new Array(numberOfColumns).fill().map((_, columnIndex) => {
          const thumbIndex = index * numberOfColumns + columnIndex;
          const allowDragAndDrop = allowPageOperationsUI && (isThumbnailMergingEnabled || isThumbnailReorderingEnabled);
          const showPlaceHolder = allowDragAndDrop && draggingOverPageIndex === thumbIndex;

          return thumbIndex < totalPages ? (
            <div role="cell" key={thumbIndex} onDragEnd={onDragEnd} className="cellThumbContainer">
              {showPlaceHolder && isDraggingToPreviousPage && <div className="thumbnailPlaceholder" />}
              <Thumbnail
                isDraggable={allowDragAndDrop}
                isSelected={selectedPageIndexes.includes(thumbIndex)}
                index={thumbIndex}
                canLoad={canLoad}
                onLoad={onLoad}
                onCancel={onCancel}
                onRemove={onRemove}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onFinishLoading={removeFromPendingThumbs}
                updateAnnotations={updateAnnotations}
                shouldShowControls={allowPageOperationsUI}
                thumbnailSize={thumbnailSize}
              />
              {showPlaceHolder && !isDraggingToPreviousPage && <div className="thumbnailPlaceholder" />}
            </div>
          ) : null;
        })}
      </div>
    );
  };

  const onPanelResize = ({ bounds }) => {
    setHeight(bounds.height);
    setWidth(bounds.width);
    setNumberOfColumns(Math.min(3, Math.max(1, Math.floor(bounds.width / thumbnailSize))));
  };

  const updateNumberOfColumns = () => {
    setNumberOfColumns(Math.min(3, Math.max(1, Math.floor(width / thumbnailSize))));
  };

  const thumbnailHeight = isThumbnailControlDisabled ? Number(thumbnailSize) + 50 : Number(thumbnailSize) + 80;
  const shouldShowControls = !isReaderMode && (allowPageOperations || selectedPageIndexes.length > 0);

  return (
    <React.Fragment>
      <div data-element="thumbnailsSizeSlider" className="thumbnail-slider-container">
        <Button
          img="icon-zoom-thumb-out"
          title="action.thumbZoomOut"
          onClick={() => {
            if (thumbnailSize - Number(ZOOM_RANGE_STEP) > Number(ZOOM_RANGE_STEP)) {
              setThumbnailSize(thumbnailSize - Number(ZOOM_RANGE_STEP));
              updateNumberOfColumns();
            }
          }}
          dataElement="zoomThumbOutButton"
        />
        <input
          type="range"
          min={ZOOM_RANGE_MIN}
          max={ZOOM_RANGE_MAX}
          value={thumbnailSize}
          onChange={e => {
            setThumbnailSize(Number(e.target.value));
            updateNumberOfColumns();
          }}
          step={ZOOM_RANGE_STEP}
          className="thumbnail-slider"
          id="thumbnailSize"
        />
        <Button
          img="icon-zoom-thumb-in"
          title="action.thumbZoomIn"
          onClick={() => {
            if (thumbnailSize + Number(ZOOM_RANGE_STEP) < 1001) {
              setThumbnailSize(thumbnailSize + Number(ZOOM_RANGE_STEP));
              updateNumberOfColumns();
            }
          }}
          dataElement="zoomThumbInButton"
        />
      </div>
      <Measure bounds onResize={onPanelResize} key={thumbnailSize}>
        {({ measureRef }) => (
          <div className="Panel ThumbnailsPanel" data-element="thumbnailsPanel" onDrop={onDrop} ref={measureRef}>
            <div className="virtualized-thumbnails-container">
              <List
                ref={listRef}
                height={height}
                width={width}
                rowHeight={thumbnailHeight}
                // Round it to a whole number because React-Virtualized list library doesn't round it for us and throws errors when rendering non whole number rows
                // use ceiling rather than floor so that an extra row can be created in case the items can't be evenly distributed between rows
                rowCount={Math.ceil(totalPages / numberOfColumns)}
                rowRenderer={renderThumbnails}
                overscanRowCount={3}
                className={'thumbnailsList'}
                style={{ outline: 'none' }}
              />
            </div>
          </div>
        )}
      </Measure>
      <DocumentControls shouldShowControls={shouldShowControls} />
    </React.Fragment>
  );
};

export default ThumbnailsPanel;
