import React, {
  useState, useEffect, useRef, useLayoutEffect,
} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import core from 'core';

import './InkSignature.scss';

const propTypes = {
  isModalOpen: PropTypes.bool,
  setSaveSignature: PropTypes.func,
};

const InkSignature = ({ isModalOpen, setSaveSignature }) => {
  const canvasRef = useRef();
  const [canClear, setCanClear] = useState(false);
  const [t] = useTranslation();
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
    const handleDrawing = _.throttle(() => {
      if (!signatureTool.isEmptySignature()) {
        setSaveSignature(true);
        setCanClear(true);
      }
    }, 300);

    const canvas = canvasRef.current;
    if (canvas) {
      signatureTool.setSignatureCanvas(canvas);

      const multiplier = window.utils.getCanvasMultiplier();
      canvas.getContext('2d').scale(multiplier, multiplier);
      canvas.addEventListener('mousemove', handleDrawing);
      canvas.addEventListener('touchmove', handleDrawing);

      setSignatureCanvasSize();

      return () => {
        canvas.removeEventListener('mousemove', handleDrawing);
        canvas.removeEventListener('touchmove', handleDrawing);
      };
    }
  }, []);

  useLayoutEffect(() => {
    // use layout effect here because we want to clear the signature canvas
    // before browser paints, otherwise we will see a flash where the signature disappears after the modal opens
    if (isModalOpen) {
      clearCanvas();
    }
  }, [isModalOpen]);

  const clearCanvas = () => {
    signatureTool.clearSignatureCanvas();
    setCanClear(false);
    setSaveSignature(false);
  };

  const clearBtnClass = classNames({
    'draw-signature-clear': true,
    active: canClear,
  });

  return (
    <div className="draw-signature">
      <canvas width="100%" height="100%" className="draw-signature-canvas" ref={canvasRef} />
      <div className="draw-signature-background">
        <div className="draw-signature-sign-here">{t('message.signHere')}</div>
        <div className={clearBtnClass} onClick={clearCanvas}>
          {t('action.clear')}
        </div>
      </div>
    </div>
  );
};

InkSignature.propTypes = propTypes;

export default InkSignature;