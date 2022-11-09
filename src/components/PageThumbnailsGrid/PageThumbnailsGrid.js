import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ThumbnailCard from 'components/ThumbnailCard';

function PageThumbnailsGrid({ document, onThumbnailSelected, selectedThumbnails, onfileLoadedHandler }) {
  const [thumbnails, setThumbnails] = useState([]);
  const [completedPages, setCompletedPagesCount] = useState(0);
  const [t] = useTranslation();

  useEffect(() => {
    const inFlightPromiseIds = [];
    async function generateThumbnails() {
      const thumbnails = [];
      const pageCount = document.getPageCount();
      const thumbnailPromises = [];
      for (let i = 1; i <= pageCount; i++) {
        const thumbnailPromise = new Promise((resolve) => {
          const promiseId = document.loadThumbnail(i, (result) => {
            let thumbnail;
            // If we get an embedded thumbnail we set the currentSrc prop
            // otherwise we set the URl to avoid having to call this repeatedly every time the thumbnail card is rendered
            if (result.currentSrc) {
              thumbnail = {
                pageNumber: i,
                currentSrc: result.currentSrc,
              };
            } else {
              thumbnail = {
                pageNumber: i,
                url: result.toDataURL(),
              };
            }
            thumbnails.push(thumbnail);
            setCompletedPagesCount(i);
            resolve();
          });
          inFlightPromiseIds.push(promiseId);
        });
        thumbnailPromises.push(thumbnailPromise);
      }

      await Promise.all(thumbnailPromises);
      const sortedThumbnails = [...thumbnails].sort((a, b) => a.pageNumber - b.pageNumber);
      setThumbnails(sortedThumbnails);
      inFlightPromiseIds.length = 0;
      onfileLoadedHandler(false);
    }

    if (document) {
      generateThumbnails();
    }

    return () => {
      inFlightPromiseIds.forEach((id) => document.cancelLoadThumbnail(id));
    };
  }, [document]);

  if (thumbnails.length > 0) {
    return thumbnails.map((thumbnail, index) => {
      const pageNumber = index + 1;
      return (
        <ThumbnailCard key={pageNumber}
          onChange={() => onThumbnailSelected(pageNumber)}
          checked={!!selectedThumbnails[pageNumber]}
          index={index}
          thumbnail={thumbnail}
        />
      );
    });
  }

  const pageCount = document ? document.getPageCount() : 0;
  const processText = `${completedPages}/${pageCount}`;
  return (<div>{t('message.processing')} {processText}</div>);
}

export default PageThumbnailsGrid;