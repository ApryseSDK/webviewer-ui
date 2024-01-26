import { loadViewerSample } from '../../playwright-utils';
import { expect, test } from '@playwright/test';
import { drawRectangle } from '../common/rectangle';
import { FileChooser } from 'playwright';
import path from 'path';

test.describe('Multi-tab Feature', () => {
  test('should enable the multi-tab feature with no loaded documents', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing-with-multi-tab-empty');
    await waitForInstance();
    await page.waitForTimeout(5000);
    const app = await iframe.$('.App');

    expect(await app.screenshot()).toMatchSnapshot(['multi-tab-empty', 'multi-tab-empty.png']);
  });

  test('should close open file modal after adding a tab', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing-with-multi-tab-empty');
    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    page.on('filechooser', async (fileChooser: FileChooser) => {
      await fileChooser.setFiles([path.join(__dirname, '../../../../e2e-test/test-files/blank.pdf')]);
    });

    const addButton = await iframe.$('.TabsHeader .add-button .Button');
    await addButton.click();

    await page.waitForTimeout(2000);

    const fileTabButton = await iframe.$('[data-element=filePickerPanelButton]');
    await fileTabButton.click();

    await page.waitForTimeout(1000);

    const chooseFileButton = await iframe.$('.OpenFileModal .modal-btn-file');
    await chooseFileButton.click();

    await page.waitForTimeout(3000);

    const isElementOpen = await instance('isElementOpen', 'openFileModal');
    expect(isElementOpen).toBe(false);
  });

  test('should show empty page after closing all tabs', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing-with-multi-tab');
    await waitForInstance();
    await page.waitForTimeout(5000);

    const tabs = await iframe.evaluate(async () => {
      return (Array.from(document.querySelectorAll('.draggable-tab .Tab')) as Array<HTMLElement>);
    });

    for (let i = 0; i < tabs.length; i++) {
      await iframe.click('.draggable-tab .Tab button');
      await page.waitForTimeout(5000);
    }

    const app = await iframe.$('.App');

    expect(await app.screenshot()).toMatchSnapshot(['multi-tab-empty-page', 'multi-tab-empty-page.png']);
  });

  test('should show a warning when trying to close a doc in case there are unsaved changes', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing-with-multi-tab');
    const instance = await waitForInstance();
    await page.waitForTimeout(5000);
    await instance('setToolMode', 'AnnotationCreateRectangle');
    await page.waitForTimeout(5000);

    const pageContainer = await iframe.$('#pageContainer1');
    const { x: xContainer, y: yContainer } = await pageContainer.boundingBox();

    await drawRectangle(page, xContainer + 20, yContainer + 20, 150, 150);
    await page.waitForTimeout(1000);

    const closeButton = await iframe.$('.Tab.active .Button');
    await closeButton.click();

    const app = await iframe.$('.App');

    expect(await app.screenshot()).toMatchSnapshot(['close-tab-warning', 'close-tab-warning.png']);
  });

  test('should keep the panels open/closed when change tabs', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing-with-multi-tab');
    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    await instance('openElements', ['leftPanel', 'notesPanel']);
    await page.waitForTimeout(5000);

    const secondTab = await iframe.$('#tab-1');
    await secondTab?.click();
    await page.waitForTimeout(5000);

    await iframe.evaluate(() => {
      const { documentViewer } = window.instance.Core;
      documentViewer.addEventListener('documentLoaded', async () => {
        const app = await iframe.$('.App');
        expect(await app.screenshot()).toMatchSnapshot(['left-right-panels-open', 'left-right-panels-open.png']);
      });
    });
  });

  test('should enable multi-tab feature, be able to add a tab and come back to first tab with everything working', async ({ page }) => {
    // This test is incredibly flaky when no license is provided
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing-with-valid-license');
    const instance = await waitForInstance();
    await page.waitForTimeout(3000);

    await iframe?.evaluate(() => {
      window.instance.UI.enableFeatures(['MultiTab']);
    });
    await page.waitForTimeout(200);

    // Scroll to top of page to prevent a flaky issue
    await iframe?.evaluate(() => {
      const scrollViewElement = window.instance.Core.documentViewer.getScrollViewElement();
      scrollViewElement.scrollTo({ top: 0 });
    });
    await page.waitForTimeout(200);

    await iframe?.evaluate(() => {
      window.instance.UI.TabManager.addTab('https://pdftron.s3.amazonaws.com/downloads/pl/form1.pdf', { setActive: true });
    });

    await page.waitForTimeout(2000);
    await iframe?.click('#tab-0');
    await page.waitForTimeout(2000);

    await instance('openElements', ['thumbnailsPanel']);
    await page.waitForTimeout(2000);

    const app = await iframe.$('.App');
    expect(await app.screenshot()).toMatchSnapshot(['first-tab-thumbnails', 'first-tab-thumbnails.png']);
  });

  test('should be able to delete annotations when returning to tab', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing-with-multi-tab');
    await waitForInstance();
    await page.waitForTimeout(5000);

    await iframe.evaluate(async () => {
      window.instance.UI.TabManager.setActiveTab(2);
    });

    await page.waitForTimeout(2000);

    await iframe.evaluate(async () => {
      const annotationManager = window.instance.Core.annotationManager;
      annotationManager.deleteAnnotations(annotationManager.getAnnotationsList().filter((a) => a.PageNumber === 1));
    });

    await page.waitForTimeout(2000);

    await iframe.evaluate(async () => {
      window.instance.UI.TabManager.setActiveTab(0, true);
    });

    await page.waitForTimeout(2000);

    await iframe.evaluate(async () => {
      window.instance.UI.TabManager.setActiveTab(2, true);
    });

    await page.waitForTimeout(2000);

    const annotOnPageOneCount = await iframe.evaluate(async () => {
      const annotationManager = window.instance.Core.annotationManager;
      return annotationManager.getAnnotationsList().filter((a) => a.PageNumber === 1).length;
    });

    expect(annotOnPageOneCount).toEqual(0);
  });

  test('should be able to use addTab API to load non-PDF documents via file picker', async ({ page }) => {
    const { iframe } = await loadViewerSample(page, 'viewing/viewing-with-multi-tab-empty');
    await page.waitForTimeout(3000);

    page.on('filechooser', async (fileChooser) => {
      await fileChooser.setFiles([path.join(__dirname, '../../../../e2e-test/test-files/legal-contract.docx')]);
    });

    await iframe?.evaluate(() => {
      const inputBtn = window.parent.document.createElement('input');
      inputBtn.id = 'add-tab-file-picker';
      inputBtn.type = 'file';
      inputBtn.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          window.instance.UI.TabManager.addTab(file, { setActive: true });
        }
      };
      window.parent.document.body.appendChild(inputBtn);
    });

    await page.click('#add-tab-file-picker');
    await page.waitForTimeout(5000);
    const app = await iframe.$('.App');
    expect(await app.screenshot()).toMatchSnapshot(['add-tab-non-pdf', 'add-tab-non-pdf.png']);
  });

  test('should be able to save scroll position afer switching tabs', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing-with-multi-tab');
    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    // Zoom and scroll to bottom right corner
    await instance('setZoomLevel', 6);
    const previousPosition = await iframe?.evaluate(async () => {
      const scrollViewElement = window.instance.Core.documentViewer.getScrollViewElement();
      scrollViewElement.scrollTo({
        top: scrollViewElement.scrollHeight,
        left: scrollViewElement.scrollWidth
      });
      return {
        top: scrollViewElement.scrollTop,
        left: scrollViewElement.scrollLeft,
      };
    });

    // Switch tabs and switch back
    await iframe?.click('#tab-1');
    await page.waitForTimeout(1000);
    await iframe?.click('#tab-0');
    await page.waitForTimeout(2000);

    const newPosition = await iframe?.evaluate(() => {
      const scrollViewElement = window.instance.Core.documentViewer.getScrollViewElement();
      return {
        top: scrollViewElement.scrollTop,
        left: scrollViewElement.scrollLeft,
      };
    });

    // Compare positions with a buffer room
    const BUFFER_ROOM = 10;
    expect(newPosition?.top).toBeLessThan(previousPosition?.top + BUFFER_ROOM);
    expect(newPosition?.top).toBeGreaterThan(previousPosition?.top - BUFFER_ROOM);
    expect(newPosition?.left).toBeLessThan(previousPosition?.left + BUFFER_ROOM);
    expect(newPosition?.left).toBeGreaterThan(previousPosition?.left - BUFFER_ROOM);
  });
});
