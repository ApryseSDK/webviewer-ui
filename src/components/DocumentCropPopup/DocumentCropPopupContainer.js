import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import actions from 'actions';
import selectors from 'selectors';
import core from 'core';
import DocumentCropPopup from './DocumentCropPopup';
import './DocumentCropPopup.scss';
import Draggable from 'react-draggable';
import useOnCropAnnotationChangedOrSelected from '../../hooks/useOnCropAnnotationChangedOrSelected';
import useMedia from '../../hooks/useMedia';

function DocumentCropPopupContainer() {
  const cropCreateTool = core.getTool(window.Core.Tools.ToolNames['CROP']);
  const [isOpen, isInDesktopOnlyMode, presetCropDimensions] = useSelector(state => [
    selectors.getActiveToolName(state) === window.Core.Tools.ToolNames['CROP'] &&
      selectors.isElementOpen(state, 'documentCropPopup'),
    selectors.isInDesktopOnlyMode(state),
    selectors.getPresetCropDimensions(state),
  ]);
  const dispatch = useDispatch();
  const [isCropping, setIsCropping] = useState(cropCreateTool.getIsCropping());

  const elementsToClose = ['leftPanel', 'searchPanel', 'notesPanel', 'redactionPanel'];

  const openDocumentCropPopup = () => {
    dispatch(actions.openElement('documentCropPopup'));
    setSelectedPages(cropCreateTool.getPagesToCrop());
    instance.UI.closeElements(elementsToClose);
    setIsCropping(cropCreateTool.getIsCropping());
  };

  useEffect(() => {
    const handleToolModeChange = (newTool, oldTool) => {
      if (newTool instanceof Core.Tools.CropCreateTool) {
        openDocumentCropPopup();
      } else if (oldTool instanceof Core.Tools.CropCreateTool) {
        setIsCropping(cropCreateTool.getIsCropping());
        reenableHeader();
      }
    };
    core.addEventListener('toolModeUpdated', handleToolModeChange);
    return () => {
      core.removeEventListener('toolModeUpdated', handleToolModeChange);
    };
  });

  const disableHeader = () => {
    const header = document.querySelector('[data-element=header]');
    if (header) {
      header.style.pointerEvents = 'none';
      header.style.opacity = '0.5';
    }

    const toolsHeader = document.querySelector('[data-element=toolsHeader]');
    if (toolsHeader) {
      toolsHeader.style.pointerEvents = 'none';
      toolsHeader.style.opacity = '0.5';
    }
  };

  const reenableHeader = () => {
    const header = document.querySelector('[data-element=header]');
    if (header) {
      header.style.pointerEvents = '';
      header.style.opacity = '1';
    }

    const toolsHeader = document.querySelector('[data-element=toolsHeader]');
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

  const onCropModeChange = cropName => {
    cropCreateTool.setCropMode(cropName);
    setCropMode(cropName);
  };

  const [selectedPages, setSelectedPages] = useState(cropCreateTool.getPagesToCrop());

  const onSelectedPagesChange = pages => {
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

  const closeAndReset = () => {
    cropCreateTool.reset();
    if (cropMode === 'MULTI_PAGE') {
      setPagesToCrop([]);
      cropCreateTool.setPagesToCrop([]);
    }
    dispatch(actions.closeElement('documentCropPopup'));
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
  };

  const getPageHeight = useCallback(pageNumber => {
    if (isPageRotated(pageNumber)) {
      return core.getPageWidth(pageNumber);
    }
    return core.getPageHeight(pageNumber);
  }, []);

  const getPageWidth = useCallback(pageNumber => {
    if (isPageRotated(pageNumber)) {
      return core.getPageHeight(pageNumber);
    }
    return core.getPageWidth(pageNumber);
  }, []);

  const isPageRotated = useCallback(pageNumber => {
    return documentViewer?.getDocument().getPageRotation(pageNumber) % 180 !== 0;
  });

  const getPageCount = useCallback(() => {
    return documentViewer?.getPageCount();
  });

  const getCurrentPage = useCallback(() => {
    return documentViewer?.getCurrentPage();
  });

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
    presetCropDimensions,
  };

  const isMobile = useMedia(['(max-width: 640px)'], [true], false);

  if (isOpen && core.getDocument()) {
    if (isMobile && !isInDesktopOnlyMode) {
      //disable draggable on mobile devices
      return (
        <div className="DocumentCropPopupContainer" ref={cropPopupRef}>
          <DocumentCropPopup {...props} isMobile />
        </div>
      );
    } else {
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
  } else {
    return null;
  }
}

export default DocumentCropPopupContainer;
