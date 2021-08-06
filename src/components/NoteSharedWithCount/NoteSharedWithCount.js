import React, { useState } from "react";
import PropTypes from 'prop-types';
import core from 'core';

import DataElementWrapper from 'components/DataElementWrapper';
import Icon from "components/Icon";

import './NoteSharedWithCount.scss';

const propTypes = {
  annotation: PropTypes.object
};

function NoteSharedWithCount(props) {
  const {
    annotation
  } = props;

  const [watchersAreSet, setWatchersAreSet] = useState(false);
  let parsedSharedWithCount = 0;

  if (core.canModify(annotation) && !annotation.isReply() && annotation.getCustomData('sharedWithCount')) {
    parsedSharedWithCount = parseInt(annotation.getCustomData('sharedWithCount'));
  }

  let [sharedWithCount, setSharedWithCount] = useState(parsedSharedWithCount);
  const [annotationIsPrivate, setAnnotationIsPrivate] = useState(!!annotation.getCustomData('isPrivate'));

  if (!watchersAreSet) {
    setWatchersAreSet(true);

    if (
      core.canModify(annotation) &&
      !annotation.isReply() &&
      (annotation.Author === core.getCurrentUser())
    ) {
      // We're emitting this event from PdfPreview component in Nucleus
      core.getAnnotationManager().on('annotationSharedWithCountChanged', (changedAnnotation, changedSharedWithCount) => {
        if (changedAnnotation.Id === annotation.Id) {
          const newSharedWithCount = parseInt(changedSharedWithCount);
          sharedWithCount = newSharedWithCount;

          setSharedWithCount(newSharedWithCount);
        }
      });
    }

    core.getAnnotationManager().on('annotationAccessStateChanged', (changedAnnotation, annotationIsPrivate) => {
      if (changedAnnotation.Id === annotation.Id) {
        setAnnotationIsPrivate(annotationIsPrivate);
      }
    });
  }

  if (
    !sharedWithCount ||
    !annotationIsPrivate ||
    annotation.isReply() ||
    (annotation.Author !== core.getCurrentUser())
  ) {
    return null;
  }

  return (
    <DataElementWrapper
      className="num-shares-container"
      dataElement="noteSharedWithCount"
    >
      <Icon className="num-share-icon" glyph={"icon-share"} />
      <div className="num-shares">{sharedWithCount}</div>
    </DataElementWrapper>
  );
}

NoteSharedWithCount.propTypes = propTypes;

export default NoteSharedWithCount;