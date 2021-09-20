import { loadViewerSample } from '../../utils';

it('should be able to access instance immediately from config file', async() => {
  const {
    waitForInstance,
  } = await loadViewerSample('viewing/viewing-with-config-file');

  await waitForInstance();

  // no error should be thrown when running sample with config file
});