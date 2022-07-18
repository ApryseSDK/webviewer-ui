import React, { useState, useEffect, useRef, useCallback } from 'react';
import Measure from 'react-measure';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import setToolStyles from 'helpers/setToolStyles';
import { Swipeable } from 'react-swipeable';
import ColorPalette from 'components/ColorPalette';

import core from 'core';

import './InkSignature.scss';

const useForceUpdate = () => {
  const [, setIt] = useState(false);
  return () => setIt(it => !it);
};

const propTypes = {
  isModalOpen: PropTypes.bool,
  _setSaveSignature: PropTypes.func,
  isTabPanelSelected: PropTypes.bool,
  disableCreateButton: PropTypes.func,
  enableCreateButton: PropTypes.func,
};

const InkSignature = ({
  isModalOpen,
  isTabPanelSelected,
  disableCreateButton,
  enableCreateButton
}) => {
  const canvasRef = useRef();
  // the ref holds the path points of the underlying freehand annotation
  // when users switch to a different tab the underlying signature annotation will change
  // so this ref is used for setting the current uderlying annotation back when users switch back to the ink tab
  const freeHandPathsRef = useRef();
  // the ref holds an id that will be used to check if the newly added signature annotation is the same as the freehand annotation that's drawn in the canvas
  const annotIdRef = useRef();
  const [t] = useTranslation();
  const [dimension, setDimension] = useState({});
  const [drawn, setDrawn] = useState(false);

  const forceUpdate = useForceUpdate();

  useEffect(() => {
    const signatureTool = core.getTool('AnnotationCreateSignature');
    const canvas = canvasRef.current;

    signatureTool.setSignatureCanvas(canvas);
    const multiplier = window.Core.getCanvasMultiplier();
    canvas.getContext('2d').scale(multiplier, multiplier);
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      clearCanvas();
    }
  }, [isModalOpen]);

  useEffect(() => {
    async function resizeCanvasAsyncCall() {
      if (isModalOpen && isTabPanelSelected) {
        const signatureTool = core.getTool('AnnotationCreateSignature');
        freeHandPathsRef.current ? enableCreateButton() : disableCreateButton();
        signatureTool.setSignature(freeHandPathsRef.current);
        annotIdRef.current = signatureTool.annot?.Id;
        // use resizeCanvas here mainly for redawing the underlying signature annotation to make it show on the canvas
        await signatureTool.resizeCanvas();
      }
    }
    resizeCanvasAsyncCall();
  }, [isTabPanelSelected, isModalOpen]);

  useEffect(() => {
    async function resizeCanvasAsyncCall() {
      if (dimension.height && dimension.width) {
        const signatureTool = core.getTool('AnnotationCreateSignature');
        await signatureTool.resizeCanvas();
      }
    }
    resizeCanvasAsyncCall();
  }, [dimension]);

  const clearCanvas = useCallback(() => {
    const signatureTool = core.getTool('AnnotationCreateSignature');
    signatureTool.clearSignatureCanvas();
    freeHandPathsRef.current = null;
    annotIdRef.current = null;
    setDrawn(false);
    disableCreateButton();
  }, []);

  const handleFinishDrawing = async () => {
    const signatureTool = core.getTool('AnnotationCreateSignature');
    if (!(await signatureTool.isEmptySignature())) {
      // need to deep copy the paths because it will be modified
      // when the annotation is added to the document
      // we want to keep the unmodified paths so that users can keep drawing on the canvas
      freeHandPathsRef.current = deepCopy(signatureTool.annot.getPaths());
      annotIdRef.current = signatureTool.annot.Id;
      setDrawn(true);
      enableCreateButton();
    }
  };

  const handleColorInputChange = (property, value) => {
    setToolStyles('AnnotationCreateSignature', property, value);
    const signatureTool = core.getTool('AnnotationCreateSignature');
    if (signatureTool.annot) {
      signatureTool.annot.StrokeColor = value;
      signatureTool.resizeCanvas();
    }
    // hack for tool styles for signature not being on state
    forceUpdate();
  }

  const deepCopy = paths => {
    const pathsCopy = [];
    for (let i = 0; i < paths.length; ++i) {
      for (let j = 0; j < paths[i].length; ++j) {
        if (!pathsCopy[i]) {
          pathsCopy[i] = [];
        }
        pathsCopy[i][j] = new window.Core.Math.Point(paths[i][j].x, paths[i][j].y);
      }
    }

    return pathsCopy;
  };

  const signatureTool = core.getTool('AnnotationCreateSignature');
  const toolStyles = signatureTool.defaults;

  return (
    <Measure bounds onResize={({ bounds }) => setDimension(bounds)}>
      {({ measureRef }) => (
        <div className="ink-signature" ref={measureRef}>
          <Swipeable
            onSwiping={({ event }) => event.stopPropagation()} 
            className="canvas-colorpalette-container"
          >
            <div className="ink-signature-canvas-container">
              <div className="ink-signature-sign-here">
                {drawn ? '' : t('message.signHere')}
              </div>
              <canvas
                className="ink-signature-canvas"
                onMouseUp={handleFinishDrawing}
                onTouchEnd={handleFinishDrawing}
                onMouseLeave={handleFinishDrawing}
                ref={canvasRef}
              />
            </div>
            <div className="colorpalette-clear-container">
              <ColorPalette
                  color={toolStyles['StrokeColor']}
                  property="StrokeColor"
                  onStyleChange={(property, value) => handleColorInputChange(property, value)}
                  overridePalette2={['#000000', '#4E7DE9', '#E44234']}
              />
              <button className="signature-clear" onClick={clearCanvas} disabled={!drawn}>
                {t('action.clear')}
              </button>
            </div>              
          </Swipeable>
        </div>
      )}
    </Measure>
  );
};

InkSignature.propTypes = propTypes;

export default InkSignature;
