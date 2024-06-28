import { loadViewerSample, WebViewerInstance } from '../../playwright-utils';
import { expect, test } from '@playwright/test';

test.describe('Form Field Popup tests', () => {
  let instance: WebViewerInstance;
  const formTools = ['SignatureFormFieldCreateTool', 'RadioButtonFormFieldCreateTool', 'TextFormFieldCreateTool', 'CheckBoxFormFieldCreateTool', 'ListBoxFormFieldCreateTool', 'ComboBoxFormFieldCreateTool'];

  test('Form Field popup remains centered after the viewport has been resized', async ({ page }) => {
    const { iframe, waitForWVEvents, waitForInstance, getTextPosition } = await loadViewerSample(page, 'viewing/viewing');
    await waitForWVEvents(['pageComplete', 'annotationsLoaded']);
    instance = await waitForInstance();
    await page.waitForTimeout(1500);

    await iframe?.evaluate(() => {
      const formFieldEditingManager = window.instance.Core.annotationManager.getFormFieldCreationManager();
      formFieldEditingManager.startFormFieldCreationMode();
    });
    await page.waitForTimeout(3000);
    const pageContainer = await iframe?.$('#pageContainer1');
    const rect = await getTextPosition('Important');

    // draw a Signature Annot
    await page.mouse.move(rect.x1, rect.y1);
    await page.mouse.down();
    await page.mouse.move(rect.x2, rect.y2);
    await page.mouse.up();
    await page.waitForTimeout(1500);

    const viewportSize = await page.viewportSize();
    const height = viewportSize?.height;
    const biggerViewport = viewportSize?.width + 400;
    await page.setViewportSize({ width: biggerViewport, height });
    await page.waitForTimeout(1500);

    expect(await pageContainer.screenshot()).toMatchSnapshot(['form-field-popup', 'form-field-popup-centered.png'], { maxDiffPixelRatio: .01 });
  });

  test('Form fields changes are applied immediately after clicking OK in the modal', async ({ page }) => {
    const { iframe, waitForWVEvents, waitForInstance, getTextPosition } = await loadViewerSample(page, 'viewing/viewing');
    await waitForWVEvents(['pageComplete', 'annotationsLoaded']);
    instance = await waitForInstance();
    await page.waitForTimeout(1500);

    await iframe?.evaluate(() => {
      const formFieldEditingManager = window.instance.Core.annotationManager.getFormFieldCreationManager();
      formFieldEditingManager.startFormFieldCreationMode();
    });
    await page.waitForTimeout(500);
    const rect = await getTextPosition('6 Important');
    await instance('setToolMode', 'TextFormFieldCreateTool');
    await page.mouse.move(rect.x1 + 5, rect.y1 - 20);
    await page.mouse.down();
    await page.mouse.move(rect.x2 - 5, rect.y2 + 20);
    await page.mouse.up();
    await page.waitForTimeout(200);
    const confirmButton = await iframe.$('[data-element="formFieldOK"]');
    await confirmButton?.click();
    await page.waitForTimeout(200);

    const isReadOnlyTrue = await iframe?.evaluate(async () => {
      const { annotationManager } = instance.Core;
      const renderTime = 300;
      const placeholder = annotationManager.getAnnotationsList().filter(annot => annot.isFormFieldPlaceholder())[0];
      annotationManager.selectAnnotation(placeholder);
      await new Promise(r => setTimeout(r, renderTime));
      const fieldEditButton = window.document.querySelector('[data-element="formFieldEditButton"]');
      fieldEditButton?.click();
      await new Promise(r => setTimeout(r, renderTime));
      const checkBoxes = window.document.querySelector('[data-element="formFieldEditPopup"]')?.getElementsByTagName('input')
      for (var i = 0; i < checkBoxes.length; i++) {
      if (checkBoxes[i].type == 'checkbox') {
          // set ReadOnly to true on the modal;
          checkBoxes[i].click();
          break;
        }
      }
      await new Promise(r => setTimeout(r, renderTime));
      const confirmButton = window.document.querySelector('[data-element="formFieldOK"]');
      confirmButton?.click();
      await new Promise(r => setTimeout(r, renderTime));
      // check if the ReadOnly prop on field is set to true
      const flags = instance.Core.annotationManager.getFieldManager().getFields()[0].flags
      for (let key in flags) {
        if (typeof flags[key] === 'object' && flags[key]['ReadOnly'] === true) return true
      }
    });
    expect(isReadOnlyTrue).toBe(true);
  });

  test('Form field can be dragged across pages', async ({ page }) => {
    const { iframe, waitForInstance, waitForWVEvents } = await loadViewerSample(page, 'viewing/blank', '#viewer', 1200, 900);
    await waitForWVEvents(['pageComplete', 'annotationsLoaded']);
    instance = await waitForInstance();
    await instance('loadDocument', '/test-files/two-blank-pages.pdf');
    await page.waitForTimeout(2000);
    await iframe.evaluate(async () => {
      const { annotationManager } = window.instance.Core;
      const [annotation] = await annotationManager.importAnnotations(`<?xml version="1.0" encoding="UTF-8" ?><xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve"><pdf-info xmlns="http://www.pdftron.com/pdfinfo" version="2" import-version="4"><ffield type="Ch" name="ListBoxFormField 19"><font name="Helvetica" size="12" /><options><option value="3" /></options></ffield><widget field="ListBoxFormField 19" name="9f2cd72c-6d8b-32b4-b4f0-538fede4768e" modified-date="D:20240325024333-07'00'" page="1"><rect x1="59.22" x2="317.92" y1="573.82" y2="731.74" /><border style="null" /><background-color r="211" g="211" b="211" a="0.5" /><trn-custom-data bytes="{&quot;trn-form-field-show-indicator&quot;:&quot;false&quot;,&quot;trn-is-field-data-placeholder-copy&quot;:&quot;&quot;,&quot;trn-editing-rectangle-id&quot;:&quot;05b9524b-3167-e6f4-428e-91d8e98a0932&quot;,&quot;trn-form-field-indicator-text&quot;:&quot;&quot;}" /></widget></pdf-info><fields><field name="ListBoxFormField 19"><value></value></field></fields><annots /></xfdf>`)
      annotationManager.addAnnotation(annotation);
      annotationManager.redrawAnnotation(annotation);
      annotationManager.getFormFieldCreationManager().startFormFieldCreationMode();
      return annotation.Id;
    });

    iframe.evaluate(() => {
      const { annotationManager, Annotations } = window.instance.Core;
      annotationManager.addEventListener('annotationChanged', (annotations, action) => {
        if (action === 'delete') {
          annotations.forEach(annot => {
            if (annot instanceof Annotations.WidgetAnnotation) window.deleted = true;
          })
        }
      });
    });
    await page.waitForTimeout(500);

    const pageContainer = await iframe.$('#pageContainer1');
    const { x, y } = await pageContainer.boundingBox();
    await iframe.evaluate(() => {
      const { annotationManager } = window.instance.Core;
      const annotation = annotationManager.getAnnotationsList()[1];
      annotationManager.selectAnnotation(annotation);
    });
    await page.mouse.move(x + 70, y + 70);
    await page.mouse.click(x + 70, y + 70);
    await page.waitForTimeout(500);
    await page.mouse.down();
    await page.mouse.move(x + 55, y + 970);
    await page.mouse.up();
    await page.waitForTimeout(500);
    const isDeleted = await iframe.evaluate(() => {
      return window.deleted;
    });
    expect(isDeleted).toBe(true);
  });
});