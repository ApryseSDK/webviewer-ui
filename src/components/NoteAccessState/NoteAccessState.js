import React, { useState } from "react";
import PropTypes from 'prop-types';
import core from 'core';

import DataElementWrapper from 'components/DataElementWrapper';
import Icon from "components/Icon";

import './NoteAccessState.scss';

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

    const modifiedAnnotations = [annotation];
    const replies = annotation.getReplies();

    for (const reply of replies) {
      reply.setCustomData('isPrivate', !annotationIsPrivate);
      modifiedAnnotations.push(reply);
    }

    const annotationManager = core.getAnnotationManager();
    annotationManager.trigger('annotationChanged', [modifiedAnnotations, 'modify', {}]);
  };

  if (annotation.isReply() || annotation.Author !== core.getCurrentUser()) {
    return null;
  }

  const icon = annotationIsPrivate ? 'eye-off-outline' : 'eye-outline';
  const title = annotationIsPrivate ? 'Annotation is private' : 'Annotation is public';

  return (
    <DataElementWrapper
      className="NoteAccessState"
      dataElement="noteAccessState"
      title={title}
      onClick={e => toggleAnnotationAccessState(e, annotation)}
    >
      <Icon glyph={icon} />
    </DataElementWrapper>
  );
}

NoteAccessState.propTypes = propTypes;

export default NoteAccessState;