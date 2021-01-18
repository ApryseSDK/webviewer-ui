import React, { useEffect } from 'react';
import classNames from 'classnames';

import core from 'core';
import ThumbnailControls from 'components/ThumbnailControls';

import './Thumbnail.scss';

const Thumbnail = ({
  index,
  isSelected,
  updateAnnotations,
  onFinishLoading,
  onLoad,
  onRemove,
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
  isMobile
}) => {
  const thumbSize = thumbnailSize ? Number(thumbnailSize) : 150;

  useEffect(() => {
    const loadThumbnailAsync = () => {
      const thumbnailContainer = document.getElementById(`pageThumb${index}`);
      const pageNum = index + 1;
      const viewerRotation = core.getRotation(pageNum);
  
      const doc = core.getDocument();
  
      if (doc) {
        const id = doc.loadCanvasAsync({
          pageNumber: pageNum,
          zoom: thumbSize > 150 ? 1 : 0.5,
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
          },
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
      const newPageCount = pageLabels.length - removed.length;
  
      if (removed.length > 0 && index + 1 > newPageCount) {
        return;
      }
  
      if (isPageAdded || didPageChange || didPageMove || isPageRemoved) {
        loadThumbnailAsync();
      }
    };

    const onRotationUpdated = () => {
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
      let updatedSelectedPages = [...selectedPageIndexes];

      if (multiSelectionKeyPressed) {
        // Include current page as part of selection if we just started multi-selecting
        if (selectedPageIndexes.length === 0) {
          updatedSelectedPages.push(currentPage - 1);
        }

        if (selectedPageIndexes.includes(index)) {
          updatedSelectedPages = selectedPageIndexes.filter(pageIndex => index !== pageIndex);
        } else {
          updatedSelectedPages.push(index);
        }
      } else {
        updatedSelectedPages = [index];
      }

      dispatch(actions.setSelectedPageThumbnails(updatedSelectedPages));
    } else if (isMobile()) {
      dispatch(actions.closeElement('leftPanel'));
    }

    core.setCurrentPage(index + 1);
  };

  const isActive = currentPage === index + 1;
  const pageLabel = pageLabels[index];

  return (
    <div
      className={classNames({
        Thumbnail: true,
        active: isActive,
        selected: isSelected,
      })}
      onClick={handleClick}
      onDragOver={e => onDragOver(e, index)}
    >
      <div
        className="container"
        style={{
          width: thumbSize,
          height: thumbSize,
        }}
        onDragStart={e => onDragStart(e, index)}
        draggable={isDraggable}
      >
        <div id={`pageThumb${index}`} className="thumbnail" />
      </div>
      <div className="page-label">{pageLabel}</div>
      {isActive && shouldShowControls && <ThumbnailControls index={index} />}
    </div>
  );
};

export default Thumbnail;
