import { loadViewerSample } from '../../utils';

it('should be able to draw signature', async () => {
  const { iframe, waitForInstance, waitForWVEvents } = await loadViewerSample('viewing/viewing');

  const instance = await waitForInstance();
  await instance('loadDocument', '/test-files/blank.pdf');
  await waitForWVEvents(['pageComplete', 'annotationsLoaded']);

  await instance('openElement', 'signatureModal');
  await page.waitFor(1000);

  const inkContainer = await iframe.$('.ink-signature-canvas');
  const inkCoordinates = await inkContainer.boundingBox();
  const { x, y } = inkCoordinates;

  await page.mouse.move(x + 10, y + 10);
  await page.mouse.down();
  await page.waitFor(500);

  await page.mouse.move(x + 300, y + 100);
  await page.waitFor(500);

  for (let i = 0; i < 15; i++) {
    await page.mouse.move(
      x + 300 + i * 20,
      y + 100 + (i % 2 * 30)
    );
    await page.waitFor(100);
  }

  await page.waitFor(500);

  await page.mouse.up();
  await page.waitFor(1000);

  const signatureModalContainer = await iframe.$('.SignatureModal > .container');
  expect(await signatureModalContainer.screenshot()).toMatchImageSnapshot({
    customSnapshotIdentifier: 'drawing-on-signature-modal',
  });
});
