import { loadWebComponentSample, loadViewerSample, test } from '../../playwright-utils';
import { expect } from '@playwright/test';


test.describe('Style panel modular ui', () => {
  // skip flaky test: https://app.circleci.com/pipelines/github/XodoDocs/webviewer/110188/workflows/9aee53b1-f20e-4152-80bf-df18f588f032/jobs/128450
  test.skip('should update widget style after apply form field mode', async ({ page }) => {
    const { webComponent, waitForInstance } = await loadWebComponentSample(page, 'viewing/viewing-with-modular-ui');
    const instance = await waitForInstance();
    await instance('setToolbarGroup', 'toolbarGroup-Forms');
    await instance('setToolMode', 'TextFormFieldCreateTool');
    await page.waitForTimeout(1500);
    const pageContainer = await webComponent.$('#pageContainer1');

    const { x, y } = await pageContainer.boundingBox();
    await page.mouse.move(x + 200, y + 200);
    await page.mouse.down();
    await page.mouse.move(x + 400, y + 400);
    await page.mouse.up();
    await webComponent?.waitForSelector('[data-element=formFieldEditPopup]');
    const confirmButton = await webComponent.$('[data-element="formFieldOK"]');
    await confirmButton?.click();
    const selectButton = await webComponent.$('[data-element="annotationEditToolButton"]');
    await selectButton?.click();
    await page.waitForTimeout(200);
    await page.mouse.move(x + 150, y + 150);
    await page.mouse.down();
    await page.mouse.move(x + 450, y + 450);
    await page.mouse.up();
    await webComponent?.waitForSelector('[data-element=annotationPopup]');
    const styleButton = await webComponent.$('[data-element=annotationStyleEditButton]');
    styleButton?.click();
    await webComponent?.waitForSelector('[data-element=stylePanel]');
    const strokeColorSection = await webComponent.$('[data-element=stylePanel] .collapsible-menu StrokeColorPicker');
    strokeColorSection?.click();
    await webComponent?.waitForSelector('.ColorPalette');
    const orangeColorSwatch = await webComponent.$('.ColorPalette button[aria-label="Color #FF8D00"]');
    const cellStyle = await orangeColorSwatch?.evaluate((element) => element.children[0].children[0].style);

    orangeColorSwatch?.click();
    await page.waitForTimeout(200);
    const viewButton = await webComponent.$('[data-element="toolbarGroup-View"]');
    viewButton?.click();
    await page.waitForTimeout(800);
    const textWidget = await webComponent?.$('.text');
    const widgetStyle = await textWidget?.evaluate((element) => element.style);
    expect(cellStyle.backgroundColor).toBe(widgetStyle?.borderColor);
  });

  test('the style panel shows the correct options when we select a line annotation and then open the panel', async ({ page }) => {
    test.skip(process.env.MODULAR_UI_E2E !== 'true', 'Test only works in Modular UI');
    const { waitForInstance, waitForWVEvent } = await loadWebComponentSample(page, 'viewing/empty');
    await waitForInstance();

    await waitForWVEvent('annotationsLoaded', {
      code: async () => {
        window.instance.Core.documentViewer.loadDocument('/test-files/style-panel-blank.pdf');
      }
    });


    await page.evaluate(() => {
      // Select the first annotation
      const annotationManager = window.instance.Core.annotationManager;
      const annotations = annotationManager.getAnnotationsList();
      annotationManager.selectAnnotation(annotations[0]);
    });

    await page.getByLabel('Style').click();


    // Assert that the last three comboboxes are visible
    const lineStartCombobox = page.getByRole('combobox', { name: 'Line Start' });
    const lineMiddleCombo = page.getByRole('combobox', { name: 'Line Middle' });
    const lineEndCombo = page.getByRole('combobox', { name: 'Line End' });

    await expect(lineStartCombobox).toBeVisible();
    await expect(lineMiddleCombo).toBeVisible();
    await expect(lineEndCombo).toBeVisible();
  });

  test('the style panel shows the correct options when we select a stamp and then open the panel', async ({ page }) => {
    test.skip(process.env.MODULAR_UI_E2E !== 'true', 'Test only works in Modular UI');
    const { waitForInstance, waitForWVEvent } = await loadWebComponentSample(page, 'viewing/empty');
    await waitForInstance();

    await waitForWVEvent('annotationsLoaded', {
      code: async () => {
        window.instance.Core.documentViewer.loadDocument('/test-files/style-panel-blank.pdf');
      }
    });


    await page.evaluate(() => {
      // Select the second annotation
      const annotationManager = window.instance.Core.annotationManager;
      const annotations = annotationManager.getAnnotationsList();
      annotationManager.selectAnnotation(annotations[1]);
    });

    await page.getByLabel('Style').click();


    // Opacity should be visible
    const opacityHeader = page.getByText('Opacity');
    // Show more button should never render - this is part of the color picker which is not supported for stamps
    const showMoreButton = page.getByRole('button', { name: 'Show More' });

    await expect(opacityHeader).toBeVisible();
    await expect(showMoreButton).toBeHidden();
  });

  test('when switching between rectangle with cloudy lines and the ellipse, the application does not crash', async ({ page }) => {
    test.skip(process.env.MODULAR_UI_E2E !== 'true', 'Test only works in Modular UI');
    const { waitForInstance } = await loadWebComponentSample(page, 'viewing/blank');
    await waitForInstance();

    // Rectangle tool is the first one selected by default
    await page.getByRole('button', { name: 'Shapes' }).click();

    await page.getByRole('button', { name: 'Style' }).click();

    // Select the cloudy line style
    await page.getByRole('combobox', { name: 'Border' }).click();
    await page.getByRole('option', { name: 'cloudy' }).click();

    await page.getByRole('button', { name: 'Ellipse' }).click();

    const borderCombobox = page.getByRole('combobox', { name: 'Border' });
    await expect(borderCombobox).toBeVisible();
    await expect(borderCombobox).toHaveAttribute('aria-describedby', 'middleLineStyleDropdown-solid');

    // Click on the border combobox to open the dropdown and ensure the cloudy option is not there
    await borderCombobox.click();
    await expect(page.getByRole('option', { name: 'cloudy' })).toBeHidden();
  });

  test('Should be able to add custom colors in UI', async function({ page }) {
    test.skip(process.env.MODULAR_UI_E2E !== 'true', 'Test only works in Modular UI');
    const { iframe, waitForInstance, waitForWVEvent } = await loadViewerSample(page, 'viewing/viewing');
    await waitForInstance();
    await waitForWVEvent('documentLoaded');
    await iframe.evaluate(() => {
      const freetext = new window.instance.Core.Annotations.FreeTextAnnotation({
        X: 0,
        Y: 0,
      });
      window.instance.Core.annotationManager.addAnnotation(freetext);
      window.instance.UI.openElement('stylePanel');
      // Need a brief moment for the panel to load elements.
      // Otherwise, the style options will not appear.
      setTimeout(() => {
        window.instance.Core.annotationManager.selectAnnotation(freetext);
      }, 100);
    });

    const testColor = '1ACA1A';

    await iframe.getByLabel('Text Style Add New Color from').click();
    let hexInput = iframe.getByLabel('hex');
    await hexInput.fill(testColor);
    await iframe.getByRole('button', { name: 'OK', exact: true }).click();

    await iframe.getByRole('button', { name: 'Stroke icon - chevron - down', exact: true }).first().click();
    await iframe.getByRole('button', { name: 'Fill icon - chevron - down', exact: true }).first().click();

    await iframe.getByLabel('Stroke Add New Color from').click();
    hexInput = iframe.getByLabel('hex');
    await hexInput.fill(testColor);
    await iframe.getByRole('button', { name: 'OK', exact: true }).click();

    await iframe.getByLabel('Fill Add New Color from').click();
    hexInput = iframe.getByLabel('hex');
    await hexInput.fill(testColor);
    await iframe.getByRole('button', { name: 'OK', exact: true }).click();

    expect(await iframe.getByLabel(`Text Style Color #${testColor}`).count()).toBe(1);
    expect(await iframe.getByLabel(`Stroke Color #${testColor}`).count()).toBe(1);
    expect(await iframe.getByLabel(`Fill Color #${testColor}`).count()).toBe(1);
  });
});
