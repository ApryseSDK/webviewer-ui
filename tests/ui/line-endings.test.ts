import { loadViewerSample, Timeouts } from '../../utils';

const BUTT_LINE_STYLE = 'Butt';

describe('Annotation Line Ending Tests', () => {
  let iFrameRef;
  let instance;
  let pageX;
  let pageY;

  beforeEach(async () => {
    const { iframe, waitForInstance, waitForWVEvents } = await loadViewerSample('viewing/blank');

    instance = await waitForInstance();
    await waitForWVEvents(['pageComplete', 'annotationsLoaded']);

    const pageContainer = await iframe.$('#pageContainer1');
    const { x, y } = await pageContainer.boundingBox();

    pageX = x;
    pageY = y;
    iFrameRef = iframe;
  });

  it('should change distance measurement line endings via UI', async () => {
    // Setup distance measurement tool.
    await iFrameRef.evaluate(async () => {
      const { UI, Core } = window.instance;
      UI.enableFeatures(UI.Feature.Measurement);
      const distanceMeasurementTool = Core.documentViewer.getTool(Core.Tools.ToolNames.DISTANCE_MEASUREMENT);
      distanceMeasurementTool.setDrawMode(Core.Tools.LineCreateTool.DrawModes.TWO_CLICKS);
    });
    await instance('setToolbarGroup', 'toolbarGroup-Measure');

    // Create distance measurement annotation.
    const startPoint = { x: pageX + 100, y: pageY + 100 };
    const endPoint = { x: pageX + 200, y: pageY + 100 };
    await page.mouse.move(startPoint.x, startPoint.y);
    await page.mouse.down();
    await page.mouse.move(endPoint.x, endPoint.y);
    await page.mouse.down();
    await page.waitFor(Timeouts.REACT_RERENDER);

    await changeSelectedAnnotationLineStyles(iFrameRef);
    const annotation = await getAnnotationLineStyles(iFrameRef);
    expect(annotation.startLineStyle).toEqual(BUTT_LINE_STYLE);
    expect(annotation.endLineStyle).toEqual(BUTT_LINE_STYLE);
  });

  it('should change polyline line endings via UI', async () => {
    // Create polyline annotation.
    await instance('setToolbarGroup', 'toolbarGroup-Shapes');
    await iFrameRef.click('[data-element=polyLineToolGroupButton]');
    const startPoint = { x: pageX + 100, y: pageY + 100 };
    const point1 = { x: startPoint.x + 100, y: startPoint.y + 100 };
    const point2 = { x: startPoint.x + 150, y: startPoint.y + 175 };
    const point3 = { x: startPoint.x + 300, y: startPoint.y + 100 };
    await page.mouse.click(point1.x, point1.y);
    await page.mouse.click(point2.x, point2.y);
    await page.mouse.click(point3.x, point3.y, { button: 'right' });
    await page.waitFor(Timeouts.REACT_RERENDER);

    await changeSelectedAnnotationLineStyles(iFrameRef);
    const annotation = await getAnnotationLineStyles(iFrameRef);
    expect(annotation.startLineStyle).toEqual(BUTT_LINE_STYLE);
    expect(annotation.endLineStyle).toEqual(BUTT_LINE_STYLE);
  });

  it('should change arrow line endings via UI', async () => {
    // Create arrow annotation.
    await instance('setToolbarGroup', 'toolbarGroup-Shapes');
    await iFrameRef.click('[data-element=arrowToolGroupButton]');
    const startPoint = { x: pageX + 100, y: pageY + 100 };
    const point1 = { x: startPoint.x + 100, y: startPoint.y + 100 };
    const point2 = { x: startPoint.x + 150, y: startPoint.y + 175 };
    await page.mouse.move(point1.x, point1.y);
    await page.mouse.down();
    await page.mouse.move(point2.x, point2.y);
    await page.mouse.up();
    await page.waitFor(Timeouts.REACT_RERENDER);

    await changeSelectedAnnotationLineStyles(iFrameRef);
    const annotation = await getAnnotationLineStyles(iFrameRef);
    expect(annotation.startLineStyle).toEqual(BUTT_LINE_STYLE);
    expect(annotation.endLineStyle).toEqual(BUTT_LINE_STYLE);
  });

  it('should change perimeter measurement line endings via UI', async () => {
    // Setup perimeter measurement tool.
    await iFrameRef.evaluate(() => {
      const { UI } = window.instance;
      UI.enableFeatures(UI.Feature.Measurement);
    });
    await instance('setToolbarGroup', 'toolbarGroup-Measure');
    await iFrameRef.click('[data-element=perimeterToolGroupButton]');

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
    await page.waitFor(Timeouts.REACT_RERENDER);

    await changeSelectedAnnotationLineStyles(iFrameRef);
    const annotation = await getAnnotationLineStyles(iFrameRef);
    expect(annotation.startLineStyle).toEqual(BUTT_LINE_STYLE);
    expect(annotation.endLineStyle).toEqual(BUTT_LINE_STYLE);
  });

  it('should change line annotation line endings via UI', async () => {
    // Create line annotation.
    await instance('setToolbarGroup', 'toolbarGroup-Shapes');
    await iFrameRef.click('[data-element=lineToolGroupButton]');
    const startPoint = { x: pageX + 100, y: pageY + 100 };
    const point1 = { x: startPoint.x + 100, y: startPoint.y + 100 };
    const point2 = { x: startPoint.x + 150, y: startPoint.y + 175 };
    await page.mouse.move(point1.x, point1.y);
    await page.mouse.down();
    await page.mouse.move(point2.x, point2.y);
    await page.mouse.up();
    await page.waitFor(Timeouts.REACT_RERENDER);

    await changeSelectedAnnotationLineStyles(iFrameRef);
    const annotation = await getAnnotationLineStyles(iFrameRef);
    expect(annotation.startLineStyle).toEqual(BUTT_LINE_STYLE);
    expect(annotation.endLineStyle).toEqual(BUTT_LINE_STYLE);
  });
});

async function getAnnotationLineStyles(iframe) {
  return iframe.evaluate(async () => {
    const annotationManager = window.instance.Core.documentViewer.getAnnotationManager();
    const annotation = annotationManager.getAnnotationsList()[0];
    return {
      startLineStyle: annotation.getStartStyle(),
      endLineStyle: annotation.getEndStyle(),
    };
  });
}

async function selectAnnotation(iframe) {
  await iframe.evaluate(async () => {
    const annotationManager = window.instance.Core.documentViewer.getAnnotationManager();
    const annotation = annotationManager.getAnnotationsList()[0];
    annotationManager.deselectAllAnnotations();
    annotationManager.selectAnnotation(annotation);
    return annotation;
  });
}

async function changeSelectedAnnotationLineStyles(iframe) {
  await selectAnnotation(iframe);

  await iframe.waitForSelector('[data-element=annotationPopup]');
  await iframe.click('[data-element=annotationStyleEditButton]');
  await iframe.click('[data-element=startLineStyleDropdown]');
  await iframe.click(`[data-element=startLineStyleDropdown] button[data-element="dropdown-item-${BUTT_LINE_STYLE}"]`);
  await iframe.click('[data-element=endLineStyleDropdown]');
  await iframe.click(`[data-element=endLineStyleDropdown] button[data-element="dropdown-item-${BUTT_LINE_STYLE}"]`);
}