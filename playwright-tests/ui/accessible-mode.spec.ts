import { getUIMode, loadViewerSample, test, WebViewerInstance, setupWebViewer } from '../../playwright-utils';
import { expect, Frame, Page } from '@playwright/test';

test.describe('Accessible Mode Tests', () => {
  let iframe: Frame | Page;
  let waitForWVEvent: Function;
  let instance: WebViewerInstance;
  let evaluateAndWaitForEvent: Function;

  const isAROModeEnabled = async (iframe: Frame | Page) => {
    return iframe.evaluate(() => {
      return window.instance.Core.documentViewer.getAccessibleReadingOrderManager().isInAccessibleReadingOrderMode();
    });
  };

  test.describe('Loading a XOD file', () => {
    test.beforeEach(async ({ page }) => {
      const { iframe: iframeRef,
        waitForInstance,
        waitForWVEvent: waitForWVEventMethod,
        evaluateAndWaitForEvent: evaluateAndWaitForEventMethod } = await loadViewerSample(page, 'advanced/accessibility');
      iframe = iframeRef;
      instance = await waitForInstance();
      waitForWVEvent = waitForWVEventMethod;
      evaluateAndWaitForEvent = evaluateAndWaitForEventMethod;

      await evaluateAndWaitForEvent(
        async () => window.instance.Core.documentViewer.loadDocument('/test-files/demo-annotated.xod'),
        'AccessibleReadingOrderManager.accessibleReadingOrderModeNoStructure',
      );

      const loadingModal = iframe.locator('[data-element="loadingModal"]');
      await expect(loadingModal).toHaveCount(0);
    });

    // Flaky test: https://app.circleci.com/pipelines/github/XodoDocs/webviewer/123371/workflows/e28c18bd-f750-4335-b6f1-22752562fbcc/jobs/151298/tests
    // Jira ticket: https://apryse.atlassian.net/browse/WVR-7712
    test.skip('Should tab into the current page from outside of the document', async ({ page, browserName }, testInfo) => {
      test.skip(testInfo.project.use.webComponent, 'TODO: This test is failing when using with web component');
      test.skip(browserName === 'webkit', 'TODO: investigate why this test is flaky on webkit');

      await iframe.evaluate(async () => {
        window.instance.Core.documentViewer.setCurrentPage(2);
      });

      await waitForWVEvent('pageComplete');

      let currentPageNumber = await iframe.evaluate(async () => {
        return instance.Core.documentViewer.getCurrentPage();
      });
      expect(currentPageNumber).toBe(2);

      await instance('closeElements', ['loadingModal']);

      const notesPanelButtonSelector = (getUIMode() === 'default') ? 'notesPanelToggle' : 'toggleNotesButton';
      await iframe.locator(`[data-element="${notesPanelButtonSelector}"]`).click();

      await page.keyboard.press('Tab');

      currentPageNumber = await iframe.evaluate(async () => {
        return instance.Core.documentViewer.getCurrentPage();
      });
      expect(currentPageNumber).toBe(2);
    });

    test.skip('Should go to the correct page when pressing the document button in accessibility popup', async ({ page, browserName }) => {
      test.skip(browserName === 'webkit', 'TODO: investigate why this test is flaky on webkit');

      await iframe.evaluate(async () => {
        window.instance.Core.documentViewer.setCurrentPage(9);
      });

      await waitForWVEvent('pageComplete');

      let currentPageNumber = await iframe.evaluate(async () => {
        return instance.Core.documentViewer.getCurrentPage();
      });
      expect(currentPageNumber).toBe(9);

      await page.locator('#play').click();

      // press tab 6 times to get to the accessibility popup
      // timeout of 200 used to make test more consistent
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);

      await page.keyboard.press('Enter');
      await page.waitForTimeout(200);

      currentPageNumber = await iframe.evaluate(async () => {
        return instance.Core.documentViewer.getCurrentPage();
      });
      expect(currentPageNumber).toBe(9);
    });

    test('Tabs correctly through pages and links', async ({ page, browserName }, testInfo) => {
      test.skip(testInfo.project.use.webComponent, 'TODO: This test is failing when using with web component');
      test.skip(browserName === 'firefox' || browserName === 'webkit', 'TODO: investigate why this test fails on webkit and firefox');

      // add a link
      await evaluateAndWaitForEvent(
        async () => {
          const core = window.instance.Core;

          const annot = new core.Annotations.RectangleAnnotation({
            PageNumber: 1,
            X: 50,
            Y: 100,
            Width: 150,
            Height: 100,
          });

          core.annotationManager.addAnnotation(annot);
          core.annotationManager.redrawAnnotation(annot);

          const annotations = core.annotationManager.getAnnotationsList();
          const targetAnnotation = annotations[0];

          const newLink = new core.Annotations.Link();
          newLink.PageNumber = targetAnnotation.PageNumber;
          newLink.X = targetAnnotation.X;
          newLink.Y = targetAnnotation.Y;
          newLink.Width = targetAnnotation.Width;
          newLink.Height = targetAnnotation.Height;

          newLink.addAction(
            'U',
            new core.Actions.URI({
              uri: 'https://www.apryse.com',
            }),
          );

          core.annotationManager.addAnnotation(newLink);
          core.annotationManager.groupAnnotations(targetAnnotation, [newLink]);
          core.annotationManager.drawAnnotationsFromList(newLink);
        },
        'annotManager.annotationsDrawn'
      );

      await page.locator('#play').click();

      // press the document button in the accessibility popup
      // timeout of 200 used to make test more consistent
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);

      await page.keyboard.press('Enter');
      await page.waitForTimeout(200);

      // should be on page 1
      let currentPageNumber = await iframe.evaluate(async () => {
        return instance.Core.documentViewer.getCurrentPage();
      });
      expect(currentPageNumber).toBe(1);

      // first tab on page 1 should go to link
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);
      // second tab should go to page 2
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);

      currentPageNumber = await iframe.evaluate(async () => {
        return instance.Core.documentViewer.getCurrentPage();
      });
      expect(currentPageNumber).toBe(2);
    });

    test('Should be able to toggle a11y mode ON and OFF with the preset button', async () => {
      test.skip(getUIMode() !== 'default', 'Test only works in Modular UI');

      // Customize header by adding a button to it
      await iframe.evaluate(() => {
        const toggleA11yModeButton = {
          'dataElement': 'toggleAccessibilityModePresetButton',
          'type': 'presetButton',
          'buttonType': 'toggleAccessibilityModeButton',
        };

        const mainHeader = window.instance.UI.getModularHeader('default-top-header');
        const updatedItems = [...mainHeader.items, toggleA11yModeButton];
        mainHeader.setItems(updatedItems);
      });

      const toggleA11yModeButton = iframe.getByRole('button', { name: /Accessibility Mode/i });
      await expect(toggleA11yModeButton).toBeVisible();
      expect(await isAROModeEnabled(iframe)).toBe(true);
      await toggleA11yModeButton.click();
      expect(await isAROModeEnabled(iframe)).toBe(false);
    });

    test('Should turn the ARO mode on, add the accessible mode content and be able to turn the mode off via UI', async () => {
      test.skip(getUIMode() !== 'default', 'Test only works in Modular UI');
      expect(await isAROModeEnabled(iframe)).toBe(true);

      // ARO mode content should not be added
      const a11yContentBoxes = iframe.locator('[data-element^="a11y-reader-content"]');
      await expect(a11yContentBoxes).toHaveCount(0);

      // Legacy Accessible mode content should be added
      const accessibleModeContent = iframe.locator('[id^="pageText"]');
      await expect(accessibleModeContent).toHaveCount(9);


      await iframe.getByRole('button', { name: /View Controls/i }).click();
      await iframe.getByRole('button', { name: /Accessibility Mode/i }).click();
      expect(await isAROModeEnabled(iframe)).toBe(false);

      // Legacy Accessible mode content should be removed
      const accessibleModeContentAfterDisableMode = iframe.locator('[id^="pageText"]');
      await expect(accessibleModeContentAfterDisableMode).toHaveCount(0);
    });
  });

  test.describe('Loading a PDF file', () => {
    test.beforeEach(async ({ page }) => {
      const {
        iframe: iframeRef,
        evaluateAndWaitForEvent: evaluateAndWaitForEventMethod,
        waitForWVEvent: waitForWVEventMethod
      } = await setupWebViewer(
        {
          page,
          samplePath: 'advanced/accessibility',
        },
      );
      iframe = iframeRef;
      evaluateAndWaitForEvent = evaluateAndWaitForEventMethod;
      waitForWVEvent = waitForWVEventMethod;
      await expect(async () => {
        expect(await isAROModeEnabled(iframe)).toBe(true);
      }).toPass({ timeout: 5000 });

      const loadingModal = iframe.locator('[data-element="loadingModal"]');
      await expect(loadingModal).toHaveCount(0);

      await evaluateAndWaitForEvent(
        async () => window.instance.Core.documentViewer.loadDocument('/test-files/pdf-ua/basic-three-page-doc.pdf'),
        'AccessibleReadingOrderManager.accessibleReadingOrderModeReady',
      );
    });
    test('Should activate the Accessible Reading Order Mode without errors and add the appropriate a11y DOM elements', async () => {
      const a11yPageContainers = iframe.locator('[data-element^="a11y-reader-container"]');
      await expect(a11yPageContainers).toHaveCount(3);

      const a11yPage1 = a11yPageContainers.nth(0);
      const a11yPage1Elements = a11yPage1.locator('[data-element^="a11y-reader-content"]');
      await expect(a11yPage1Elements).toHaveCount(2);
    });

    test('Should add the accessibility mode toggle option to the View controls and be able to toggle the mode ON and OFF', async () => {
      test.skip(getUIMode() !== 'default', 'Test only works in Modular UI');
      expect(await isAROModeEnabled(iframe)).toBe(true);
      await iframe.getByRole('button', { name: /View Controls/i }).click();
      await iframe.getByRole('button', { name: /Accessibility Mode/i }).click();
      expect(await isAROModeEnabled(iframe)).toBe(false);
      const a11yPageContainers = iframe.locator('[data-element^="a11y-reader-container"]');
      await expect(a11yPageContainers).toHaveCount(0);
      await iframe.getByRole('button', { name: /Accessibility Mode/i }).click();
      expect(await isAROModeEnabled(iframe)).toBe(true);
      const a11yPageContainersAfterEnablingAgain = iframe.locator('[data-element^="a11y-reader-container"]');
      await expect(a11yPageContainersAfterEnablingAgain).toHaveCount(3);
    });

    test('should update the accessibility DOM based on whether the opened file is structured or unstructured', async () => {
      // The PDF file loaded is structured so the a11y content should be added
      await expect(iframe.locator('[data-element^="a11y-reader-container"]')).toHaveCount(3);

      await evaluateAndWaitForEvent(
        async () => window.instance.Core.documentViewer.loadDocument('/test-files/demo-annotated.pdf'),
        'AccessibleReadingOrderManager.accessibleReadingOrderModeNoStructure',
      );

      // After loading a non-structured file, the a11y content should be removed
      await expect(iframe.locator('[data-element^="a11y-reader-container"]')).toHaveCount(0);
      // And the legacy accessible content should be added
      await expect(iframe.locator('[id^="pageText"]')).toHaveCount(9);

      await evaluateAndWaitForEvent(
        async () => window.instance.Core.documentViewer.loadDocument('/test-files/pdf-ua/PDFUA-Ref-2-02_Invoice.pdf'),
        'AccessibleReadingOrderManager.accessibleReadingOrderModeReady'
      );
      // Opening a structured PDF file again and should add the a11y content and remove the legacy accessible content
      await expect(iframe.locator('[data-element^="a11y-reader-container"]')).toHaveCount(1);
      await expect(iframe.locator('[id^="pageText"]')).toHaveCount(0);
    });
  });


  test.describe('Accessible mode and Full API OFF', () => {
    test('should log a warning when the user tries to enable accessibility mode using the preset button', async ({ page }) => {
      test.skip(getUIMode() !== 'default', 'Test only works in Modular UI');
      const { iframe, waitForInstance, consoleLogs } = await loadViewerSample(page, 'viewing/viewing');
      instance = await waitForInstance();

      const isAROModeEnabled = async () => {
        return iframe.evaluate(() => {
          return window.instance.Core.documentViewer.getAccessibleReadingOrderManager().isInAccessibleReadingOrderMode();
        });
      };

      expect(await isAROModeEnabled()).toBe(false);

      await iframe.evaluate(() => {
        const toggleA11yModeButton = {
          'dataElement': 'toggleAccessibilityModePresetButton',
          'type': 'presetButton',
          'buttonType': 'toggleAccessibilityModeButton',
        };

        const mainHeader = window.instance.UI.getModularHeader('default-top-header');
        const updatedItems = [...mainHeader.items, toggleA11yModeButton];
        mainHeader.setItems(updatedItems);
      });

      const toggleA11yModeButton = iframe.getByRole('button', { name: /Accessibility Mode/i });
      await expect(toggleA11yModeButton).toBeVisible();
      await toggleA11yModeButton.click();
      expect(await isAROModeEnabled(iframe)).toBe(false);
      expect(consoleLogs).toContain('FullAPI is required to use accessibility mode');
    });
  });
});