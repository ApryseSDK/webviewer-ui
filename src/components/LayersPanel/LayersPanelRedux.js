import React, { useEffect } from 'react';
import LayersPanel from './LayersPanel';

import { useSelector, useDispatch } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import core from 'core';
import { toggleAnnotationsVisibility } from './helper';

function LayersPanelRedux(props) {
  const dispatch = useDispatch();

  const [
    layers,
  ] = useSelector((state) => [
    selectors.getLayers(state),
  ]);

  function setLayers(updatedLayers) {
    dispatch(actions.setLayers(updatedLayers));
  }

  useEffect(() => {
    const documentViewer = core.getDocumentViewer();
    const doc = core.getDocument();
    if (doc) {
      doc.setLayersArray(layers);
      if (core.isFullPDFEnabled()) {
        toggleAnnotationsVisibility(layers).then(() => {
          documentViewer.refreshAll();
          documentViewer.updateView();
        });
      } else {
        documentViewer.refreshAll();
        documentViewer.updateView();
      }
    }
  }, [layers]);

  const reduxProps = {
    layers,
    setLayers
  };

  return <LayersPanel {...props}{...reduxProps} />;
}

export default LayersPanelRedux;