import { loadViewerSample, Timeouts } from '../../playwright-utils';
import { expect, test } from '@playwright/test';

test.describe('Features', () => {
  test('should enabled and disabled search-and-replace feature', async ({ page, browserName }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');
    const instance = await waitForInstance();
    await instance('setToolbarGroup', 'toolbarGroup-Edit');
    await page.waitForTimeout(5000);

    await iframe.evaluate(() => {
      window.instance.UI.openElements(['searchPanel']);
    });
    await page.waitForTimeout(1000);

    const toolsHeaderContainer = await iframe.$('[data-element=toolsHeader]');
    const searchPanelContainer = await iframe.$('[data-element=searchPanel]');

    expect(await toolsHeaderContainer.screenshot())
      .toMatchSnapshot(['enable-feature', 'edit-button-tools-disabled.png']);
    expect(await searchPanelContainer.screenshot())
      .toMatchSnapshot(['enable-feature', 'search-replace-component-disabled.png']);

    await iframe.evaluate(async () => {
      window.instance.UI.enableFeatures(window.instance.UI.Feature.ContentEdit);
    });

    await page.waitForTimeout(Timeouts.REACT_RERENDER);

    if (browserName === 'webkit') {
      expect(await searchPanelContainer.screenshot()).toMatchSnapshot(['enable-feature', 'search-replace-component-disabled.png']);
      return;
    }

    expect(await toolsHeaderContainer.screenshot())
      .toMatchSnapshot(['enable-feature', 'edit-button-tools-enabled.png']);
    expect(await searchPanelContainer.screenshot())
      .toMatchSnapshot(['enable-feature', 'search-replace-component-enabled.png']);
  });
});