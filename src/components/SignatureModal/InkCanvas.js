import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import core from 'core';

const propTypes = {
  t: PropTypes.func.isRequired
};

const InkCanvas = ({ t }) => {
  const canvasRef = useRef();
  const [canClear, setCanClear] = useState(false);
  const signatureTool = core.getTool('AnnotationCreateSignature');

  const setSignatureCanvasSize = () => {
    const canvas = canvasRef.current;

    if (canvas) {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    }
  };

  useEffect(() => {
    window.addEventListener('resize', setSignatureCanvasSize);
    window.addEventListener('orientationchange', setSignatureCanvasSize);

    return () => {
      window.removeEventListener('resize', setSignatureCanvasSize);
      window.removeEventListener('orientationchange', setSignatureCanvasSize);
    };
  });

  useEffect(() => {
    const handleFinishDrawing = () => {
      if (!signatureTool.isEmptySignature()) {
        setCanClear(true);
      }
    };

    const canvas = canvasRef.current;
    if (canvas) {
      signatureTool.setSignatureCanvas(canvas);

      const multiplier = window.utils.getCanvasMultiplier();
      canvas.getContext('2d').scale(multiplier, multiplier);
      canvas.addEventListener('mouseup', handleFinishDrawing);
      canvas.addEventListener('touchend', handleFinishDrawing);

      setSignatureCanvasSize();

      return () => {
        canvas.removeEventListener('mouseup', handleFinishDrawing);
        canvas.removeEventListener('touchend', handleFinishDrawing);
      };
    }
  }, []);

  const clearCanvas = () => {
    signatureTool.clearSignatureCanvas();
    setCanClear(false);
  };

  const clearBtnClass = classNames({
    'signature-clear': true,
    active: canClear
  });

  return (
    <div className="signature">
      <canvas className="signature-canvas" ref={canvasRef} />
      <div className="signature-background">
        <div className="signature-sign-here">{t('message.signHere')}</div>
        <div className={clearBtnClass} onClick={clearCanvas}>
          {t('action.clear')}
        </div>
      </div>
    </div>
  );
};

InkCanvas.propTypes = propTypes;

export default translate()(InkCanvas);
