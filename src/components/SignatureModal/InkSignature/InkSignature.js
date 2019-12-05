import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
} from 'react';
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
  // TODO: add a documentation here
  const freeHandPathRef = useRef();
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
    if (isTabPanelSelected) {
      // the panel have display: none when it's not selected, which may affect the canvas size
      // so we resize the canvas whenever this panel is selected
      setSignatureCanvasSize();

      const signatureTool = core.getTool('AnnotationCreateSignature');
      signatureTool.setSignature(freeHandPathRef.current);
      setCanClear(!!freeHandPathRef.current);
      _setSaveSignature(!!freeHandPathRef.current);
    }
  }, [isTabPanelSelected, _setSaveSignature, setSignatureCanvasSize]);

  useLayoutEffect(() => {
    // use layout effect here because we want to clear the signature canvas
    // before browser paints, otherwise we will see a flash where the signature disappears after the modal opens
    if (isModalOpen && isTabPanelSelected) {
      clearCanvas();
    }
  }, [clearCanvas, isModalOpen, isTabPanelSelected]);

  const setSignatureCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;

    if (isTabPanelSelected && canvas) {
      // since the canvas will be cleared when the size changes,
      // we grab the image data before resizing and use it to redraw afterwards
      const { width, height } = canvas.getBoundingClientRect();
      const ctx = canvasRef.current.getContext('2d');
      const imageData = ctx.getImageData(0, 0, width, height);

      canvas.width = width;
      canvas.height = height;

      ctx.putImageData(imageData, 0, 0);
    }
  }, [isTabPanelSelected]);

  const clearCanvas = useCallback(() => {
    const signatureTool = core.getTool('AnnotationCreateSignature');

    signatureTool.clearSignatureCanvas();
    setCanClear(false);
    _setSaveSignature(false);
    freeHandPathRef.current = null;
  }, [_setSaveSignature]);

  const handleDrawing = _.throttle(() => {
    const signatureTool = core.getTool('AnnotationCreateSignature');

    if (!signatureTool.isEmptySignature()) {
      setCanClear(true);
      _setSaveSignature(true);

      freeHandPathRef.current = signatureTool.annot.getPaths();
    }
  }, 300);

  return (
    <div className="ink-signature">
      <canvas
        width="100%"
        height="100%"
        className="ink-signature-canvas"
        onMouseMove={handleDrawing}
        onTouchMove={handleDrawing}
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
