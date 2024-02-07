import { loadViewerSample, Timeouts } from '../../playwright-utils';
import { expect, test } from '@playwright/test';

test.describe('Features', () => {
  test('should need to call enableFeatures just once to re-enable Redaction', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'advanced/redaction');
    await waitForInstance();
    await page.waitForTimeout(5000);

    const headerContainer = await iframe.$('[data-element=header]');
    const toolsHeaderContainer = await iframe.$('[data-element=toolsHeader]');

    expect(await headerContainer.screenshot()).toMatchSnapshot(['enable-feature', 'redaction-feature-header-enabled.png']);
    expect(await toolsHeaderContainer.screenshot()).toMatchSnapshot(['enable-feature', 'redaction-feature-tools-header-enabled.png']);

    await iframe.evaluate(async () => {
      window.instance.UI.disableFeatures(window.instance.UI.Feature.Redaction);
    });

    await page.waitForTimeout(Timeouts.REACT_RERENDER);

    expect(await headerContainer.screenshot()).toMatchSnapshot(['enable-feature', 'redaction-feature-header-disabled.png']);
    expect(await toolsHeaderContainer.screenshot()).toMatchSnapshot(['enable-feature', 'redaction-feature-tools-header-disabled.png']);

    await iframe.evaluate(async () => {
      window.instance.UI.enableFeatures(window.instance.UI.Feature.Redaction);
      window.instance.UI.setToolMode(window.instance.Core.Tools.ToolNames.REDACTION);
    });

    await page.waitForTimeout(Timeouts.REACT_RERENDER);

    expect(await headerContainer.screenshot()).toMatchSnapshot(['enable-feature', 'redaction-feature-header-enabled.png']);
    expect(await toolsHeaderContainer.screenshot()).toMatchSnapshot(['enable-feature', 'redaction-feature-tools-header-enabled.png']);
  });
});