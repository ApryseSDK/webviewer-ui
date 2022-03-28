import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import actions from 'actions';
import selectors from 'selectors';
import core from 'core';
import DocumentCropPopup from './DocumentCropPopup';
import './DocumentCropPopup.scss';
import Draggable from 'react-draggable';
import useOnCropAnnotationAddedOrSelected from '../../hooks/useOnCropAnnotationAddedOrSelected';
import useMedia from '../../hooks/useMedia';

function DocumentCropPopupContainer() {
  const cropCreateTool = core.getTool(window.Core.Tools.ToolNames['CROP']);
  const [isOpen, isInDesktopOnlyMode] = useSelector(state => [
    selectors.getActiveToolName(state) === window.Core.Tools.ToolNames['CROP'] &&
      selectors.isElementOpen(state, 'documentCropPopup'),
    selectors.isInDesktopOnlyMode(state),
  ]);
  const dispatch = useDispatch();
  const [isCropping, setIsCropping] = useState(cropCreateTool.getIsCropping());

  const openDocumentCropPopup = () => {
    dispatch(actions.openElement('documentCropPopup'));
    setIsCropping(cropCreateTool.getIsCropping());
  };

  const cropAnnotation = useOnCropAnnotationAddedOrSelected(openDocumentCropPopup);

  // disable other tools and the left panel while crop popup is open
  useEffect(() => {
    if (isOpen) {
      instance.UI.disableElements(['leftPanel', 'leftPanelButton']);
      instance.UI.disableFeatures([instance.UI.Feature.Ribbons]);
    } else {
      instance.UI.enableElements(['leftPanel', 'leftPanelButton']);
      instance.UI.enableFeatures([instance.UI.Feature.Ribbons]);
    }
  }, [isOpen]);

  const [cropMode, setCropMode] = useState(null);

  useEffect(() => {
    cropCreateTool.setCropMode('ALL_PAGES');
    setCropMode('ALL_PAGES');
  }, []);

  const onCropModeChange = cropName => {
    cropCreateTool.setCropMode(cropName);
    setCropMode(cropName);
  };

  const [documentContainerWidth, documentContainerHeight] = useSelector(state => [
    selectors.getDocumentContainerWidth(state),
    selectors.getDocumentContainerHeight(state),
  ]);

  const cropPopupRef = useRef();

  const popupWidth = cropPopupRef.current?.getBoundingClientRect().width || 0;
  const popupHeight = cropPopupRef.current?.getBoundingClientRect().height || 0;
  const headerHeight = document.querySelector('[data-element=header]')?.offsetHeight || 0;
  const headerToolsHeight = document.querySelector('[data-element=toolsHeader]')?.offsetHeight || 0;
  const yOffset = headerHeight + headerToolsHeight;
  const xOffset = documentViewer.getViewerElement()?.getBoundingClientRect().right || 0;

  const cropPopupOffset = () => {
    const offset = {
      x: xOffset + 35,
      y: yOffset + 10,
    };
    if (cropAnnotation && cropPopupRef?.current) {
      offset.x = Math.min(offset.x, documentContainerWidth - popupWidth);
    }
    return offset;
  };

  const cropPopupBounds = () => {
    const bounds = {
      top: 0,
      bottom: documentContainerHeight - popupHeight,
      left: 0 - cropPopupOffset()['x'],
      right: documentContainerWidth - cropPopupOffset()['x'] - popupWidth,
    };
    return bounds;
  };

  const getCropDimension = dimension => {
    switch (dimension) {
      case 'top':
        return cropCreateTool.getCropTop(cropAnnotation);
      case 'bottom':
        return cropCreateTool.getCropBottom(cropAnnotation);
      case 'left':
        return cropCreateTool.getCropLeft(cropAnnotation);
      case 'right':
        return cropCreateTool.getCropRight(cropAnnotation);
    }
  };

  const setCropTop = val => {
    cropCreateTool.setCropTop(cropAnnotation, val);
  };

  const setCropBottom = val => {
    cropCreateTool.setCropBottom(cropAnnotation, val);
  };

  const setCropLeft = val => {
    cropCreateTool.setCropLeft(cropAnnotation, val);
  };

  const setCropRight = val => {
    cropCreateTool.setCropRight(cropAnnotation, val);
  };

  const closeAndReset = () => {
    cropCreateTool.reset();
    dispatch(actions.closeElement('documentCropPopup'));
  };

  const closeDocumentCropPopup = useCallback(() => {
    closeAndReset();
  }, []);

  // disable/enable the 'apply' button when cropping
  useEffect(() => {
    setIsCropping(cropCreateTool.getIsCropping());
  }, [cropAnnotation]);

  const applyCrop = () => {
    cropCreateTool.applyCrop();
    if (cropMode === 'ALL_PAGES') {
      closeAndReset();
    } else {
      cropCreateTool.reset();
    }
  };

  const getPageHeight = useCallback(pageNumber => {
    return core.getPageHeight(pageNumber);
  }, []);

  const getPageWidth = useCallback(pageNumber => {
    return core.getPageWidth(pageNumber);
  }, []);

  const redrawCropAnnotations = useCallback(rect => {
    const cropAnnotations = core
      .getAnnotationManager()
      .getAnnotationsList()
      .filter(annot => {
        return annot.ToolName === window.Core.Tools.ToolNames['CROP'];
      });
    cropAnnotations.forEach(annot => {
      annot.setRect(rect);
      core.getAnnotationManager().drawAnnotationsFromList([annot]);
    });
  }, []);

  const props = {
    cropAnnotation,
    cropMode,
    onCropModeChange,
    getCropDimension,
    setCropTop,
    setCropBottom,
    setCropLeft,
    setCropRight,
    closeDocumentCropPopup,
    applyCrop,
    isCropping,
    getPageHeight,
    getPageWidth,
    redrawCropAnnotations,
    isInDesktopOnlyMode
  };

  const isMobile = useMedia(['(max-width: 640px)'], [true], false);

  if (isOpen) {
    if (isMobile && !isInDesktopOnlyMode) {
      //disable draggable on mobile devices
      return (
        <div className="DocumentCropPopupContainer" ref={cropPopupRef}>
          <DocumentCropPopup {...props} isMobile />
        </div>
      );
    } else {
      return (
        <Draggable cancel={'input'} positionOffset={cropPopupOffset()} bounds={cropPopupBounds()}>
          <div className="DocumentCropPopupContainer" ref={cropPopupRef}>
            <DocumentCropPopup {...props} />
          </div>
        </Draggable>
      );
    }
  } else {
    return null;
  }
}

export default DocumentCropPopupContainer;
