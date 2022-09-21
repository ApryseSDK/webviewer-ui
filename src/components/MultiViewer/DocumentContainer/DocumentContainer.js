import React, { useRef, useEffect } from 'react';
import './DocumentContainer.scss';
import classNames from 'classnames';
import loadDocument from 'helpers/loadDocument';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'actions';
import selectors from 'selectors';
import PropTypes from 'prop-types';
import { getMaxZoomLevel, getMinZoomLevel } from 'constants/zoomFactors';
import _setCurrentPage from 'helpers/setCurrentPage';
import { getStep } from 'helpers/zoom';
import { throttle } from 'lodash';
import core from 'core';
import getNumberOfPagesToNavigate from 'helpers/getNumberOfPagesToNavigate';

const propTypes = {
  documentViewerKey: PropTypes.number.isRequired,
  activeDocumentViewerKey: PropTypes.number.isRequired,
  container: PropTypes.object.isRequired,
  onReady: PropTypes.func,
};

// TODO compare: check display mode scrolling
const DocumentContainer = ({
  documentViewerKey,
  activeDocumentViewerKey,
  container,
  onReady,
}) => {
  const documentViewer = core.getDocumentViewer(documentViewerKey);
  const dispatch = useDispatch();
  const document = useRef();
  const [
    isMouseWheelZoomEnabled,
  ] = useSelector((state) => [
    selectors.getEnableMouseWheelZoom(state),
  ]);

  useEffect(() => {
    const removeListeners = () => {
      container.current.removeEventListener('dragover', preventDefault);
      container.current.removeEventListener('drop', onDrop);
      container.current.removeEventListener('wheel', onWheel, { passive: false });
    };
    documentViewer.setScrollViewElement(container.current);
    documentViewer.setViewerElement(document.current);
    container.current.addEventListener('dragover', preventDefault);
    container.current.addEventListener('drop', onDrop);
    container.current.addEventListener('wheel', onWheel, { passive: false });
    onReady(documentViewerKey);
    return removeListeners;
  }, []);

  const preventDefault = (e) => e.preventDefault();
  const onDrop = (e) => {
    e.preventDefault();
    const { files } = e.dataTransfer;
    if (files.length) {
      loadDocument(dispatch, files[0], {}, documentViewerKey);
    }
  };
  const onWheel = (e) => {
    const displayMode = documentViewer.getDisplayModeManager().getDisplayMode();
    if (isMouseWheelZoomEnabled && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      wheelToZoom(e, core.getZoom(documentViewerKey));
    } else if (!displayMode?.isContinuous() && displayMode?.IsScrollable()) {
      wheelToNavigatePages(e);
      dispatch(actions.closeElements([
        'annotationPopup',
        'textPopup',
        'annotationNoteConnectorLine',
      ]));
    }
  };
  const wheelToZoom = throttle((e, zoom) => {
    let newZoomFactor = zoom;
    if (e.deltaY < 0) {
      newZoomFactor = Math.min(
        zoom + getStep(zoom),
        getMaxZoomLevel()
      );
    } else if (e.deltaY > 0) {
      newZoomFactor = Math.max(
        zoom - getStep(zoom),
        getMinZoomLevel()
      );
    }
    const yOffset = window.document.getElementById(`header${documentViewerKey}`).getBoundingClientRect().bottom;
    const xOffset = e.clientX - window.document.getElementById(`container${documentViewerKey}`).getBoundingClientRect().left;
    documentViewer.zoomToMouse(newZoomFactor, xOffset, yOffset);
  }, 30, { trailing: false });
  const wheelToNavigatePages = (e) => {
    const currentPage = core.getCurrentPage(documentViewerKey);
    const totalPages = documentViewer.getPageCount();
    const { scrollTop, scrollHeight, clientHeight } = container.current;
    const reachedTop = scrollTop === 0;
    const reachedBottom = Math.abs(scrollTop + clientHeight - scrollHeight) <= 1;
    // depending on the track pad used (see this on MacBooks), deltaY can be between -1 and 1 when doing horizontal scrolling which cause page to change
    const scrollingUp = e.deltaY < 0 && Math.abs(e.deltaY) > Math.abs(e.deltaX);
    const scrollingDown = e.deltaY > 0 && Math.abs(e.deltaY) > Math.abs(e.deltaX);
    if (scrollingUp && reachedTop && currentPage > 1) {
      pageUp();
    } else if (scrollingDown && reachedBottom && currentPage < totalPages) {
      pageDown();
    }
  };
  const pageUp = () => {
    const currentPage = core.getCurrentPage(documentViewerKey);
    const pagesToNavigate = getNumberOfPagesToNavigate();
    const _container = container.current;
    const { scrollHeight, clientHeight } = _container;
    _setCurrentPage(currentPage - pagesToNavigate, documentViewerKey);
    _container.scrollTop = scrollHeight - clientHeight;
  };
  const pageDown = () => {
    const currentPage = core.getCurrentPage(documentViewerKey);
    const pagesToNavigate = getNumberOfPagesToNavigate();
    _setCurrentPage(currentPage + pagesToNavigate, documentViewerKey);
  };

  return (
    <div className={classNames('DocumentContainer', {
      active: activeDocumentViewerKey === documentViewerKey,
    })} ref={container} id={`DocumentContainer${documentViewerKey}`}
    >
      <div className={'document'} ref={document} id={`Document${documentViewerKey}`} />
    </div>
  );
};

DocumentContainer.propTypes = propTypes;

export default DocumentContainer;
