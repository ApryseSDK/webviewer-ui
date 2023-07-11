import { loadViewerSample } from '../../playwright-utils';
import { expect, test } from '@playwright/test';

test.describe('Tests for exposed APIs', () => {
  test('UI.setLanguage: multiple calls', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');
    await waitForInstance();
    const languageChangeCount = await iframe.evaluate(async () => {
      const { UI } = window.instance;
      let languageChangeCount = 0;
      UI.addEventListener(UI.Events.LANGUAGE_CHANGED, () => {
        languageChangeCount++;
      });
      UI.setLanguage('en');
      UI.setLanguage('de');
      await UI.setLanguage('fr');
      return languageChangeCount;
    });
    expect(languageChangeCount).toBe(1); // should only change once
  });
});
