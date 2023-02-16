import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import core from 'core';

import WatermarkList from './WatermarkList';

const ImageWatermarkPanel = () => {
  const { t } = useTranslation();
  const fileInput = useRef(null);

  const documentViewer = core.getDocumentViewer(1);
  const annotationManager = documentViewer?.getAnnotationManager();

  const onAddButtonClick = () => {
    fileInput.current.click();
  };

  const loadFile = (e) => {
    const pageCount = documentViewer?.getPageCount();
    const document = documentViewer?.getDocument();

    e.preventDefault();
    const { files } = e.target;
    if (files.length) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          for (let page = 1; page <= pageCount; page++) {
            const { width, height } = document?.getPageInfo(page);
            const imageWatermark = new Annotations.StampAnnotation({
              PageNumber: page,
              X: width / 2,
              Y: height / 2,
              Width: 25,
              Height: 25,
            });

            await imageWatermark.setImageData(reader.result);
            annotationManager?.addAnnotation(imageWatermark);
            annotationManager?.redrawAnnotation(imageWatermark);
          }
        };
      });
    }
  };

  return (
    <>
      <WatermarkList />
      <button className="add-watermark-button" onClick={onAddButtonClick}>
        {t('watermarkPanel.browse')}
      </button>
      <input
        ref={fileInput}
        className="hidden"
        type="file"
        onChange={loadFile}
        accept="image/*"
      />
    </>
  );
};

export default ImageWatermarkPanel;