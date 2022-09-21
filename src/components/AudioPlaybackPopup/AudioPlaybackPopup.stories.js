import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import AudioPlaybackPopup from './AudioPlaybackPopup';
import { RAW_AUDIO_RECORDED_PIANO } from './test-audio/recordedPiano';

export default {
  title: 'Components/AudioPlaybackPopup',
  component: AudioPlaybackPopup,
};

const initialState = {
  viewer: {
    disabledElements: {},
    openElements: { audioPlaybackPopup: true },
    customElementOverrides: {}
  }
};

function rootReducer(state = initialState, action) {
  return state;
}

const store = createStore(rootReducer);

function createMockSoundAnnotation() {
  return {
    audio: {
      blob: new Blob([RAW_AUDIO_RECORDED_PIANO])
    }
  };
}

export const Basic = () => {
  return (
    <Provider store={store}>
      <div className="AudioPlaybackPopup">
        <AudioPlaybackPopup
          autoplay={false}
          annotation={createMockSoundAnnotation()}
          handleAudioPlaybackError={() => console.log('handleAudioPlaybackError')}
          handleAudioInitializeError={() => console.log('handleAudioInitializeError')}
          handleCloseAudioPlaybackPopup={() => console.log('handleCloseAudioPlaybackPopup')}
        />
      </div>
    </Provider>
  );
};