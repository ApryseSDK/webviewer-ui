import React, { useEffect, useRef } from 'react';
import core from 'core';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import Draggable from 'react-draggable';
import selectors from 'selectors';
import actions from 'actions';
import classNames from 'classnames';
import useOnClickPrepareSoundAnnotation from 'src/hooks/useOnClickPrepareSoundAnnotation';
import useMedia from '../../hooks/useMedia';
import DataElementWrapper from '../DataElementWrapper';
import AudioPlaybackPopup from './AudioPlaybackPopup';

function AudioPlaybackPopupContainer() {
  const [
    isOpen,
    shouldResetAudioPlaybackPosition,
    activeSoundAnnotation
  ] = useSelector((state) => [
    selectors.isElementOpen(state, 'audioPlaybackPopup'),
    selectors.shouldResetAudioPlaybackPosition(state),
    selectors.getActiveSoundAnnotation(state)
  ], shallowEqual);

  const dispatch = useDispatch();
  const draggableRef = useRef();
  const isMobile = useMedia(['(max-width: 640px)'], [true], false);

  useOnClickPrepareSoundAnnotation();

  useEffect(() => {
    resetAudioPlaybackPosition();
  }, [shouldResetAudioPlaybackPosition]);

  useEffect(() => {
    function onSoundAnnotationDeleted(annotations, action) {
      if (action === 'delete') {
        const shouldClosePopup = annotations.some((annotation) => {
          return (
            !activeSoundAnnotation ||
            (
              annotation instanceof window.Annotations.SoundAnnotation &&
              annotation.Id === activeSoundAnnotation.Id
            )
          );
        });

        if (shouldClosePopup) {
          closeAudioPlaybackPopup();
        }
      }
    }

    core.addEventListener('annotationChanged', onSoundAnnotationDeleted);
    return () => {
      core.removeEventListener('annotationChanged', onSoundAnnotationDeleted);
    };
  }, [activeSoundAnnotation]);

  function resetAudioPlaybackPosition() {
    if (shouldResetAudioPlaybackPosition && draggableRef.current) {
      dispatch(actions.triggerResetAudioPlaybackPosition(false));
      draggableRef.current.state.x = 0;
      draggableRef.current.state.y = 0;
    }
  }

  function closeAudioPlaybackPopup() {
    dispatch(actions.closeElement('audioPlaybackPopup'));
  }

  function handleAudioPlaybackError(error) {
    if (error.toString().includes('no supported source')) {
      console.error('Error playing annotation audio. The audio type is not supported in this browser.');
    } else {
      console.error('Error playing annotation audio.');
    }
  }

  function handleAudioInitializeError(error) {
    console.error(error);
    closeAudioPlaybackPopup();
  }

  const renderAudioPlaybackPopup = () => (
    <DataElementWrapper
      data-element="audioPlaybackPopup"
      className={classNames({
        Popup: true,
        AudioPlaybackPopupContainer: true,
        open: isOpen,
        closed: !isOpen
      })}
    >
      <AudioPlaybackPopup
        autoplay
        annotation={activeSoundAnnotation}
        handleAudioPlaybackError={handleAudioPlaybackError}
        handleAudioInitializeError={handleAudioInitializeError}
        handleCloseAudioPlaybackPopup={closeAudioPlaybackPopup}
      >
      </AudioPlaybackPopup>
    </DataElementWrapper>
  );

  if (!isOpen) {
    return null;
  }

  if (isMobile) {
    return renderAudioPlaybackPopup();
  }

  return (
    <Draggable ref={draggableRef} cancel=".Button, .audio-playback-progress">
      {renderAudioPlaybackPopup()}
    </Draggable>
  );
}

export default AudioPlaybackPopupContainer;