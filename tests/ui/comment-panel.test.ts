import { Frame } from 'puppeteer';
import { loadViewerSample, Timeouts } from '../../utils';

const addAndCreateAnnot = (iFrame: Frame, isFreeTextAnnot: boolean, isLockedContents: boolean, noteContent = '', author = '',) => {
  return (iFrame as Frame).evaluate(async(isFreeTextAnnot, isLockedContents, noteContent, author) => {
    const promise = new Promise((resolve) => {
      window.readerControl.docViewer.getAnnotationManager().on('annotationChanged', (annotations, action) => {
        if (action === 'add') {
          resolve();
        }
      });
    });
    let annot;
    if (isFreeTextAnnot) {
      annot = new window.Annotations.FreeTextAnnotation();
      annot.PageNumber = 1;
      // these values need to be set before setPadding and setContent can be called
      annot.X = 100;
      annot.Y = 150;
      annot.Width = 200;
      annot.Height = 50;
      annot.setPadding(new window.Annotations.Rect(0, 0, 0, 0));
      annot.setContents(noteContent);
    } else {
      annot = new window.Annotations.RectangleAnnotation();
      annot.PageNumber = 1;
      annot.X = 100;
      annot.Y = 150;
      annot.Width = 200;
      annot.Height = 50;
      window.readerControl.docViewer.getAnnotationManager().setNoteContents(annot, noteContent);
    }
    annot.Author = author;
    annot.LockedContents = isLockedContents;
    window.readerControl.docViewer.getAnnotationManager().addAnnotation(annot);
    // need to draw the annotation otherwise it won't show up until the page is refreshed
    window.readerControl.docViewer.getAnnotationManager().redrawAnnotation(annot);
    await  promise;
  }, isFreeTextAnnot, isLockedContents, noteContent, author);
};

const selectAnnotation = (id: string, iframe: Frame) => {
  return (iframe as Frame).evaluate(async(id: string) => {
    const promise = new Promise((resolve) => {
      window.readerControl.docViewer.getAnnotationManager().on('annotationSelected', (annotations, action) => {
        if (action === 'selected') {
          resolve();
        }
      });
    });
    const annots = window.readerControl.docViewer.getAnnotationManager().getAnnotationsList()
      .filter((annot) => annot.Id === id);
    window.readerControl.docViewer.getAnnotationManager().selectAnnotation(annots[0]);
    await promise;
  }, id);
};
// hide date time else e2e will always throw error as date time will depend on current time of when annot was added
const hideDateTimeInNotesPanel = (iframe: Frame) => {
  return (iframe).evaluate(async() => {
    const nodes = document.querySelectorAll('.date-and-time');
    for (const node of nodes) {
      node.style.opacity = 0;
    }
  });
};

describe('Test cases for comment panel', () => {
  let result: { iframe: Frame; waitForInstance; waitForWVEvent };

  beforeEach(async() => {
    result = await loadViewerSample('viewing/blank');
    const instance = await result.waitForInstance();
    await instance('enableElements', ['richTextPopup']);
    await result.waitForWVEvent('annotationsLoaded');
  });

  it.skip('should not be able to edit comment for not locked content non-free text annotation', async() => {
    await addAndCreateAnnot(result.iframe, false, true, 'some-content');
    const instance = await result.waitForInstance();

    const annotId = await (result.iframe as Frame).evaluate(async() => {
      const annots = window.readerControl.docViewer.getAnnotationManager().getAnnotationsList()
        .filter((annot) => annot.LockedContents === true);
      return annots[0].Id;
    });

    await selectAnnotation(annotId, result.iframe);

    instance('openElement', 'notesPanel');
    await page.waitFor(500);

    await hideDateTimeInNotesPanel(result.iframe);
    const pageContainer = await (result.iframe as Frame).$('.NotesPanel');
    await page.waitFor(2000);
    expect(await pageContainer.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: 'comment-panel-non-free-text-annot-locked-content',
    });
  });

  it.skip('should be able to edit comment for locked content non-free text annotation', async() => {
    await addAndCreateAnnot(result.iframe, false, false, 'some-content');
    const instance = await result.waitForInstance();

    const annotId = await (result.iframe as Frame).evaluate(async() => {
      const annots = window.readerControl.docViewer.getAnnotationManager().getAnnotationsList()
        .filter((annot) => annot instanceof window.Annotations.RectangleAnnotation && annot.LockedContents === false);
      return annots[0].Id;
    });

    await selectAnnotation(annotId, result.iframe);

    instance('openElement', 'notesPanel');
    await page.waitFor(1000);

    await hideDateTimeInNotesPanel(result.iframe);
    const pageContainer = await (result.iframe as Frame).$('.NotesPanel');
    await page.waitFor(2000);
    expect(await pageContainer.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: 'comment-panel-non-free-text-annot-not-locked-content',
    });
  });

  it.skip('should not be able to edit comment for locked content free text annotation', async() => {
    await addAndCreateAnnot(result.iframe, true, true, 'some-content');
    const instance = await result.waitForInstance();

    const annotId = await (result.iframe as Frame).evaluate(async() => {
      const annots = window.readerControl.docViewer.getAnnotationManager().getAnnotationsList()
        .filter((annot) => annot.LockedContents === true);
      return annots[0].Id;
    });

    await selectAnnotation(annotId, result.iframe);

    instance('openElement', 'notesPanel');
    await page.waitFor(1000);

    await hideDateTimeInNotesPanel(result.iframe);
    const pageContainer = await (result.iframe as Frame).$('.NotesPanel');
    await page.waitFor(2000);
    expect(await pageContainer.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: 'comment-panel-free-text-annot-locked-content',
    });
  });

  it('should be able to edit comment for not locked content free text annotation', async() => {
    await page.waitFor(Timeouts.PDF_PRIME_DOCUMENT);

    await addAndCreateAnnot(result.iframe, true, false, 'some-content');
    // on creation of free text annot, text can be edited right away
    const pageContainer = await result.iframe.$('#pageContainer1');
    expect(await pageContainer.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: 'comment-panel-free-text-annot-not-locked-content',
    });
  });

  it.skip('should be able to only add reply to annotation that does not belong to user', async() => {
    await addAndCreateAnnot(result.iframe, false, true, undefined, 'a');
    const instance = await result.waitForInstance();

    const annotId = await (result.iframe as Frame).evaluate(async() => {
      const annots = window.readerControl.docViewer.getAnnotationManager().getAnnotationsList()
        .filter((annot) => annot.Author === 'a');
      return annots[0].Id;
    });

    await (result.iframe as Frame).evaluate(async() => {
      window.readerControl.docViewer.getAnnotationManager().setIsAdminUser(false);
      const promise = new Promise((resolve) => {
        window.readerControl.docViewer.getAnnotationManager().on('updateAnnotationPermission', () => {
          resolve();
        });
      });
      window.readerControl.docViewer.getAnnotationManager().setCurrentUser('Not-Admin');
      await promise;
    });

    await selectAnnotation(annotId, result.iframe);

    instance('openElement', 'notesPanel');
    await page.waitFor(500);

    await hideDateTimeInNotesPanel(result.iframe);
    await page.waitFor(2000);

    const pageContainer = await (result.iframe as Frame).$('.NotesPanel');
    expect(await pageContainer.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: 'can-only-add-reply-non-admin-diff-user',
    });
  });

  it('should be able to scroll to group annotation', async() => {
    const instance = await result.waitForInstance();
    await instance('loadDocument', '/test-files/annots1-rotated-cropped.pdf');
    await result.waitForWVEvent('annotationsLoaded');

    instance('openElement', 'notesPanel');

    await result.iframe.evaluate(async() => {
      const annotManager = window.docViewer.getAnnotationManager();
      annotManager.setIsAdminUser(true);

      let annotations = annotManager.getAnnotationsList().filter(a => a.PageNumber === 5);

      let parentAnnot = annotations[0];
      let childrenAnnots = annotations.slice(1,5);

      annotManager.groupAnnotations(parentAnnot, childrenAnnots);
      annotManager.selectAnnotation(childrenAnnots[0]);
    });

    await page.waitFor(Timeouts.REACT_RERENDER);

    const pageContainer = await result.iframe.$('.Note.expanded');
    expect(await pageContainer.evaluate((node) => node.innerHTML)).toBeTruthy();
  });

  it('Buttons should be disabled if there is nothing to persist', async() => {
    await page.waitFor(Timeouts.PDF_PRIME_DOCUMENT);

    const instance = await result.waitForInstance();

    await instance('setToolMode', 'AnnotationCreateSticky');
    const pageContainer = await result.iframe.$('#pageContainer1');
    const { x, y } = await pageContainer.boundingBox();
    await page.mouse.click(x + 100, y + 20);

    await page.waitFor(1000);

    const saveButton = await result.iframe.$('.save-button');
    expect(await saveButton.evaluate((element) => element.classList.contains('disabled'))).toBeTruthy();

    await result.iframe.focus('div.edit-content textarea');
    await page.keyboard.type('Some content');

    await page.waitFor(500);

    expect(await saveButton.evaluate((element) => !element.classList.contains('disabled'))).toBeTruthy();

    await result.iframe.$eval( '.save-button', (element) => element.click());

    await page.waitFor(1000);

    const replyButton = await result.iframe.$('.reply-button');
    expect(await replyButton.evaluate((element) => element.classList.contains('disabled'))).toBeTruthy();

    await result.iframe.focus('div.reply-area-container textarea');
    await page.keyboard.type('Some reply');

    await page.waitFor(500);

    expect(await replyButton.evaluate((element) => !element.classList.contains('disabled'))).toBeTruthy();
  });
});
