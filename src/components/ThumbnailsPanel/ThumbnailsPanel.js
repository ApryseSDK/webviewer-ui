import debounce from 'lodash/debounce';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { List } from 'react-virtualized';
import Measure from 'react-measure';
import classNames from 'classnames';
import { isIE11 } from 'helpers/device';

import Thumbnail from 'components/Thumbnail';
import DocumentControls from 'components/DocumentControls';
import Button from 'components/Button';
import Slider from 'components/Slider';

import core from 'core';
import { extractPagesToMerge, mergeDocument, mergeExternalWebViewerDocument } from 'helpers/pageManipulation';
import selectors from 'selectors';
import actions from 'actions';
import Events from 'constants/events';
import DataElements from 'constants/dataElement';
import fireEvent from 'helpers/fireEvent';

import './ThumbnailsPanel.scss';
import getRootNode from 'helpers/getRootNode';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

const dataTransferWebViewerFrameKey = 'dataTransferWebViewerFrame';

const ZOOM_RANGE_MIN = '100';
const ZOOM_RANGE_MAX = '1000';
const ZOOM_RANGE_STEP = '50';
const MAX_COLUMNS = 16;

const hoverAreaHeight = 25;

const ThumbnailsPanel = ({ panelSelector, parentDataElement }) => {
  const isLeftPanelOpen = useSelector((state) => selectors.isElementOpen(state, 'leftPanel'));
  const isDisabled = useSelector((state) => selectors.isElementDisabled(state, 'thumbnailsPanel'));
  const totalPages = useSelector(selectors.getTotalPages);
  const currentPage = useSelector(selectors.getCurrentPage);
  const selectedPageIndexes = useSelector((state) => selectors.getSelectedThumbnailPageIndexes(state), shallowEqual);
  const isThumbnailMergingEnabled = useSelector(selectors.getIsThumbnailMergingEnabled);
  const isThumbnailReorderingEnabled = useSelector(selectors.getIsThumbnailReorderingEnabled);
  const isMultipleViewerMerging = useSelector(selectors.getIsMultipleViewerMerging);
  const isThumbnailControlDisabled = useSelector((state) => selectors.isElementDisabled(state, 'thumbnailControl'));
  const isThumbnailSliderDisabled = useSelector((state) => selectors.isElementDisabled(state, 'thumbnailsSizeSlider'));
  const isReaderMode = useSelector(selectors.isReaderMode);
  const isDocumentReadOnly = useSelector(selectors.isDocumentReadOnly);
  const totalPagesFromSecondaryDocumentViewer = useSelector((state) => selectors.getTotalPages(state, 2));
  const activeDocumentViewerKey = useSelector(selectors.getActiveDocumentViewerKey);
  const isRightClickEnabled = useSelector(selectors.openingPageManipulationOverlayByRightClickEnabled);
  const featureFlags = useSelector(selectors.getFeatureFlags, shallowEqual);
  const isContentEditingEnabled = useSelector(selectors.isContentEditingEnabled);

  const [t] = useTranslation();
  const isRightToLeft = i18next.dir() === 'rtl';

  const listRef = useRef();
  const pendingThumbs = useRef([]);
  const thumbs = useRef([]);
  const afterMovePageNumber = useRef(null);

  const [isOfficeEditor, setIsOfficeEditor] = useState(false);
  const [canLoad, setCanLoad] = useState(true);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [draggingOverPageIndex, setDraggingOverPageIndex] = useState(null);
  const [isDraggingToPreviousPage, setDraggingToPreviousPage] = useState(false);
  const [numberOfColumns, setNumberOfColumns] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const thumbnailContainerRefs = useRef([]);
  const thumbnailRefs = useRef([]);
  const focusedThumbnailRef = useRef(null);

  const [thumbnailSize, setThumbnailSize] = useState(150);
  const [lastTimeTriggered, setLastTimeTriggered] = useState(0);
  const [globalIndex, setGlobalIndex] = useState(0);
  const pageCount = activeDocumentViewerKey === 2 ? totalPagesFromSecondaryDocumentViewer : totalPages;
  const customizableUI = featureFlags?.customizableUI;

  const dispatch = useDispatch();

  // If memory becomes an issue, change this to use pageNumbers.
  // Instead of a debounced drawAnnotations function, perhaps use
  // a function that first checks for the pageNumber in this map
  // before calling drawAnnotations on a page.
  let activeThumbRenders = {};

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (focusedThumbnailRef.current && !focusedThumbnailRef.current.contains(event.target)) {
        removeOutline(focusedThumbnailRef.current);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleKeyDown = useCallback((e, currentIndex, columnCount) => {
    e.stopPropagation();
    let newIndex;
    const arrowActions = {
      ArrowLeft: () => handleArrowKey(e, currentIndex, -1),
      ArrowRight: () => handleArrowKey(e, currentIndex, 1),
      ArrowUp: () => handleArrowKey(e, currentIndex, -columnCount),
      ArrowDown: () => handleArrowKey(e, currentIndex, columnCount),
    };
    const keyActions = {
      Enter: () => handleEnterKey(e, currentIndex),
      Tab: () => handleTabOutKey(currentIndex),
    };

    if (arrowActions[e.key]) {
      newIndex = arrowActions[e.key]();
    }
    if (keyActions[e.key]) {
      keyActions[e.key]();
    }

    if (newIndex !== undefined && newIndex !== currentIndex) {
      setFocusedIndex(newIndex);
      selectElement(thumbnailContainerRefs.current[newIndex]);
      deselectElement(thumbnailContainerRefs.current[currentIndex]);
    }
  }, [thumbnailRefs, thumbnailContainerRefs]);

  const selectElement = (element) => {
    element.tabIndex = 0;
    element.ariaCurrent = 'page';
    element.style.outline = 'var(--focus-visible-outline)';
    element.focus();
    focusedThumbnailRef.current = element;
  };

  const deselectElement = (element) => {
    element.tabIndex = -1;
    element.ariaCurrent = undefined;
    removeOutline(element);
  };

  const removeOutline = (element) => {
    element.style.outline = 'none';
  };

  const handleTabOutKey = (index) => {
    removeOutline(thumbnailContainerRefs.current[index]);
  };

  const handleArrowKey = (e, currentIndex, direction) => {
    let newIndex = currentIndex + direction;
    if (newIndex < 0 || newIndex >= pageCount) {
      return currentIndex;
    }
    return newIndex;
  };

  const handleEnterKey = (e, index) => {
    e.preventDefault();
    selectElement(thumbnailContainerRefs.current[index]);
    core.setCurrentPage(index + 1);
    thumbnailRefs.current[index].focusInput();
  };

  const handleThumbnailKeyDown = useCallback((e, index) => {
    e.stopPropagation();
    const keyActions = {
      Tab: () => handleTabKey(e, index),
      Escape: () => handleEscapeKey(e, index)
    };
    if (keyActions[e.key]) {
      keyActions[e.key]?.();
    }
  }, [thumbnailContainerRefs]);

  const handleEscapeKey = (e, index) => {
    e.preventDefault();
    selectElement(thumbnailContainerRefs.current[index]);
  };

  const handleTabKey = (e, index) => {
    let direction = e.shiftKey ? -1 : 1;
    let newIndex = index + direction;
    if (newIndex < 0 || newIndex >= pageCount) {
      newIndex = index;
    }
    setFocusedIndex(newIndex);
    selectElement(thumbnailContainerRefs.current[newIndex]);
    if (newIndex !== index) {
      deselectElement(thumbnailContainerRefs.current[index]);
    }
  };

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

  const updateAnnotations = (pageIndex) => {
    const thumbContainer = thumbs.current && thumbs.current[pageIndex] && thumbs.current[pageIndex].element;
    if (!thumbContainer) {
      return;
    }

    const pageNumber = pageIndex + 1;
    const pageWidth = core.getPageWidth(pageNumber);
    const pageHeight = core.getPageHeight(pageNumber);

    const { width, height } = getThumbnailSize(pageWidth, pageHeight);

    const annotCanvas = thumbContainer.querySelector('.annotation-image') || document.createElement('canvas');
    annotCanvas.className = `annotation-image ${isRightToLeft ? 'right-to-left' : ''}`;
    annotCanvas.role = 'img';
    annotCanvas.ariaLabel = `${t('action.page')} ${pageNumber}`;
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

    const onFinishedRendering = (needsMoreRendering) => {
      if (!needsMoreRendering) {
        setCanLoad(true);
      }
    };

    const onDocumentLoaded = () => {
      if (core.getDocument()?.getType() === 'officeEditor') {
        setIsOfficeEditor(true);
      } else {
        setIsOfficeEditor(false);
      }
      activeThumbRenders = {};
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
    const onPagesUpdated = (changes) => {
      if (!changes) {
        return;
      }
      let updatedPagesIndexes = Array.from(selectedPageIndexes);

      if (changes.removed) {
        updatedPagesIndexes = updatedPagesIndexes.filter((pageIndex) => changes.removed.indexOf(pageIndex + 1) === -1);
      }

      if (changes.moved) {
        updatedPagesIndexes = updatedPagesIndexes.map((pageIndex) => (changes.moved[pageIndex + 1] ? changes.moved[pageIndex + 1] - 1 : pageIndex),
        );
      }

      const isPageAddedBefore = changes.added && (changes.added[0] - 1) <= updatedPagesIndexes[0];
      if (updatedPagesIndexes.length === 1 && isPageAddedBefore) {
        updatedPagesIndexes = changes.added.map((pageNumber) => pageNumber - 1);
      }

      dispatch(actions.setSelectedPageThumbnails(updatedPagesIndexes));
    };

    core.addEventListener('pagesUpdated', onPagesUpdated);

    return () => core.removeEventListener('pagesUpdated', onPagesUpdated);
  }, [selectedPageIndexes]);

  useEffect(() => {
    listRef.current?.scrollToRow(Math.floor((currentPage - 1) / numberOfColumns));
    const onAnnotationChanged = (annots) => {
      const indices = [];

      annots.forEach((annot) => {
        const pageIndex = annot.PageNumber - 1;
        if (!annot.Listable || indices.indexOf(pageIndex) > -1) {
          return;
        }
        indices.push(pageIndex);

        updateAnnotations(pageIndex);
      });
    };

    const onPageNumberUpdated = (pageNumber) => {
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
    };
  }, [thumbnailSize, numberOfColumns]);

  useEffect(() => {
    if (isReaderMode || isDocumentReadOnly) {
      dispatch(actions.setSelectedPageThumbnails([]));
      dispatch(actions.setThumbnailSelectingPages(false));
    }
  }, [isReaderMode, isDocumentReadOnly]);

  // if disabled, or is office editor or left panel is not open when we are not in customize mode, return
  if (isDisabled || isOfficeEditor || (!isLeftPanelOpen && !panelSelector && !customizableUI)) {
    return null;
  }
  const onDragEnd = () => {
    setIsDragging(false);
    setDraggingOverPageIndex(null);
  };

  const scrollToRowHelper = (index, change, time) => {
    const now = new Date().getTime();
    if (index < pageCount - 1 && index > 0 && now - lastTimeTriggered >= time) {
      listRef.current?.scrollToRow(Math.floor((index + change) / numberOfColumns));
      setLastTimeTriggered(now);
      return index + change;
    }
    return index;
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
    const virtualizedThumbnailContainerElement = getRootNode().querySelector('#virtualized-thumbnails-container');
    const { y, bottom } = virtualizedThumbnailContainerElement.getBoundingClientRect();

    if (e.pageY < y + hoverAreaHeight * 4) {
      setGlobalIndex(scrollToRowHelper(index, -1, 400));
    } else if (e.pageY > bottom - hoverAreaHeight * 4) {
      setGlobalIndex(scrollToRowHelper(index, 1, 400));
    }
  };

  const scrollDown = () => {
    setGlobalIndex(scrollToRowHelper(globalIndex, 1, 200));
  };
  const scrollUp = () => {
    setGlobalIndex(scrollToRowHelper(globalIndex, -1, 200));
  };

  const getContextElementId = () => {
    if (window.isApryseWebViewerWebComponent) {
      return getRootNode().host.id;
    } else {
      return window.frameElement.id;
    }
  };

  const onDragStart = (e, index) => {
    setGlobalIndex(index);
    setIsDragging(true);
    const draggingSelectedPage = selectedPageIndexes.some((i) => i === index);
    const pagesToMove = draggingSelectedPage ? selectedPageIndexes.map((index) => index + 1) : [index + 1];
    fireEvent(Events.THUMBNAIL_DRAGGED);
    // need to set 'text' to empty for drag to work in FireFox and mobile
    e.dataTransfer.setData('text', '');

    if (pagesToMove.length > 1) {
      // can't set to null so set to new instance of an image
      e.dataTransfer.setDragImage(new Image(), 0, 0);
    }

    if (isThumbnailMergingEnabled && isMultipleViewerMerging) {
      e.dataTransfer.dropEffect = 'move';
      e.dataTransfer.effectAllowed = 'all';
      e.dataTransfer.setData(dataTransferWebViewerFrameKey, getContextElementId());
      extractPagesToMerge(pagesToMove);
    }

    if (!draggingSelectedPage) {
      dispatch(actions.setSelectedPageThumbnails([index]));
    }

    core.setCurrentPage(index + 1);
  };

  const onDrop = (e) => {
    e.preventDefault();
    const { files } = e.dataTransfer;
    const insertTo = isDraggingToPreviousPage ? draggingOverPageIndex + 1 : draggingOverPageIndex + 2;
    let externalPageWebViewerFrameId;
    if (!isIE11) {
      // at this time of writing, IE11 does not really have support for getData
      externalPageWebViewerFrameId = e.dataTransfer.getData(dataTransferWebViewerFrameKey);
    }
    const mergingDocument =
      (externalPageWebViewerFrameId && getContextElementId() !== externalPageWebViewerFrameId) || files.length;
    const currentPageIndex = currentPage - 1;

    if (isThumbnailMergingEnabled && mergingDocument) {
      if (externalPageWebViewerFrameId && getContextElementId() !== externalPageWebViewerFrameId) {
        dispatch(mergeExternalWebViewerDocument(externalPageWebViewerFrameId, insertTo));
      } else if (files.length) {
        Array.from(files).forEach((file) => {
          dispatch(mergeDocument(file, insertTo));
        });
      }
    } else if (isThumbnailReorderingEnabled && !mergingDocument) {
      if (draggingOverPageIndex !== null) {
        const targetPageNumber = isDraggingToPreviousPage ? draggingOverPageIndex + 1 : draggingOverPageIndex + 2;
        const draggingSelectedPage = selectedPageIndexes.some((i) => i === currentPageIndex);
        const pageNumbersToMove = draggingSelectedPage ? selectedPageIndexes.map((i) => i + 1) : [currentPage];
        afterMovePageNumber.current = targetPageNumber - pageNumbersToMove.filter((p) => p < targetPageNumber).length;
        core.movePages(pageNumbersToMove, targetPageNumber);
        const updatedPagesNumbers = [];
        for (let offset = 0; offset < pageNumbersToMove.length; offset++) {
          updatedPagesNumbers.push(afterMovePageNumber.current + offset);
        }
        fireEvent(Events.THUMBNAIL_DROPPED, { pageNumbersBeforeMove: pageNumbersToMove, pagesNumbersAfterMove: updatedPagesNumbers, numberOfPagesMoved: updatedPagesNumbers.length });
      }
    }
    setDraggingOverPageIndex(null);
    setIsDragging(false);
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

  const removeFromPendingThumbs = (pageIndex) => {
    const index = getPendingThumbIndex(pageIndex);
    if (index !== -1) {
      pendingThumbs.current.splice(index, 1);
    }
  };

  const thumbIsLoaded = (pageIndex) => thumbs.current[pageIndex]?.loaded;

  const thumbIsPending = (pageIndex) => getPendingThumbIndex(pageIndex) !== -1;

  const onCancel = (pageIndex) => {
    const index = getPendingThumbIndex(pageIndex);
    if (index !== -1) {
      core.cancelLoadThumbnail(pendingThumbs.current[index].id);
      pendingThumbs.current.splice(index, 1);
    }
  };

  const onRightClick = (event, pageIndex) => {
    event.preventDefault();
    core.setCurrentPage(pageIndex + 1);
    if (!selectedPageIndexes.includes(pageIndex)) {
      dispatch(actions.setSelectedPageThumbnails([pageIndex]));
    }

    if (isReaderMode || isDocumentReadOnly || isContentEditingEnabled) {
      return;
    }

    dispatch(actions.setFlyoutPosition({ x: event.pageX, y: event.pageY }));
    dispatch(actions.openElements([DataElements.PAGE_MANIPULATION]));
  };

  const getPendingThumbIndex = (pageIndex) => pendingThumbs.current.findIndex((thumbStatus) => thumbStatus.pageIndex === pageIndex);

  const onRemove = (pageIndex) => {
    onCancel(pageIndex);
    const canvases = thumbs.current[pageIndex]?.element?.querySelectorAll('canvas');
    if (canvases?.length) {
      canvases.forEach((c) => {
        c.height = 0;
        c.width = 0;
      });
    }

    if (activeThumbRenders[pageIndex]) {
      activeThumbRenders[pageIndex].cancel();
    }
    thumbs.current[pageIndex] = null;
  };

  const handleFocus = (e, index) => {
    if (thumbnailContainerRefs.current && thumbnailContainerRefs.current.includes(e.target)) {
      selectElement(thumbnailContainerRefs.current[index]);
    }
  };

  const renderThumbnails = ({ index, key, style }) => {
    const className = classNames({
      columnsOfThumbnails: numberOfColumns > 1,
      row: true,
    });
    const allowPageOperationsUI = !(isReaderMode || isDocumentReadOnly);
    return (
      <div role="row" aria-label="row" className={className} key={key} style={style}>
        {new Array(numberOfColumns).fill().map((_, columnIndex) => {
          const thumbIndex = index * numberOfColumns + columnIndex;
          const allowDragAndDrop = allowPageOperationsUI && (isThumbnailMergingEnabled || isThumbnailReorderingEnabled);
          const showPlaceHolder = allowDragAndDrop && draggingOverPageIndex === thumbIndex;

          return thumbIndex < pageCount ? (
            <React.Fragment key={thumbIndex}>
              {(numberOfColumns > 1 || thumbIndex === 0) && showPlaceHolder && isDraggingToPreviousPage && <div key={`placeholder1-${thumbIndex}`} className="thumbnailPlaceholder" />}
              <td
                ref={(el) => (thumbnailContainerRefs.current[thumbIndex] = el)}
                key={thumbIndex}
                role="gridcell"
                tabIndex={focusedIndex === thumbIndex ? 0 : -1}
                aria-current={focusedIndex === thumbIndex ? 'page' : undefined}
                onDragEnd={onDragEnd}
                className="cellThumbContainer"
                onKeyDown={(e) => handleKeyDown(e, thumbIndex, numberOfColumns)}
                onContextMenu={(e) => isRightClickEnabled && onRightClick(e, thumbIndex)}
                onFocus={(e) => handleFocus(e, thumbIndex)}
              >
                <Thumbnail
                  ref={(el) => (thumbnailRefs.current[thumbIndex] = el)}
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
                  panelSelector={panelSelector}
                  parentKeyListener={(e) => handleThumbnailKeyDown(e, thumbIndex)}
                  isRightToLeft={isRightToLeft}
                />
              </td>
              {showPlaceHolder && !isDraggingToPreviousPage && <div key={`placeholder2-${thumbIndex}`} className="thumbnailPlaceholder" />}
            </React.Fragment>
          ) : null;
        })}
      </div>
    );
  };

  const onPanelResize = ({ bounds }) => {
    setHeight(bounds.height);
    setWidth(bounds.width);
    setNumberOfColumns(Math.min(MAX_COLUMNS, Math.max(1, Math.floor(bounds.width / thumbnailSize))));
  };

  const updateNumberOfColumns = () => {
    setNumberOfColumns(Math.min(MAX_COLUMNS, Math.max(1, Math.floor(width / thumbnailSize))));
  };

  const thumbnailHeight = isThumbnailControlDisabled ? Number(thumbnailSize) + 50 : Number(thumbnailSize) + 80;
  const shouldShowControls = !(isReaderMode || isDocumentReadOnly || isContentEditingEnabled);
  const thumbnailAutoScrollAreaStyle = {
    'height': `${hoverAreaHeight}px`,
  };

  const onSliderChange = (property, value) => {
    let zoomValue = Number(value) * ZOOM_RANGE_MAX;
    if (zoomValue < 100) {
      zoomValue = 100;
    }

    setThumbnailSize(zoomValue);
    updateNumberOfColumns();
  };

  return (
    <React.Fragment>
      {!isThumbnailSliderDisabled && <div data-element="thumbnailsSizeSlider" className="thumbnail-slider-container">
        <Button
          img="icon-zoom-thumb-out"
          title="action.zoomOut"
          hideTooltipShortcut
          onClick={() => {
            if (thumbnailSize - ZOOM_RANGE_STEP > ZOOM_RANGE_STEP) {
              setThumbnailSize(thumbnailSize - ZOOM_RANGE_STEP);
              updateNumberOfColumns();
            }
          }}
          dataElement="zoomThumbOutButton"
        />
        {customizableUI &&
          <Slider
            dataElement={'thumbnailsSizeSlider'}
            property={'zoom'}
            displayProperty={'zoom'}
            min={0}
            max={1}
            step={0.01}
            value={thumbnailSize / 1000}
            getDisplayValue={() => thumbnailSize}
            onSliderChange={onSliderChange}
            onStyleChange={onSliderChange}
            shouldHideSliderTitle={true}
            shouldHideSliderValue={true}
          />
        }
        {!customizableUI &&
          <input
            role='slider'
            type="range"
            aria-label='thumbnail size slider'
            min={ZOOM_RANGE_MIN}
            max={ZOOM_RANGE_MAX}
            value={thumbnailSize}
            aria-valuemin={ZOOM_RANGE_MIN}
            aria-valuemax={ZOOM_RANGE_MAX}
            aria-valuenow={thumbnailSize}
            onChange={(e) => {
              setThumbnailSize(Number(e.target.value));
              updateNumberOfColumns();
            }}
            step={ZOOM_RANGE_STEP}
            className="thumbnail-slider"
            id="thumbnailSize"
          />
        }
        <Button
          img="icon-zoom-thumb-in"
          title="action.zoomIn"
          hideTooltipShortcut
          onClick={() => {
            if (thumbnailSize + Number(ZOOM_RANGE_STEP) < 1001) {
              setThumbnailSize(thumbnailSize + Number(ZOOM_RANGE_STEP));
              updateNumberOfColumns();
            }
          }}
          dataElement="zoomThumbInButton"
        />
      </div>}
      <Measure bounds onResize={onPanelResize} key={thumbnailSize}>
        {({ measureRef }) => (
          <div className={`Panel ThumbnailsPanel ${panelSelector}`} id="virtualized-thumbnails-container" data-element="thumbnailsPanel" onDrop={onDrop} ref={measureRef}>
            <div className="virtualized-thumbnails-container">
              {isDragging ?
                <div className="thumbnailAutoScrollArea" onDragOver={scrollUp} style={thumbnailAutoScrollAreaStyle}></div> : ''
              }
              <List
                ref={listRef}
                height={height}
                width={width}
                rowHeight={thumbnailHeight}
                // Round it to a whole number because React-Virtualized list library doesn't round it for us and throws errors when rendering non whole number rows
                // use ceiling rather than floor so that an extra row can be created in case the items can't be evenly distributed between rows
                rowCount={Math.ceil(pageCount / numberOfColumns)}
                rowRenderer={renderThumbnails}
                overscanRowCount={3}
                className={classNames({
                  'thumbnailsList': true,
                  'right-to-left': isRightToLeft,
                })}
                // Ensure we show the current page in the thumbnails when we open the panel
                scrollToIndex={Math.floor((currentPage - 1) / numberOfColumns)}
                role='grid'
                aria-label={t('component.thumbnailsPanel')}
                tabIndex={-1}
              />
              {isDragging ?
                <div className="thumbnailAutoScrollArea" onDragOver={scrollDown} style={{ ...thumbnailAutoScrollAreaStyle, 'bottom': '70px' }}></div> : ''
              }
            </div>
          </div>
        )}
      </Measure>
      <DocumentControls shouldShowControls={shouldShowControls} parentElement={parentDataElement || panelSelector} />
    </React.Fragment>
  );
};

export default ThumbnailsPanel;
