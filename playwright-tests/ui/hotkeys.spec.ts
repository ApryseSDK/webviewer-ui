import { loadViewerSample } from '../../playwright-utils';
import { expect, test } from '@playwright/test';

test.describe('Hotkeys', () => {
  test('Pressing home and end key in single page mode take you to the first and last page, respectively', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing');
    const instance = await waitForInstance();

    await iframe.click('[data-element=viewControlsButton]');
    // click single page mode
    await iframe.click('[data-element=defaultPageTransitionButton]');

    // press the end key
    await page.keyboard.press('End');
    let pageNumber = await instance('getCurrentPageNumber');
    // Should be the last page
    expect(pageNumber).toBe(9);

    await page.keyboard.press('Home');
    pageNumber = await instance('getCurrentPageNumber');
    // Should be the first page
    expect(pageNumber).toBe(1);
  });

  test('Hotkeys should not be disabled when disabling tools incorrectly', async ({ page }) => {
    const { iframe } = await loadViewerSample(page, 'viewing/blank');
    await page.waitForTimeout(3000);

    (await iframe.$('[data-element=panToolButton]')).click();
    await page.waitForTimeout(300);
    await iframe.evaluate(() => {
      // Note that 'window.instance.Core.Tools.Tool.MarqueeZoomTool' is undefined actually
      window.instance.UI.disableTools([window.instance.Core.Tools.Tool.MarqueeZoomTool]);
    });

    let toolName;

    await page.keyboard.press('A');
    await page.waitForTimeout(300);
    toolName = await iframe.evaluate(() => window.instance.UI.getToolMode().name);
    expect(toolName).toBe('AnnotationCreateArrow');

    await page.keyboard.press('R');
    await page.waitForTimeout(300);
    toolName = await iframe.evaluate(() => window.instance.UI.getToolMode().name);
    expect(toolName).toBe('AnnotationCreateRectangle');
  });
});
