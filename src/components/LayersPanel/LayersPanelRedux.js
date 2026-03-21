import React, { useEffect } from 'react';
import LayersPanel from './LayersPanel';
import { useSelector, useDispatch, useStore } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import { toggleAnnotationsVisibility } from './helper';
import onLayersUpdated from 'src/event-listeners/onLayersUpdated';
import { setNextActivePanelDueToEmptyCurrentPanel } from 'src/event-listeners/onDocumentLoaded';
import useDocumentLoadState from 'hooks/useDocumentLoadState';
import useCore from 'hooks/useCore';

function LayersPanelRedux(props) {
  const { core } = useCore();
  const dispatch = useDispatch();

  const store = useStore();
  const activeDocumentViewerKey = useSelector(selectors.getActiveDocumentViewerKey);
  const layers = useSelector((state) => selectors.getLayers(state, activeDocumentViewerKey));
  const documentLoaded = useDocumentLoadState();
  const layersNotFetched = layers === null;

  function setLayers(updatedLayers) {
    dispatch(actions.setLayers(updatedLayers, activeDocumentViewerKey));
  }

  useEffect(() => {
    const doc = core.getDocument();
    const updateLayers = async () => {
      if (!doc.isWebViewerServerDocument()) {
        const newLayers = await doc.getLayersArray();
        const currentLayers = selectors.getLayers(store.getState(), activeDocumentViewerKey);
        onLayersUpdated(newLayers, currentLayers, dispatch, activeDocumentViewerKey);
      }
    };
    doc?.addEventListener('layersUpdated', updateLayers);
    return () => doc?.removeEventListener('layersUpdated', updateLayers);
  }, [documentLoaded, core]);

  useEffect(() => {
    if (layersNotFetched && documentLoaded) {
      const doc = core.getDocument();
      if (!doc.isWebViewerServerDocument()) {
        doc.getLayersArray()?.then((layers) => {
          if (layers.length === 0) {
            dispatch(actions.setLayers([], activeDocumentViewerKey));
            setNextActivePanelDueToEmptyCurrentPanel('layersPanel');
          } else {
            onLayersUpdated(layers, undefined, dispatch, activeDocumentViewerKey);
          }
        });
      }
    }
  }, [layersNotFetched, documentLoaded, core]);

  useEffect(() => {
    const documentViewer = core.getDocumentViewer();
    const doc = core.getDocument();
    const layersArray = layers || [];

    if (doc && !layersNotFetched) {
      doc.setLayersArray(layersArray);
      if (core.isFullPDFEnabled()) {
        toggleAnnotationsVisibility(layersArray, core).then(() => {
          documentViewer.refreshAll();
          documentViewer.updateView();

          const annotationManager = documentViewer.getAnnotationManager();
          annotationManager.drawAnnotationsFromList(annotationManager.getAnnotationsList());
        });
      } else {
        documentViewer.refreshAll();
        documentViewer.updateView();
      }
    }
  }, [layers, core]);

  const reduxProps = {
    layers: layers || [],
    setLayers,
    layersNotFetched,
  };

  return <LayersPanel {...props} {...reduxProps} />;
}

export default LayersPanelRedux;