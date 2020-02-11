import React, { useState, useEffect, useRef, useCallback } from 'react';
import Measure from 'react-measure';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import core from 'core';

import './InkSignature.scss';

const propTypes = {
  isModalOpen: PropTypes.bool,
  _setSaveSignature: PropTypes.func,
  isTabPanelSelected: PropTypes.bool,
};

const InkSignature = ({
  isModalOpen,
  _setSaveSignature,
  isTabPanelSelected,
  createSignature,
}) => {
  const canvasRef = useRef();
  const freeHandPathsRef = useRef();
  const [canClear, setCanClear] = useState(false);
  const [t] = useTranslation();
  const [dimension, setDimension] = useState({});

  useEffect(() => {
    const signatureTool = core.getTool('AnnotationCreateSignature');
    const canvas = canvasRef.current;

    signatureTool.setSignatureCanvas(canvas);
    const multiplier = window.utils.getCanvasMultiplier();
    canvas.getContext('2d').scale(multiplier, multiplier);
  }, []);

  useEffect(() => {
    if (dimension.height && dimension.width) {
      const signatureTool = core.getTool('AnnotationCreateSignature');
      signatureTool.resizeCanvas();
    }
  }, [dimension]);

  useEffect(() => {
    if (isModalOpen) {
      clearCanvas();
    }
  }, [clearCanvas, isModalOpen]);

  useEffect(() => {
    if (isTabPanelSelected) {
      const signatureTool = core.getTool('AnnotationCreateSignature');
      signatureTool.setSignature(freeHandPathsRef.current);
      setCanClear(!!freeHandPathsRef.current);
      // _setSaveSignature(!!freeHandPathsRef.current);
    }
  }, [isTabPanelSelected, _setSaveSignature]);

  const clearCanvas = useCallback(() => {
    const signatureTool = core.getTool('AnnotationCreateSignature');
    signatureTool.clearSignatureCanvas();
    setCanClear(false);
    // _setSaveSignature(false);
    freeHandPathsRef.current = null;
  }, [_setSaveSignature]);

  const handleFinishDrawing = () => {
    const signatureTool = core.getTool('AnnotationCreateSignature');

    if (!signatureTool.isEmptySignature()) {
      setCanClear(true);
      _setSaveSignature(true);

      // need to deep copy the paths because it will be modified
      // when the annotation is added to the document
      // we want to keep the unmodified paths so that users can keep drawing on the canvas
      freeHandPathsRef.current = deepCopy(signatureTool.annot.getPaths());
    }
  };

  const deepCopy = paths => {
    const pathsCopy = [];
    for (let i = 0; i < paths.length; ++i) {
      for (let j = 0; j < paths[i].length; ++j) {
        if (!pathsCopy[i]) {
          pathsCopy[i] = [];
        }
        pathsCopy[i][j] = new Annotations.Point(paths[i][j].x, paths[i][j].y);
      }
    }

    return pathsCopy;
  };

  return (
    <React.Fragment>
      <Measure bounds onResize={({ bounds }) => setDimension(bounds)}>
        {({ measureRef }) => (
          <div className="ink-signature" ref={measureRef}>
            <canvas
              className="ink-signature-canvas"
              onMouseUp={handleFinishDrawing}
              onTouchEnd={handleFinishDrawing}
              ref={canvasRef}
            />
            <div className="ink-signature-background">
              <div className="ink-signature-sign-here">
                {t('message.signHere')}
              </div>
            </div>
          </div>
        )}
      </Measure>
      <div
        className="footer"
      >
        <div className="signature-clear" onClick={clearCanvas}>
          {t('action.clear')}
        </div>
        <div className="signature-create" onClick={createSignature}>
          {t('action.create')}
        </div>
      </div>
    </React.Fragment>
  );
};

InkSignature.propTypes = propTypes;

export default InkSignature;
