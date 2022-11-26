import { loadViewerSample } from '../../playwright-utils';
import { expect, test } from '@playwright/test';

test.describe('New Custom Panel', () => {
  test('should add new panel and open the new panel', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');
    const instance = await waitForInstance();
    await page.waitForTimeout(3000);

    await iframe.evaluate(async () => {
      window.instance.UI.addPanel({
        dataElement: 'fooBarElement',
        location: 'left',
        render: function() {
          const div = document.createElement('div');
          div.innerHTML = 'Hello World, foobar panel';
          return div;
        }
      });
    });
    await page.waitForTimeout(1000);
    await instance('openElements', ['fooBarElement']);
    await page.waitForTimeout(1000);
    const notesPanelContainer = await iframe.$('[data-element=fooBarElement]');
    await page.waitForTimeout(1000);

    expect(await notesPanelContainer.screenshot())
      .toMatchSnapshot(['custom-panel', 'custom-panel-fooBarElement.png']);
  });
});