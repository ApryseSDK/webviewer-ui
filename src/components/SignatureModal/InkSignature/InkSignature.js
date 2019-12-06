import React, { useState, useEffect, useRef, useCallback } from 'react';
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
}) => {
  const canvasRef = useRef();
  const freeHandPathsRef = useRef();
  const [canClear, setCanClear] = useState(false);
  const [t] = useTranslation();

  useEffect(() => {
    window.addEventListener('resize', setSignatureCanvasSize);
    window.addEventListener('orientationchange', setSignatureCanvasSize);

    return () => {
      window.removeEventListener('resize', setSignatureCanvasSize);
      window.removeEventListener('orientationchange', setSignatureCanvasSize);
    };
  }, [setSignatureCanvasSize]);

  useEffect(() => {
    const signatureTool = core.getTool('AnnotationCreateSignature');
    const canvas = canvasRef.current;

    if (canvas) {
      signatureTool.setSignatureCanvas(canvas);
      const multiplier = window.utils.getCanvasMultiplier();
      canvas.getContext('2d').scale(multiplier, multiplier);
    }
  }, []);

  useEffect(() => {
    if (isModalOpen && isTabPanelSelected) {
      // the panel has display: none when it's not selected, which may affect the canvas size
      // so we resize the canvas whenever this panel is selected
      setSignatureCanvasSize();

      const signatureTool = core.getTool('AnnotationCreateSignature');
      signatureTool.setSignature(freeHandPathsRef.current);
      setCanClear(!!freeHandPathsRef.current);
      _setSaveSignature(!!freeHandPathsRef.current);
    }
  }, [
    isTabPanelSelected,
    _setSaveSignature,
    setSignatureCanvasSize,
    isModalOpen,
  ]);

  const setSignatureCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;

    if (isModalOpen && isTabPanelSelected && canvas) {
      // since the canvas will be cleared when the size changes,
      // we grab the image data before resizing and use it to redraw afterwards
      const { width, height } = canvas.getBoundingClientRect();
      const ctx = canvasRef.current.getContext('2d');
      const imageData = ctx.getImageData(0, 0, width, height);

      canvas.width = width;
      canvas.height = height;

      ctx.putImageData(imageData, 0, 0);
    }
  }, [isModalOpen, isTabPanelSelected]);

  const clearCanvas = useCallback(() => {
    const signatureTool = core.getTool('AnnotationCreateSignature');

    signatureTool.clearSignatureCanvas();
    setCanClear(false);
    _setSaveSignature(false);
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
    <div className="ink-signature">
      <canvas
        width="100%"
        height="100%"
        className="ink-signature-canvas"
        onMouseUp={handleFinishDrawing}
        onTouchEnd={handleFinishDrawing}
        ref={canvasRef}
      />
      <div className="ink-signature-background">
        <div className="ink-signature-sign-here">{t('message.signHere')}</div>
        <div
          className={classNames({
            'ink-signature-clear': true,
            active: canClear,
          })}
          onClick={clearCanvas}
        >
          {t('action.clear')}
        </div>
      </div>
    </div>
  );
};

InkSignature.propTypes = propTypes;

export default InkSignature;
