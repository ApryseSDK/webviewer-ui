import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Measure from 'react-measure';

import StylePopup from 'components/StylePopup';

import core from 'core';
import getClassName from 'helpers/getClassName';
import setToolStyles from 'helpers/setToolStyles';
import { isMobile } from 'helpers/device';
import actions from 'actions';
import selectors from 'selectors';
import { isToolDefaultStyleUpdateFromAnnotationPopupEnabled } from '../../apis/toolDefaultStyleUpdateFromAnnotationPopup';

import './AnnotationStylePopup.scss';

class AnnotationStylePopup extends React.Component {
  static propTypes = {
    isDisabled: PropTypes.bool,
    annotations: PropTypes.array.isRequired,
    style: PropTypes.object.isRequired,
    properties: PropTypes.object.isRequired,
    isRedaction: PropTypes.bool,
    isFreeText: PropTypes.bool,
    isEllipse: PropTypes.bool,
    closeElement: PropTypes.func.isRequired,
  };

  handleSliderChange = (property, value) => {
    const { annotations } = this.props;
    const annotationManager = core.getAnnotationManager();

    annotations.forEach((annotation) => {
      annotation[property] = value;
      annotationManager.redrawAnnotation(annotation);
    });
  }

  handlePropertyChange = (property, value) => {
    const { annotations } = this.props;

    annotations.forEach((annotation) => {
      core.setAnnotationStyles(annotation, {
        [property]: value,
      });
      if (isToolDefaultStyleUpdateFromAnnotationPopupEnabled()) {
        setToolStyles(annotation.ToolName, property, value);
      }
    });
  }

  handleStyleChange = (property, value) => {
    const { annotations } = this.props;

    annotations.forEach((annotation) => {
      core.setAnnotationStyles(annotation, {
        [property]: value,
      });

      if (isToolDefaultStyleUpdateFromAnnotationPopupEnabled()) {
        setToolStyles(annotation.ToolName, property, value);
      }
    });
  };

  handleRichTextStyleChange = (property, value) => {
    const { annotations } = this.props;

    annotations.forEach((annotation) => {
      core.updateAnnotationRichTextStyle(annotation, { [property]: value });
    });
  }

  handleLineStyleChange = (section, value) => {
    const { annotations } = this.props;

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

      if (isToolDefaultStyleUpdateFromAnnotationPopupEnabled()) {
        setToolStyles(annotation.ToolName, lineStyle, value);
      }

      core.getAnnotationManager().redrawAnnotation(annotation);
    });
  };

  handleClick = (e) => {
    if (isMobile() && e.target === e.currentTarget) {
      this.props.closeElement('annotationPopup');
    }
  }

  handleResize = () => {
    const { onResize } = this.props;
    onResize && onResize();
  }

  render() {
    const {
      isDisabled,
      style, isRedaction,
      isFreeText,
      isEllipse,
      isMeasure,
      colorMapKey,
      showLineStyleOptions,
      properties,
      hideSnapModeCheckbox,
    } = this.props;

    const className = getClassName('Popup AnnotationStylePopup', this.props);

    if (isDisabled) {
      return null;
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
              hideSnapModeCheckbox={hideSnapModeCheckbox}
              colorMapKey={colorMapKey}
              style={style}
              isFreeText={isFreeText}
              isEllipse={isEllipse}
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

const mapStateToProps = (state) => ({
  isDisabled: selectors.isElementDisabled(state, 'annotationStylePopup'),
});

const mapDispatchToProps = {
  closeElement: actions.closeElement,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AnnotationStylePopup);
