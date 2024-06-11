import { loadViewerSample, Timeouts, WebViewerInstance } from '../../playwright-utils';
import { expect, test, Frame } from '@playwright/test';

test.describe('Tests for outline bookmarks', () => {
  let instance: WebViewerInstance;
  let iframe: Frame;

  test.beforeEach(async ({ page }) => {
    const { iframe: sampleIframe, waitForInstance, waitForWVEvent } = await loadViewerSample(page, 'viewing/viewing-with-pdf-prime');
    iframe = (sampleIframe as Frame);
    instance = await waitForInstance();
    await waitForWVEvent('pageComplete', {
      code: async () => {
        window.instance.UI.loadDocument('/test-files/outlines-nested.pdf');
      }
    });

    await instance('openElements', ['outlinesPanel']);
    await page.waitForTimeout(Timeouts.PDF_PRIME_DOCUMENT);

    await iframe.evaluate(() => {
      window.numberOfTimesOutlineBookmarksChangedEventWasTriggered = 0;

      window.instance.UI.addEventListener('outlineBookmarksChanged', () => {
        window.numberOfTimesOutlineBookmarksChangedEventWasTriggered++;
      });
    });
  });

  test('should fire an event when an outline is renamed', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'TODO: Investigate why this test is flaky on webkit');
    // This test is flaky sometimes, it's because outlines aren't loaded in the UI
    await instance('reloadOutline');
    const outline = await iframe.$$('.bookmark-outline-single-container');
    await outline[0].click();
    const editOptions = await outline[0].$('.bookmark-outline-more-button');
    await editOptions?.click();

    const renameOutlineButton = await iframe.$('button[data-element=outlineRenameButton]');
    await renameOutlineButton?.click();
    await page.keyboard.type('HELLO WORLD!');
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);
    await page.keyboard.down('Enter');
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);

    const numberOfTimesOutlineBookmarksChangedEventWasTriggered = await iframe.evaluate(() => {
      return window.numberOfTimesOutlineBookmarksChangedEventWasTriggered;
    });

    expect(numberOfTimesOutlineBookmarksChangedEventWasTriggered).toBe(1);
  });

  test('should fire an event when an outline is deleted', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'TODO: Investigate why this test is flaky on webkit');
    // This test is flaky sometimes, it's because outlines aren't loaded in the UI
    await instance('reloadOutline');
    const outline = await iframe.$$('.bookmark-outline-single-container');
    await outline[0].click();
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);
    const editOptions = await outline[0].$('.bookmark-outline-more-button');
    await editOptions?.click();
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);

    const deleteOutlineButton = await iframe.$('button[data-element=outlineDeleteButton]');
    await deleteOutlineButton?.click();
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);

    const warningModalConfirmButton = await iframe.$('button[data-element=WarningModalSignButton]');
    await warningModalConfirmButton?.click();
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);

    const numberOfTimesOutlineBookmarksChangedEventWasTriggered = await iframe.evaluate(() => {
      return window.numberOfTimesOutlineBookmarksChangedEventWasTriggered;
    });

    expect(numberOfTimesOutlineBookmarksChangedEventWasTriggered).toBe(1);
  });

  test('should fire an event when new root outline is created and the new outline should not be selected', async ({ page, browserName }) => {
    test.skip(browserName === 'firefox', 'TODO: investigate why this test is flaky on firefox');
    const addNewOutlineButton = await iframe.$('[data-element=addNewOutlineButton]');
    await addNewOutlineButton?.click();
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);
    await page.keyboard.type('HELLO WORLD!');
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);
    await page.keyboard.down('Enter');
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);

    const numberOfTimesOutlineBookmarksChangedEventWasTriggered = await iframe.evaluate(() => {
      return window.numberOfTimesOutlineBookmarksChangedEventWasTriggered;
    });

    expect(numberOfTimesOutlineBookmarksChangedEventWasTriggered).toBe(1);
    const outlines = await iframe.$$('.bookmark-outline-single-container');
    expect(outlines.length).toBe(2);
    expect(await outlines[1].evaluate((outline) => Object.values(outline.classList))).not.toContain('selected');
  });

  // Flaky test: https://apryse.atlassian.net/browse/WVR-5790
  test.skip('should keep the outline expanded when create a child outline', async ({ page }) => {
    const firstOutline = await iframe.$$('.bookmark-outline-single-container');
    await firstOutline[0]?.click();
    await page.waitForTimeout(Timeouts.REACT_RERENDER);
    const addNewOutlineButton = await iframe.$('[data-element=addNewOutlineButton]');
    await addNewOutlineButton?.click();
    await page.waitForTimeout(Timeouts.REACT_RERENDER);
    await page.keyboard.type('HELLO WORLD!');
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);
    await page.keyboard.down('Enter');
    await page.waitForTimeout(Timeouts.REACT_RERENDER);

    const expandCollapseOutlineButtonSelector = '.bookmark-outline-single-container .outline-treeview-toggle.expanded';
    await expect(iframe.locator(expandCollapseOutlineButtonSelector)).toHaveCount(1);
  });

  test('should rerender the outlines panel when the event outlineBookmarksChanged is fired', async ({ page }) => {
    await instance('loadDocument', '/test-files/demo-annotated.pdf');
    await page.waitForTimeout(5000);

    await instance('openElements', ['outlinesPanel']);
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);

    let outlinesPanel = await iframe.$('[data-element=outlinesPanel]');
    expect(await outlinesPanel.screenshot()).toMatchSnapshot(['outlines-panel', 'initial-state.png']);

    await iframe.evaluate(async () => {
      const fireEvent = (eventName, data) => {
        let event;
        if (CustomEvent) {
          event = new CustomEvent(eventName, { detail: data, bubbles: true, cancelable: true });
        } else {
          event = document.createEvent('Event');
          event.initEvent(eventName, true, true);
          event.detail = data;
        }
        window.dispatchEvent(event);
      };

      const PDFNet = window.instance.Core.PDFNet;
      let newOutline;

      await PDFNet.runWithCleanup(async () => {
        const doc = await window.instance.Core.documentViewer.getDocument().getPDFDoc();
        newOutline = await PDFNet.Bookmark.create(doc, 'First Outline');

        const page = await doc.getPage(2);
        const dest = await PDFNet.Destination.createXYZ(page, 100, 100, 1);
        newOutline.setAction(await PDFNet.Action.createGoto(dest));

        await doc.addRootBookmark(newOutline);
      });

      const bookmarkEventObject = {
        ...newOutline,
        bookmark: newOutline,
        path: '0',
        action: 'addRootOutline'
      };

      fireEvent('outlineBookmarksChanged', bookmarkEventObject);
    });

    outlinesPanel = await iframe.$('[data-element=outlinesPanel]');
    expect(await outlinesPanel.screenshot()).toMatchSnapshot(['outlines-panel', 'rerendered.png']);
  });

  test('should be able to render more complex bookmarks', async ({ page }) => {
    // should be able to render children and url bookmark
    // we currently don't support "action" bookmark (bookmark that perform an action but not assoicated to a page)
    // but we still display these "action" bookmarks

    await instance('loadDocument', '/test-files/bookmarkSample.pdf');
    await page.waitForTimeout(5000);
    // expand all nested children
    await iframe.evaluate(() => {
      instance.UI.OutlinesPanel.setDefaultOptions({
        autoExpandOutlines: true
      });
    });

    await instance('openElements', ['outlinesPanel']);
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);

    const outlinesPanel = await iframe.$('[data-element=outlinesPanel]');
    expect(await outlinesPanel.screenshot()).toMatchSnapshot(['outlines-panel', 'more-complex.png']);
  });

  test('should be able to hide unsupported bookmarks', async ({ page }) => {
    // should be able to hide bookmarks that we don't support (unsupported actions)

    await instance('loadDocument', '/test-files/bookmarkSample.pdf', { showInvalidBookmarks: false });
    await page.waitForTimeout(5000);

    await instance('openElements', ['outlinesPanel']);
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);

    const outlinesPanel = await iframe.$('[data-element=outlinesPanel]');
    expect(await outlinesPanel.screenshot()).toMatchSnapshot(['outlines-panel', 'not-supported-outline.png']);
  });

  test('should be able to show color for colored bookmarks', async ({ page }) => {
    await instance('loadDocument', '/test-files/colored-outlines-nested.pdf');
    await page.waitForTimeout(Timeouts.PDF_PRIME_DOCUMENT);
    await iframe.evaluate(() => {
      instance.UI.OutlinesPanel.setDefaultOptions({
        autoExpandOutlines: true
      });
    });
    await instance('openElements', ['outlinesPanel']);
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION * 3);
    const outlinesPanel = await iframe.$('[data-element=outlinesPanel]');
    expect(await outlinesPanel.screenshot()).toMatchSnapshot(['outlines-panel', 'colored-bookmarks.png']);
  });

  test('the outline should redirect to the correct place when applied in a rotated page', async ({ page }) => {
    await instance('loadDocument', '/test-files/demo-annotated.pdf');
    await page.waitForTimeout(5000);

    await instance('openElements', ['thumbnailsPanel']);
    await page.waitForTimeout(3000);

    const clockwiseButton = await iframe.$('.Thumbnail.active [data-element="thumbRotateClockwise"]');
    await clockwiseButton?.click();
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);

    await instance('openElements', ['outlinesPanel']);
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);

    await iframe.click('.bookmark-outline-control-button.add-new-button');
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);

    await page.keyboard.type('Page 1 Outline');
    await page.keyboard.down('Enter');

    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);

    // Going to a different page to check if the outline will redirect correctly
    await instance('setCurrentPageNumber', 5);
    const outline = await iframe.$('.bookmark-outline-single-container');
    await outline?.click();
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);

    expect(await instance('getCurrentPage')).toBe(1);
  });

  test('updated outline and a new outline to the same page should have the same destination even when the page is rotated', async ({ page }) => {
    await instance('openElements', ['outlinesPanel']);
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION * 3);
    const addOutlineButton = await iframe.$('[data-element="addNewOutlineButtonContainer"]');
    await addOutlineButton?.click();
    await page.waitForTimeout(2000);
    await page.keyboard.type('Page 1 Outline');
    let saveButton = await iframe.$('.bookmark-outline-save-button');
    await saveButton?.click();
    await page.waitForTimeout(2000);
    await instance('openElements', ['thumbnailsPanel']);
    await page.waitForTimeout(2000);

    const clockwiseButton = await iframe.$('.Thumbnail.active [data-element="thumbRotateClockwise"]');
    await clockwiseButton?.click();
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);

    await instance('openElements', ['outlinesPanel']);
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);

    const firstOutline = await iframe.$('.bookmark-outline-single-container');
    await firstOutline?.hover();
    const firstOutlineMoreButton = await iframe.$('.bookmark-outline-more-button');
    await firstOutlineMoreButton?.click();
    const setDestinationButton = await iframe.$('button[data-element=outlineSetDestinationButton]');
    await setDestinationButton?.click();
    saveButton = await iframe.$('.bookmark-outline-save-button');
    await saveButton?.click();
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);
    await instance('openElements', ['thumbnailsPanel']);
    await instance('openElements', ['outlinesPanel']);
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);
    await iframe.click('.bookmark-outline-control-button.add-new-button');
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);

    await page.keyboard.type('Page 1 Outline duplicated');
    await page.keyboard.down('Enter');
    await page.waitForTimeout(Timeouts.UI_CSS_ANIMATION);

    const bookmarks = await instance('getBookmarks');
    const firstBookmark = bookmarks[0];
    const secondBookmark = bookmarks[1];
    expect(firstBookmark['verticalOffset']).toEqual(secondBookmark['verticalOffset']);
    expect(firstBookmark['horizontalOffset']).toEqual(secondBookmark['horizontalOffset']);
  });
});
