import { Frame } from 'puppeteer';
import { loadViewerSample, Timeouts } from '../../utils';

const addAndCreateAnnot = (
  iFrame: Frame,
  isFreeTextAnnot: boolean,
  isLockedContents: boolean,
  noteContent = '',
  author = '',
  richTextStyle = {}
) => {
  return (iFrame as Frame).evaluate(async (isFreeTextAnnot, isLockedContents, noteContent, author, richTextStyle) => {
    const promise = new Promise((resolve) => {
      window.instance.Core.documentViewer.getAnnotationManager().addEventListener('annotationChanged', (annotations, action) => {
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
      annot.setRichTextStyle(richTextStyle);
    } else {
      annot = new window.Annotations.RectangleAnnotation();
      annot.PageNumber = 1;
      annot.X = 100;
      annot.Y = 150;
      annot.Width = 200;
      annot.Height = 50;
      window.instance.Core.documentViewer.getAnnotationManager().setNoteContents(annot, noteContent);
    }
    annot.Author = author;
    annot.LockedContents = isLockedContents;
    window.instance.Core.documentViewer.getAnnotationManager().addAnnotation(annot);
    // need to draw the annotation otherwise it won't show up until the page is refreshed
    window.instance.Core.documentViewer.getAnnotationManager().redrawAnnotation(annot);
    await promise;
  }, isFreeTextAnnot, isLockedContents, noteContent, author, richTextStyle);
};

const selectAnnotation = (id: string, iframe: Frame) => {
  return (iframe as Frame).evaluate(async (id: string) => {
    const promise = new Promise((resolve) => {
      window.instance.Core.documentViewer.getAnnotationManager().addEventListener('annotationSelected', (annotations, action) => {
        if (action === 'selected') {
          resolve();
        }
      });
    });
    const annots = window.instance.Core.documentViewer.getAnnotationManager().getAnnotationsList()
      .filter((annot) => annot.Id === id);
    window.instance.Core.documentViewer.getAnnotationManager().selectAnnotation(annots[0]);
    await promise;
  }, id);
};

// hide date time else e2e will always throw error as date time will depend on current time of when annot was added
const hideDateTimeInNotesPanel = (iframe: Frame) => {
  return (iframe).evaluate(async () => {
    const nodes = document.querySelectorAll('.date-and-time');
    for (const node of nodes) {
      node.style.opacity = 0;
    }
  });
};

describe('Test cases for comment panel', () => {
  let result: { iframe: Frame; waitForInstance; waitForWVEvent };

  beforeEach(async () => {
    result = await loadViewerSample('viewing/blank');
    const instance = await result.waitForInstance();
    await instance('enableElements', ['richTextPopup']);
    await result.waitForWVEvent('annotationsLoaded');
  });

  it.skip('should not be able to edit comment for not locked content non-free text annotation', async () => {
    await addAndCreateAnnot(result.iframe, false, true, 'some-content');
    const instance = await result.waitForInstance();

    const annotId = await (result.iframe as Frame).evaluate(async () => {
      const annots = window.instance.Core.documentViewer.getAnnotationManager().getAnnotationsList()
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

  it.skip('should be able to edit comment for locked content non-free text annotation', async () => {
    await addAndCreateAnnot(result.iframe, false, false, 'some-content');
    const instance = await result.waitForInstance();

    const annotId = await (result.iframe as Frame).evaluate(async () => {
      const annots = window.instance.Core.documentViewer.getAnnotationManager().getAnnotationsList()
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

  it.skip('should not be able to edit comment for locked content free text annotation', async () => {
    await addAndCreateAnnot(result.iframe, true, true, 'some-content');
    const instance = await result.waitForInstance();

    const annotId = await (result.iframe as Frame).evaluate(async () => {
      const annots = window.instance.Core.documentViewer.getAnnotationManager().getAnnotationsList()
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

  it('should be able to edit comment for not locked content free text annotation', async () => {
    await page.waitFor(Timeouts.PDF_PRIME_DOCUMENT);

    await addAndCreateAnnot(result.iframe, true, false, 'some-content');
    // on creation of free text annot, text can be edited right away
    const pageContainer = await result.iframe.$('#pageContainer1');
    expect(await pageContainer.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: 'comment-panel-free-text-annot-not-locked-content',
    });
  });

  it('should change annotations type labels according to the current language set', async () => {
    await addAndCreateAnnot(result.iframe, false, true, 'some-content');
    await addAndCreateAnnot(result.iframe, true, false, 'Testing Annotations type labels', '');

    const instance = await result.waitForInstance();
    instance('openElement', 'notesPanel');

    await result.iframe.click('[data-element=notesOrderDropdown] .arrow');
    await result.iframe.click('[data-element=dropdown-item-type]');

    let notesContainer = await result.iframe.$('.normal-notes-container .ListSeparator');
    let innerHTML = await notesContainer.evaluate((node) => node.innerHTML);

    expect(innerHTML).toBe('Free Text');

    await instance('setLanguage', 'zh_cn');
    await page.waitFor(2000);

    notesContainer = await result.iframe.$('.normal-notes-container .ListSeparator');
    innerHTML = await notesContainer.evaluate((node) => node.innerHTML);
    expect(innerHTML).toBe('自由文本');
  });

  it('freetext annotation with rich text should render with rich text stylings', async () => {
    const richTextStyle = {
      '0': { 'font-style': 'italic' },
      '1': { 'font-weight': 'bold', 'font-style': 'italic' },
      '3': { 'font-style': 'italic' },
      '4': {},
      '7': { 'text-decoration': 'line-through' },
      '11': {},
      '17': { 'font-weight': 'bold', 'color': '#e44234' },
      '21': { 'text-decoration': 'word' }
    };
    await addAndCreateAnnot(result.iframe, true, false, 'Test www.google.ca 1234', '', richTextStyle);
    const instance = await result.waitForInstance();

    const annotId = await (result.iframe as Frame).evaluate(async () => {
      const annots = window.instance.Core.documentViewer.getAnnotationManager().getAnnotationsList();
      return annots[0].Id;
    });

    instance('openElement', 'notesPanel');
    await page.waitFor(1000);
    await selectAnnotation(annotId, result.iframe);

    const noteContainer = await result.iframe.$(`#note_${annotId} .container`);
    const innerHTML = await noteContainer.evaluate((node) => node.innerHTML);
    expect(innerHTML).toBe('<span><span style="font-style: italic;">T</span><span style="font-weight: bold; font-style: italic;">es</span><span style="font-style: italic;">t</span><span> </span></span><a href="http://www.google.ca" target="_blank" rel="noopener noreferrer"><span>ww</span><span style="text-decoration: line-through;">w.go</span><span>ogle.c</span><span style=\"font-weight: bold; color: rgb(228, 66, 52);\">a</span></a><span style=\"font-weight: bold; color: rgb(228, 66, 52);\"> 12</span><span style=\"text-decoration: underline;\">34</span>');

    // Search comments
    const searchInput = await result.iframe.$('#NotesPanel__input');
    await searchInput.type('www');
    await page.waitFor(2000);
    const innerHTML1 = await noteContainer.evaluate((node) => node.innerHTML);
    expect(innerHTML1).toBe('<span><span style="font-style: italic;">T</span><span style="font-weight: bold; font-style: italic;">es</span><span style="font-style: italic;">t</span><span> </span></span><a href="http://www.google.ca" target="_blank" rel="noopener noreferrer"><span class="highlight"><span>ww</span><span style="text-decoration: line-through;">w</span></span><span style="text-decoration: line-through;">.go</span><span>ogle.c</span><span style=\"font-weight: bold; color: rgb(228, 66, 52);\">a</span></a><span style=\"font-weight: bold; color: rgb(228, 66, 52);\"> 12</span><span style=\"text-decoration: underline;\">34</span>');
  });

  it('should apply rich text style into Notes Panel comments and render them with rich text stylings', async () => {
    
    await addAndCreateAnnot(result.iframe, true, false, 'Adding Free Text', '');
    const instance = await result.waitForInstance();

    const annotId = await (result.iframe as Frame).evaluate(async () => {
      const annots = window.instance.Core.documentViewer.getAnnotationManager().getAnnotationsList();
      return annots[0].Id;
    });

    instance('openElement', 'notesPanel');
    await page.waitFor(1000);
    await selectAnnotation(annotId, result.iframe);

    await result.iframe.focus(`#note_${annotId} .reply-area-container .ql-editor`);
    await page.keyboard.type('Normal content ');
    
    // Activating bold style
    await page.keyboard.down('ControlLeft');  
    await page.keyboard.press('KeyB');
    await page.keyboard.up('ControlLeft');
    await page.keyboard.type('Bold content ');

    // Activating Italic style
    await page.keyboard.down('ControlLeft');  
    await page.keyboard.press('KeyI');
    await page.keyboard.up('ControlLeft');
    await page.keyboard.type('Bold + Italic content ');

    // Disabling Italic and bold style and activating Underline style
    await page.keyboard.down('ControlLeft');  
    await page.keyboard.press('KeyI');
    await page.keyboard.press('KeyB');
    await page.keyboard.press('KeyU');
    await page.keyboard.up('ControlLeft');
    await page.keyboard.type('Underline content');
    
    await page.keyboard.down('ControlLeft');
    await page.keyboard.down('Enter');
    await page.keyboard.up('ControlLeft');

    await page.waitFor(500);
    
    await selectAnnotation(annotId, result.iframe);

    const commentContainer = await result.iframe.$(`#note_${annotId} .container.reply-content`);
   
    const innerHTML1 = await commentContainer.evaluate((node) => node.innerHTML);
    expect(innerHTML1).toBe(`<div class="note-text-preview preview-comment"><span>Normal content </span><span style="font-weight: bold;">Bold content </span><span style="font-weight: bold; font-style: italic;">Bold + Italic content </span><span style="text-decoration: underline;">Underline content</span> </div>`);
  });

  it.skip('should be able to only add reply to annotation that does not belong to user', async () => {
    await addAndCreateAnnot(result.iframe, false, true, undefined, 'a');
    const instance = await result.waitForInstance();

    const annotId = await (result.iframe as Frame).evaluate(async () => {
      const annots = window.instance.Core.documentViewer.getAnnotationManager().getAnnotationsList()
        .filter((annot) => annot.Author === 'a');
      return annots[0].Id;
    });

    await (result.iframe as Frame).evaluate(async () => {
      window.instance.Core.documentViewer.getAnnotationManager().setIsAdminUser(false);
      const promise = new Promise((resolve) => {
        window.instance.Core.documentViewer.getAnnotationManager().addEventListener('updateAnnotationPermission', () => {
          resolve();
        });
      });
      window.instance.Core.documentViewer.getAnnotationManager().setCurrentUser('Not-Admin');
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

  it('should be able to scroll to group annotation', async () => {
    const instance = await result.waitForInstance();
    await instance('loadDocument', '/test-files/annots1-rotated-cropped.pdf');
    await result.waitForWVEvent('annotationsLoaded');

    instance('openElement', 'notesPanel');
    await result.iframe.evaluate(async () => {

      const annotManager = window.instance.Core.documentViewer.getAnnotationManager();
      annotManager.setIsAdminUser(true);

      const annotations = annotManager.getAnnotationsList().filter((a) => a.PageNumber === 5);

      const parentAnnot = annotations[0];
      const childrenAnnots = annotations.slice(1,5);

      annotManager.groupAnnotations(parentAnnot, childrenAnnots);
      annotManager.selectAnnotation(childrenAnnots[0]);
    });

    await page.waitFor(Timeouts.REACT_RERENDER);

    const pageContainer = await result.iframe.$('.Note.expanded');
    expect(await pageContainer.evaluate((node) => node.innerHTML)).toBeTruthy();
  });

  it('should be able to scroll to selected annotation for VirtualizedList', async () => {
    const instance = await result.waitForInstance();

    await instance('loadDocument', '/test-files/VirtualizedAnnotTest.pdf');
    await result.waitForWVEvent('annotationsLoaded');

    instance('openElement', 'notesPanel');

    const selectAnnotAndTest = async (index) => {
      const annotId = await (result.iframe as Frame).evaluate(async (index) => {
        const annotManager = window.instance.Core.documentViewer.getAnnotationManager();
        annotManager.deselectAllAnnotations();

        const annots = annotManager.getAnnotationsList().filter((annot) => annot instanceof window.Annotations.FreeTextAnnotation);
        annotManager.selectAnnotation(annots[index]);

        return annots[index].Id;
      }, index);

      await page.waitFor(500);

      // check if the note is being rendered in the virtualized list
      // testing like this to try to prevent it from being buggy if scroll is off by a little bit
      const noteContainer = await result.iframe.$(`#note_${annotId}`);
      expect(await noteContainer.evaluate((node) => node.innerHTML)).toBeTruthy();

      const focusedElement = await (result.iframe as Frame).evaluate(async () => {
        return document.activeElement.constructor.name;
      });

      // check if focusing on the textarea, can't think of any other way to tell if there is a blinking text cursor
      expect(focusedElement).toBe('HTMLDivElement');

      const notePanel = await result.iframe.$('.NotesPanel .ReactVirtualized__Grid');
      const selectedScrollTop = await notePanel.evaluate((node) => node.scrollTop);

      await (result.iframe as Frame).evaluate(async (index) => {
        const annotManager = window.instance.Core.documentViewer.getAnnotationManager();
        annotManager.deselectAllAnnotations();
      }, index);
      await page.waitFor(500);

      const deselectedScrollTop = await notePanel.evaluate((node) => node.scrollTop);
      // check if the note panel stay near the same location when closing the note
      expect(Math.abs(selectedScrollTop - deselectedScrollTop)).toBeLessThan(5);
    };

    await selectAnnotAndTest(30);
    await selectAnnotAndTest(60);
    await selectAnnotAndTest(10);
    await selectAnnotAndTest(88);
  });

  it('should be able to select text in the note panel', async () => {
    const instance = await result.waitForInstance();

    await instance('loadDocument', '/test-files/demo-annotated.pdf');
    await result.waitForWVEvent('annotationsLoaded');

    instance('openElement', 'notesPanel');
    await page.waitFor(2000);

    const annotNote = await result.iframe.$('#note_140aed30-b8f5-49f7-374f-b8a7cbd88e17 .container .note-text-preview');
    const bounding_box = await annotNote.boundingBox();

    await page.mouse.move(bounding_box.x, bounding_box.y);
    await page.waitFor(500);
    await page.mouse.down();

    await page.mouse.move(bounding_box.x + bounding_box.width / 2, bounding_box.y + bounding_box.height / 2);
    await page.waitFor(500);
    await page.mouse.up();
    const selectedText = await (result.iframe as Frame).evaluate(() => {
      return window.getSelection().toString();
    });

    expect(selectedText.trim()).toEqual('Great quotes! Do we have any more?');
  });

  it('for VirtualizedList should not scroll, when new comment is added', async () => {
    const instance = await result.waitForInstance();

    await instance('loadDocument', '/test-files/VirtualizedAnnotTest.pdf');
    await result.waitForWVEvent('annotationsLoaded');

    instance('openElement', 'notesPanel');

    await (result.iframe as Frame).evaluate(async () => {
      const annotManager = window.instance.Core.documentViewer.getAnnotationManager();

      const replyList = annotManager.getAnnotationsList().filter((a) => a.InReplyTo).map((a) => a.InReplyTo);
      const map = replyList.reduce((acc, e) => {
        const nextAcc = { ...acc };
        nextAcc[e] = nextAcc[e] ? (nextAcc[e] + 1) : 1;
        return nextAcc;
      }, {});

      const annotIDWithMostReplies = Array.from(Object.entries(map)).sort((a, b) => (b[1] as number) -(a[1] as number))[0][0];
      annotManager.selectAnnotation(annotManager.getAnnotationById(annotIDWithMostReplies));
    });

    await page.waitFor(1000);

    const notePanel = await result.iframe.$('.NotesPanel .ReactVirtualized__Grid');

    await notePanel.evaluate((node) => {
      // scroll down a bit so that it looking at the "reply" area
      node.scrollTop = node.scrollTop + 300;
      return node.scrollTop;
    });

    await page.waitFor(1000);

    await (result.iframe as Frame).evaluate(async () => {
      const annotManager = window.instance.Core.documentViewer.getAnnotationManager();
      await annotManager.importAnnotations(`
      <?xml version="1.0" encoding="UTF-8"?>
      <xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
        <annots>
          <text page="0" rect="96,466,127,497" color="#FFFF00" flags="hidden,print,nozoom,norotate" name="7094c86e-0b2e-fb7b-b611-7cce80589299" title="Guest" subject="Sticky Note" date="D:20210517142304-07'00'" creationdate="D:20210517142304-07'00'" inreplyto="32d38690-104f-fbaa-2fc0-70be1f5eb27d" icon="Comment" state="Accepted" statemodel="Review">
            <contents>Accepted set by Guest</contents>
          </text>
        </annots>
      </xfdf>>`);
      // blurring so we don't have a blinking text cursor causing screenshot test to fail
      (document.querySelector('.reply-area-container > div.reply-area > .comment-textarea .ql-editor') as HTMLElement).blur();
    });

    await page.waitFor(1000);

    expect(await notePanel.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: 'note-panel-scrolling-when-added',
    });
  });

  it('Buttons should be disabled if there is nothing to persist', async () => {
    await page.waitFor(Timeouts.PDF_PRIME_DOCUMENT);

    const instance = await result.waitForInstance();

    await instance('setToolMode', 'AnnotationCreateSticky');
    const pageContainer = await result.iframe.$('#pageContainer1');
    const { x, y } = await pageContainer.boundingBox();
    await page.mouse.click(x + 100, y + 20);

    await page.waitFor(1000);

    const saveButton = await result.iframe.$('.save-button');
    expect(await saveButton.evaluate((element) => element.classList.contains('disabled'))).toBeTruthy();

    await result.iframe.focus('div.edit-content .ql-editor');
    await page.keyboard.type('Some content');

    await page.waitFor(500);

    expect(await saveButton.evaluate((element) => !element.classList.contains('disabled'))).toBeTruthy();

    await result.iframe.$eval( '.save-button', (element) => element.click());

    await page.waitFor(1000);

    const replyButton = await result.iframe.$('.reply-button');
    expect(await replyButton.evaluate((element) => element.classList.contains('disabled'))).toBeTruthy();

    await result.iframe.focus('form.reply-area-container .ql-editor');
    await page.keyboard.type('Some reply');

    await page.waitFor(500);

    expect(await replyButton.evaluate((element) => !element.classList.contains('disabled'))).toBeTruthy();
  });

  it('should be able enable and disable virtualized list', async () => {
    const instance = await result.waitForInstance();

    await instance('loadDocument', '/test-files/VirtualizedAnnotTest.pdf');
    await result.waitForWVEvent('annotationsLoaded');

    instance('openElement', 'notesPanel');
    await page.waitFor(500);

    const annotCount = await (result.iframe as Frame).evaluate(async () => {
      return window.instance.Core.documentViewer.getAnnotationManager().getAnnotationsList().filter((a) => !a.InReplyTo && a.Listable).length;
    });

    const noteEleCount = await (result.iframe as Frame).evaluate(async () => {
      return Array.from(document.querySelectorAll('.Note')).length;
    });

    await page.waitFor(500);
    expect(annotCount).toBeGreaterThan(noteEleCount);

    await (result.iframe as Frame).evaluate(async () => {
      window.instance.UI.disableFeatures(window.instance.UI.Feature.NotesPanelVirtualizedList);
    });

    await page.waitFor(1000);

    const nonVirtualListNoteEleCount = await (result.iframe as Frame).evaluate(async () => {
      return Array.from(document.querySelectorAll('.Note')).length;
    });

    expect(annotCount).toEqual(nonVirtualListNoteEleCount);

    await (result.iframe as Frame).evaluate(async () => {
      window.instance.UI.enableFeatures(window.instance.UI.Feature.NotesPanelVirtualizedList);
    });

    await page.waitFor(1000);

    const virtualNoteEleCount = await (result.iframe as Frame).evaluate(async () => {
      return Array.from(document.querySelectorAll('.Note')).length;
    });

    expect(virtualNoteEleCount).toEqual(noteEleCount);
  });

  it('should update row positions when changing sort strategies', async () => {
    const instance = await result.waitForInstance();

    await instance('loadDocument', '/test-files/VirtualizedAnnotTest.pdf');
    await result.waitForWVEvent('annotationsLoaded');

    instance('openElement', 'notesPanel');
    await page.waitFor(500);

    const notesTopStyle = await (result.iframe as Frame).evaluate(async () => {
      return  (Array.from(document.querySelectorAll('.virtualized-notes-container .ReactVirtualized__Grid__innerScrollContainer > div')) as Array<HTMLElement>).map((a) => a.style.top);
    });

    await (result.iframe as Frame).evaluate(async () => {
      (document.querySelector('button[data-element="dropdown-item-modifiedDate"]') as HTMLElement).click();
    });

    await page.waitFor(1000);

    const notesTopStyleAfter = await (result.iframe as Frame).evaluate(async () => {
      return  (Array.from(document.querySelectorAll('.virtualized-notes-container .ReactVirtualized__Grid__innerScrollContainer > div')) as Array<HTMLElement>).map((a) => a.style.top);
    });

    // we expect that "top" of some rows will change when we go from "position" to "time" sorting
    const notesToCompare = Math.min(notesTopStyle.length, notesTopStyleAfter.length);
    let doesPositionsChange = false;

    for (let i = 0; i < notesToCompare; i++) {
      if (notesTopStyle[i] !== notesTopStyleAfter[i]) {
        doesPositionsChange = true;
        break;
      }
    }

    expect(doesPositionsChange).toEqual(true);
  });

  it('should be able resize when selection change for virtualizedList', async () => {
    const instance = await result.waitForInstance();

    await instance('loadDocument', '/test-files/VirtualizedAnnotTest.pdf');
    await result.waitForWVEvent('annotationsLoaded');

    instance('openElement', 'notesPanel');
    await page.waitFor(500);

    const annotIDToSelect = await (result.iframe as Frame).evaluate(async () => {
      const annotManager = window.instance.docViewer.getAnnotationManager();
      const annotList = annotManager.getAnnotationsList();

      const replyCount = annotList.filter((a) => a.PageNumber === 2 && a.InReplyTo).reduce((cur, val) => {
        cur[val.InReplyTo] = cur[val.InReplyTo] ? cur[val.InReplyTo] + 1 : 1;
        return cur;
      }, {});

      const annotIDToSelect = Object.entries(replyCount).sort((a, b) => b[1] - a[1])[0][0];
      annotManager.selectAnnotation(annotManager.getAnnotationById(annotIDToSelect));
      return annotIDToSelect;
    });

    await page.waitFor(1000);

    const selectedHeight = await (result.iframe as Frame).evaluate(async (id) => {
      return document.querySelector(`#note_${id}`).getBoundingClientRect().height;
    }, annotIDToSelect);

    const notePanel = await result.iframe.$('.NotesPanel .ReactVirtualized__Grid');
    // want selected annotation to be removed from DOM
    await notePanel.evaluate((node) => node.scrollTop = 5000);

    await (result.iframe as Frame).evaluate(async () => {
      const annotManager = window.instance.docViewer.getAnnotationManager();
      const annotList = annotManager.getAnnotationsList();

      annotManager.deselectAllAnnotations();
      const annot = annotList.filter((a) => a.PageNumber === 23 && !a.InReplyTo)[0];
      annotManager.selectAnnotation(annot);
    });

    await page.waitFor(1000);

    // scroll back to previous selected annotion
    await notePanel.evaluate((node) => node.scrollTop = 0);
    await page.waitFor(1000);

    const deselectedHeight = await (result.iframe as Frame).evaluate(async (id) => {
      return document.querySelector(`#note_${id}`).getBoundingClientRect().height;
    }, annotIDToSelect);

    expect(selectedHeight).not.toEqual(deselectedHeight);
  });

  it('should be able to handle duplicate Ids', async () => {
    const instance = await result.waitForInstance();

    await instance('loadDocument', '/test-files/demo-annotated.pdf');
    await result.waitForWVEvent('annotationsLoaded');

    instance('openElement', 'notesPanel');
    await page.waitFor(500);

    // import annotation with duplicate IDs on different pages
    await (result.iframe as Frame).evaluate(async () => {
      await window.instance.Core.documentViewer.getAnnotationManager().importAnnotations(`<?xml version="1.0" encoding="UTF-8"?>
      <xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
        <pdf-info xmlns="http://www.pdftron.com/pdfinfo" version="2" import-version="3"/>
        <fields/>
        <annots>
		    <ink width="5.39018" color="#E44234" creationdate="D:20191108141059-08'00'" flags="print" date="D:20191108141102-08'00'" name="aa9d15ae-46bd-f5df-9247-3c0d18c22959" page="5" rect="333.745,293.745,401.315,416.845" subject="FreeHand" title="Guest">
			<popup flags="print,nozoom,norotate" open="no" page="5" rect="612,299.65,816,413.65"/>
			<inklist>
				<gesture>352.94,413.65;355.76,411.76;361.41,408;364.24,406.12;366.12,405.18;367.06,403.29;368,402.35;369.88,399.53;375.53,392.94;379.29,389.18;382.12,386.35;384,382.59;385.88,379.76;387.76,377.88;389.65,374.12;390.59,372.24;391.53,371.29;392.47,367.53;394.35,364.71;395.29,360.94;396.24,358.12;397.18,354.35;397.18,350.59;397.18,348.71;398.12,348.71;398.12,347.76;397.18,344;396.24,342.12;394.35,339.29;392.47,337.41;390.59,335.53;390.59,334.59;389.65,334.59;388.71,334.59;385.88,331.76;383.06,328.94;380.24,327.06;376.47,324.24;375.53,323.29;370.82,320.47;366.12,316.71;363.29,313.88;359.53,311.06;358.59,310.12;355.76,308.24;352.94,307.29;350.12,305.41;348.24,303.53;343.53,300.71;341.65,298.82;338.82,296.94;336.94,296.94</gesture>
			</inklist>
			<apref y="416.845" x="333.745" gennum="0" objnum="227"/>
		</ink>
    <highlight color="#B54800" creationdate="D:20191108142144-08'00'" flags="print" date="D:20191108142245-08'00'" name="689c80ad-d18e-73d6-66c5-79bde33a1d3c" page="5" coords="36,311.48,96.7,311.48,36,293.88,96.7,293.88" rect="36,293.884,96.704,311.482" subject="Highlight" title="Guest">
			<popup flags="print,nozoom,norotate" open="no" page="5" rect="612,197.48,816,311.48"/>
			<contents>ADAM PEZ</contents>
			<apref blend-mode="multiply" y="311.482" x="36" gennum="0" objnum="228"/>
		</highlight>
		<square width="2.4504" color="#FF8D00" creationdate="D:20191108142201-08'00'" flags="print" date="D:20191108142233-08'00'" name="a698eb86-1317-870f-cd87-cbf2607b4e04" page="5" rect="280.471,25.8824,595.765,268.706" subject="Rectangle" title="Guest">
				<popup flags="print,nozoom,norotate" open="no" page="5" rect="612,154.706,816,268.706"/>
			</square>
		<text page="5" rect="280.471,237.70600000000002,311.471,268.706" color="#FFFF00" flags="hidden,print,nozoom,norotate" name="3841c575-9fcf-05c3-4fec-7c4d3e94a5df" title="Guest" subject="Sticky Note" date="D:20210513141119-07'00'" creationdate="D:20210513141119-07'00'" inreplyto="a698eb86-1317-870f-cd87-cbf2607b4e04" icon="Comment" state="Accepted" statemodel="Review">
		  <contents>Accepted set by Guest</contents>
		</text>
		<text page="5" rect="36,280.482,67,311.482" color="#FFFF00" flags="hidden,print,nozoom,norotate" name="d050949f-f7c1-dd1c-ee98-d00539af16bc" title="Guest" subject="Sticky Note" date="D:20210513141123-07'00'" creationdate="D:20210513141123-07'00'" inreplyto="689c80ad-d18e-73d6-66c5-79bde33a1d3c" icon="Comment" state="Accepted" statemodel="Review">
		  <contents>Accepted set by Guest</contents>
		</text>
		<text page="5" rect="333.745,385.845,364.745,416.845" color="#FFFF00" flags="hidden,print,nozoom,norotate" name="6720505b-68f7-e0ad-156c-fbbb22291be9" title="Guest" subject="Sticky Note" date="D:20210513141126-07'00'" creationdate="D:20210513141126-07'00'" inreplyto="aa9d15ae-46bd-f5df-9247-3c0d18c22959" icon="Comment" state="Accepted" statemodel="Review">
		  <contents>Accepted set by Guest</contents>
		</text
        </annots>
        <pages>
          <defmtx matrix="1,0,0,-1,0,792"/>
        </pages>
      </xfdf>`);

      (document.querySelector('button[data-element="dropdown-item-modifiedDate"]') as HTMLElement).click();
    });

    await page.waitFor(500);
    await (result.iframe as Frame).evaluate(async () => {
      (document.querySelector('button[data-element="dropdown-item-position"]') as HTMLElement).click();
    });

    await page.waitFor(500);
    await (result.iframe as Frame).evaluate(async () => {
      (document.querySelector('button[data-element="dropdown-item-modifiedDate"]') as HTMLElement).click();
    });

    await page.waitFor(500);
    await (result.iframe as Frame).evaluate(async () => {
      (document.querySelector('button[data-element="dropdown-item-position"]') as HTMLElement).click();
    });

    const duplicateCount = await (result.iframe as Frame).evaluate(async () => {
      return document.querySelectorAll('#note_a698eb86-1317-870f-cd87-cbf2607b4e04').length;
    });

    expect(duplicateCount).toEqual(2);

    // Test disabling "sortContainer" data element
    const sortContainer = await result.iframe.$('[data-element=sortContainer]');
    expect(sortContainer).not.toBe(null);
    await instance('disableElements', ['sortContainer']);

    const sortContainer2 = await result.iframe.$('[data-element=sortContainer]');
    expect(sortContainer2).toBe(null);
  });

  it(
    'should have a comment with an anchor tag that captures the prefix "https://" and trailing slash',
    async () => {
      const instance = await result.waitForInstance();

      await instance('loadDocument', '/test-files/autolinker-prefix-and-trailing-slash.pdf');
      await result.waitForWVEvent('annotationsLoaded');

      instance('openElement', 'notesPanel');
      await page.waitFor(500);

      const hrefFromAnchor = await (result.iframe as Frame).evaluate(async () => {
        return String(document.querySelectorAll('.Note')[0].getElementsByTagName('a')[0].getAttribute('href'));
      });

      await page.waitFor(500);
      expect(hrefFromAnchor).toBe('https://www.pdftron.com/');
    }
  );

  it(
    'should continue to render the comment by Justin if Sally is filtered and replies are included',
    async () => {
      const instance = await result.waitForInstance();

      await instance('loadDocument', '/test-files/filter-by-comment-replies.pdf');
      await result.waitForWVEvent('annotationsLoaded');

      instance('openElement', 'notesPanel');
      await page.waitFor(500);
      instance('openElement', 'filterModal');
      await page.waitFor(500);

      await (result.iframe as Frame).evaluate(async () => {
        const sallyCheckbox = document.getElementById('Sally');
        sallyCheckbox.click();
        return;
      });

      await (result.iframe as Frame).evaluate(async () => {
        const searchForApplyBtn = document.getElementsByClassName('filter-annot-apply');
        const applyBtn = searchForApplyBtn[0] as HTMLButtonElement;
        applyBtn.click();
        return;
      });

      let noteEleCount = await (result.iframe as Frame).evaluate(async () => {
        return Array.from(document.querySelectorAll('.Note')).length;
      });

      await page.waitFor(500);
      expect(noteEleCount).toBe(1);

      instance('openElement', 'filterModal');
      await page.waitFor(500);

      await (result.iframe as Frame).evaluate(async () => {
        const includeRepliesCheckbox = document.getElementById(
          'filter-annot-modal-include-replies'
        );
        // Turn off Including Replies
        includeRepliesCheckbox.click();
        const searchForApplyBtn = document.getElementsByClassName('filter-annot-apply');
        const applyBtn = searchForApplyBtn[0] as HTMLButtonElement;
        applyBtn.click();
        return;
      });

      noteEleCount = await (result.iframe as Frame).evaluate(async () => {
        return Array.from(document.querySelectorAll('.Note')).length;
      });

      await page.waitFor(500);
      expect(noteEleCount).toBe(0);
    }
  );

  it('should add comment note by only clicking Enter after call enableNoteSubmissionWithEnter', async () => {
    await page.waitFor(Timeouts.PDF_PRIME_DOCUMENT);

    const instance = await result.waitForInstance();

    await instance('setToolMode', 'AnnotationCreateSticky');
    const pageContainer = await result.iframe.$('#pageContainer1');
    const { x, y } = await pageContainer.boundingBox();
    await page.mouse.click(x + 100, y + 20);

    await page.waitFor(1000);

    await result.iframe.focus('div.edit-content .ql-editor');
    await page.keyboard.type('Some content');

    await page.waitFor(500);

    await page.keyboard.down('Enter');

    const noteSubmissionWithEnterNotEnableCount = await (result.iframe as Frame).evaluate(async () => {
      return Array.from(document.querySelectorAll('.NoteContent .container')).length;
    });

    expect(noteSubmissionWithEnterNotEnableCount).toBe(0);

    // After call enableNoteSubmissionWithEnter API, it will be able to add the note by clicking Enter
    await instance('enableNoteSubmissionWithEnter');
    await page.waitFor(2000);

    await result.iframe.focus('div.edit-content .ql-editor');
    await page.keyboard.down('Enter');

    const noteSubmissionWithEnterEnableCount = await (result.iframe as Frame).evaluate(async () => {
      return Array.from(document.querySelectorAll('.NoteContent .container')).length;
    });

    expect(noteSubmissionWithEnterEnableCount).toBe(1);
    await instance('disableNoteSubmissionWithEnter');
    await page.waitFor(2000);
  });

  it.skip('should use correct icon for annotation comments', async () => {
    const { iframe, waitForWVEvent, waitForInstance } = await loadViewerSample('viewing/viewing');

    const instance = await waitForInstance();
    await waitForWVEvent('documentLoaded');
    await iframe.evaluate(async () => {
      const stampAnnot = new window.Annotations.StampAnnotation();
      stampAnnot.PageNumber = 1;
      stampAnnot.X = 100;
      stampAnnot.Y = 250;
      stampAnnot.Width = 275;
      stampAnnot.Height = 40;
      const keepAsSVG = false;
      const dd = 'data:image/png;base64,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';
      await stampAnnot.setImageData(dd, keepAsSVG);
      const annotationManager = window.instance.docViewer.getAnnotationManager();
      stampAnnot.Author = annotationManager.getCurrentUser();
      window.instance.Core.documentViewer.getAnnotationManager().addAnnotation(stampAnnot);
      window.instance.Core.documentViewer.getAnnotationManager().redrawAnnotation(stampAnnot);
    });

    await page.waitFor(Timeouts.WIDGETS_IN_DOM);
    await instance('openElement', 'notesPanel');
    await page.waitFor(2000);
    const notesPanelContainer = await iframe.$('.NoteContent .type-icon-container');

    const image0 = await notesPanelContainer.screenshot();
    expect(image0).toMatchImageSnapshot({
      customSnapshotIdentifier: 'image-stamp-annotation-icon',
    });
  });

  it('should be able to disable the collapse of the Notes Panel text and show the truncate text', async () => {
    const instance = await result.waitForInstance();

    await instance('loadDocument', '/test-files/VirtualizedAnnotTest.pdf');
    await result.waitForWVEvent('annotationsLoaded');

    instance('openElement', 'notesPanel');
    await page.waitFor(500);

    const moreButtonSelector = '.virtualized-notes-container .ReactVirtualized__Grid__innerScrollContainer > div > .note-wrapper .note-text-preview .note-text-preview-prompt';
   
    // The collapse of text is enable so the button with 'more' label should be visible
    const showMoreTextButton = await result.iframe.$(moreButtonSelector);
    expect(await showMoreTextButton.evaluate((node) => node.innerHTML)).toBe('...more');

    await (result.iframe as Frame).evaluate(async () => {
      window.instance.UI.NotesPanel.disableTextCollapse();
    });
    
    instance('closeElements', ['notesPanel']);
    await page.waitFor(500);

    instance('openElement', 'notesPanel');
    await page.waitFor(500);
    
    // After disable the collapse of texts feature, the 'more' button should not be visible
    expect(await showMoreTextButton.evaluate((node) => node)).toBeFalsy();
  });

  it('should add a note with mentions active and not crash', async () => {
    const instance = await result.waitForInstance();

    await (result.iframe as Frame).evaluate(async () => {
      const userData = [
        {
          value: 'John Doe', // required property
          id: 'johndoe@gmail.com', // optional property
          email: 'johndoe@gmail.com', // optional property
        },
        {
          value: 'Jane Doe',
          id: 'janedoe@gmail.com',
          email: 'janedoe@gmail.com'
        },
        {
          value: 'Random Name',
          id: 'userID1',
          email: 'verydifferentemail@gmail.com'
        },
      ];
      
      instance.UI.mentions.setUserData(userData);
    });
    
    await instance('setToolMode', 'AnnotationCreateSticky');
    const pageContainer = await result.iframe.$('#pageContainer1');
    const { x, y } = await pageContainer.boundingBox();
    await page.mouse.click(x + 100, y + 20);

    await page.waitFor(1000);

    const annotCount = await (result.iframe as Frame).evaluate(async () => {
      return window.instance.Core.documentViewer.getAnnotationManager().getAnnotationsList().length;
    });

    expect(annotCount).toBe(1);
  });
});
