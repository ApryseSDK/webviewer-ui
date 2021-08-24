import { loadViewerSample, Timeouts } from '../../utils';
import {Frame} from "puppeteer";

it.only('should need to call enableFeatures just once to re-enable Redaction', async() => {
  const {
    iframe,
    waitForInstance,
    waitForWVEvent,
  } = await loadViewerSample('advanced/redaction');

  await waitForInstance();
  await waitForWVEvent('pageComplete');

  await page.waitFor(Timeouts.REACT_RERENDER);

  const toolGroupButtonsContainer = await iframe.$('.tool-group-buttons-container');

  expect(await toolGroupButtonsContainer.screenshot()).toMatchImageSnapshot({
    customSnapshotIdentifier: 'redaction-feature-enabled',
  });

  await iframe.evaluate(async() => {
    window.readerControl.disableFeatures(window.readerControl.Feature.Redaction);
  });

  await page.waitFor(Timeouts.REACT_RERENDER);

  expect(await toolGroupButtonsContainer.screenshot()).toMatchImageSnapshot({
    customSnapshotIdentifier: 'redaction-feature-disabled',
  });

  await iframe.evaluate(async() => {
    window.readerControl.enableFeatures(window.readerControl.Feature.Redaction);
  });

  await page.waitFor(Timeouts.REACT_RERENDER);

  expect(await toolGroupButtonsContainer.screenshot()).toMatchImageSnapshot({
    customSnapshotIdentifier: 'redaction-feature-enabled',
  });
});