import { loadViewerSample } from '../../playwright-utils';
import { expect, test } from '@playwright/test';

test.describe('Flyout Menu', () => {
  test('should create flyout menus with the right size and position', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');
    await waitForInstance();
    await page.waitForTimeout(5000);

    const buttons = [
      'menuButton',
      'viewControlsButton',
      'zoomOverlayButton',
      'pageManipulationOverlayButton',
    ];
    await iframe.click('[data-element=leftPanelButton]');
    await page.waitForTimeout(1000);
    for (let i = 0; i < buttons.length; i++) {
      const button = await iframe.$(`button[data-element=${buttons[i]}]`);
      await button.click();
      await page.waitForTimeout(50);
      const currentFlyoutMenu = await iframe.$('.Overlay.FlyoutMenu');
      const body = await iframe.$('body');
      const flyoutMenuPos = await currentFlyoutMenu.boundingBox();
      const buttonPos = await button.boundingBox();
      const bodyPos = await body.boundingBox();
      if (buttons[i] === 'viewControlsOverlay') {
        expect(flyoutMenuPos.y > buttonPos.y).toBe(true);
      }

      expect(flyoutMenuPos.x >= 0).toBe(true);
      expect(flyoutMenuPos.y >= 0).toBe(true);
      expect(flyoutMenuPos.x + flyoutMenuPos.width <= bodyPos.x + bodyPos.width).toBe(true);
      expect(flyoutMenuPos.y + flyoutMenuPos.height <= bodyPos.y + bodyPos.height).toBe(true);
      await body.click();
    }
  });

  test('should close flyout menus on left panel when clicking outside the viewer', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing');
    await waitForInstance();
    await page.waitForTimeout(5000);

    const flyoutMenuTriggers = [
      'thumbnailsControlManipulatePopupSmallTrigger',
    ];

    const flyoutMenuSelectors = [
      'thumbnailsControlManipulatePopupSmall'
    ];

    await iframe.click('[data-element=leftPanelButton]');
    await page.waitForTimeout(1000);

    await iframe.evaluate(async () => {
      window.instance.UI.ThumbnailsPanel.enableMultiselect();
    });

    for (let i = 0; i < flyoutMenuTriggers.length; i++) {
      const button = await iframe.$(`button[data-element=${flyoutMenuTriggers[i]}]`);
      await button.click();
      await page.waitForTimeout(2000);
      const currentFlyoutMenuSelector = `[data-element="${flyoutMenuSelectors[i]}"]`;
      const currentFlyout = await page.locator(currentFlyoutMenuSelector);
      // Clicking outside the viewer
      const inputOutsideViewer = await iframe.$('#url-form input');
      await inputOutsideViewer?.click();
      await page.waitForTimeout(2000);
      // The flyout should be hidden
      const isFlyoutHidden = await currentFlyout.isHidden();
      expect(isFlyoutHidden).toEqual(true);
    }
  });
});