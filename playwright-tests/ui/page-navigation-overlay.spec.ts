import { loadViewerSample } from '../../playwright-utils';
import { expect, test } from '@playwright/test';

test.describe('Page navigation overlay', () => {
  test('Should show page labels', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing-with-pdf-prime');
    const instance = await waitForInstance();
    await instance('enableElements', ['pageNavOverlay']);
    await instance('disableFadePageNavigationComponent');
    await instance('loadDocument', '/test-files/51-A4-layout.pdf');
    await page.waitForTimeout(10000);

    const pageNavigationOverlay = await iframe.$('.PageNavOverlay');
    expect(await pageNavigationOverlay.screenshot()).toMatchSnapshot(['page-navigation-overlay', 'page-nav-overlay-labels.png']);
  });
})
