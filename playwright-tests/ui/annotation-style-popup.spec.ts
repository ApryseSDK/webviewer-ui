import { loadViewerSample } from '../../playwright-utils';
import { expect, test } from '@playwright/test';
import { drawLine } from '../common/line';

test.describe.skip('Style popup', () => {
  // TODO:reenable this. This will disable to reduce runtime and not exceed circleCI limit
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
});
