import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import actions from 'actions';
import selectors from 'selectors';
import core from 'core';
import SnippingToolPopup from './SnippingToolPopup';
import './SnippingToolPopup.scss';
import Draggable from 'react-draggable';
import useOnSnippingAnnotationChangedOrSelected from '../../hooks/useOnSnippingAnnotationChangedOrSelected';
import { isMobileSize } from 'helpers/getDeviceSize';
import getRootNode from 'helpers/getRootNode';
import DataElements from 'constants/dataElement';
import { focusActiveIcon } from 'components/DocumentCropPopup/DocumentCropPopupContainer';
import useDraggablePosition from '../../hooks/useDraggablePosition';

function SnippingToolPopupContainer() {
  const snippingToolName = window.Core.Tools.ToolNames['SNIPPING'];
  const snippingCreateTool = core.getTool(snippingToolName);
  const [
    isOpen,
    isInDesktopOnlyMode,
    shouldShowApplySnippingWarning,
  ] = useSelector((state) => [
    selectors.getActiveToolName(state) === snippingToolName && selectors.isElementOpen(state, DataElements.SNIPPING_TOOL_POPUP),
    selectors.isInDesktopOnlyMode(state),
    selectors.shouldShowApplySnippingWarning(state),
  ]);
  const dispatch = useDispatch();
  const [isSnipping, setIsSnipping] = useState(snippingCreateTool.getIsSnipping());

  const elementsToClose = ['leftPanel', 'searchPanel', 'notesPanel', 'redactionPanel', 'textEditingPanel'];

  const openSnippingPopup = () => {
    dispatch(actions.openElement(DataElements.SNIPPING_TOOL_POPUP));
    // eslint-disable-next-line no-undef
    dispatch(actions.closeElements(elementsToClose));
    setIsSnipping(snippingCreateTool.getIsSnipping());
  };

  useEffect(() => {
    const handleSnippingCancellation = () => setIsSnipping(false);

    const handleToolModeChange = (newTool, oldTool) => {
      if (newTool instanceof Core.Tools.SnippingCreateTool) { // eslint-disable-line no-undef
        newTool.addEventListener(window.Core.Tools.SnippingCreateTool.Events['SNIPPING_CANCELLED'], handleSnippingCancellation);
        openSnippingPopup();
      } else if (oldTool instanceof Core.Tools.SnippingCreateTool) { // eslint-disable-line no-undef
        newTool.removeEventListener(window.Core.Tools.SnippingCreateTool.Events['SNIPPING_CANCELLED'], handleSnippingCancellation);
        setIsSnipping(false);
        snippingCreateTool.reset();
        reenableHeader();
      }
    };

    core.addEventListener('toolModeUpdated', handleToolModeChange);

    return () => {
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

  const snippingAnnotation = useOnSnippingAnnotationChangedOrSelected(openSnippingPopup);

  // re-enable other tools and panels while not snipping
  useEffect(() => {
    if (!isSnipping) {
      reenableHeader();
    } else {
      disableHeader();
    }
  }, [isSnipping]);

  const [snippingMode, setSnippingMode] = useState(null);

  useEffect(() => {
    snippingCreateTool.setSnippingMode('CLIPBOARD');
    setSnippingMode('CLIPBOARD');
  }, []);

  const onSnippingModeChange = (option) => {
    snippingCreateTool.setSnippingMode(option);
    setSnippingMode(option);
  };

  const snippingPopupRef = useRef();
  const { position, handleDrag, handleStop, containerRef, style, bounds } = useDraggablePosition('top-right');

  const closeAndReset = () => {
    snippingCreateTool.reset();
    dispatch(actions.closeElement(DataElements.SNIPPING_TOOL_POPUP));
    reenableHeader();
    core.setToolMode(window.Core.Tools.ToolNames.SNIPPING);
  };

  const closeSnippingPopup = useCallback((e) => {
    closeAndReset();
    focusActiveIcon(e);
  }, []);

  // disable/enable the 'apply' button when snipping
  useEffect(() => {
    setIsSnipping(snippingCreateTool.getIsSnipping());
  }, [snippingAnnotation]);

  const applySnipping = async (e) => {
    await snippingCreateTool.applySnipping();
    snippingCreateTool.reset();
    reenableHeader();
    focusActiveIcon(e);
  };

  const props = {
    snippingMode,
    onSnippingModeChange,
    closeSnippingPopup,
    applySnipping,
    isSnipping,
    isInDesktopOnlyMode,
    shouldShowApplySnippingWarning,
  };

  const isMobile = isMobileSize();

  if (isOpen && core.getDocument()) {
    if (isMobile && !isInDesktopOnlyMode) {
      // disable draggable on mobile devices
      return (
        <div className="SnippingPopupContainer" ref={snippingPopupRef}>
          <SnippingToolPopup {...props} isMobile />
        </div>
      );
    }
    return (
      <Draggable
        cancel={'input, button, .collapsible-menu, .ui__choice__label'}
        position={position}
        bounds={bounds}
        onDrag={handleDrag}
        onStop={handleStop}
      >
        <div
          className="SnippingPopupContainer"
          ref={(el) => {
            snippingPopupRef.current = el;
            containerRef.current = el;
          }}
          style={style}
        >
          <SnippingToolPopup {...props} />
        </div>
      </Draggable>
    );
  }
  return null;
}

export default SnippingToolPopupContainer;
