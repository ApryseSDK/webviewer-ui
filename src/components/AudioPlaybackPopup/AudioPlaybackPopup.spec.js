import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Basic } from './AudioPlaybackPopup.stories';
import AudioPlaybackPopup from './AudioPlaybackPopup';
import { RAW_AUDIO_RECORDED_PIANO } from './test-audio/recordedPiano';


const BasicAudioPlaybackPopupStory = withI18n(Basic);
const TestAudioPlaybackPopup = withProviders(AudioPlaybackPopup);

function noop() {}

const createMockSoundAnnotation = () => {
  return {
    audio: {
      blob: new Blob([RAW_AUDIO_RECORDED_PIANO])
    }
  };
}

describe('AudioPlaybackPopup', () => {

  beforeEach(() => {
    // JSDOM does not support the WebAudio specification. https://github.com/jsdom/jsdom/issues/2900
    // We need to mock a few classes and functions from the WebAudio API.
    class MockMediaElementAudioSourceNode {
      constructor() {}
      connect(mockArg) {}
    }

    class MockAudioContext {
      constructor() {}
      createMediaElementSource(mockArg) { return new MockMediaElementAudioSourceNode(); }
      close() {}
    }

    global.URL.createObjectURL = jest.fn();
    global.AudioContext = MockAudioContext;
  });

  describe('Component', () => {
    it('Story should not throw any errors', () => {
      expect(() => {
        render(<BasicAudioPlaybackPopupStory />);
      }).not.toThrow();
    });

    it('Should render audio playback popup with UI elements', () => {
      render(
        <TestAudioPlaybackPopup
          autoplay={false}
          annotation={createMockSoundAnnotation()}
          handleAudioPlaybackError={noop}
          handleAudioInitializeError={noop}
          handleCloseAudioPlaybackPopup={noop}
        />
      );

      screen.getByRole('button', { name: 'Close' });
      screen.getByRole('button', { name: 'Play audio' });
      screen.getByRole('slider', { class: 'audio-playback-progress' });
    });

    it('Should render a hidden audio tag', () => {
      render(
        <TestAudioPlaybackPopup
          autoplay={false}
          annotation={createMockSoundAnnotation()}
          handleAudioPlaybackError={noop}
          handleAudioInitializeError={noop}
          handleCloseAudioPlaybackPopup={noop}
        />
      );

      /**
       * Testing would be easier with <audio> if a specific ARIA role existed.
       * See W3C discussion: https://github.com/w3c/aria/issues/517
       *
       * Until then, will use a test-id for this assertion.
       */
      const audioElement = screen.getByTestId('hidden-audio-element');
      expect(audioElement.style.display).toEqual('none');
    });

    it('Should call close handler when close button is pressed', () => {
      const closeAudioPlaybackPopup = jest.fn();

      render(
        <TestAudioPlaybackPopup
          autoplay={false}
          annotation={createMockSoundAnnotation()}
          handleAudioPlaybackError={noop}
          handleAudioInitializeError={noop}
          handleCloseAudioPlaybackPopup={closeAudioPlaybackPopup}
        />
      );

      const closeButton = screen.getByRole('button', { name: 'Close' });
      fireEvent.click(closeButton);
      expect(closeAudioPlaybackPopup).toBeCalled();
    });

    it('Should call error handler when audio fails to initialize', () => {
      const handleAudioInitializeError = jest.fn();

      render(
        <TestAudioPlaybackPopup
          autoplay={false}
          annotation={null}
          handleAudioPlaybackError={noop}
          handleAudioInitializeError={handleAudioInitializeError}
          handleCloseAudioPlaybackPopup={noop} 
        />
      );

      expect(handleAudioInitializeError).toBeCalled();
    });

    it('Should show play button when audio is not playing', () => {
      render(
        <TestAudioPlaybackPopup
          autoplay={false}
          annotation={createMockSoundAnnotation()}
          handleAudioPlaybackError={noop}
          handleAudioInitializeError={noop}
          handleCloseAudioPlaybackPopup={noop}
        />
      );

      screen.getByRole('button', { name: 'Play audio' });
    });


    // Skipping tests due to error thrown when trying to play audio
    // Not implemented: HTMLMediaElement.prototype.play
    it.skip('Should call error handler when audio fails to play', () => {});
    it.skip('Should show pause button when audio is playing', () => {});
    it.skip('Should autoplay when valid audio is provided', () => {});
  });
});