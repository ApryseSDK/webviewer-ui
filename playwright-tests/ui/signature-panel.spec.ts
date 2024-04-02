import { loadViewerSample } from '../../playwright-utils';
import { expect, test } from '@playwright/test';
import { drawRectangle } from '../common/rectangle';

const signatureConfig = [
  { x: 20, y: 20, width: 150, height: 50 },
  { x: 20, y: 400, width: 150, height: 50 }
]

/**
  * @ignore
  * Setup up the Signature Panel and switches WV to Form Builder mode
  * @param page
  * @param iframe
  * @param instance
  */
async function setupSignaturePanels(page, iframe, instance) {
  await instance('setToolbarGroup', 'toolbarGroup-Forms');
  await iframe?.evaluate(() => {
    window.instance.UI.enableFeatures([window.instance.UI.Feature.SavedSignaturesTab]);
    window.instance.UI.enableElements(['leftPanel', 'signaturePanelButton']);
    window.instance.UI.setToolMode(window.instance.Core.Tools.SignatureFormFieldCreateTool);
  });

  await iframe.click('[data-element=leftPanelButton]');
  await page.waitForTimeout(200);
  await iframe.click('[data-element=signaturePanelButton]');
}

/**
 * @ignore
 * Draws two signatures to the document and applies them by exiting Form Builder mode
 * @param page
 * @param iframe
 * @param pageContainer
 */
async function drawSignaturesAndApply(page, iframe, pageContainer) {
  const { x: xContainer, y: yContainer } = await pageContainer.boundingBox();

  await drawRectangle(page, xContainer + signatureConfig[0].x, yContainer + signatureConfig[0].y, signatureConfig[0].width, signatureConfig[0].height);
  await drawRectangle(page, xContainer + signatureConfig[1].x, yContainer + signatureConfig[1].y, signatureConfig[1].width, signatureConfig[1].height);

  await page.waitForTimeout(1000);
  await iframe.click('[data-element=applyFormFieldButton]');
  await page.waitForTimeout(1000);
}

/**
 * @ignore
 * Small routine to setup the Signature mode, draw two sigantures to the document and apply them
 * We than switch out of Form Builder mode to confirm the Panel updates
 * @param page
 * @param iframe
 * @param instance
 * @param pageContainer
 */
async function drawTwoSignaturesRoutine(page, iframe, instance, pageContainer) {
  await setupSignaturePanels(page, iframe, instance);
  await page.waitForTimeout(1000);
  await drawSignaturesAndApply(page, iframe, pageContainer);
}

test.describe('Signature Panel', () => {
  test('should show the same time zone for both signing and verification', async ({ page }) => {
    const { iframe } = await loadViewerSample(
      page,
      'full-apis/ViewerDigitalSignatureValidationTest/'
    );

    await page.waitForTimeout(10000);

    const areTimeZonesTheSame = await iframe?.evaluate(() => {
      const signTimeZone = document.querySelector('.SignaturePanel .title p')?.innerText.split(' ').at(-1);
      const verifyTimeZone = document.querySelector('.SignaturePanel .trust-verification-result')?.children[1].innerText.split(' ').at(-1);
      return signTimeZone === verifyTimeZone;
    });

    expect(areTimeZonesTheSame).toBeTruthy();
  });

  test('I can populate the Signature Panel with new items', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'full-apis/ViewerEditTest/');
    const instance = await waitForInstance();
    await page.waitForTimeout(5000);
    const pageContainer = await iframe?.$('#pageContainer1');

    await drawTwoSignaturesRoutine(page, iframe, instance, pageContainer);
    await page.waitForTimeout(1000);

    const signatures = await iframe?.$$('.signature-widget-info');
    expect(signatures?.length).toBe(2);
  });

  test('items are removed from the Signature Panel when the item is deleted', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'full-apis/ViewerEditTest/');
    const instance = await waitForInstance();
    await page.waitForTimeout(5000);
    const pageContainer = await iframe.$('#pageContainer1');

    await drawTwoSignaturesRoutine(page, iframe, instance, pageContainer);

    await instance('setToolbarGroup', 'toolbarGroup-Forms');
    await iframe?.evaluate(() => {
      const annotList = window.instance.Core.annotationManager.getAnnotationsList();
      window.instance.Core.annotationManager.deleteAnnotations(annotList);
    });
    await page.waitForTimeout(1000);

    const signatures = await iframe.$$('.signature-widget-info');
    expect(signatures.length).toBe(0);
  });
});