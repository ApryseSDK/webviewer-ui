import { loadViewerSample, Timeouts, WebViewerInstance } from '../../playwright-utils';
import { expect, Frame, test } from '@playwright/test';

test.describe('Line Endings', () => {
  const BUTT_LINE_STYLE = 'Butt';

  let iframe: Frame;
  let instance: WebViewerInstance;
  let pageX: number;
  let pageY: number;

  async function getAnnotationLineStyles() {
    return iframe.evaluate(async () => {
      const { annotationManager } = window.instance.Core;
      const annotation = annotationManager.getAnnotationsList()[0];
      return {
        startLineStyle: annotation.getStartStyle(),
        endLineStyle: annotation.getEndStyle(),
      };
    });
  }

  async function selectAnnotation() {
    await iframe.evaluate(async () => {
      const { annotationManager } = window.instance.Core;
      const annotation = annotationManager.getAnnotationsList()[0];
      annotationManager.deselectAllAnnotations();
      await annotationManager.selectAnnotation(annotation);
      return annotation;
    });
  }

  async function changeSelectedAnnotationLineStyles() {
    await selectAnnotation();

    await iframe.waitForSelector('[data-element=annotationPopup]');
    await iframe.click('[data-element=annotationStyleEditButton]');
    await iframe.click('[data-element=startLineStyleDropdown]');
    await iframe.click(`[data-element=startLineStyleDropdown] button[data-element="dropdown-item-${BUTT_LINE_STYLE}"]`);
    await iframe.click('[data-element=endLineStyleDropdown]');
    await iframe.click(`[data-element=endLineStyleDropdown] button[data-element="dropdown-item-${BUTT_LINE_STYLE}"]`);
  }

  test.beforeEach(async ({ page }) => {
    const { iframe: sampleIframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');
    iframe = sampleIframe;
    instance = await waitForInstance();
    await page.waitForTimeout(5000);

    const pageContainer = await iframe.$('#pageContainer1');
    const { x, y } = await pageContainer.boundingBox();
    pageX = x;
    pageY = y;

    await iframe.evaluate(async () => {
      const { Core } = window.instance;
      const measurementManager = Core.documentViewer.getMeasurementManager();
      measurementManager.createAndApplyScale({
        scale: new Core.Scale({
          pageScale: { value: 1, unit: 'in' },
          worldScale: { value: 1, unit: 'in' },
        }),
        applyTo: [],
      });
    });
  });

  test('should change distance measurement line endings via UI', async ({ page }) => {
    // Setup distance measurement tool.
    await iframe.evaluate(async () => {
      const { UI, Core } = window.instance;
      UI.enableFeatures(UI.Feature.Measurement);
      const distanceMeasurementTool = Core.documentViewer.getTool(Core.Tools.ToolNames.DISTANCE_MEASUREMENT);
      distanceMeasurementTool.setDrawMode(Core.Tools.LineCreateTool.DrawModes.TWO_CLICKS);

      window.annotChangedCount = 0;
      Core.annotationManager.addEventListener('annotationChanged', (annotations, action) => {
        if (action === 'modify') {
          window.annotChangedCount++;
        }
      });
    });
    await instance('setToolbarGroup', 'toolbarGroup-Measure');

    // Create distance measurement annotation.
    const startPoint = { x: pageX + 100, y: pageY + 100 };
    const endPoint = { x: pageX + 200, y: pageY + 100 };
    await page.mouse.move(startPoint.x, startPoint.y);
    await page.mouse.down();
    await page.mouse.move(endPoint.x, endPoint.y);
    await page.mouse.down();
    await page.waitForTimeout(Timeouts.REACT_RERENDER);

    await changeSelectedAnnotationLineStyles();
    const annotation = await getAnnotationLineStyles();
    expect(annotation.startLineStyle).toEqual(BUTT_LINE_STYLE);
    expect(annotation.endLineStyle).toEqual(BUTT_LINE_STYLE);

    const annotChangedCount = await iframe.evaluate(() => window.annotChangedCount);
    expect(annotChangedCount).toBe(2);
  });

  test('should change polyline line endings via UI', async ({ page }) => {
    // Create polyline annotation.
    await instance('setToolbarGroup', 'toolbarGroup-Shapes');
    await iframe.click('[data-element=polyLineToolGroupButton]');
    const startPoint = { x: pageX + 100, y: pageY + 100 };
    const point1 = { x: startPoint.x + 100, y: startPoint.y + 100 };
    const point2 = { x: startPoint.x + 150, y: startPoint.y + 175 };
    const point3 = { x: startPoint.x + 300, y: startPoint.y + 100 };
    await page.mouse.click(point1.x, point1.y);
    await page.mouse.click(point2.x, point2.y);
    await page.mouse.click(point3.x, point3.y, { button: 'right' });
    await page.waitForTimeout(Timeouts.REACT_RERENDER);

    await changeSelectedAnnotationLineStyles();
    const annotation = await getAnnotationLineStyles();
    expect(annotation.startLineStyle).toEqual(BUTT_LINE_STYLE);
    expect(annotation.endLineStyle).toEqual(BUTT_LINE_STYLE);
  });

  test('should change arrow line endings via UI', async ({ page }) => {
    // Create arrow annotation.
    await instance('setToolbarGroup', 'toolbarGroup-Shapes');
    await iframe.click('[data-element=arrowToolGroupButton]');
    const startPoint = { x: pageX + 100, y: pageY + 100 };
    const point1 = { x: startPoint.x + 100, y: startPoint.y + 100 };
    const point2 = { x: startPoint.x + 150, y: startPoint.y + 175 };
    await page.mouse.move(point1.x, point1.y);
    await page.mouse.down();
    await page.mouse.move(point2.x, point2.y);
    await page.mouse.up();
    await page.waitForTimeout(Timeouts.REACT_RERENDER);

    await changeSelectedAnnotationLineStyles();
    const annotation = await getAnnotationLineStyles();
    expect(annotation.startLineStyle).toEqual(BUTT_LINE_STYLE);
    expect(annotation.endLineStyle).toEqual(BUTT_LINE_STYLE);
  });

  test('should change perimeter measurement line endings via UI', async ({ page }) => {
    // Setup perimeter measurement tool.
    await iframe.evaluate(() => {
      const { UI } = window.instance;
      UI.enableFeatures(UI.Feature.Measurement);
    });
    await instance('setToolbarGroup', 'toolbarGroup-Measure');
    await iframe.click('[data-element=perimeterToolGroupButton]');

    const startPoint = { x: pageX + 100, y: pageY + 100 };
    const point1 = { x: startPoint.x + 100, y: startPoint.y };
    const point2 = { x: startPoint.x + 100, y: startPoint.y + 100 };
    const point3 = { x: startPoint.x, y: startPoint.y + 100 };

    await page.mouse.click(startPoint.x, startPoint.y);
    await page.mouse.click(point1.x, point1.y);
    await page.mouse.click(point2.x, point2.y);
    await page.mouse.click(point3.x, point3.y);
    await page.mouse.click(startPoint.x, startPoint.y);
    await page.mouse.click(startPoint.x, startPoint.y, { button: 'right' }); // Repeat last click to complete perimeter measurement.
    await page.waitForTimeout(Timeouts.REACT_RERENDER);

    await changeSelectedAnnotationLineStyles();
    const annotation = await getAnnotationLineStyles();
    expect(annotation.startLineStyle).toEqual(BUTT_LINE_STYLE);
    expect(annotation.endLineStyle).toEqual(BUTT_LINE_STYLE);
  });

  test('should change line annotation line endings via UI', async ({ page }) => {
    // Create line annotation.
    await instance('setToolbarGroup', 'toolbarGroup-Shapes');
    await iframe.click('[data-element=lineToolGroupButton]');
    const startPoint = { x: pageX + 100, y: pageY + 100 };
    const point1 = { x: startPoint.x + 100, y: startPoint.y + 100 };
    const point2 = { x: startPoint.x + 150, y: startPoint.y + 175 };
    await page.mouse.move(point1.x, point1.y);
    await page.mouse.down();
    await page.mouse.move(point2.x, point2.y);
    await page.mouse.up();
    await page.waitForTimeout(Timeouts.REACT_RERENDER);

    await changeSelectedAnnotationLineStyles();
    const annotation = await getAnnotationLineStyles();
    expect(annotation.startLineStyle).toEqual(BUTT_LINE_STYLE);
    expect(annotation.endLineStyle).toEqual(BUTT_LINE_STYLE);
  });
});