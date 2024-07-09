import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import actions from 'actions';
import selectors from 'selectors';
import core from 'core';
import DocumentCropPopup from './DocumentCropPopup';
import './DocumentCropPopup.scss';
import Draggable from 'react-draggable';
import useOnCropAnnotationChangedOrSelected from '../../hooks/useOnCropAnnotationChangedOrSelected';
import { isMobileSize } from 'helpers/getDeviceSize';
import getRootNode from 'helpers/getRootNode';
import DataElements from 'constants/dataElement';

function DocumentCropPopupContainer() {
  const cropCreateTool = core.getTool(window.Core.Tools.ToolNames['CROP']);
  const [
    isOpen,
    isInDesktopOnlyMode,
    shouldShowApplyCropWarning,
    presetCropDimensions,
  ] = useSelector((state) => [
    selectors.getActiveToolName(state) === window.Core.Tools.ToolNames['CROP'] &&
    selectors.isElementOpen(state, DataElements.DOCUMENT_CROP_POPUP),
    selectors.isInDesktopOnlyMode(state),
    selectors.shouldShowApplyCropWarning(state),
    selectors.getPresetCropDimensions(state),
  ]);

  const dispatch = useDispatch();
  const [isCropping, setIsCropping] = useState(cropCreateTool.getIsCropping());

  const elementsToClose = ['leftPanel', 'searchPanel', 'notesPanel', 'redactionPanel', 'textEditingPanel'];

  const openDocumentCropPopup = () => {
    dispatch(actions.openElement(DataElements.DOCUMENT_CROP_POPUP));
    setSelectedPages(cropCreateTool.getPagesToCrop());
    // eslint-disable-next-line no-undef
    dispatch(actions.closeElements(elementsToClose));
    setIsCropping(cropCreateTool.getIsCropping());
  };

  useEffect(() => {
    const handleToolModeChange = (newTool, oldTool) => {
      if (newTool instanceof Core.Tools.CropCreateTool) { // eslint-disable-line no-undef
        openDocumentCropPopup();
      } else if (oldTool instanceof Core.Tools.CropCreateTool) { // eslint-disable-line no-undef
        setIsCropping(cropCreateTool.getIsCropping());
        reenableHeader();
      }
    };

    const handleCropModeChange = (newMode) => {
      setCropMode(newMode);
    };

    cropCreateTool.addEventListener('cropModeChanged', handleCropModeChange);
    core.addEventListener('toolModeUpdated', handleToolModeChange);

    return () => {
      cropCreateTool.removeEventListener('cropModeChanged', handleCropModeChange);
      core.removeEventListener('toolModeUpdated', handleToolModeChange);
    };
  });

  const disableHeader = () => {
    const header = getRootNode().querySelector('[data-element=header]');
    if (header) {
      header.style.pointerEvents = 'none';
      header.style.opacity = '0.5';
    }

    const toolsHeader = getRootNode().querySelector('[data-element=toolsHeader]');
    if (toolsHeader) {
      toolsHeader.style.pointerEvents = 'none';
      toolsHeader.style.opacity = '0.5';
    }
  };

  const reenableHeader = () => {
    const header = getRootNode().querySelector('[data-element=header]');
    if (header) {
      header.style.pointerEvents = '';
      header.style.opacity = '1';
    }

    const toolsHeader = getRootNode().querySelector('[data-element=toolsHeader]');
    if (toolsHeader) {
      toolsHeader.style.pointerEvents = '';
      toolsHeader.style.opacity = '1';
    }
  };

  const cropAnnotation = useOnCropAnnotationChangedOrSelected(openDocumentCropPopup);

  // re-enable other tools and panels while not cropping
  useEffect(() => {
    if (!isCropping) {
      reenableHeader();
    } else {
      disableHeader();
    }
  }, [isCropping]);

  const [cropMode, setCropMode] = useState(null);

  useEffect(() => {
    cropCreateTool.setCropMode('ALL_PAGES');
    setCropMode('ALL_PAGES');
  }, []);

  const onCropModeChange = (cropName) => {
    cropCreateTool.setCropMode(cropName);
    setCropMode(cropName);
  };

  const [selectedPages, setSelectedPages] = useState(cropCreateTool.getPagesToCrop());

  const onSelectedPagesChange = (pages) => {
    if (pages.length) {
      setSelectedPages(pages);
      cropCreateTool.setPagesToCrop(pages);
      if (cropCreateTool.getIsCropping()) {
        if (cropMode === 'MULTI_PAGE') {
          cropCreateTool.multiSelectAnnotations(pages);
        }
      }
    }
  };

  const cropPopupRef = useRef();
  const DEFAULT_POPUP_WIDTH = 250;
  const DEFAULT_POPUP_HEIGHT = 250;
  const documentContainerElement = core.getScrollViewElement();
  const popupWidth = cropPopupRef.current?.getBoundingClientRect().width || DEFAULT_POPUP_WIDTH;
  const popupHeight = cropPopupRef.current?.getBoundingClientRect().height || DEFAULT_POPUP_HEIGHT;
  const documentViewer = core.getDocumentViewer(1);

  const docContainer = getRootNode().querySelector('.DocumentContainer');
  const xOffset = docContainer?.getBoundingClientRect().width || 0;

  const cropPopupOffset = () => {
    const offset = {
      x: xOffset - popupWidth - 20,
      y: documentContainerElement?.offsetTop + 10,
    };
    if (cropAnnotation && cropPopupRef?.current) {
      offset.x = Math.min(offset.x, documentContainerElement.offsetWidth - popupWidth);
    }
    return offset;
  };

  const cropPopupBounds = () => {
    const bounds = {
      top: 0,
      bottom: documentContainerElement.offsetHeight - popupHeight,
      left: 0 - cropPopupOffset()['x'],
      right: documentContainerElement.offsetWidth - cropPopupOffset()['x'] - popupWidth,
    };
    return bounds;
  };

  const closeAndReset = () => {
    cropCreateTool.reset();
    if (cropMode === 'MULTI_PAGE') {
      // eslint-disable-next-line no-undef
      setPagesToCrop([]);
      cropCreateTool.setPagesToCrop([]);
    }
    dispatch(actions.closeElement(DataElements.DOCUMENT_CROP_POPUP));
    reenableHeader();
    core.setToolMode(window.Core.Tools.ToolNames.CROP);
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
    cropCreateTool.reset();
    reenableHeader();
  };

  const getPageHeight = useCallback((pageNumber) => {
    if (isPageRotated(pageNumber)) {
      return core.getPageWidth(pageNumber);
    }
    return core.getPageHeight(pageNumber);
  }, []);

  const getPageWidth = useCallback((pageNumber) => {
    if (isPageRotated(pageNumber)) {
      return core.getPageHeight(pageNumber);
    }
    return core.getPageWidth(pageNumber);
  }, []);

  const isPageRotated = useCallback((pageNumber) => {
    // eslint-disable-next-line no-undef
    return documentViewer?.getDocument().getPageRotation(pageNumber) % 180 !== 0;
  });

  const getPageCount = useCallback(() => {
    // eslint-disable-next-line no-undef
    return documentViewer?.getPageCount();
  });

  const getCurrentPage = useCallback(() => {
    // eslint-disable-next-line no-undef
    return documentViewer?.getCurrentPage();
  });

  const redrawCropAnnotations = useCallback((rect) => {
    const cropAnnotations = core
      .getAnnotationManager()
      .getAnnotationsList()
      .filter((annot) => {
        return annot.ToolName === window.Core.Tools.ToolNames['CROP'];
      });
    cropAnnotations.forEach((annot) => {
      annot.setRect(rect);
      core.getAnnotationManager().drawAnnotationsFromList([annot]);
    });
  }, []);

  const props = {
    cropAnnotation,
    cropMode,
    onCropModeChange,
    closeDocumentCropPopup,
    applyCrop,
    isCropping,
    getPageHeight,
    getPageWidth,
    isPageRotated,
    redrawCropAnnotations,
    isInDesktopOnlyMode,
    getPageCount,
    getCurrentPage,
    selectedPages,
    onSelectedPagesChange,
    shouldShowApplyCropWarning,
    presetCropDimensions,
  };

  const isMobile = isMobileSize();

  if (isOpen && core.getDocument()) {
    if (isMobile && !isInDesktopOnlyMode) {
      // disable draggable on mobile devices
      return (
        <div className="DocumentCropPopupContainer" ref={cropPopupRef}>
          <DocumentCropPopup {...props} isMobile />
        </div>
      );
    }
    return (
      <Draggable
        cancel={'input, button, .collapsible-menu, .ui__choice__label'}
        positionOffset={cropPopupOffset()}
        bounds={cropPopupBounds()}
      >
        <div className="DocumentCropPopupContainer" ref={cropPopupRef}>
          <DocumentCropPopup {...props} />
        </div>
      </Draggable>
    );
  }
  return null;
}

export default DocumentCropPopupContainer;
