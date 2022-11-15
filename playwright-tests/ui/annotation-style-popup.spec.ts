import { loadViewerSample } from '../../playwright-utils';
import { expect, test } from '@playwright/test';
import { drawLine } from '../common/line';

test.describe('Style popup', () => {
  async function addNewAnnotation(iframe) {
    await iframe.evaluate(() => {
      const annotationManager = window.instance.Core.annotationManager;
      const rectangleAnnotation = new window.instance.Core.Annotations.RectangleAnnotation({
        PageNumber: 1,
        X: 50,
        Y: 100,
        Width: 150,
        Height: 100,
      });
      annotationManager.addAnnotation(rectangleAnnotation);
      annotationManager.redrawAnnotation(rectangleAnnotation);
      return;
    });
  }

  async function selectNewAnnotation(iframe) {
    await iframe?.evaluate(() => {
      const annotationManager = window.instance.Core.annotationManager;
      annotationManager.deselectAllAnnotations();
      const annotations = annotationManager.getAnnotationsList();
      annotationManager.selectAnnotation(annotations[0]);
    });
  }

  test('style popup should render correctly for different annotations', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'TODO: Investigate why this test is flaky on webkit');
    const { iframe, waitForInstance, getAnnotationsCount } = await loadViewerSample(page, 'viewing/blank');
    const instance = await waitForInstance();
    await instance('loadDocument', '/test-files/style_popup_test.pdf');
    await page.waitForTimeout(5000);

    await instance('openElement', ['stylePopupLabelTextContainer']);

    await page.waitForTimeout(1000);

    const annotationsCount = await getAnnotationsCount();

    for (let i = 0; i < annotationsCount; i++) {
      await iframe.evaluate((i: number) => {
        const annotationManager = window.instance.Core.annotationManager;
        const annotations = annotationManager.getAnnotationsList();
        annotationManager.deselectAllAnnotations();
        annotationManager.selectAnnotation(annotations[i]);
      }, i);
      await page.waitForTimeout(1000);
      await iframe.click('[data-element=annotationStyleEditButton]');
      await page.waitForTimeout(3000);

      const stylePopup = await iframe.$('[data-element="annotationStylePopup"]');
      expect(await stylePopup.screenshot()).toMatchSnapshot(['annotation-style-popup', `annotation-style-popup-${i}.png`]);
    }
  });

  test('should have text slider when enable FontSize for LineAnnotation for measurement line annotation', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');
    const instance = await waitForInstance();
    await page.waitForTimeout(5000);
    await instance('setToolMode', 'AnnotationCreateDistanceMeasurement');

    await iframe.evaluate(async () => {
      const { Core } = window.instance;
      const distanceMeasurementTool = Core.documentViewer.getTool(Core.Tools.ToolNames.DISTANCE_MEASUREMENT);
      const measurementManager = Core.documentViewer.getMeasurementManager();
      measurementManager.createAndApplyScale({
        scale: new Core.Scale({
          pageScale: { value: 1, unit: 'in' },
          worldScale: { value: 1, unit: 'in' },
        }),
        applyTo: [distanceMeasurementTool],
      });
    });

    await iframe.evaluate(() => {
      const { Annotations } = window.instance.Core;
      Object.defineProperty(Annotations.LineAnnotation.prototype, 'FontSize', {
        get: function() {
          // Read from Custom Data
          if (!this.mFontSize) {
            this.mFontSize = Number(this.getCustomData('MeasurementTextSize'));
          }
          // Use default if nothing was read
          if (!this.mFontSize) {
            this.mFontSize = parseFloat(Annotations.LineAnnotation.prototype.constant.FONT_SIZE);
            this.setCustomData('MeasurementTextSize', this.mFontSize);
          }
          return this.mFontSize;
        },
        set: function(val) {
          this.mFontSize = parseFloat(val);
          this.setCustomData('MeasurementTextSize', this.mFontSize);
        }
      });

      // Override draw with custom draw
      const originalLineDraw = Annotations.LineAnnotation.prototype.draw;
      Annotations.LineAnnotation.prototype.draw = function() {
        // Replace size before draw
        const originalSize = Annotations.LineAnnotation.prototype.constant.FONT_SIZE;
        this.constant.FONT_SIZE = `${this.FontSize}pt`;

        const result = originalLineDraw.call(this, ...arguments);

        // Restore
        Annotations.LineAnnotation.prototype.FONT_SIZE = originalSize;

        return result;
      };
    });

    const pageContainer = await iframe.$('#pageContainer1');
    const { x, y } = await pageContainer.boundingBox();

    await drawLine(page, x + 110, y + 110, 100, 5);

    await iframe.evaluate(() => {
      const annotationManager = window.instance.Core.annotationManager;
      const annotations = annotationManager.getAnnotationsList();
      annotationManager.deselectAllAnnotations();
      annotationManager.selectAnnotation(annotations[0]);
    });
    await iframe.waitForSelector('[data-element=annotationPopup]');
    await iframe.click('[data-element=annotationStyleEditButton]');
    await iframe.waitForSelector('[data-element=fontSizeSlider]');
  });

  test("Opacity slider input should be 0% if a user enter a negative value", async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');
    const instance = await waitForInstance();
    await page.waitForTimeout(5000);
    await addNewAnnotation(iframe);

    await page.waitForTimeout(5000);
    await selectNewAnnotation(iframe);
    await iframe.waitForSelector('[data-element=annotationPopup]');
    await iframe.click('[data-element="annotationStyleEditButton"]');
    await iframe.waitForSelector('[data-element=opacitySlider]');
    const opacityInput = await iframe.$('[data-element="opacitySlider"] > .slider-element-container > input');
    await opacityInput?.focus();
    await iframe.waitForSelector('[data-element=opacitySlider]');
    const realInput = await iframe.$('[data-element="opacitySlider"] > .slider-element-container > .slider-input-wrapper > input');
    await realInput.fill('-15', {
      force: true
    });
    await page.waitForTimeout(3000);
    const strokeThicknessInput = await iframe.$('[data-element="strokeThicknessSlider"] > .slider-element-container > input');
    await strokeThicknessInput?.focus();
    await iframe.waitForSelector('[data-element=opacitySlider]');
    const changedOpacityInput = await iframe.$('[data-element="opacitySlider"] > .slider-element-container > input');
    await iframe.waitForSelector('[data-element=opacitySlider]');
    await page.waitForTimeout(3000);
    expect(await changedOpacityInput.evaluate(input => input.value)).toBe("0%");
  });

  test("StrokThickness slider input should be 0.10pt if a user enter a negative value", async({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');
    const instance = await waitForInstance();
    await page.waitForTimeout(5000);
    await addNewAnnotation(iframe);

    await page.waitForTimeout(5000);
    await selectNewAnnotation(iframe);
    await iframe.waitForSelector('[data-element=annotationPopup]');
    await iframe.click('[data-element="annotationStyleEditButton"]');
    await iframe.waitForSelector('[data-element=strokeThicknessSlider]');
    const strokeThicknessInput = await iframe.$('[data-element="strokeThicknessSlider"] > .slider-element-container > input');
    await strokeThicknessInput?.focus();
    await iframe.waitForSelector('[data-element=strokeThicknessSlider]');
    const realInput = await iframe.$('[data-element="strokeThicknessSlider"] > .slider-element-container > .slider-input-wrapper > input');
    await realInput.fill('-15', {
      force: true
    });
    await page.waitForTimeout(3000);
    const opacitySliderInput = await iframe.$('[data-element="opacitySlider"] > .slider-element-container > input');
    await opacitySliderInput?.focus();
    await iframe.waitForSelector('[data-element=strokeThicknessSlider]');
    const changedStrokeThicknessInput = await iframe.$('[data-element="strokeThicknessSlider"] > .slider-element-container > input');
    await iframe.waitForSelector('[data-element=strokeThicknessSlider]');
    await page.waitForTimeout(3000);
    expect(await changedStrokeThicknessInput.evaluate(input => input.value)).toBe("0.10pt");
  });
});
