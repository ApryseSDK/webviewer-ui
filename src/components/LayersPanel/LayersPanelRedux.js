import React, { useEffect } from 'react';
import LayersPanel from './LayersPanel';
import { useSelector, useDispatch, useStore } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import core from 'core';
import { toggleAnnotationsVisibility } from './helper';
import onLayersUpdated from 'src/event-listeners/onLayersUpdated';
import { setNextActivePanelDueToEmptyCurrentPanel } from 'src/event-listeners/onDocumentLoaded';
import useDocumentLoadState from 'hooks/useDocumentLoadState';

function LayersPanelRedux(props) {
  const dispatch = useDispatch();

  const store = useStore();
  const layers = useSelector(selectors.getLayers);
  const documentLoaded = useDocumentLoadState();
  const layersNotFetched = layers === null;


  function setLayers(updatedLayers) {
    dispatch(actions.setLayers(updatedLayers));
  }

  useEffect(() => {
    const doc = core.getDocument();
    const updateLayers = async () => {
      if (!doc.isWebViewerServerDocument()) {
        const newLayers = await doc.getLayersArray();
        const currentLayers = selectors.getLayers(store.getState());
        onLayersUpdated(newLayers, currentLayers, dispatch);
      }
    };
    doc?.addEventListener('layersUpdated', updateLayers);
    return () => doc?.removeEventListener('layersUpdated', updateLayers);
  }, [documentLoaded]);

  useEffect(() => {
    if (layersNotFetched && documentLoaded) {
      const doc = core.getDocument();
      if (!doc.isWebViewerServerDocument()) {
        doc.getLayersArray()?.then((layers) => {
          if (layers.length === 0) {
            dispatch(actions.setLayers([]));
            setNextActivePanelDueToEmptyCurrentPanel('layersPanel');
          } else {
            onLayersUpdated(layers, undefined, dispatch);
          }
        });
      }
    }
  }, [layersNotFetched, documentLoaded]);

  useEffect(() => {
    const documentViewer = core.getDocumentViewer();
    const doc = core.getDocument();
    const layersArray = layers || [];

    if (doc && !layersNotFetched) {
      doc.setLayersArray(layersArray);
      if (core.isFullPDFEnabled()) {
        toggleAnnotationsVisibility(layersArray).then(() => {
          documentViewer.refreshAll();
          documentViewer.updateView();

          documentViewer.getAnnotationManager().drawAnnotationsFromList(
            documentViewer.getAnnotationManager().getAnnotationsList()
          );
        });
      } else {
        documentViewer.refreshAll();
        documentViewer.updateView();
      }
    }
  }, [layers]);

  const reduxProps = {
    layers: layers || [],
    setLayers,
    layersNotFetched,
  };

  return <LayersPanel {...props}{...reduxProps} />;
}

export default LayersPanelRedux;