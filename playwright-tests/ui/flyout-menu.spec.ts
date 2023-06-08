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
});