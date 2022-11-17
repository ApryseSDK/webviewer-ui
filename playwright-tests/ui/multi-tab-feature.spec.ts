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

  test('should enable the multi-tab feature and load both initialDoc option and the added tabs', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing-with-multi-tab');
    await waitForInstance();
    await iframe.evaluate(async () => {
      window.instance.UI.TabManager.addTab('https://pdftron.s3.amazonaws.com/downloads/pl/form1.pdf', { setActive: true });
    });

    await page.waitForTimeout(5000);
    const app = await iframe.$('.App');

    expect(await app.screenshot()).toMatchSnapshot(['add-initial-doc-and-tabs', 'add-initial-doc-and-tabs.png']);
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
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing');
    const instance = await waitForInstance();
    
    await iframe.evaluate(() => {
      return instance.UI.enableFeatures(['MultiTab']);
    });

    await iframe.evaluate(async () => {
      window.instance.UI.TabManager.addTab('https://pdftron.s3.amazonaws.com/downloads/pl/form1.pdf', { setActive: true });
    });

    await page.waitForTimeout(5000);
    const firstTab = await iframe.$('#tab-0');
    await firstTab?.click();
    await page.waitForTimeout(5000);

    await instance('openElements', ['thumbnailsPanel']);
    await page.waitForTimeout(10000);

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
      annotationManager.deleteAnnotations(annotationManager.getAnnotationsList().filter(a => a.PageNumber === 1));
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
      return annotationManager.getAnnotationsList().filter(a => a.PageNumber === 1).length;
    });

    expect(annotOnPageOneCount).toEqual(0);
  });
});
