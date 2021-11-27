import { loadViewerSample } from '../../utils';

it('should create flyout menus with the right size and position', async () => {
  const { iframe, waitForInstance, waitForWVEvents } = await loadViewerSample('viewing/viewing');
  const instance = await waitForInstance();
  await instance('loadDocument', '/test-files/blank.pdf');
  await waitForWVEvents(['pageComplete', 'annotationsLoaded']);

  const buttons = [
    'menuButton',
    'viewControlsButton',
    'zoomOverlay',
    'pageManipulationOverlayButton',
  ];
  await iframe.click('[data-element=leftPanelButton]');
  await page.waitFor(1000);
  for (let i = 0; i < buttons.length; i++) {
    const button = await iframe.$(`[data-element=${buttons[i]}]`);
    await button.click();
    const currentFlyoutMenu = await iframe.$('.Overlay.FlyoutMenu:not(.closed)');
    const body = await iframe.$('body');
    const flyoutMenuPos = await currentFlyoutMenu.boundingBox();
    const buttonPos = await button.boundingBox();
    const bodyPos = await body.boundingBox();
    if (buttons[i] === 'viewControlsOverlay') {
      expect(flyoutMenuPos.y > buttonPos.y).toBe(true);
    };
    //Menus should not be cutoff by borders
    expect(flyoutMenuPos.x >= 0).toBe(true);
    expect(flyoutMenuPos.y >= 0).toBe(true);
    expect(flyoutMenuPos.x + flyoutMenuPos.width <= bodyPos.x + bodyPos.width).toBe(true);
    expect(flyoutMenuPos.y + flyoutMenuPos.height <= bodyPos.y + bodyPos.height).toBe(true);
    await body.click();
  }
});

