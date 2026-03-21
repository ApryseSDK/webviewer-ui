import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import actions from 'actions';
import selectors from 'selectors';
import DocumentCropPopup from './DocumentCropPopup';
import './DocumentCropPopup.scss';
import Draggable from 'react-draggable';
import useOnCropAnnotationChangedOrSelected from '../../hooks/useOnCropAnnotationChangedOrSelected';
import { isMobileSize } from 'helpers/getDeviceSize';
import getRootNode from 'helpers/getRootNode';
import DataElements from 'constants/dataElement';
import MobilePopupWrapper from '../MobilePopupWrapper';
import useDraggablePosition from '../../hooks/useDraggablePosition';
import useCore from 'hooks/useCore';

export function focusActiveIcon(e) {
  if (e && e.nativeEvent.pointerType === '') {
    const activeToolBtn = getRootNode().querySelector('.active.ToolButton');
    activeToolBtn.focus();
  }
}

function DocumentCropPopupContainer() {
  const { core, documentViewer } = useCore();
  const cropCreateTool = core.getTool(window.Core.Tools.ToolNames['CROP']);
  const activeToolName = useSelector(selectors.getActiveToolName);
  const isDocumentCropPopupOpen = useSelector((state) => selectors.isElementOpen(state, DataElements.DOCUMENT_CROP_POPUP));
  const isInDesktopOnlyMode = useSelector(selectors.isInDesktopOnlyMode);
  const shouldShowApplyCropWarning = useSelector(selectors.shouldShowApplyCropWarning);
  const presetCropDimensions = useSelector(selectors.getPresetCropDimensions);

  const isOpen = activeToolName === window.Core.Tools.ToolNames['CROP'] && isDocumentCropPopupOpen;
  const dispatch = useDispatch();
  const [isCropping, setIsCropping] = useState(cropCreateTool.getIsCropping());

  const elementsToClose = ['leftPanel', 'searchPanel', 'notesPanel', 'redactionPanel', 'textEditingPanel'];

  const openDocumentCropPopup = () => {
    dispatch(actions.openElement(DataElements.DOCUMENT_CROP_POPUP));
    setSelectedPages(cropCreateTool.getPagesToCrop() || []);
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
  }, [core]);

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
    const modeToSet = cropMode || 'ALL_PAGES';
    cropCreateTool.setCropMode(modeToSet);
    setCropMode(modeToSet);
  }, [cropCreateTool]);

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
  const { position, handleDrag, handleStop, containerRef, setOverlayRef, initialOffset, dragBounds } = useDraggablePosition('top-right');

  const closeAndReset = () => {
    cropCreateTool.reset();
    if (cropMode === 'MULTI_PAGE') {
      cropCreateTool.setPagesToCrop([]);
    }
    dispatch(actions.closeElement(DataElements.DOCUMENT_CROP_POPUP));
    reenableHeader();
    core.setToolMode(window.Core.Tools.ToolNames.CROP);
  };

  const closeDocumentCropPopup = useCallback(
    (e) => {
      closeAndReset();
      focusActiveIcon(e);
    },
    [core, cropCreateTool, dispatch, closeAndReset, focusActiveIcon],
  );

  // disable/enable the 'apply' button when cropping
  useEffect(() => {
    setIsCropping(cropCreateTool.getIsCropping());
  }, [cropAnnotation]);

  const applyCrop = (e) => {
    cropCreateTool.applyCrop();
    cropCreateTool.reset();
    reenableHeader();
    focusActiveIcon(e);
  };

  const getPageHeight = useCallback((pageNumber) => {
    if (isPageRotated(pageNumber)) {
      return core.getPageWidth(pageNumber);
    }
    return core.getPageHeight(pageNumber);
  }, [core]);

  const getPageWidth = useCallback((pageNumber) => {
    if (isPageRotated(pageNumber)) {
      return core.getPageHeight(pageNumber);
    }
    return core.getPageWidth(pageNumber);
  }, [core]);

  const isPageRotated = useCallback((pageNumber) => {
    return documentViewer?.getDocument().getPageRotation(pageNumber) % 180 !== 0;
  }, [documentViewer]);

  const getPageCount = useCallback(() => {
    return documentViewer?.getPageCount();
  }, [documentViewer]);

  const getCurrentPage = useCallback(() => {
    return documentViewer?.getCurrentPage();
  }, [documentViewer]);

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
  }, [core]);

  const isMobile = isMobileSize();

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
    isMobile,
  };

  if (isOpen && core.getDocument()) {
    if (isMobile && !isInDesktopOnlyMode) {
      // disable draggable on mobile devices
      return (
        <MobilePopupWrapper>
          <div className="DocumentCropPopupContainer" ref={cropPopupRef}>
            <DocumentCropPopup {...props} isMobile />
          </div>
        </MobilePopupWrapper>
      );
    }
    return (
      <Draggable
        cancel={'input, button, .collapsible-menu, .ui__choice__label'}
        position={position}
        bounds={dragBounds}
        onDrag={handleDrag}
        onStop={handleStop}
      >
        <div
          className="DocumentCropPopupContainer"
          ref={(el) => {
            cropPopupRef.current = el;
            containerRef.current = el;
            setOverlayRef(el);
          }}
          style={initialOffset}
        >
          <DocumentCropPopup {...props} />
        </div>
      </Draggable>
    );
  }
  return null;
}

export default DocumentCropPopupContainer;
