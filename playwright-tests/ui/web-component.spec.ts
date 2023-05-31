import { loadSample, loadWebComponentSample } from '../../playwright-utils';
import { test, expect } from '@playwright/test';

test.describe('WebViewer in web component', () => {
  test('Should be able to load documentViewer', async ({ page }) => {
    const { webComponent, waitForInstance, getAnnotationsCount, saveAndReloadPDF, waitForWVEvents, getTextPosition } = await loadWebComponentSample(page, 'viewing/viewing-with-webcomponent');
    await waitForInstance();
    await waitForWVEvents(['annotationsLoaded']);
    const app = await webComponent.$('.App');

    expect(await getAnnotationsCount()).toEqual(25);

    await saveAndReloadPDF();
    await page.waitForTimeout(5000);

    const textInTheFirstPage = '6 Important Factors when';

    const rect = await getTextPosition(textInTheFirstPage);
    await page.mouse.click(rect.x1 + 10, rect.y1 + 10, { clickCount: 2 });

    expect(await app.screenshot()).toMatchSnapshot(['webcomponent', 'webcomponent-docViewer-instance.png']);
  });

  test('Should be able to load with multiple documentViewers', async ({ page, browserName }) => {
    test.skip(browserName === 'firefox' || browserName === 'webkit', 'TODO: update the Firefox version we are testing on to support container queries and investigate why this test fails on webkit');
    // loadWebComponentSample does not work here because there are multiple document viewers
    await loadSample(page, 'viewing/viewing-with-webcomponent-multi');
    await page.waitForTimeout(10000);
    const bodyContainer = await page.$('body');
    expect(await bodyContainer.screenshot()).toMatchSnapshot(['webcomponent', 'webcomponent-multiple-docViewer-instance.png']);
  });
});