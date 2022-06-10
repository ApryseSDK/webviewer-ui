import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Measure from 'react-measure';

import StylePopup from 'components/StylePopup';

import core from 'core';
import getClassName from 'helpers/getClassName';
import setToolStyles from 'helpers/setToolStyles';
import { isMobile } from 'helpers/device';
import { getDataWithKey, mapToolNameToKey, mapAnnotationToKey } from 'constants/map';
import actions from 'actions';
import selectors from 'selectors';
import { isToolDefaultStyleUpdateFromAnnotationPopupEnabled } from '../../apis/toolDefaultStyleUpdateFromAnnotationPopup';

import './AnnotationStylePopup.scss';

class AnnotationStylePopup extends React.Component {
  static propTypes = {
    isDisabled: PropTypes.bool,
    annotation: PropTypes.object.isRequired,
    style: PropTypes.object.isRequired,
    closeElement: PropTypes.func.isRequired,
  };

  handleSliderChange = (property, value) => {
    const { annotation } = this.props;
    const annotationManager = core.getAnnotationManager();

    annotation[property] = value
    annotationManager.redrawAnnotation(annotation)
  }

  handlePropertyChange = (property, value) => {
    const { annotation } = this.props;

    core.setAnnotationStyles(annotation, {
      [property]: value,
    });
  }

  handleStyleChange = (property, value) => {
    const { annotation } = this.props;

    core.setAnnotationStyles(annotation, {
      [property]: value,
    });

    if (isToolDefaultStyleUpdateFromAnnotationPopupEnabled()) {
      setToolStyles(annotation.ToolName, property, value);
    }
  };

  handleRichTextStyleChange = (property, value) => {
    const { annotation } = this.props;

    core.updateAnnotationRichTextStyle(annotation, { [property]: value });
  }

  handleLineStyleChange = (section, value) => {
    const { annotation } = this.props;

    let lineStyle = '';
    if (section === 'start') {
      annotation.setStartStyle(value);
      lineStyle = 'StartLineStyle';
    } else if (section === 'end') {
      annotation.setEndStyle(value);
      lineStyle = 'EndLineStyle';
    }

    if (isToolDefaultStyleUpdateFromAnnotationPopupEnabled()) {
      setToolStyles(annotation.ToolName, lineStyle, value);
    }

    core.getAnnotationManager().redrawAnnotation(annotation);
  };

  handleClick = e => {
    // see the comments above handleClick in ToolStylePopup.js
    if (isMobile() && e.target === e.currentTarget) {
      this.props.closeElement('annotationPopup');
    }
  }

  handleResize = () => {
    const { onResize } = this.props;
    onResize && onResize();
  }

  render() {
    const { isDisabled, annotation, style } = this.props;
    const isFreeText =
      annotation instanceof window.Annotations.FreeTextAnnotation &&
      annotation.getIntent() === window.Annotations.FreeTextAnnotation.Intent.FreeText;
    const isMeasure = !!annotation.Measure;
    let properties = {};
    const className = getClassName('Popup AnnotationStylePopup', this.props);
    const colorMapKey = mapAnnotationToKey(annotation);
    const isRedaction = annotation instanceof window.Annotations.RedactionAnnotation;
    const showLineStyleOptions = getDataWithKey(mapToolNameToKey(annotation.ToolName)).hasLineEndings;

    if (isDisabled) {
      return null;
    }

    if (showLineStyleOptions) {
      properties = {
        StartLineStyle: annotation.getStartStyle(),
        EndLineStyle: annotation.getEndStyle(),
      }
    }

    if (isFreeText) {
      const richTextStyles = annotation.getRichTextStyle();
      properties = {
        Font: annotation.Font,
        FontSize: annotation.FontSize,
        TextAlign: annotation.TextAlign,
        TextVerticalAlign: annotation.TextVerticalAlign,
        bold: richTextStyles?.[0]['font-weight'] === 'bold' ?? false,
        italic: richTextStyles?.[0]['font-style'] === 'italic' ?? false,
        underline: richTextStyles?.[0]['text-decoration']?.includes('underline') || richTextStyles?.[0]['text-decoration']?.includes('word'),
        strikeout: richTextStyles?.[0]['text-decoration']?.includes('line-through') ?? false,
      };
    }

    if (isRedaction) {
      properties = {
        OverlayText: annotation['OverlayText'],
        Font: annotation['Font'],
        FontSize: annotation['FontSize'],
        TextAlign: annotation['TextAlign']
      };
    }

    return (
      <Measure
        onResize={this.handleResize}
      >
        {({ measureRef }) => (
          <div
            className={className}
            data-element="annotationStylePopup"
            onClick={this.handleClick}
            ref={measureRef}
          >
            {/* Do not show checkbox for ellipse as snap mode does not exist for it */}
            <StylePopup
              hideSnapModeCheckbox={(annotation instanceof window.Annotations.EllipseAnnotation || !core.isFullPDFEnabled())}
              colorMapKey={colorMapKey}
              style={style}
              isFreeText={isFreeText}
              isMeasure={isMeasure}
              onStyleChange={this.handleStyleChange}
              onSliderChange={this.handleSliderChange}
              onPropertyChange={this.handlePropertyChange}
              disableSeparator
              properties={properties}
              onRichTextStyleChange={this.handleRichTextStyleChange}
              isRedaction={isRedaction}
              showLineStyleOptions={showLineStyleOptions}
              onLineStyleChange={this.handleLineStyleChange}
            />
          </div>
        )}
      </Measure>
    );
  }
}

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'annotationStylePopup'),
});

const mapDispatchToProps = {
  closeElement: actions.closeElement,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AnnotationStylePopup);
