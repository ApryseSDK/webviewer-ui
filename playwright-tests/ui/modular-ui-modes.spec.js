import { test, loadOfficeEditorWithFile, setupWebViewer } from '../../playwright-utils';
import verticalHeaders from './modular-ui-configs/vertical-headers';
import { expect } from '@playwright/test';

test.describe('Swtiching modes in Modular UI', () => {
  test('When I load the modular UI and customize it via an IIFE, my customizations stay in place', async ({ page }) => {
    test.skip(process.env.MODULAR_UI_E2E !== 'true', 'Test only works in Modular UI');
    await setupWebViewer({
      page,
      samplePath: 'full-apis/ViewerSnapToNearestTest',
    });

    const testLabelElement = page.getByText('Default', { exactMatch: true });

    await expect(testLabelElement, 'My customizations should still be in place using an IIFE').toBeVisible();
  });

  test('When I load the modular UI and customize it and switch to office editor and back, my customizations stay in place', async ({ page }) => {
    test.skip(process.env.MODULAR_UI_E2E !== 'true', 'Test only works in Modular UI');
    const { waitForWVEvent } = await setupWebViewer({
      page,
      samplePath: 'viewing/blank',
      eventsToWaitFor: [],
    });

    await page.evaluate(([verticalHeaders]) => {
      const functionMap = {
        'loadDocx': () => {
          instance.UI.loadDocument('/test-files/legal-contract.docx', { enableOfficeEditing: true });
        },
      };
      instance.UI.importModularComponents(verticalHeaders, functionMap);
    }, [verticalHeaders]);

    await page.getByRole('button', { name: 'Load Docx' }).click();

    // Label for the docx file should be visible
    await page.getByText('legal-contract.docx').isVisible();
    // Load Docx button should be hidden
    await page.getByRole('button', { name: 'Load Docx' }).isHidden();

    // Load a PDF again
    await waitForWVEvent('annotationsLoaded', {
      code: async () => {
        window.instance.Core.documentViewer.loadDocument('/test-files/blank.pdf');
      }
    });

    // My customizations should still be in place
    await page.getByRole('button', { name: 'Load Docx' }).isVisible();
  });

  test('When I load office editor and customize it, and then switch to regular viewing and back, my customizations stay in place', async ({ page }) => {
    test.skip(process.env.MODULAR_UI_E2E !== 'true', 'Test only works in Modular UI');
    const { waitForWVEvent } = await loadOfficeEditorWithFile(page, '/test-files/legal-contract.docx');

    // Customize header by adding a button to it
    await page.evaluate(() => {
      const customButton = new window.instance.UI.Components.CustomButton({
        dataElement: 'customButton',
        label: 'Load Blank PDF',
        onClick: () => {
          instance.UI.loadDocument('/test-files/blank.pdf');
        }
      });

      const mainHeader = window.instance.UI.getModularHeader('default-top-header');
      const updatedItems = [...mainHeader.items, customButton];
      mainHeader.setItems(updatedItems);
    });

    await page.getByRole('button', { name: 'Load Blank PDF' }).isVisible();

    // Click the button to load a blank PDF
    await page.getByRole('button', { name: 'Load Blank PDF' }).click();


    // Now we are in PDF viewing and the custom button should not be there
    await page.getByRole('button', { name: 'Load Blank PDF' }).isHidden();

    // Now add a custom button to the PDF Viewing UI
    await page.evaluate(() => {
      const customButton = new window.instance.UI.Components.CustomButton({
        dataElement: 'customButton',
        label: 'Custom Button In PDF Viewing'
      });

      const mainHeader = window.instance.UI.getModularHeader('default-top-header');
      const updatedItems = [customButton, ...mainHeader.items];
      mainHeader.setItems(updatedItems);
    });

    await page.getByRole('button', { name: 'Custom Button In PDF Viewing' }).isVisible();

    // load Docx in editing mode
    await waitForWVEvent('documentLoaded', {
      code: async () => {
        window.instance.Core.documentViewer.loadDocument('/test-files/legal-contract.docx', { enableOfficeEditing: true });
      }
    });

    // Now we check our customization made in docx editor is still there
    await page.getByRole('button', { name: 'Load Blank PDF' }).isVisible();
    await page.getByRole('button', { name: 'Custom Button In PDF Viewing' }).isHidden();


    // One final trip to PDF viewing
    await waitForWVEvent('annotationsLoaded', {
      code: async () => {
        window.instance.Core.documentViewer.loadDocument('/test-files/blank.pdf');
      }
    });
    // And our custom button should still be there
    await page.getByRole('button', { name: 'Custom Button In PDF Viewing' }).isVisible();
    // But the button we added in the docx editor should not be there
    await page.getByRole('button', { name: 'Load Blank PDF' }).isHidden();
  });
});
