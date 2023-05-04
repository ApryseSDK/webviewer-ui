import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import useOverflowContainer from 'hooks/useOverflowContainer';
import useOnClickOutside from 'hooks/useOnClickOutside';

import DataElements from 'constants/dataElement';
import NoteShareTypeDialog from './NoteShareTypeDialog';
import ShareTypeIcon from '../NoteShareType/ShareTypeIcon';

import { getAnnotationShareType, setAnnotationShareType } from 'src/helpers/annotationShareType';
import getAnnotationManager from 'src/core/getAnnotationManager';

import './NoteShareType.scss';

/**
 * Multi control button and popup menu
 * @param {{
 *  multiSelectedAnnotations: Array<Annotation>,
 * }} props
 */
const NoteShareTypeMultiControl = ({ multiSelectedAnnotations }) => {
  const [t] = useTranslation();
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const { popupMenuRef: dialogRef, style } = useOverflowContainer(dialogIsOpen, { defaultLocation: 'top' });
  const [collectiveShareType, setCollectiveShareType] = useState();

  useEffect(() => {
    const shareTypes = new Set(multiSelectedAnnotations.map((annotation) => getAnnotationShareType(annotation)));
    if (shareTypes.size === 1) {
      setCollectiveShareType(shareTypes.values().next().value);
    } else {
      setCollectiveShareType(undefined);
    }
  }, [multiSelectedAnnotations]);

  const onClose = () => {
    dialogRef.current?.close();
    setDialogIsOpen(false);
  };

  const onOpen = () => {
    dialogRef.current?.show();
    setDialogIsOpen(true);
  };

  const togglePopup = (e) => {
    e.stopPropagation();
    if (dialogIsOpen) {
      onClose();
    } else {
      onOpen();
    }
  };

  useOnClickOutside(dialogRef, () => {
    onClose();
  });

  const handleSelect = (shareType) => {

    multiSelectedAnnotations.forEach((annotation) => {
      setAnnotationShareType(annotation, shareType);
    });

    getAnnotationManager().trigger('annotationChanged', [multiSelectedAnnotations, 'modify', {}]);
    setCollectiveShareType(shareType);
    onClose();
  };

  const isDisabled = !multiSelectedAnnotations.length;

  return (
    <div style={{ position: 'relative', display: 'flex' }}>
      <button
        style={{ padding: '0 3px', opacity: isDisabled ? 0.6 : 1 }}
        dataElement={DataElements.NOTE_MULTI_SHARE_TYPE_BUTTON}
        onClick={togglePopup}
        className={classNames('share-type-icon-button', {
          active: dialogIsOpen,
        })}
        disabled={isDisabled}
      >
        <ShareTypeIcon shareType={collectiveShareType} label={t('action.shareType')} />
      </button>

      <NoteShareTypeDialog onClose={onClose} selectedShareType={collectiveShareType} ref={dialogRef} positionStyle={style} onSelect={handleSelect} />
    </div >
  );
};

export default NoteShareTypeMultiControl;