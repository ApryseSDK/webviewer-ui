import { loadViewerSample } from '../../utils';

describe('Style popup test', () => {
  it('style popup should render correctly for different annotations', async () => {
    const {
      iframe,
      waitForInstance,
      waitForWVEvent,
    } = await loadViewerSample('viewing/blank');

    const instance = await waitForInstance();
    await waitForWVEvent('annotationsLoaded');

    await instance('loadDocument', '/test-files/style_popup_test.pdf');
    await waitForWVEvent('annotationsLoaded');

    await page.waitFor(500);

    const annotsCount = await iframe.evaluate(() => {
      const annotManager = window.instance.Core.documentViewer.getAnnotationManager();
      return annotManager.getAnnotationsList().length;
    });

    for (let i = 0; i < annotsCount; i++) {
      await iframe.evaluate((i: number) => {
        const annotManager = window.instance.Core.documentViewer.getAnnotationManager();
        const annots = annotManager.getAnnotationsList();
        annotManager.deselectAllAnnotations();
        annotManager.selectAnnotation(annots[i]);
      }, i);
      await page.waitFor(200);
      await iframe.click('[data-element=annotationStyleEditButton]');
      await page.waitFor(200);

      const stylePopup = await iframe.$('[data-element="annotationStylePopup"]');
      expect(await stylePopup.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `annotation-style-popup-${i}`
      });
    }
  });
});
