import { Frame } from 'puppeteer';
import { loadViewerSample } from '../../utils';

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
  let result: { iframe: Frame; waitForInstance; waitForWVEvent};
  beforeEach(async() => {
    result = await loadViewerSample(
      'viewing/viewing',
    );
    await result.waitForWVEvent('annotationsLoaded');
  });

  it('should not be able to edit comment for not locked content non-free text annotation', async() => {
    await addAndCreateAnnot(result.iframe, false, true, 'some-content');

    const annotId = await (result.iframe as Frame).evaluate(async() => {
      const annots = window.readerControl.docViewer.getAnnotationManager().getAnnotationsList()
        .filter((annot) => annot.LockedContents === true);
      return annots[0].Id;
    });

    await selectAnnotation(annotId, result.iframe);

    await (result.iframe as Frame).click('[data-element=annotationCommentButton]');
    await page.waitFor(2000);
    await hideDateTimeInNotesPanel(result.iframe);
    await page.waitFor(2000);
    const pageContainer = await (result.iframe as Frame).$('.NotesPanel');
    expect(await pageContainer.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: 'comment-panel-non-free-text-annot-locked-content',
    });
  });

  it('should be able to edit comment for locked content non-free text annotation', async() => {
    await addAndCreateAnnot(result.iframe, false, false, 'some-content');

    const annotId = await (result.iframe as Frame).evaluate(async() => {
      const annots = window.readerControl.docViewer.getAnnotationManager().getAnnotationsList()
        .filter((annot) => annot instanceof window.Annotations.RectangleAnnotation && annot.LockedContents === false);
      return annots[0].Id;
    });

    await selectAnnotation(annotId, result.iframe);

    await (result.iframe as Frame).click('[data-element=annotationCommentButton]');
    await page.waitFor(2000);
    await hideDateTimeInNotesPanel(result.iframe);
    await page.waitFor(2000);
    const pageContainer = await (result.iframe as Frame).$('.NotesPanel');
    expect(await pageContainer.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: 'comment-panel-non-free-text-annot-not-locked-content',
    });
  });

  it('should not be able to edit comment for locked content free text annotation', async() => {
    await addAndCreateAnnot(result.iframe, true, true, 'some-content');

    const annotId = await (result.iframe as Frame).evaluate(async() => {
      const annots = window.readerControl.docViewer.getAnnotationManager().getAnnotationsList()
        .filter((annot) => annot.LockedContents === true);
      return annots[0].Id;
    });

    await selectAnnotation(annotId, result.iframe);

    await (result.iframe as Frame).click('[data-element=annotationCommentButton]');
    await page.waitFor(2000);
    await hideDateTimeInNotesPanel(result.iframe);
    await page.waitFor(2000);
    const pageContainer = await (result.iframe as Frame).$('.NotesPanel');
    expect(await pageContainer.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: 'comment-panel-free-text-annot-locked-content',
    });
  });

  it('should be able to edit comment for not locked content free text annotation', async() => {
    await addAndCreateAnnot(result.iframe, true, false, 'some-content');
    // on creation of free text annot, text can be edited right away
    await page.waitFor(2000);
    const pageContainer = await result.iframe.$('#pageContainer1');
    expect(await pageContainer.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: 'comment-panel-free-text-annot-not-locked-content',
    });
  });

  it('should be able to only add reply to annotation that does not belong to user', async() => {
    await addAndCreateAnnot(result.iframe, false, true, undefined, 'a');

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

    await (result.iframe as Frame).click('[data-element=annotationCommentButton]');
    await page.waitFor(2000);
    await hideDateTimeInNotesPanel(result.iframe);
    await page.waitFor(2000);

    const pageContainer = await (result.iframe as Frame).$('.NotesPanel');
    expect(await pageContainer.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: 'can-only-add-reply-non-admin-diff-user',
    });
  });
});
