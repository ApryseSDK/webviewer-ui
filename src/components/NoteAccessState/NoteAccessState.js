import React, { useState } from "react";
import PropTypes from 'prop-types';
import core from 'core';

import DataElementWrapper from 'components/DataElementWrapper';
import Icon from "components/Icon";

const propTypes = {
  annotation: PropTypes.object
};

function NoteAccessState(props) {
  const {
    annotation
  } = props;

  const [annotationIsPrivate, setAnnotationIsPrivate] = useState(!!annotation.getCustomData('isPrivate'));

  const toggleAnnotationAccessState = (event, annotation) => {
    event.stopPropagation();

    setAnnotationIsPrivate(!annotationIsPrivate);
    annotation.setCustomData('isPrivate', !annotationIsPrivate);

    const annotationManager = core.getAnnotationManager();
    annotationManager.trigger('annotationChanged', [[annotation], 'modify', {}]);
  };

  function getIcon(annotation) {
    let icon;

    if (annotation.getCustomData('isPrivate')) {
      icon = `icon-tool-measurement-area-ellipse-line`;
    } else {
      icon = `ic_annotation_apply_redact_black_24px`;
    }

    return icon;
  }

  let icon = getIcon(annotation);

  if (annotation.isReply() || annotation.Author !== core.getCurrentUser()) {
    return null;
  }

  return (
    <DataElementWrapper dataElement="noteAccessState" onClick={e => toggleAnnotationAccessState(e, annotation)}>
      <Icon glyph={icon} />
    </DataElementWrapper>
  );
}

NoteAccessState.propTypes = propTypes;

export default NoteAccessState;