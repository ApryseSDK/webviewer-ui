import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Measure from 'react-measure';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import setToolStyles from 'helpers/setToolStyles';
import { Swipeable } from 'react-swipeable';
import ColorPalette from 'components/ColorPalette';
import Dropdown from 'components/Dropdown';
import SignatureModes from 'constants/signatureModes';
import useCore from 'hooks/useCore';
import getSignatureTools from 'components/SignatureModal/getSignatureTools';
import {
  getSignatureColorHex,
  isSignatureColorAvailable,
} from 'components/SignatureModal/signatureColorHelpers';
import { SIGNATURE_MODAL_COLORS } from 'constants/commonColors';
import classNames from 'classnames';

import './InkSignature.scss';

const useForceUpdate = () => {
  const [, setIt] = useState(false);
  return useCallback(() => setIt((it) => !it), []);
};

const propTypes = {
  isModalOpen: PropTypes.bool,
  isTabPanelSelected: PropTypes.bool,
  disableCreateButton: PropTypes.func,
  enableCreateButton: PropTypes.func,
  isInitialsModeEnabled: PropTypes.bool,
  signatureModalColors: PropTypes.arrayOf(PropTypes.string),
  selectedSignatureColor: PropTypes.object,
  onSignatureColorChange: PropTypes.func,
  isMultiViewerMode: PropTypes.bool,
};

const InkSignature = ({
  isModalOpen,
  isTabPanelSelected,
  disableCreateButton,
  enableCreateButton,
  isInitialsModeEnabled = false,
  signatureModalColors = SIGNATURE_MODAL_COLORS,
  selectedSignatureColor,
  onSignatureColorChange,
  isMultiViewerMode = false,
}) => {
  const { core, documentViewer } = useCore();
  const signatureToolArray = useMemo(
    () => getSignatureTools(core, documentViewer, isMultiViewerMode),
    [core, documentViewer, isMultiViewerMode]
  );
  const signatureTool = signatureToolArray[0];
  const fullSignatureCanvas = useRef();
  const initialsCanvas = useRef();
  // the ref holds the path points of the underlying freehand annotation
  // when users switch to a different tab the underlying signature annotation will change
  // so this ref is used for setting the current uderlying annotation back when users switch back to the ink tab
  const fullSignaturePathsRef = useRef();
  const initialsPathsRef = useRef();
  // the ref holds an id that will be used to check if the newly added signature annotation is the same as the freehand annotation that's drawn in the canvas
  const [t] = useTranslation();
  const [dimension, setDimension] = useState({});
  const [fullSignatureDrawn, setFullSignatureDrawn] = useState(false);
  const [initialsDrawn, setInitialsDrawn] = useState(false);

  const forceUpdate = useForceUpdate();

  useEffect(() => {
    const canvas = fullSignatureCanvas.current;

    signatureTool.setSignatureCanvas(canvas);
    const multiplier = window.Core.getCanvasMultiplier();
    canvas.getContext('2d').scale(multiplier, multiplier);

    // Now set the initials canvas
    const secondCanvas = initialsCanvas.current;
    signatureTool.setInitialsCanvas(secondCanvas);
    secondCanvas.getContext('2d').scale(multiplier, multiplier);
  }, [signatureTool]);

  useEffect(() => {
    if (isModalOpen) {
      clearFullSignatureCanvas();
      clearInitialsCanvas();
    }
  }, [isModalOpen]);

  useEffect(() => {
    async function resizeFullSignatureCanvas() {
      if (isModalOpen && isTabPanelSelected) {
        for (const signatureTool of signatureToolArray) {
          signatureTool.setSignature(fullSignaturePathsRef.current);
          signatureTool.setInitials(initialsPathsRef.current);
          // use resizeCanvas here mainly for redawing the underlying signature annotation to make it show on the canvas
          await signatureTool.resizeCanvas(SignatureModes.FULL_SIGNATURE);
        }
      }
    }


    async function resizeInitialsCanvas() {
      if (isModalOpen && isTabPanelSelected && isInitialsModeEnabled) {
        for (const signatureTool of signatureToolArray) {
          signatureTool.setInitials(initialsPathsRef.current);
          await signatureTool.resizeCanvas(SignatureModes.INITIALS);
        }
      }
    }

    function checkEnableCreateButton() {
      if (isInitialsModeEnabled) {
        (fullSignaturePathsRef.current && initialsPathsRef.current) ? enableCreateButton() : disableCreateButton();
      } else {
        fullSignaturePathsRef.current ? enableCreateButton() : disableCreateButton();
      }
    }

    resizeFullSignatureCanvas();
    resizeInitialsCanvas();
    checkEnableCreateButton();
  }, [isTabPanelSelected, isModalOpen, isInitialsModeEnabled]);

  useEffect(() => {
    async function resizeCanvasAsyncCall() {
      if (dimension.height && dimension.width) {
        await signatureTool.resizeCanvas();

        if (isInitialsModeEnabled) {
          await signatureTool.resizeCanvas(SignatureModes.INITIALS);
        }
      }
    }
    resizeCanvasAsyncCall();
  }, [dimension, isInitialsModeEnabled, signatureTool]);

  useEffect(() => {
    if (fullSignatureDrawn && (!isInitialsModeEnabled || initialsDrawn)) {
      enableCreateButton();
    } else {
      disableCreateButton();
    }
  }, [initialsDrawn, fullSignatureDrawn, isInitialsModeEnabled]);

  const clearFullSignatureCanvas = useCallback(() => {
    signatureTool.clearSignatureCanvas();
    fullSignaturePathsRef.current = null;
    setFullSignatureDrawn(false);
  }, [signatureTool]);

  const clearInitialsCanvas = useCallback(() => {
    signatureTool.clearInitialsCanvas();
    initialsPathsRef.current = null;
    setInitialsDrawn(false);
  }, [signatureTool]);

  const handleFinishDrawingFullSignature = async () => {
    if (!(await signatureTool.isEmptySignature())) {
      // need to deep copy the paths because it will be modified
      // when the annotation is added to the document
      // we want to keep the unmodified paths so that users can keep drawing on the canvas
      fullSignaturePathsRef.current = deepCopy(signatureTool.getFullSignatureAnnotation().getPaths());
      setFullSignatureDrawn(true);
    }
  };

  const handleFinishDrawingInitials = async () => {
    const initialsAnnotation = signatureTool.getInitialsAnnotation();
    if (initialsAnnotation) {
      // need to deep copy the paths because it will be modified
      // when the annotation is added to the document
      // we want to keep the unmodified paths so that users can keep drawing on the canvas
      initialsPathsRef.current = deepCopy(signatureTool.getInitialsAnnotation().getPaths());
      setInitialsDrawn(true);
    }
  };

  const handleColorInputChange = useCallback(async (property, value) => {
    onSignatureColorChange?.(value);
    setToolStyles('AnnotationCreateSignature', property, value);
    try {
      const fullSignatureAnnotation = signatureTool.getFullSignatureAnnotation();
      if (typeof fullSignatureAnnotation?.getPaths === 'function') {
        fullSignatureAnnotation.StrokeColor = value;
        await signatureTool.resizeCanvas(SignatureModes.FULL_SIGNATURE);
      }

      const initialsAnnotation = signatureTool.getInitialsAnnotation();
      if (typeof initialsAnnotation?.getPaths === 'function') {
        initialsAnnotation.StrokeColor = value;
        await signatureTool.resizeCanvas(SignatureModes.INITIALS);
      }
    } finally {
      forceUpdate();
    }
  }, [forceUpdate, onSignatureColorChange, signatureTool]);

  useEffect(() => {
    const toolColor = signatureTool.defaults['StrokeColor'];
    const toolColorHex = getSignatureColorHex(toolColor);
    const activeColor = selectedSignatureColor || toolColor;
    const isActiveColorAvailable = isSignatureColorAvailable(activeColor, signatureModalColors);

    const colorToApply = isActiveColorAvailable
      ? selectedSignatureColor
      : new window.Core.Annotations.Color(signatureModalColors[0]);
    const colorToApplyHex = getSignatureColorHex(colorToApply);

    if (toolColorHex && colorToApply && colorToApplyHex.toLowerCase() !== toolColorHex.toLowerCase()) {
      handleColorInputChange('StrokeColor', colorToApply).catch((error) => {
        console.error('Unable to update the ink signature color.', error);
      });
    } else if (!isActiveColorAvailable) {
      onSignatureColorChange?.(colorToApply);
    }
  }, [handleColorInputChange, onSignatureColorChange, signatureModalColors, signatureTool, selectedSignatureColor]);

  const deepCopy = (paths) => {
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

  const toolStyles = signatureTool.defaults;

  return (
    <Measure bounds onResize={({ bounds }) => setDimension(bounds)}>
      {({ measureRef }) => (
        <div className="ink-signature" ref={measureRef}>
          <Swipeable
            onSwiping={({ event }) => event.stopPropagation()}
            className="canvas-colorpalette-container"
          >
            <div className='signature-and-initials-container'>
              <div className='signature-input full-signature'>
                <canvas
                  className="ink-signature-canvas"
                  onMouseUp={handleFinishDrawingFullSignature}
                  onTouchEnd={handleFinishDrawingFullSignature}
                  onMouseLeave={handleFinishDrawingFullSignature}
                  ref={fullSignatureCanvas}
                />
                <div className="signature-input-footer">
                  <div className="signature-prompt">
                    {t('option.signatureModal.drawSignature')}
                  </div>
                  <button
                    className="footer-signature-clear"
                    onClick={clearFullSignatureCanvas}
                    disabled={!fullSignatureDrawn}
                    aria-label={t('action.clearSignature')}
                  >
                    {t('action.clear')}
                  </button>
                </div>
              </div>
              <div className={classNames('signature-input initials', { 'ink-signature-initials-hidden': !isInitialsModeEnabled })}>
                <canvas
                  className="ink-signature-canvas"
                  onMouseUp={handleFinishDrawingInitials}
                  onTouchEnd={handleFinishDrawingInitials}
                  onMouseLeave={handleFinishDrawingInitials}
                  ref={initialsCanvas}
                />
                <div className="signature-input-footer">
                  <div className="signature-prompt">
                    {t('option.signatureModal.drawInitial')}
                  </div>
                  <button
                    className="footer-signature-clear"
                    onClick={clearInitialsCanvas}
                    disabled={!initialsDrawn}
                    aria-label={t('action.clearInitial')}
                  >
                    {t('action.clear')}
                  </button>
                </div>
              </div>
            </div>
            <div className="colorpalette-clear-container">
              <div className="signature-style-options">
                <Dropdown
                  id="ink-signature-font-dropdown"
                  disabled={true}
                  placeholder={'Text Styles'}
                />
                <div className="placeholder-dropdown"></div>
                <div className="divider"></div>
                <ColorPalette
                  color={selectedSignatureColor || toolStyles['StrokeColor']}
                  property="StrokeColor"
                  onStyleChange={(property, value) => handleColorInputChange(property, value)}
                  overridePalette2={signatureModalColors}
                />
              </div>
            </div>
          </Swipeable>
        </div>
      )}
    </Measure>
  );
};

InkSignature.propTypes = propTypes;

export default InkSignature;
