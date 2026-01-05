import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';

import './SavedStateIndicator.scss';
import { AnnotationSavedState } from './annotationSavedState';

const stateConfig = (labels) => ({
  [AnnotationSavedState.SAVING]: { icon: 'sprite:clock-outline', label: labels.saving },
  [AnnotationSavedState.SAVED]: { icon: 'check', label: labels.saved },
  [AnnotationSavedState.UNSAVED_EDITS]: { icon: 'edit', label: labels.unsaved },
  [AnnotationSavedState.ERROR]: { icon: 'exclamation-triangle', label: labels.error },
});

const SavedStateIndicator = ({ state, labels }) => {
  if (!state || state === AnnotationSavedState.NONE) {
    return null;
  }

  const { icon, label, title } = stateConfig(labels)[state];

  const isError = state === AnnotationSavedState.ERROR;
  const className = classNames('SavedStateIndicator', { error: isError });

  return (
    <div className={className} title={title}>
      <Icon glyph={icon} />
      <span>{label}</span>
    </div>
  );
};

SavedStateIndicator.propTypes = {
  state: PropTypes.oneOf(Object.values(AnnotationSavedState)).isRequired,
  labels: PropTypes.shape({
    saved: PropTypes.string.isRequired,
    saving: PropTypes.string.isRequired,
    unsaved: PropTypes.string.isRequired,
    error: PropTypes.string.isRequired,
  }).isRequired,
};

export default SavedStateIndicator;
