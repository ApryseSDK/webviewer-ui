import { getUIMode, loadViewerSample, test, Timeouts } from '../../playwright-utils';
import { expect } from '@playwright/test';
import { drawRectangle } from '../common/rectangle';
import { FileChooser } from 'playwright';
import path from 'path';

test.describe('Multi-tab Feature', () => {
  test('should enable the multi-tab feature with no loaded documents', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing-with-multi-tab-empty');
    await waitForInstance();
    await page.waitForTimeout(5000);
    const app = await iframe.$('.App');

    expect(await app.screenshot()).toMatchSnapshot(['multi-tab-empty', `multi-tab-empty-${getUIMode()}.png`]);
  });

  test('should close open file modal after adding a tab', async ({ page }) => {
    const { iframe, waitForInstance, waitForWVEvents } = await loadViewerSample(page, 'viewing/viewing-with-multi-tab');
    const instance = await waitForInstance();
    await waitForWVEvents(['documentLoaded']);

    page.on('filechooser', async (fileChooser: FileChooser) => {
      await fileChooser.setFiles([path.join(__dirname, '../../../../e2e-test/test-files/blank.pdf')]);
    });

    await iframe.getByRole('button', { name: /^Open file$/i }).click();
    await iframe.getByRole('button', { name: /^Upload$/i }).click();

    const chooseFileButton = await iframe.$('.OpenFileModal .modal-btn-file');
    await chooseFileButton.click();

    await waitForWVEvents(['documentLoaded']);

    const isElementOpen = await instance('isElementOpen', 'openFileModal');
    expect(isElementOpen).toBe(false);
  });

  test('should open image files properly after switching tabs', async ({ page }) => {
    const { iframe, waitForWVEvents } = await loadViewerSample(page, 'viewing/viewing-with-multi-tab');
    await waitForWVEvents(['annotationsLoaded']);

    page.on('filechooser', async (fileChooser: FileChooser) => {
      await fileChooser.setFiles([path.join(__dirname, '../../../../e2e-test/test-files/annotations-in-color-on-grayscale.png')]);
    });

    await iframe.getByRole('button', { name: /^Open file$/i }).click();
    await iframe.getByRole('button', { name: /^Upload$/i }).click();
    await iframe.locator('.OpenFileModal .modal-btn-file').click();
    await waitForWVEvents(['documentLoaded']);
    // Switch to the demo-annotated tab
    await iframe.getByRole('tab', { name: /^demo-annotated$/i }).click();
    await waitForWVEvents(['documentLoaded']);
    // Switch back to the image tab
    await iframe.getByRole('tab', { name: /^annotations-in-color-on-grayscale$/i }).click();
    await waitForWVEvents(['documentLoaded']);

    const activeTab = await iframe.evaluate(() => {
      return window.instance.UI.TabManager.getActiveTab();
    });

    // This check ensures that the image file tab was opened correctly.
    expect(activeTab.options.filename).toBe('annotations-in-color-on-grayscale.png');
  });

  test('should show empty page after closing all tabs', async ({ page }) => {
    const { iframe, waitForInstance, waitForWVEvents } = await loadViewerSample(page, 'viewing/viewing-with-multi-tab');
    await waitForInstance();
    await waitForWVEvents(['documentLoaded']);

    const tabs = await iframe.evaluate(async () => {
      return (Array.from(document.querySelectorAll('.draggable-tab')) as Array<HTMLElement>);
    });

    for (let i = 0; i < tabs.length; i++) {
      await iframe.click('.draggable-tab .close-button-wrapper .Button');
      await page.waitForTimeout(5000);
    }

    const app = await iframe.$('.App');

    expect(await app.screenshot()).toMatchSnapshot(['multi-tab-empty-page', `multi-tab-empty-page-${getUIMode()}.png`]);
  });

  test('should show a warning when trying to close a doc in case there are unsaved changes', async ({ page }) => {
    const { iframe, waitForInstance, waitForWVEvents } = await loadViewerSample(page, 'viewing/viewing-with-multi-tab-empty');
    await waitForInstance();

    page.on('filechooser', async (fileChooser: FileChooser) => {
      await fileChooser.setFiles([path.join(__dirname, '../../../../e2e-test/test-files/blank.pdf')]);
    });

    await iframe.getByRole('button', { name: /^Open file$/i }).click();
    await iframe.getByRole('button', { name: /^Upload$/i }).click();

    const chooseFileButton = await iframe.$('.OpenFileModal .modal-btn-file');
    await chooseFileButton.click();

    await waitForWVEvents(['documentLoaded']);

    const pageContainer = iframe.locator('#pageContainer1');
    const { x: xContainer, y: yContainer } = await pageContainer.boundingBox();

    await iframe.getByRole('button', { name: /^Shapes$/i }).click();

    await drawRectangle(page, xContainer + 70, yContainer + 70, 150, 150);
    await iframe.waitForFunction(() => {
      return window.instance.Core.annotationManager.getAnnotationsList().length === 1;
    });

    const closeButton = iframe.getByRole('button', { name: /^close blank$/i });
    await closeButton.click();

    const closeTabWarningButton = iframe.getByRole('button', { name: /^Close without download$/i });
    await expect(closeTabWarningButton).toBeVisible();
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
    const secondTab = await iframe.$('#tab-demo button.Tab');
    await secondTab.click();
    await page.waitForTimeout(2000);

    await instance('openElements', ['thumbnailsPanel']);
    await page.waitForTimeout(2000);

    const app = await iframe.$('.App');
    expect(await app.screenshot()).toMatchSnapshot(['first-tab-thumbnails', `first-tab-thumbnails-${getUIMode()}.png`]);
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

  // https://app.circleci.com/pipelines/github/XodoDocs/webviewer/112586/workflows/df0f2b05-b2f7-4d0a-9b46-f8ce5b18ac87/jobs/132248
  test.skip('should be able to use addTab API to load non-PDF documents via file picker', async ({ page }) => {
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

  // flaky: https://app.circleci.com/pipelines/github/XodoDocs/webviewer/115428/workflows/38dcb46c-fcab-49b1-8544-5547acab56c0/jobs/137633/tests
  test.skip('should be able to save scroll position afer switching tabs', async ({ page }) => {
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
    await iframe.click('#tab-cheetahs button.Tab');
    await page.waitForTimeout(1000);
    await iframe.click('#tab-demo button.Tab');
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

  test('should cache the document loaded after the tab is created', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing-with-multi-tab');
    await waitForInstance();
    await page.waitForTimeout(5000);

    await iframe.evaluate(async () => {
      const promise = new Promise((resolve) => {
        const instance = window.instance;
        const documentViewer = instance.Core.documentViewer;
        documentViewer.addEventListener('annotationsLoaded', () => {
          resolve(null);
        });
        instance.UI.TabManager.setActiveTab(1);
      });
      await promise;
    });

    await iframe.evaluate(async () => {
      const promise = new Promise(async (resolve) => {
        const instance = window.instance;
        const { UI, Core } = instance;
        const documentViewer = instance.Core.documentViewer;
        const fileURL = 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf'
        const doc = await Core.createDocument(fileURL);
        const xfdf = `<?xml version="1.0" encoding="UTF-8" ?><xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve"><annots><square page="0" rect="254.37,565.31,304.45,618.03" color="#E44234" flags="print" name="72c1af4b-b1d3-2a39-b429-663c5d7a1b0e" title="Guest" subject="Rectangle" date="D:20240809163220-04'00'" interior-color="#FFE6A2" width="0.1" creationdate="D:20240809163220-04'00'" dashes=""/></annots></xfdf>`;
        const options = { xfdfString: xfdf };
        const data = await doc.getFileData(options);
        const arr = new Uint8Array(data);
        const blob = new Blob([arr], { type: 'application/pdf' });

        documentViewer.addEventListener('annotationsLoaded', () => {
          resolve(null);
        });
        UI.loadDocument(blob, {
          filename: 'this-is-a-demo.pdf',
        });
      });
      await promise;
    });
    await iframe.evaluate(async () => {
      const promise = new Promise((resolve) => {
        const instance = window.instance;
        const documentViewer = instance.Core.documentViewer;
        documentViewer.addEventListener('annotationsLoaded', () => {
          resolve(null);
        });
        instance.UI.TabManager.setActiveTab(0);
      });
      await promise;
    });
    await iframe.evaluate(async () => {
      const promise = new Promise((resolve) => {
        const instance = window.instance;
        const documentViewer = instance.Core.documentViewer;
        documentViewer.addEventListener('annotationsLoaded', () => {
          resolve(null);
        });
        instance.UI.TabManager.setActiveTab(1);
      });
      await promise;
    });
    const annots = await iframe.evaluate(async () => {
      return window.instance.Core.annotationManager.getAnnotationsList();
    });
    expect(annots.length).toBe(1);
  });

  test('tab should show "untitled-{count}" when loading a document without the filename option', async ({ page }) => {
    const { iframe, waitForInstance, waitForWVEvents } = await loadViewerSample(page, 'viewing/viewing-with-multi-tab');
    await waitForInstance();
    await waitForWVEvents(['documentLoaded']);

    await iframe.evaluate(async () => {
      const promise = new Promise(async (resolve) => {
        const instance = window.instance;
        const { UI, Core } = instance;
        const documentViewer = instance.Core.documentViewer;
        const fileURL = 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf';
        const doc = await Core.createDocument(fileURL);
        const xfdf = '<?xml version="1.0" encoding="UTF-8" ?><xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve"><annots><square page="0" rect="254.37,565.31,304.45,618.03" color="#E44234" flags="print" name="72c1af4b-b1d3-2a39-b429-663c5d7a1b0e" title="Guest" subject="Rectangle" date="D:20240809163220-04\'00\'" interior-color="#FFE6A2" width="0.1" creationdate="D:20240809163220-04\'00\'" dashes=""/></annots></xfdf>';
        const options = { xfdfString: xfdf };
        const data = await doc.getFileData(options);
        const arr = new Uint8Array(data);
        const blob = new Blob([arr], { type: 'application/pdf' });

        documentViewer.addEventListener('annotationsLoaded', () => {
          resolve(null);
        });
        UI.loadDocument(blob);
      });
      await promise;
    });
    const tabTitle1 = iframe.getByRole('button', { name: 'untitled-1' });
    await expect(await tabTitle1).toBeVisible();
    await iframe.evaluate(async () => {
      const promise = new Promise((resolve) => {
        const instance = window.instance;
        const documentViewer = instance.Core.documentViewer;
        documentViewer.addEventListener('annotationsLoaded', () => {
          resolve(null);
        });
        instance.UI.TabManager.setActiveTab(1);
      });
      await promise;
    });
    await iframe.evaluate(async () => {
      const promise = new Promise(async (resolve) => {
        const instance = window.instance;
        const { UI, Core } = instance;
        const documentViewer = instance.Core.documentViewer;
        const fileURL = 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf';
        const doc = await Core.createDocument(fileURL);
        const xfdf = '<?xml version="1.0" encoding="UTF-8" ?><xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve"><annots><square page="0" rect="254.37,565.31,304.45,618.03" color="#E44234" flags="print" name="72c1af4b-b1d3-2a39-b429-663c5d7a1b0e" title="Guest" subject="Rectangle" date="D:20240809163220-04\'00\'" interior-color="#FFE6A2" width="0.1" creationdate="D:20240809163220-04\'00\'" dashes=""/></annots></xfdf>';
        const options = { xfdfString: xfdf };
        const data = await doc.getFileData(options);
        const arr = new Uint8Array(data);
        const blob = new Blob([arr], { type: 'application/pdf' });

        documentViewer.addEventListener('annotationsLoaded', () => {
          resolve(null);
        });
        UI.loadDocument(blob);
      });
      await promise;
    });
    const tabTitle2 = iframe.getByRole('button', { name: 'untitled-2' });
    await expect(await tabTitle2).toBeVisible();
  });
});
