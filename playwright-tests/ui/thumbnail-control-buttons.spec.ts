import { loadViewerSample } from '../../playwright-utils';
import { expect, test } from '@playwright/test';

test.describe('Thumbnail Control Buttons', () => {
  test('should customize thumbnail control buttons', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing');
    const instance = await waitForInstance();
    await page.waitForTimeout(5000);
    await instance('openElements', ['leftPanel']);
    await page.waitForTimeout(3000);
    await iframe.evaluate(() => {
      window.instance.UI.thumbnailControlMenu.add([
        {
          title: 'alertme',
          img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41Ljg3O4BdAAAAl0lEQVQ4jWP4P9n9PyWYgTYGzAr+///Q9P//Ty/HjhfEETDg1oH/YPDgNKbm4wsIuGBO+H84WJJKhhd2dkA0v3tEZhjcPQox4MVN7P7fUEHAgM112DX++Qkx+PEFMqPxwSmIAQenkWHAvCicAUucAbCAfX2PQCCCEtDGKkz86RXEgL39BAwAKcAFbh/6/39GIL3yAj0NAAB+LQeDCZ9tvgAAAABJRU5ErkJggg==',
          onClick: (selectedPageNumbers) => {
            alert(`Selected thumbnail: ${selectedPageNumbers}`);
          },
          dataElement: 'alertMeDataElement',
        },
      ], 'thumbRotateClockwise');
    });
    await page.waitForTimeout(1000);
    const thumbnailControlsOverlay = await iframe.$('.thumbnailControls-overlay');
    expect(await thumbnailControlsOverlay.screenshot()).toMatchSnapshot(['thumbnail-control-buttons', 'thumbnail-controls-overlay.png']);
  });
});