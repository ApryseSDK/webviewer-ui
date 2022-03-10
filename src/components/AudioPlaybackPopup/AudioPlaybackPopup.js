import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../Button';
import classNames from 'classnames';
import './AudioPlaybackPopup.scss';

const PLAY_AUDIO_SVG = 'ic_play_24px';
const PAUSE_AUDIO_SVG = 'ic_pause_24px';
const CLOSE_SVG = 'ic_close_black_24px';

function AudioPlaybackPopup({
  autoplay,
  annotation,
  handleAudioPlaybackError,
  handleAudioInitializeError,
  handleCloseAudioPlaybackPopup
}) {

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [durationValue, setDurationValue] = useState(0);
  const [durationString, setDurationString] = useState('00:00');
  const [currentTimeValue, setCurrentTimeValue] = useState(0);
  const [currentTimeString, setCurrentTimeString] = useState('00:00');

  const audioElementRef = useRef();

  const { t } = useTranslation();

  useEffect(() => {
    const audioContext = new AudioContext();
    audioContext
      .createMediaElementSource(audioElementRef.current)
      .connect(audioContext.destination);

    return () => {
      audioContext.close();
    };
  }, []);

  useEffect(() => {
    if(!annotation || !annotation.audio || !annotation.audio.blob) {
      handleAudioInitializeError('No audio data found. Cannot play this annotation\'s audio.');
      return;
    }

    audioElementRef.current.src = URL.createObjectURL(annotation.audio.blob);

    if(autoplay) {
      playAudio();
    }
  }, [annotation]);

  async function toggleAudio() {
    let isPlaying = false;

    if(isPlayingAudio) {
      await audioElementRef.current.pause();
    } else {
      isPlaying = true;
      await audioElementRef.current.play()
        .catch(error => {
          isPlaying = false;
          handleAudioPlaybackError(error);
        });
    }

    setIsPlayingAudio(isPlaying);
  }

  async function playAudio() {
    let isPlaying = true;
    await audioElementRef.current.play()
      .catch(error => {
        isPlaying = false;
        handleAudioPlaybackError(error);
      });

    setIsPlayingAudio(isPlaying);
  }

  function handleLoadedAudioMetadata(e) {
    const duration = e.target.duration
    const timeStampString = getTimeStampStringFromSeconds(duration);
    setDurationValue(duration);
    setDurationString(timeStampString);
  }

  function handleAudioTimeUpdate(e) {
    const currentTime = e.target.currentTime;
    const timeStampString = getTimeStampStringFromSeconds(currentTime);
    setCurrentTimeValue(currentTime);
    setCurrentTimeString(timeStampString);
  }

  function getTimeStampStringFromSeconds(totalSeconds) {
    const minutes = `${parseInt(`${(totalSeconds / 60) % 60}`, 10)}`.padStart(2, '0');
    const seconds = `${parseInt(`${totalSeconds % 60}`, 10)}`.padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  function handleOnProgressBarClick(e) {
    audioElementRef.current.currentTime = e.target.value;
  }

  function handleAudioFinished() {
    setIsPlayingAudio(false);
  }

  return (
    <div className={classNames({
      Popup: true,
      AudioPlaybackPopup: true
    })}>
      <div className="audio-popup-draggable-header">
        <svg width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="12" height="2" rx="1" fill="#CFD4DA"/>
        </svg>
      </div>
      <div className="audio-popup-ui">
        <audio
          data-testid="hidden-audio-element"
          ref={audioElementRef}
          style={{ display: 'none'}}
          onLoadedMetadata={handleLoadedAudioMetadata}
          onTimeUpdate={handleAudioTimeUpdate}
          onEnded={handleAudioFinished}
        />

        <Button
          onClick={toggleAudio}
          title={(isPlayingAudio ? t('action.pauseAudio') : t('action.playAudio'))}
          img={(isPlayingAudio ? PAUSE_AUDIO_SVG : PLAY_AUDIO_SVG)}
        />

        <span className="current-time">{currentTimeString}</span>
        <input
          className="audio-playback-progress"
          type="range"
          step="any"
          max={durationValue}
          value={currentTimeValue}
          onChange={handleOnProgressBarClick}
        />
        <span className="duration">{durationString}</span>

        <Button
          title="action.close"
          img={CLOSE_SVG}
          onClick={handleCloseAudioPlaybackPopup}
        />
      </div>
    </div>
  );
}

export default AudioPlaybackPopup;