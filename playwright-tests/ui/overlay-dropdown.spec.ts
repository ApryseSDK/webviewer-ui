import { loadViewerSample } from '../../playwright-utils';
import { expect, test } from '@playwright/test';
import { drawRectangle } from '../common/rectangle';

test.describe('Overlay Dropdown', () => {
  test('should close overlays on click outside WebViewer iframe', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing');

    const overlays = [
      'viewControlsOverlay',
      'searchOverlay',
      'menuOverlay',
      'zoomOverlay',
      'toolsOverlay',
      'stampOverlay',
      'signatureOverlay',
      'measurementOverlay'
    ];

    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    // Enable Measurement feature for measurement overlay.
    await iframe.evaluate(async () => {
      window.instance.UI.enableFeatures(window.instance.UI.Feature.Measurement);
    });

    const viewerAside = await page.$('body aside');
    const appContainer = await iframe.$('div.App');

    for (let i = 0; i < overlays.length; i++) {
      // Set focus on WebViewer iframe.
      await appContainer.click();

      // Assert overlay is closed by default.
      let isElementOpen = await instance('isElementOpen', [overlays[i]]);
      expect(isElementOpen).toBe(false);

      await instance('openElement', overlays[i]);
      isElementOpen = await instance('isElementOpen', [overlays[i]]);
      expect(isElementOpen).toBe(true);

      // Set focus outside iframe (triggers onBlur event).
      // Assert this closes overlay.
      await viewerAside.click();
      isElementOpen = await instance('isElementOpen', [overlays[i]]);
      expect(isElementOpen).toBe(false);
    }
  });

  test('should close overlays when document unloads', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing');

    const overlays = [
      'viewControlsOverlay',
      'searchOverlay',
      'menuOverlay',
      'zoomOverlay',
      'toolsOverlay',
      'stampOverlay',
      'signatureOverlay',
      'measurementOverlay'
    ];

    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    // Enable Measurement feature for measurement overlay.
    await iframe.evaluate(async () => {
      window.instance.UI.enableFeatures(window.instance.UI.Feature.Measurement);
    });

    for (let i = 0; i < overlays.length; i++) {
      // Assert overlay is closed by default.
      let isElementOpen = await instance('isElementOpen', [overlays[i]]);
      expect(isElementOpen).toBe(false);

      // Open overlay dropdown.
      await instance('openElements', [overlays[i]]);
      isElementOpen = await instance('isElementOpen', [overlays[i]]);
      expect(isElementOpen).toBe(true);

      // Load new document.
      await instance('loadDocument', '/test-files/blank.pdf');
      await page.waitForTimeout(5000);
      isElementOpen = await instance('isElementOpen', [overlays[i]]);
      expect(isElementOpen).toBe(false);
    }
  });

  test('should place the overlay on top/bottom of the trigger element if there is not enough space at the bottom/top of it', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');
    const instance = await waitForInstance();

    await instance('setToolMode', 'AnnotationCreateRectangle');
    await page.waitForTimeout(3000);

    const pageContainer = await iframe.$('#pageContainer1');
    const { x: pageX, y: pageY, height: heightContainer, width: widthContainer } = await pageContainer?.boundingBox();
    await drawRectangle(page, heightContainer - 100, widthContainer - 100, 200, 50);

    await page.waitForTimeout(3000);
    await page.mouse.click(heightContainer - 100, widthContainer - 100);
    await page.waitForTimeout(3000);

    const annotationStyleButton = await iframe.$('[data-element=annotationStyleEditButton]');
    await annotationStyleButton?.click();
    const borderStylePicker = await iframe.$('[data-element=borderStylePicker] button');
    await borderStylePicker?.click();
    await page.waitForTimeout(3000);

    expect(await pageContainer.screenshot()).toMatchSnapshot(['overlay-dropdown', 'overlay-dropdown-top-position.png']);

    // Now get the overlay and drag it to the top of the page container
    // When opening the overlay again, it should be positioned at the bottom ofits trigger
    const annotationPopup = await iframe.$('[data-element=annotationPopup]');
    const popupCoordinates = await annotationPopup?.boundingBox();
    const { x, y, height: popupHeight } = popupCoordinates;
    await page.mouse.move(x + 10, y + popupHeight - 10);
    await page.mouse.down();
    await page.mouse.move(pageX + 100, pageY + 100);
    await page.mouse.up();
    await page.waitForTimeout(2000);
    await borderStylePicker?.click();
    await page.waitForTimeout(3000);

    expect(await pageContainer.screenshot()).toMatchSnapshot(['overlay-dropdown', 'overlay-dropdown-bottom-position.png']);
  });
});