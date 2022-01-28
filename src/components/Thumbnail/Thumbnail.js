import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import core from 'core';
import ThumbnailControls from 'components/ThumbnailControls';

import './Thumbnail.scss';
import { Choice } from "@pdftron/webviewer-react-toolkit";
import { workerTypes } from "constants/types";

const Thumbnail = ({
  index,
  isSelected,
  updateAnnotations,
  shiftKeyThumbnailPivotIndex,
  onFinishLoading,
  onLoad,
  onRemove = () => { },
  onDragStart,
  onDragOver,
  isDraggable,
  shouldShowControls,
  thumbnailSize,
  currentPage,
  pageLabels = [],
  selectedPageIndexes,
  isThumbnailMultiselectEnabled,
  isReaderMode,
  dispatch,
  actions,
  isMobile,
  isThumbnailSelectingPages
}) => {
  const thumbSize = thumbnailSize ? Number(thumbnailSize) : 150;

  const [dimensions, setDimensions] = useState({ width: thumbSize, height: thumbSize });
  // To ensure checkmark loads after thumbnail
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadThumbnailAsync = () => {
      const thumbnailContainer = document.getElementById(`pageThumb${index}`);
      const pageNum = index + 1;
      const viewerRotation = core.getRotation(pageNum);

      const doc = core.getDocument();
      // Possible race condition can happen where we try to render a thumbnail for a page that has
      // been deleted. Prevent that by checking if pageInfo exists

      if (doc && doc.getPageInfo(pageNum)) {
        const id = doc.loadCanvasAsync({
          pageNumber: pageNum,
          width: thumbSize,
          height: thumbSize,
          drawComplete: async thumb => {
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
          source: 'thumbnail',
          'isInternalRender': true,
        });
        onLoad(index, thumbnailContainer, id);
      }
    };

    const onLayoutChanged = changes => {
      const { contentChanged, moved, added, removed } = changes;

      const currentPage = index + 1;

      const isPageAdded = added.includes(currentPage);
      const didPageChange = contentChanged.some(changedPage => currentPage === changedPage);
      const didPageMove = Object.keys(moved).some(movedPage => currentPage === parseInt(movedPage));
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

    core.addEventListener('layoutChanged', onLayoutChanged);
    core.addEventListener('rotationUpdated', onRotationUpdated);
    loadThumbnailAsync();
    return () => {
      core.removeEventListener('layoutChanged', onLayoutChanged);
      core.removeEventListener('rotationUpdated', onRotationUpdated);
      onRemove(index);
    };
  }, []);

  const handleClick = e => {
    if (isThumbnailMultiselectEnabled && !isReaderMode) {
      const multiSelectionKeyPressed = e.ctrlKey || e.metaKey;
      const shiftKeyPressed = e.shiftKey;
      let updatedSelectedPages = [...selectedPageIndexes];

      if (shiftKeyPressed) {
        // Include current page as part of selection if we just started shift-selecting
        let shiftKeyPivot = shiftKeyThumbnailPivotIndex;
        if (shiftKeyPivot === null) {
          shiftKeyPivot = currentPage - 1;
          dispatch(actions.setShiftKeyThumbnailsPivotIndex(shiftKeyPivot));
        }
        // get the range of the selected index and update selected page
        const currSelectMinIndex = Math.min(shiftKeyPivot, index);
        const currSelectMaxIndex = Math.max(shiftKeyPivot, index);
        updatedSelectedPages = Array.from({ length: currSelectMaxIndex - currSelectMinIndex + 1 }, (_, i) => i + currSelectMinIndex);
      } else if (multiSelectionKeyPressed || isThumbnailSelectingPages) {
        // Include current page as part of selection if we just started multi-selecting
        if (selectedPageIndexes.length === 0 && !isThumbnailSelectingPages) {
          updatedSelectedPages.push(currentPage - 1);
        } else if (selectedPageIndexes.includes(index)) {
          updatedSelectedPages = selectedPageIndexes.filter(pageIndex => index !== pageIndex);
        } else {
          updatedSelectedPages.push(index);
        }
      } else {
        updatedSelectedPages = [index];
      }
      // set shiftKeyPivot when press ctr key or single key
      !shiftKeyPressed && dispatch(actions.setShiftKeyThumbnailsPivotIndex(updatedSelectedPages[updatedSelectedPages.length - 1]));
      dispatch(actions.setSelectedPageThumbnails(updatedSelectedPages));
    } else if (isMobile()) {
      dispatch(actions.closeElement('leftPanel'));
    }
    // due to the race condition, we need a settimeout here
    // otherwise, sometimes the current page will not be visible in left panel
    setTimeout(() => {
      core.setCurrentPage(index + 1);
    }, 0);
  };

  const isActive = currentPage === index + 1;
  const pageLabel = pageLabels[index];
  let checkboxRotateClass = "default";
  const rotation = core.getRotation(index + 1);
  if ((!rotation || rotation === 2) && dimensions.width > dimensions.height) {
    checkboxRotateClass = "rotated";
  } else if ((rotation === 1 || rotation === 3) && dimensions.width < dimensions.height) {
    checkboxRotateClass = "rotated";
  }

  const ratio = Math.min(thumbSize / dimensions.width, thumbSize / dimensions.height);

  const rotateDimDiv = core.getDocument()?.type === workerTypes.XOD;

  return (
    <div
      className={classNames({
        Thumbnail: true,
        active: isActive,
        selected: isSelected,
      })}
      onDragOver={e => onDragOver(e, index)}
      id="Thumbnail-container"
    >
      <div
        className="container"
        style={{
          width: thumbSize,
          height: thumbSize,
        }}
        onDragStart={e => onDragStart(e, index)}
        draggable={isDraggable}
        onClick={handleClick}
      >
        <div id={`pageThumb${index}`} className="thumbnail" />
        {isThumbnailSelectingPages && <div className={`dim ${rotateDimDiv && checkboxRotateClass}`} style={{ width: dimensions.width * ratio, height: dimensions.height * ratio }} />}
        {isThumbnailSelectingPages && loaded &&
        <Choice
          className={`checkbox ${checkboxRotateClass}`}
          checked={selectedPageIndexes.includes(index)}
        />}
      </div>
      <div className="page-label">{pageLabel}</div>
      {isActive && shouldShowControls && <ThumbnailControls index={index} />}
    </div>
  );
};

export default Thumbnail;
