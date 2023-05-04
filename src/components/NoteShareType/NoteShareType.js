import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import './NoteShareType.scss';

import core from 'core';
import getAnnotationManager from 'src/core/getAnnotationManager';
import { getAnnotationShareType, setAnnotationShareType } from 'src/helpers/annotationShareType';
import useOverflowContainer from 'hooks/useOverflowContainer';
import useOnClickOutside from 'hooks/useOnClickOutside';

import DataElementWrapper from 'components/DataElementWrapper';
import ShareTypes from 'constants/shareTypes';
import ShareTypeIcon from '../NoteShareType/ShareTypeIcon';
import NoteShareTypeDialog from './NoteShareTypeDialog';

const propTypes = {
  annotation: PropTypes.object.isRequired,
};

function NoteShareType(props) {
  const { annotation } = props;

  const [t] = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef();
  const [shareType, setShareType] = useState(getAnnotationShareType(annotation) || ShareTypes.NONE);

  const { popupMenuRef: dialogRef, style } = useOverflowContainer(isOpen, { container: '.normal-notes-container', offset: 25 });

  const isOwnedByCurrentUser = annotation.Author === core.getCurrentUser();

  const annotationTooltip = useMemo(() => `${t('option.notesOrder.shareType')}: ${t(
    `option.state.${shareType.toLowerCase()}`,
  )}`, [shareType]);

  const onClose = () => {
    dialogRef.current?.close();
    setIsOpen(false);
  };

  const onOpen = () => {
    dialogRef.current?.show();
    setIsOpen(true);
  };

  const togglePopup = (e) => {
    e.stopPropagation();
    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  };

  useOnClickOutside(wrapperRef, () => {
    onClose();
  });

  const handleStateChange = useCallback((newValue) => {
    // CUSTOM WISEFLOW: Set custom data value called sharetype and trigger annotationChanged event

    // Set share type and trigger annotationChanged "modify" event
    setAnnotationShareType(annotation, newValue);
    getAnnotationManager().trigger('annotationChanged', [[annotation], 'modify', {}]);
    setShareType(newValue);
    onClose();
  }, [annotation]);

  return (
    <DataElementWrapper
      className={classNames('NoteShareType', { active: isOpen })}
      dataElement="noteShareType"
      disabled={!isOwnedByCurrentUser}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      }}
      ref={wrapperRef}
    >
      <button className="share-type-icon-button" onClick={togglePopup}><ShareTypeIcon shareType={shareType} label={annotationTooltip} /></button>

      <NoteShareTypeDialog onClose={onClose} ref={dialogRef} positionStyle={style} onSelect={handleStateChange} />
    </DataElementWrapper>
  );
}

NoteShareType.propTypes = propTypes;

export default NoteShareType;
