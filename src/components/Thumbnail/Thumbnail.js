import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import useDidUpdate from 'hooks/useDidUpdate';
import core from 'core';
import ThumbnailControls from 'components/ThumbnailControls';
import thumbnailSelectionModes from 'constants/thumbnailSelectionModes';

import './Thumbnail.scss';
import { Choice } from '@pdftron/webviewer-react-toolkit';

// adds a delay in ms so thumbs that are only on the screen briefly are not loaded.
const THUMBNAIL_LOAD_DELAY = 50;

const Thumbnail = ({
  index,
  isSelected,
  updateAnnotations,
  shiftKeyThumbnailPivotIndex,
  onFinishLoading,
  onLoad,
  onRemove = () => {},
  onDragStart,
  onDragOver,
  isDraggable,
  shouldShowControls,
  thumbnailSize,
  currentPage,
  pageLabels = [],
  selectedPageIndexes,
  isThumbnailMultiselectEnabled,
  isReaderModeOrReadOnly,
  dispatch,
  actions,
  isMobile,
  canLoad,
  onCancel,
  isThumbnailSelectingPages,
  thumbnailSelectionMode,
  activeDocumentViewerKey,
}) => {
  const thumbSize = thumbnailSize ? Number(thumbnailSize) : 150;

  const [dimensions, setDimensions] = useState({ width: thumbSize, height: thumbSize });
  // To ensure checkmark loads after thumbnail
  const [loaded, setLoaded] = useState(false);

  let loadTimeout = null;

  const loadThumbnailAsync = () => {
    loadTimeout = setTimeout(() => {
      const thumbnailContainer = document.getElementById(`pageThumb${index}`);

      const pageNum = index + 1;
      const viewerRotation = core.getRotation(pageNum);

      const doc = core.getDocument(activeDocumentViewerKey);
      // Possible race condition can happen where we try to render a thumbnail for a page that has
      // been deleted. Prevent that by checking if pageInfo exists

      if (doc && doc.getPageInfo(pageNum)) {
        const id = doc.loadCanvas({
          pageNumber: pageNum,
          width: thumbSize,
          height: thumbSize,
          drawComplete: async (thumb) => {
            const thumbnailContainer = document.getElementById(`pageThumb${index}`);
            if (thumbnailContainer) {
              const childElement = thumbnailContainer.querySelector('.page-image');
              if (childElement) {
                thumbnailContainer.removeChild(childElement);
              }

              thumb.className = 'page-image';

              const ratio = Math.min(thumbSize / thumb.width, thumbSize / thumb.height);
              thumb.style.width = `${thumb.width * ratio}px`;
              thumb.style.height = `${thumb.height * ratio}px`;
              setDimensions({ width: Number(thumb.width), height: Number(thumb.height) });

              if (Math.abs(viewerRotation)) {
                const cssTransform = `rotate(${viewerRotation * 90}deg) translate(-50%,-50%)`;
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

            if (updateAnnotations) {
              updateAnnotations(index);
            }

            onFinishLoading(index);
            setLoaded(true);
          },
          allowUseOfOptimizedThumbnail: true,
        });
        onLoad(index, thumbnailContainer, id);
      }
    }, THUMBNAIL_LOAD_DELAY);
  };

  useEffect(() => {
    const onPagesUpdated = (changes) => {
      const { contentChanged, moved, added, removed } = changes;

      const currentPage = index + 1;

      const isPageAdded = added.includes(currentPage);
      const didPageChange = contentChanged.some((changedPage) => currentPage === changedPage);
      const didPageMove = Object.keys(moved).some((movedPage) => currentPage === parseInt(movedPage));
      const isPageRemoved = removed.includes(currentPage);
      const newPageCount = core.getTotalPages();

      if (removed.length > 0 && index + 1 > newPageCount) {
        return;
      }

      if (isPageAdded || didPageChange || didPageMove || isPageRemoved) {
        loadThumbnailAsync();
      }
    };

    const onRotationUpdated = () => {
      setLoaded(false);
      loadThumbnailAsync();
    };

    core.addEventListener('pagesUpdated', onPagesUpdated);
    core.addEventListener('rotationUpdated', onRotationUpdated);
    if (canLoad) {
      loadThumbnailAsync();
    }
    return () => {
      core.removeEventListener('pagesUpdated', onPagesUpdated);
      core.removeEventListener('rotationUpdated', onRotationUpdated);
      clearTimeout(loadTimeout);
      onRemove(index);
    };
  }, []);

  useDidUpdate(() => {
    if (canLoad) {
      loadThumbnailAsync();
      updateAnnotations(index);
    } else {
      onCancel(index);
    }
  }, [canLoad, activeDocumentViewerKey]);

  const handleClick = (e) => {
    const checkboxToggled = e.target.type && e.target.type === 'checkbox';
    if (isThumbnailMultiselectEnabled && !isReaderModeOrReadOnly) {
      const multiSelectionKeyPressed = e.ctrlKey || e.metaKey;
      const shiftKeyPressed = e.shiftKey;
      let updatedSelectedPages = [...selectedPageIndexes];

      if (shiftKeyPressed) {
        dispatch(actions.setThumbnailSelectingPages(true));
        // Include current page as part of selection if we just started shift-selecting
        let shiftKeyPivot = shiftKeyThumbnailPivotIndex;
        if (shiftKeyPivot === null) {
          shiftKeyPivot = currentPage - 1;
          dispatch(actions.setShiftKeyThumbnailsPivotIndex(shiftKeyPivot));
        }
        // get the range of the selected index and update selected page
        const currSelectMinIndex = Math.min(shiftKeyPivot, index);
        const currSelectMaxIndex = Math.max(shiftKeyPivot, index);
        updatedSelectedPages = Array.from(
          { length: currSelectMaxIndex - currSelectMinIndex + 1 },
          (_, i) => i + currSelectMinIndex,
        );
      } else if (multiSelectionKeyPressed || isThumbnailSelectingPages) {
        dispatch(actions.setThumbnailSelectingPages(true));
        // Only select a page if multiSelectionKeyPressed or if checkbox is checked unless in 'thumbnail' mode
        if (multiSelectionKeyPressed || checkboxToggled || thumbnailSelectionMode === thumbnailSelectionModes['THUMBNAIL']) {
          // Include current page as part of selection if we just started multi-selecting
          if (selectedPageIndexes.length === 0 && !isThumbnailSelectingPages) {
            updatedSelectedPages.push(currentPage - 1);
          } else if (selectedPageIndexes.includes(index)) {
            updatedSelectedPages = selectedPageIndexes.filter((pageIndex) => index !== pageIndex);
          } else {
            updatedSelectedPages.push(index);
          }
        }
      } else {
        updatedSelectedPages = [index];
      }
      // set shiftKeyPivot when press ctr key or single key
      !isThumbnailSelectingPages &&
        !shiftKeyPressed &&
        dispatch(actions.setShiftKeyThumbnailsPivotIndex(updatedSelectedPages[updatedSelectedPages.length - 1]));
      dispatch(actions.setSelectedPageThumbnails(updatedSelectedPages));
    } else if (isMobile()) {
      dispatch(actions.closeElement('leftPanel'));
    }

    // due to the race condition, we need a settimeout here
    // otherwise, sometimes the current page will not be visible in left panel
    setTimeout(() => {
      // If user clicks on checkbox, it should not automatically jump to that page,
      // only if the user clicks on thumbnail then go to page and view it, unless in 'thumbnail' mode
      if (!checkboxToggled || thumbnailSelectionMode === thumbnailSelectionModes['THUMBNAIL']) {
        core.setCurrentPage(index + 1);
      }
    }, 0);
  };

  const isActive = currentPage === index + 1;
  const pageLabel = pageLabels[index];
  let checkboxRotateClass = 'default';
  const rotation = core.getRotation(index + 1);
  if ((!rotation || rotation === 2) && dimensions.width > dimensions.height) {
    checkboxRotateClass = 'rotated';
  } else if ((rotation === 1 || rotation === 3) && dimensions.width < dimensions.height) {
    checkboxRotateClass = 'rotated';
  }

  return (
    <div
      className={classNames({
        Thumbnail: true,
        active: isActive,
        selected: isSelected && isThumbnailSelectingPages,
      })}
      onDragOver={(e) => onDragOver(e, index)}
      id="Thumbnail-container"
    >
      <div
        className="container"
        style={{
          width: thumbSize,
          height: thumbSize,
        }}
        onDragStart={(e) => onDragStart(e, index)}
        draggable={isDraggable}
        onClick={handleClick}
      >
        <div id={`pageThumb${index}`} className="thumbnail" />
        {isThumbnailSelectingPages && loaded && (
          <Choice className={`checkbox ${checkboxRotateClass}`} checked={selectedPageIndexes.includes(index)} />
        )}
      </div>
      <div className="page-label">{pageLabel}</div>
      {!isThumbnailSelectingPages && isActive && shouldShowControls && <ThumbnailControls index={index} />}
    </div>
  );
};

export default Thumbnail;
