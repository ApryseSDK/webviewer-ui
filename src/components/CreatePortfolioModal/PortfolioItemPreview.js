import React, { useState, useRef, useEffect, memo } from 'react';
import core from 'core';
import Icon from 'components/Icon';

const options = { loadAsPDF: true };

const PortfolioItemPreview = ({ item }) => {
  const canvasContainer = useRef();
  const [showIcon, setShowIcon] = useState(false);

  useEffect(() => {
    let document;
    let requestId;

    const fn = async () => {
      try {
        document = await core.createDocument(item, options);
        const pageCount = document.getPageCount();
        if (pageCount < 1) {
          setShowIcon(true);
          return;
        }
        requestId = await document.loadThumbnail(1, (canvas) => {
          const canvasContainerWidth = canvasContainer.current.clientWidth;
          const canvasContainerHeight = canvasContainer.current.clientHeight;
          const canvasWidth = canvas.width;
          const canvasHeight = canvas.height;
          if (canvasContainerWidth < canvasWidth || canvasContainerHeight < canvasHeight) {
            const ratio = Math.min(canvasContainerWidth / canvasWidth, canvasContainerHeight / canvasHeight);
            canvas.style.width = `${canvasWidth * ratio}px`;
            canvas.style.height = `${canvasHeight * ratio}px`;
          }
          canvasContainer.current?.appendChild(canvas);
        });
      } catch (e) {
        setShowIcon(true);
      }
    };

    fn();

    return () => {
      requestId && document.cancelLoadThumbnail(requestId);
    };
  }, []);

  return (
    <div className="preview-container" ref={canvasContainer}>
      {showIcon && (
        <Icon glyph="icon-portfolio-file" />
      )}
    </div>
  );
};

export default memo(PortfolioItemPreview);
