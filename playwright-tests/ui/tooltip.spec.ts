import { loadViewerSample, Timeouts } from '../../playwright-utils';
import { expect, test, Frame } from '@playwright/test';

test.describe('Tooltip', () => {
  test('should be able to hide tooltip label', async ({ page }) => {
    const { iframe, waitForWVEvents } = await loadViewerSample(page, 'viewing/viewing');

    await waitForWVEvents(['pageComplete', 'annotationsLoaded']);

    await iframe.evaluate(() => {
      window.instance.UI.hotkeys.off();
    });
    const tool = await iframe.$('[data-element="shapeToolGroupButton"]');
    const toolCoordinates = await tool.boundingBox();
    await page.mouse.move(toolCoordinates.x + 10, toolCoordinates.y + 10);
    await page.waitForTimeout(1000);

    const tooltip = await iframe.$('.tooltip--bottom');
    const value = await tooltip.evaluate((el) => el.textContent);

    expect(value).toBe('Rectangle');

    await iframe.evaluate(() => {
      window.instance.UI.hotkeys.on();
    });

    const tool2 = await iframe.$('[data-element="shapeToolGroupButton"]');
    const toolCoordinates2 = await tool2.boundingBox();
    await page.mouse.move(toolCoordinates2.x + 100, toolCoordinates2.y + 100);
    await page.waitForTimeout(500);

    await page.mouse.move(toolCoordinates2.x + 10, toolCoordinates2.y + 10);
    await page.waitForTimeout(1000);
    const tooltip2 = await iframe.$('.tooltip--bottom');
    const value2 = await tooltip2.evaluate((el) => el.textContent);

    expect(value2).toBe('Rectangle(R)');
  });

  test('should no longer show text pop-up tooltip on open', async ({ page }) => {
    const { iframe, waitForInstance, getTextPosition } = await loadViewerSample(page, 'viewing/viewing');
    const instance = await waitForInstance();
    await page.waitForTimeout(5000);


    await instance('setToolMode', 'TextSelect');
    const text = await getTextPosition('6 Important');

    // Select the text, but don't release the button to finish it
    await page.mouse.move(text.x1, text.y1);
    await page.mouse.down();
    await page.mouse.move(text.x2, text.y2);
    await page.mouse.up();
    // wait for the text selection to finish
    await iframe.waitForSelector('[data-element=textPopup]');

    const textPopupContainer = await iframe.$('.TextPopup');

    expect(await textPopupContainer.screenshot()).toMatchSnapshot([
      'tooltip',
      'text-popup-tooltip.png',
    ]);
  });
});