import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import StylePopup from 'components/StylePopup';

import core from 'core';
import getClassName from 'helpers/getClassName';
import setToolStyles from 'helpers/setToolStyles';
import { isMobile } from 'helpers/device';
import { mapAnnotationToKey } from 'constants/map';
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
    const curr = annotation.getRichTextStyle();

    core.setAnnotationStyles(annotation, {
      0: {
        ...curr[0],
        [property] : value
      },
    });
  }

  handleClick = e => {
    // see the comments above handleClick in ToolStylePopup.js
    if (isMobile() && e.target === e.currentTarget) {
      this.props.closeElement('annotationPopup');
    }
  }

  render() {
    const { isDisabled, annotation, style } = this.props;
    const isFreeText =
      annotation instanceof window.Annotations.FreeTextAnnotation &&
      annotation.getIntent() ===
        window.Annotations.FreeTextAnnotation.Intent.FreeText;
    let freeTextProperties = {};
    const className = getClassName('Popup AnnotationStylePopup', this.props);
    const colorMapKey = mapAnnotationToKey(annotation);

    if (isDisabled) {
      return null;
    }
    if (isFreeText) {
      const richTextStyles = annotation.getRichTextStyle();
      freeTextProperties = {
        Font: annotation.Font,
        FontSize: annotation.FontSize,
        TextAlign: annotation.TextAlign,
        TextVerticalAlign: annotation.TextVerticalAlign,
        bold: richTextStyles?.[0]["font-weight"] === "bold" ?? false,
        italic: richTextStyles?.[0]["font-style"] === "italic" ?? false,
        underline: richTextStyles?.[0]["text-decoration"]?.includes("underline") || richTextStyles?.[0]["text-decoration"]?.includes("word"),
        strikeout: richTextStyles?.[0]["text-decoration"]?.includes("line-through") ?? false,
      };
    }

    return (
      <div
        className={className}
        data-element="annotationStylePopup"
        onClick={this.handleClick}
      >
        {/* Do not show checkbox for ellipse as snap mode does not exist for it */}
        <StylePopup
          hideSnapModeCheckbox={(annotation instanceof window.Annotations.EllipseAnnotation || !core.isFullPDFEnabled())}
          colorMapKey={colorMapKey}
          style={style}
          isFreeText={isFreeText}
          onStyleChange={this.handleStyleChange}
          onPropertyChange={this.handlePropertyChange}
          disableSeparator
          freeTextProperties={freeTextProperties}
          isFontSizeSliderDisabled={isFreeText}
          onRichTextStyleChange={this.handleRichTextStyleChange}
        />
      </div>
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
