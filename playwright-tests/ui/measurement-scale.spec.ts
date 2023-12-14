import { test, expect } from '@playwright/test';
import { loadViewerSample } from '../../playwright-utils';

const addScale1 = async (iframe) => {
  await iframe.click('[data-element="addNewScale"]');
  await iframe.click('[data-element="createScale"]');
};

const addScale2 = async (iframe) => {
  await iframe.click('.scale-overlay-selection');
  await iframe.click('[data-element=scaleSelector] .add-new-scale');
  await iframe.fill('[data-element=customDisplayScaleValue]', '2');
  await iframe.click('[data-element=createScale]');
};

const addMeasurement = async (iframe, page) => {
  const pageContainer = await iframe.$('#pageContainer1');
  const { x, y } = await pageContainer.boundingBox();
  await page.mouse.move(x + 100, y + 100);
  await page.mouse.down();
  await page.mouse.move(x + 200, y + 200);
  await page.mouse.up();
};

async function increaseInputValueViaKeyboard(page) {
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');
  await page.mouse.move(100, 100);
  await page.mouse.down();
}

test.describe('Measurement Scale', () => {
  test('should show scale modal after click the doc', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');

    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    await instance('setToolMode', 'AnnotationCreateDistanceMeasurement');

    const pageContainer = await iframe.$('#pageContainer1');
    const { x, y } = await pageContainer.boundingBox();
    await page.mouse.click(x + 100, y + 100);

    await iframe.waitForSelector('[data-element=scaleModal]');
    const scaleModal = await iframe.$('[data-element=scaleModal] .container');
    expect(await scaleModal.screenshot()).toMatchSnapshot(['measurement-scale', 'measurement-scale-scaleModal-0.png']);
  });

  test('should have no initial scale and be able to add a new scale', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');

    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    await instance('setToolMode', 'AnnotationCreateDistanceMeasurement');

    const scaleOverlay = await iframe.$('[data-element=scaleOverlayContainer]');
    expect(await scaleOverlay.screenshot()).toMatchSnapshot(['measurement-scale', 'measurement-scale-scaleOverlay-0.png']);

    await iframe.click('[data-element="addNewScale"]');

    await iframe.waitForSelector('[data-element=scaleModal]');
    const scaleModal = await iframe.$('[data-element=scaleModal] .container');
    expect(await scaleModal.screenshot()).toMatchSnapshot(['measurement-scale', 'measurement-scale-scaleModal-0.png']);

    await iframe.click('[data-element="createScale"]');
    expect(await scaleOverlay.screenshot()).toMatchSnapshot(['measurement-scale', 'measurement-scale-scaleOverlay-1.png']);
  });

  test('should be able to add/delete scale', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');

    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    await instance('setToolMode', 'AnnotationCreateDistanceMeasurement');

    // Add scale 1
    await addScale1(iframe);

    // Add scale 2
    await addScale2(iframe);

    await iframe.click('.scale-overlay-selection');
    const scaleOverlay = await iframe.$('[data-element=scaleOverlayContainer]');
    expect(await scaleOverlay.screenshot()).toMatchSnapshot(['measurement-scale', 'measurement-scale-scaleOverlay-2.png']);

    // Dark mode
    await instance('setTheme', 'dark');
    await page.waitForTimeout(1000);
    expect(await scaleOverlay.screenshot()).toMatchSnapshot(['measurement-scale', 'measurement-scale-scaleOverlay-dark-mode.png']);
    await instance('setTheme', 'light');
    await page.waitForTimeout(1000);

    // Delete scale 2
    await iframe.click('[data-element=scaleSelector] ul button.delete');

    await iframe.waitForSelector('.WarningModal');
    const warningModal = await iframe.$('.WarningModal .container');
    expect(await warningModal.screenshot()).toMatchSnapshot(['measurement-scale', 'measurement-scale-warningModal-0.png']);

    // Confirm delete scale
    await iframe.click('[data-element=WarningModalSignButton]');

    await page.waitForTimeout(1000);
    await scaleOverlay.click();
    expect(await scaleOverlay.screenshot()).toMatchSnapshot(['measurement-scale', 'measurement-scale-scaleOverlay-1.png']);
  });

  test('should show proper warning when deleting a scale with associated measurement', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');

    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    await instance('setToolMode', 'AnnotationCreateDistanceMeasurement');

    // Add scale 1
    await addScale1(iframe);

    // Add scale 2
    await addScale2(iframe);

    // Create a measurement with scale 2
    await addMeasurement(iframe, page);

    // Delete scale 2
    await iframe.click('.scale-overlay-selection');
    await iframe.click('[data-element=scaleSelector] ul button.delete');

    await iframe.waitForSelector('.WarningModal');
    const warningModal = await iframe.$('.WarningModal .container');
    expect(await warningModal.screenshot()).toMatchSnapshot(['measurement-scale', 'measurement-scale-warningModal-1.png']);

    // Confirm delete scale
    await iframe.click('[data-element=WarningModalSignButton]');

    await page.waitForTimeout(1000);

    const scaleOverlay = await iframe.$('[data-element=scaleOverlayContainer]');
    await scaleOverlay.click();
    expect(await scaleOverlay.screenshot()).toMatchSnapshot(['measurement-scale', 'measurement-scale-scaleOverlay-1.png']);
  });

  test('should show proper warning whne auto deleting a scale with no associated measurement', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');

    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    await instance('setToolMode', 'AnnotationCreateDistanceMeasurement');

    // Add scale 1
    await addScale1(iframe);

    // Add scale 2
    await addScale2(iframe);

    // Select scale 1
    await iframe.click('.scale-overlay-selection');
    const scaleItems = await iframe.$$('[data-element=scaleSelector] ul li');
    await (await scaleItems[2].$('button.options')).click();

    await iframe.waitForSelector('.WarningModal');
    const warningModal = await iframe.$('.WarningModal .container');
    expect(await warningModal.screenshot()).toMatchSnapshot(['measurement-scale', 'measurement-scale-warningModal-2.png']);

    // Confirm delete scale
    await iframe.click('[data-element=WarningModalSignButton]');

    await page.waitForTimeout(1000);

    const scaleOverlay = await iframe.$('[data-element=scaleOverlayContainer]');
    await scaleOverlay.click();
    expect(await scaleOverlay.screenshot()).toMatchSnapshot(['measurement-scale', 'measurement-scale-scaleOverlay-1.png']);
  });

  test('should be able to update scale', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');

    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    await instance('setToolMode', 'AnnotationCreateDistanceMeasurement');

    // Add scale
    await addScale1(iframe);

    // Select scale
    await iframe.click('.scale-overlay-selection');
    const scaleItems = await iframe.$$('[data-element=scaleSelector] ul li');
    await (await scaleItems[1].$('button.options')).click();

    // Update scale
    await iframe.fill('[data-element=customDisplayScaleValue]', '2');
    await iframe.click('[data-element="updateScale"]');

    await page.waitForTimeout(1000);

    await iframe.click('.scale-overlay-selection');
    const scaleOverlay = await iframe.$('[data-element=scaleOverlayContainer]');
    expect(await scaleOverlay.screenshot()).toMatchSnapshot(['measurement-scale', 'measurement-scale-scaleOverlay-3.png']);
  });

  test('scale modal tests', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');

    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    await instance('setToolMode', 'AnnotationCreateDistanceMeasurement');

    await iframe.click('[data-element="addNewScale"]');

    // Change units
    await iframe.click('[data-element="customPageScaleUnit"]');
    await iframe.click('[data-element="customPageScaleUnit"] button[data-element="dropdown-item-mm"]');
    await iframe.click('[data-element="customDisplayScaleUnit"]');
    await iframe.click('[data-element="customDisplayScaleUnit"] button[data-element="dropdown-item-km"]');

    let scaleModal = await iframe.$('[data-element=scaleModal] .container');
    expect(await scaleModal.screenshot()).toMatchSnapshot(['measurement-scale', 'measurement-scale-scaleModal-1.png']);

    // Switch to Preset scale
    await iframe.click('[data-element="presetScaleOption"]');
    // Enable Fractional Units
    await iframe.click('input[id="scale-modal-fractional-units"]');
    await page.waitForTimeout(1000); // Wait for the toggle animation

    await iframe.click('[data-element="presetScales"]');
    await (await iframe.$$('[data-element=presetScales] button.Dropdown__item'))[1].click();
    expect(await scaleModal.screenshot()).toMatchSnapshot(['measurement-scale', 'measurement-scale-scaleModal-2.png']);

    // Switch to Custom scale
    await iframe.click('[data-element="customScaleOption"]');

    expect(await scaleModal.screenshot()).toMatchSnapshot(['measurement-scale', 'measurement-scale-scaleModal-3.png']);

    // Create scale
    await iframe.click('[data-element="createScale"]');

    const scaleOverlay = await iframe.$('[data-element=scaleOverlayContainer]');
    expect(await scaleOverlay.screenshot()).toMatchSnapshot(['measurement-scale', 'measurement-scale-scaleOverlay-4.png']);

    // Error state
    await iframe.click('.scale-overlay-selection');
    const scaleItems = await iframe.$$('[data-element=scaleSelector] ul li');
    await (await scaleItems[1].$('button.options')).click();
    scaleModal = await iframe.$('[data-element=scaleModal] .container');
    await iframe.type('[data-element=customPageScaleValue]', '-');
    await iframe.type('[data-element=customDisplayScaleValue]', '-');

    await page.waitForTimeout(1000);
    expect(await scaleModal.screenshot()).toMatchSnapshot(['measurement-scale', 'measurement-scale-scaleModal-4.png']);
  });

  test('should show multiple scale when select two different measurement tools or annotations with different scales', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');

    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    await instance('setToolMode', 'AnnotationCreateDistanceMeasurement');

    // Add scale 1
    await addScale1(iframe);

    // Add scale 2
    await addScale2(iframe);

    // Create a measurement with scale 2
    await addMeasurement(iframe, page);

    // Switch to AnnotationCreateDistanceMeasurement2
    await instance('setToolMode', 'AnnotationCreateDistanceMeasurement2');

    // Select the measurement created before
    await iframe.evaluate(async () => {
      const annotation = window.instance.Core.annotationManager.getAnnotationsList()[0];
      window.instance.Core.annotationManager.selectAnnotation(annotation);
    });

    const scaleOverlay = await iframe.$('[data-element=scaleOverlayContainer]');
    await iframe.click('.scale-overlay-selection');
    expect(await scaleOverlay.screenshot()).toMatchSnapshot(['measurement-scale', 'measurement-scale-scaleOverlay-5.png']);
  });

  test('calibration should work properly', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');

    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    await instance('setToolMode', 'AnnotationCreateDistanceMeasurement');

    // Add scale
    await iframe.click('[data-element="addNewScale"]');

    // Click Calibrate button
    await iframe.click('[data-element="calibrate"]');

    const scaleOverlay = await iframe.$('[data-element=scaleOverlayContainer]');
    expect(await scaleOverlay.screenshot()).toMatchSnapshot(['measurement-scale', 'measurement-scale-scaleOverlay-6.png']);

    // Calibrate
    const pageContainer = await iframe.$('#pageContainer1');
    const { x, y } = await pageContainer.boundingBox();
    await page.mouse.click(x + 100, y + 100);
    await page.mouse.click(x + 200, y + 200);

    // Change calibration unit
    await iframe.click('[data-element="calibrationUnits"]');
    await iframe.click('[data-element="calibrationUnits"] button[data-element="dropdown-item-mm"]');

    const calibrationPopup = await iframe.$('[data-element=calibrationPopup]');
    expect(await calibrationPopup.screenshot()).toMatchSnapshot(['measurement-scale', 'measurement-scale-calibrationPopup.png']);
    expect(await scaleOverlay.screenshot()).toMatchSnapshot(['measurement-scale', 'measurement-scale-scaleOverlay-7.png']);

    // Apply calibration
    await iframe.click('[data-element="calibrationApply"]');

    await page.waitForTimeout(1000);

    await iframe.waitForSelector('[data-element=scaleModal]');
    const scaleModal = await iframe.$('[data-element=scaleModal] .container');
    expect(await scaleModal.screenshot()).toMatchSnapshot(['measurement-scale', 'measurement-scale-scaleModal-5.png']);
  });

  test('should update scale properly after calibration', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');

    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    await instance('setToolMode', 'AnnotationCreateDistanceMeasurement');

    // Add scale
    await addScale1(iframe);

    // Select scale
    await iframe.click('.scale-overlay-selection');
    const scaleItems = await iframe.$$('[data-element=scaleSelector] ul li');
    await (await scaleItems[1].$('button.options')).click();

    // Calibrate
    await iframe.click('[data-element="calibrate"]');
    const pageContainer = await iframe.$('#pageContainer1');
    const { x, y } = await pageContainer.boundingBox();
    await page.mouse.click(x + 100, y + 100);
    await page.mouse.click(x + 200, y + 200);
    await iframe.click('[data-element="calibrationApply"]');

    await page.waitForTimeout(1000);

    // Update scale
    await iframe.click('[data-element="updateScale"]');

    await page.waitForTimeout(1000);

    const scaleSelectorTitle = await iframe.$('.scale-overlay-selection div span');
    expect(await scaleSelectorTitle.textContent()).toBe('1.5 in = 1.5 in');
  });

  test('should toggle calibration popup correctly', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');

    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    await instance('setToolMode', 'AnnotationCreateDistanceMeasurement');
    // Add scale
    await addScale1(iframe);
    // draw distance annotation
    const pageContainer = await iframe.$('#pageContainer1');
    const { x, y } = await pageContainer.boundingBox();
    await page.mouse.move(x + 20, y + 100);
    await page.mouse.down();
    await page.mouse.move(x + 200, y + 100);
    await page.mouse.up();
    // selection annotation
    await iframe.evaluate(() => {
      const annotManager = window.instance.Core.documentViewer.getAnnotationManager();
      const annots = annotManager.getAnnotationsList();
      annotManager.deselectAllAnnotations();
      annotManager.selectAnnotation(annots[0]);
    });

    // check pop up annotation
    await iframe.waitForSelector('[data-element=annotationPopup]');
    const annotationPopup = await iframe.$('[data-element=annotationPopup]');
    expect(await annotationPopup.screenshot()).toMatchSnapshot(['measurement-scale-popup-disable', 'measurement-scale-calibration-popup-1.png']);
    await instance('enableElements', ['calibratePopupButton']);
    expect(await annotationPopup.screenshot()).toMatchSnapshot(['measurement-scale-popup-enable', 'measurement-scale-calibration-popup-2.png']);
    await instance('disableElements', ['calibratePopupButton']);
    expect(await annotationPopup.screenshot()).toMatchSnapshot(['measurement-scale-popup-disable', 'measurement-scale-calibration-popup-1.png']);
  });

  test('scale overlay for distance measurement should not lose focus when changing angle or length', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');
    const instance = await waitForInstance();
    await page.waitForTimeout(2000);

    await instance('setToolMode', 'AnnotationCreateDistanceMeasurement');
    await addScale1(iframe);

    // draw distance annotation
    const pageContainer = await iframe.$('#pageContainer1');
    const { x, y } = await pageContainer.boundingBox();
    await page.mouse.move(x + 20, y + 100);
    await page.mouse.down();
    await page.mouse.move(x + 200, y + 100);
    await page.mouse.up();

    // selection annotation
    await iframe.evaluate(() => {
      const annotManager = window.instance.Core.documentViewer.getAnnotationManager();
      const annots = annotManager.getAnnotationsList();
      annotManager.deselectAllAnnotations();
      annotManager.selectAnnotation(annots[0]);
    });

    const scaleOverlay = await iframe?.$('[data-element=scaleOverlayContainer]');
    expect(scaleOverlay).toBeDefined();

    // Query the distance/length and angle containers.
    // Keep track of original values.
    let scaleContainers = await scaleOverlay?.$$('div.distance-show');
    expect(scaleContainers?.length).toBe(2);
    let lengthContainer = scaleContainers[0];
    let angleContainer = scaleContainers[1];
    const previousLength = await lengthContainer.innerHTML();
    const previousAngle = await angleContainer.innerHTML();

    // Setup event listener through page context.
    await lengthContainer.click();
    await iframe?.evaluate(() => {
      window.inputChangedCounter = 0;
      const inputElement = window.document.querySelector('[data-element=scaleOverlayContainer] input');
      if (inputElement) {
        inputElement.addEventListener('change', () => window.inputChangedCounter++);
      }
    });
    await increaseInputValueViaKeyboard(page);

    await angleContainer.click();
    await iframe?.evaluate(() => {
      const inputElement = window.document.querySelector('[data-element=scaleOverlayContainer] input');
      if (inputElement) {
        inputElement.addEventListener('change', () => window.inputChangedCounter++);
      }
    });
    await increaseInputValueViaKeyboard(page);

    // Query inputs again since React rerender occurred and values have changed.
    scaleContainers = await scaleOverlay?.$$('div.distance-show');
    expect(scaleContainers?.length).toBe(2);
    lengthContainer = scaleContainers[0];
    angleContainer = scaleContainers[1];
    const newLength = await lengthContainer.innerHTML();
    const newAngle = await angleContainer.innerHTML();

    // Fetch total # of input change events from page.
    const eventCount = await iframe?.evaluate(() => {
      const eventCount = window.inputChangedCounter;
      window.inputChangedCounter = 0;
      return eventCount;
    });

    expect(eventCount).toBe(4);
    expect(previousLength).not.toBe(newLength);
    expect(newAngle).not.toBe(previousAngle);
  });
});
