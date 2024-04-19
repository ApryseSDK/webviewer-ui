import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Measure from 'react-measure';
import { useTranslation } from 'react-i18next';
import StylePopup from 'components/StylePopup';
import ActionButton from 'components/ActionButton';
import core from 'core';
import getClassName from 'helpers/getClassName';
import setToolStyles from 'helpers/setToolStyles';
import { isMobile } from 'helpers/device';
import adjustFreeTextBoundingBox from 'helpers/adjustFreeTextBoundingBox';
import actions from 'actions';
import selectors from 'selectors';
import DataElements from 'constants/dataElement';
import handleFreeTextAutoSizeToggle from 'src/helpers/handleFreeTextAutoSizeToggle';

import './AnnotationStylePopup.scss';

const propTypes = {
  annotations: PropTypes.array.isRequired,
  style: PropTypes.object.isRequired,
  properties: PropTypes.object.isRequired,
  isRedaction: PropTypes.bool,
  isFreeText: PropTypes.bool,
  isEllipse: PropTypes.bool,
  hasBackToMenu: PropTypes.bool,
  onBackToMenu: PropTypes.func,
};

const AnnotationStylePopup = (props) => {
  const {
    annotations,
    style,
    isRedaction,
    isFreeText,
    isEllipse,
    isMeasure,
    colorMapKey,
    showLineStyleOptions,
    properties,
    hideSnapModeCheckbox,
    onResize,
    hasBackToMenu,
    onBackToMenu
  } = props;

  const [
    isDisabled,
    isToolDefaultStyleUpdateFromAnnotationPopupEnabled,
    activeDocumentViewerKey,
  ] = useSelector((state) => [
    selectors.isElementDisabled(state, DataElements.ANNOTATION_STYLE_POPUP),
    selectors.isToolDefaultStyleUpdateFromAnnotationPopupEnabled(state),
    selectors.getActiveDocumentViewerKey(state),
  ]);

  const dispatch = useDispatch();
  const [t] = useTranslation();
  const [isAutoSizeFont, setAutoSizeFont] = useState(properties.isAutoSizeFont);

  const handleSliderChange = (property, value) => {
    const annotationManager = core.getAnnotationManager(activeDocumentViewerKey);
    annotations.forEach((annotation) => {
      annotation[property] = value;
      if (property === 'StrokeThickness') {
        adjustFreeTextBoundingBox(annotation);
      }
      annotationManager.redrawAnnotation(annotation);
    });
  };

  const handlePropertyChange = (property, value) => {
    annotations.forEach((annotation) => {
      core.setAnnotationStyles(annotation, {
        [property]: value,
      }, activeDocumentViewerKey);
      if (isToolDefaultStyleUpdateFromAnnotationPopupEnabled) {
        setToolStyles(annotation.ToolName, property, value);
      }
      if (property === 'FontSize' || property === 'Font') {
        adjustFreeTextBoundingBox(annotation);
      }
    });
  };

  const handleStyleChange = (property, value) => {
    annotations.forEach((annotation) => {
      core.setAnnotationStyles(annotation, {
        [property]: value,
      }, activeDocumentViewerKey);

      if (isToolDefaultStyleUpdateFromAnnotationPopupEnabled) {
        setToolStyles(annotation.ToolName, property, value);
      }
    });
  };

  const handleRichTextStyleChange = (property, value) => {
    annotations.forEach((annotation) => {
      core.updateAnnotationRichTextStyle(annotation, { [property]: value }, activeDocumentViewerKey);
    });
  };

  const handleLineStyleChange = (section, value) => {
    annotations.forEach((annotation) => {
      let lineStyle = '';
      if (section === 'start') {
        annotation.setStartStyle(value);
        lineStyle = 'StartLineStyle';
      } else if (section === 'end') {
        annotation.setEndStyle(value);
        lineStyle = 'EndLineStyle';
      } else if (section === 'middle') {
        const dashes = value.split(',');
        const style = dashes.shift();
        annotation['Style'] = style;
        annotation['Dashes'] = dashes;
        lineStyle = 'StrokeStyle';
      }

      if (isToolDefaultStyleUpdateFromAnnotationPopupEnabled) {
        setToolStyles(annotation.ToolName, lineStyle, value);
      }

      core.getAnnotationManager(activeDocumentViewerKey).redrawAnnotation(annotation);
    });

    core.getAnnotationManager(activeDocumentViewerKey).trigger('annotationChanged', [annotations, 'modify', {}]);
  };

  const handleClick = (e) => {
    if (isMobile() && e.target === e.currentTarget) {
      dispatch(actions.closeElement(DataElements.ANNOTATION_POPUP));
    }
  };

  const handleResize = () => {
    onResize && onResize();
  };

  const className = getClassName('Popup AnnotationStylePopup', props);

  return isDisabled ? null : (
    <Measure
      onResize={handleResize}
    >
      {({ measureRef }) => (
        <div
          className={className}
          data-element={DataElements.ANNOTATION_STYLE_POPUP}
          onClick={handleClick}
          ref={measureRef}
        >
          {hasBackToMenu &&
            <div
              className="back-to-menu-container"
              data-element={DataElements.ANNOTATION_STYLE_POPUP_BACK_BUTTON_CONTAINER}
            >
              <ActionButton
                className="back-to-menu-button"
                dataElement={DataElements.ANNOTATION_STYLE_POPUP_BACK_BUTTON}
                label={t('action.backToMenu')}
                img="icon-chevron-left"
                onClick={onBackToMenu}
              />
            </div>
          }
          {/* Do not show checkbox for ellipse as snap mode does not exist for it */}
          <StylePopup
            hideSnapModeCheckbox={hideSnapModeCheckbox}
            colorMapKey={colorMapKey}
            style={style}
            isFreeText={isFreeText}
            isFreeTextAutoSize={isAutoSizeFont}
            onFreeTextSizeToggle={() => handleFreeTextAutoSizeToggle(annotations[0], setAutoSizeFont, isAutoSizeFont)}
            isEllipse={isEllipse}
            isMeasure={isMeasure}
            onStyleChange={handleStyleChange}
            onSliderChange={handleSliderChange}
            onPropertyChange={handlePropertyChange}
            disableSeparator
            properties={properties}
            onRichTextStyleChange={handleRichTextStyleChange}
            isRedaction={isRedaction}
            showLineStyleOptions={showLineStyleOptions}
            onLineStyleChange={handleLineStyleChange}
          />
        </div>
      )}
    </Measure>
  );
};

AnnotationStylePopup.propTypes = propTypes;

export default AnnotationStylePopup;
