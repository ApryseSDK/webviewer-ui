import { loadViewerSample, WebViewerInstance } from '../../playwright-utils';
import { expect, test, Frame } from '@playwright/test';

test.describe('Signature Modal', () => {
  let iframe: Frame;
  let instance: WebViewerInstance;
  let signatureModalContainer: any;

  test.beforeEach(async ({ page }) => {
    const { iframe: sampleIframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');

    iframe = sampleIframe;
    instance = await waitForInstance();
    await page.waitForTimeout(5000);

    await instance('openElement', 'signatureModal');
    await page.waitForTimeout(1000);

    signatureModalContainer = await iframe.$(
      '.SignatureModal > .container'
    );
  });

  test('should be able to draw signature', async ({ page }) => {
    const inkContainer = await iframe.$('.ink-signature-canvas');
    const inkCoordinates = await inkContainer.boundingBox();
    const { x, y } = inkCoordinates;

    await page.mouse.move(x + 10, y + 10);
    await page.mouse.down();
    await page.waitForTimeout(500);

    await page.mouse.move(x + 300, y + 100);
    await page.waitForTimeout(500);

    for (let i = 0; i < 15; i++) {
      await page.mouse.move(x + 300 + i * 20, y + 100 + (i % 2) * 30);
      await page.waitForTimeout(100);
    }

    await page.waitForTimeout(500);
    await page.mouse.up();
    await page.waitForTimeout(1000);

    expect(await signatureModalContainer.screenshot()).toMatchSnapshot([
      'signature-modal',
      'drawing-on-signature-modal.png',
    ]);
  });

  test('should be able to select a font family for text signature', async ({ page }) => {
    await iframe.click('[data-element=textSignaturePanelButton]');
    await page.waitForTimeout(1000);

    await iframe.$('.text-signature-input-container');

    expect(await signatureModalContainer.screenshot()).toMatchSnapshot([
      'signature-modal',
      'typing-on-signature-modal.png',
    ]);

    await iframe.click('[data-element=text-signature-font-dropdown]');
    await iframe.click('[data-element=dropdown-item-Whisper]');

    expect(await signatureModalContainer.screenshot()).toMatchSnapshot([
      'signature-modal',
      'typing-on-signature-modal-with-new-font-family.png',
    ]);
  });

  test('should no longer show close button tooltip on open', async () => {
    expect(await signatureModalContainer.screenshot()).toMatchSnapshot([
      'signature-modal',
      'opening-signature-modal.png',
    ]);
  });

  test('should close the fonts dropdown when clear both full signature and initials on the signature typing tab', async ({ page }) => {
    const emptyFontSignatureText = 'Font style';
    await iframe.click('[data-element=textSignaturePanelButton]');
    await iframe.waitForSelector('.text-signature');
    await iframe.$('.text-signature-input-container');
    await iframe.waitForSelector('button.signature-create');
    const pickedFontOptionText = await iframe.$('.text-signature .colorpalette-clear-container .signature-style-options .picked-option-text');
    expect(await pickedFontOptionText?.innerText()).toEqual('Guest');
    const clearFullSignatureButton = await iframe.$('#app > div.App > div:nth-child(5) > div > div > div:nth-child(4) > div > div.signature-and-initials-container > div.signature-input.full-signature > div > button');
    await clearFullSignatureButton?.click();
    expect(await pickedFontOptionText?.innerText()).toEqual(emptyFontSignatureText);

    await iframe.evaluate(() => {
      window.instance.UI.enableFeatures([window.instance.UI.Feature.Initials]);
    });

    expect(await pickedFontOptionText?.innerText()).toEqual('G');
    const clearInitialsButton = await iframe.$('.text-signature div.signature-and-initials-container > div.signature-input.initials > div > button');
    await clearInitialsButton?.click();
    expect(await pickedFontOptionText?.innerText()).toEqual(emptyFontSignatureText);
  });

  test('should not create signature if full signature is empty', async ({ page }) => {
    await iframe.evaluate(() => {
      window.instance.UI.enableFeatures([window.instance.UI.Feature.Initials]);
    });

    await iframe.click('[data-element=textSignaturePanelButton]');
    await iframe.waitForSelector('.text-signature');
    await iframe.$('.text-signature-input-container');
    await iframe.waitForSelector('button.signature-create');

    const clearFullSignatureButton = await iframe.$('#app > div.App > div:nth-child(5) > div > div > div:nth-child(4) > div > div.signature-and-initials-container > div.signature-input.full-signature > div > button');
    await clearFullSignatureButton?.click();

    const clearInitialsButton = await iframe.$('.text-signature div.signature-and-initials-container > div.signature-input.initials > div > button');
    await clearInitialsButton?.click();

    const createSignatureButton = await iframe.$('.container.include-initials > footer > button');
    const buttonText = createSignatureButton?.innerText;
    await createSignatureButton?.click();
    expect(createSignatureButton?.innerText).toEqual(buttonText);
  });
});

test.describe('Signature Validation Modal', () => {
  test.skip('should render the validation signature modal on top of form field indicators', async ({
    page,
  }) => {
    const { iframe, waitForInstance } = await loadViewerSample(
      page,
      'viewing/viewing-with-fullAPI'
    );
    const instance = await waitForInstance();
    await instance('loadDocument', '/test-files/digital-signature.pdf');
    await page.waitForTimeout(5000);

    await iframe.evaluate(async () => {
      const documentViewer = window.instance.Core.documentViewer;
      const annotationManager = window.instance.Core.annotationManager;
      const Annotations = window.instance.Core.Annotations;

      window.instance.UI.enableElements(['signaturePanelButton']);
      const addIndicator = (widget) => {
        widget.setFieldIndicator(true, 'Insert text here');
      };

      documentViewer.addEventListener('annotationsLoaded', () => {
        const widgetAnnotations = annotationManager.getAnnotationsList().filter((annotation) => annotation instanceof Annotations.WidgetAnnotation);
        widgetAnnotations.forEach(addIndicator);
        annotationManager.trigger('annotationChanged', [widgetAnnotations, 'modify', {}]);
      });
    });

    await instance('openElement', 'leftPanel');
    await page.waitForTimeout(1000);
    await iframe.click('[data-element=signaturePanelButton]');
    await page.waitForTimeout(1000);

    await iframe.$('.signature-widget-info');
    await iframe.click('.signature-widget-info .link p');
    await iframe.$('.SignatureValidationModal');


    const app = await iframe.$('.App');
    expect(await app.screenshot()).toMatchSnapshot([
      'signature-validation-modal',
      'signature-validation-modal-position.png',
    ]);
  });
});
