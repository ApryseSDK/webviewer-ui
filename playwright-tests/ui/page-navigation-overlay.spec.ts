import { WebViewerInstance, loadViewerSample } from '../../playwright-utils';
import { Frame, expect, test } from '@playwright/test';

test.describe('Page navigation overlay', () => {
  let iframe: Frame;
  let instance: WebViewerInstance;

  test.beforeEach(async ({ page }) => {
    const { iframe: sampleIframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing-with-pdf-prime');
    iframe = sampleIframe as Frame;
    instance = await waitForInstance();
    await instance('enableElements', ['pageNavOverlay']);
    await instance('disableFadePageNavigationComponent');
    await instance('loadDocument', '/test-files/51-A4-layout.pdf');
    await page.waitForTimeout(10000);
  });

  test('Should show page labels', async () => {
    const pageNavigationOverlay = await iframe.$('.PageNavOverlay');
    expect(await pageNavigationOverlay?.screenshot()).toMatchSnapshot(['page-navigation-overlay', 'page-nav-overlay-labels.png']);
  });

  test('Should set page labels correctly using setPageLabels API with fullAPI', async () => {
    const newLabels = ['i', 'ii', 'iii'];
    await instance('setPageLabels', newLabels);
    const pageNavigationOverlay = await iframe.$('.PageNavOverlay');
    const label = await pageNavigationOverlay?.$('input');
    expect(await label?.inputValue()).toBe(newLabels[0]);
  });
});
