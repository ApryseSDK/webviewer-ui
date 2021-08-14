import { Frame } from 'puppeteer';
import { loadViewerSample, Timeouts } from '../../utils';

const addAndCreateAnnot = (iFrame: Frame, isFreeTextAnnot: boolean, isLockedContents: boolean, noteContent = '', author = '',) => {
  return (iFrame as Frame).evaluate(async(isFreeTextAnnot, isLockedContents, noteContent, author) => {
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
    await  promise;
  }, isFreeTextAnnot, isLockedContents, noteContent, author);
};

const selectAnnotation = (id: string, iframe: Frame) => {
  return (iframe as Frame).evaluate(async(id: string) => {
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

  it.skip('should be able to edit comment for locked content non-free text annotation', async() => {
    await addAndCreateAnnot(result.iframe, false, false, 'some-content');
    const instance = await result.waitForInstance();

    const annotId = await (result.iframe as Frame).evaluate(async() => {
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

  it.skip('should not be able to edit comment for locked content free text annotation', async() => {
    await addAndCreateAnnot(result.iframe, true, true, 'some-content');
    const instance = await result.waitForInstance();

    const annotId = await (result.iframe as Frame).evaluate(async() => {
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
      const annots = window.instance.Core.documentViewer.getAnnotationManager().getAnnotationsList()
        .filter((annot) => annot.Author === 'a');
      return annots[0].Id;
    });

    await (result.iframe as Frame).evaluate(async() => {
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

  it('should be able to scroll to group annotation', async() => {
    const instance = await result.waitForInstance();
    await instance('loadDocument', '/test-files/annots1-rotated-cropped.pdf');
    await result.waitForWVEvent('annotationsLoaded');

    instance('openElement', 'notesPanel');
    await result.iframe.evaluate(async() => {

      const annotManager = window.instance.Core.documentViewer.getAnnotationManager();
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

  it('should be able to scroll to selected annotation for VirtualizedList', async() => {
    const instance = await result.waitForInstance();

    await instance('loadDocument', '/test-files/VirtualizedAnnotTest.pdf');
    await result.waitForWVEvent('annotationsLoaded');

    instance('openElement', 'notesPanel');

    const selectAnnotAndTest = async (index) => {
      let annotId = await (result.iframe as Frame).evaluate(async(index) => {
        const annotManager = window.instance.Core.documentViewer.getAnnotationManager();
        annotManager.deselectAllAnnotations();

        const annots = annotManager.getAnnotationsList().filter(annot => annot instanceof window.Annotations.FreeTextAnnotation);
        annotManager.selectAnnotation(annots[index]);

        return annots[index].Id;
      }, index);

      await page.waitFor(500);

      // check if the note is being rendered in the virtualized list
      // testing like this to try to prevent it from being buggy if scroll is off by a little bit
      const noteContainer = await result.iframe.$(`#note_${annotId}`);
      expect(await noteContainer.evaluate((node) => node.innerHTML)).toBeTruthy();

      let focusedElement = await (result.iframe as Frame).evaluate(async() => {
        return document.activeElement.constructor.name;
      });

      // check if focusing on the textarea, can't think of any other way to tell if there is a blinking text cursor
      expect(focusedElement).toBe("HTMLTextAreaElement");

      const notePanel = await result.iframe.$(`.NotesPanel .ReactVirtualized__Grid`);
      const selectedScrollTop = await notePanel.evaluate((node) => node.scrollTop);

      await (result.iframe as Frame).evaluate(async(index) => {
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

  it('should be able to select text in the note panel', async() => {
    const instance = await result.waitForInstance();

    await instance('loadDocument', '/test-files/demo-annotated.pdf');
    await result.waitForWVEvent('annotationsLoaded');

    instance('openElement', 'notesPanel');
    await page.waitFor(2000);

    const annotNote = await result.iframe.$(`#note_140aed30-b8f5-49f7-374f-b8a7cbd88e17 .container`);
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

    expect(selectedText).toEqual('Great quotes! Do we have any more?');
  });

  it('for VirtualizedList should not scroll, when new comment is added', async() => {
    const instance = await result.waitForInstance();

    await instance('loadDocument', '/test-files/VirtualizedAnnotTest.pdf');
    await result.waitForWVEvent('annotationsLoaded');

    instance('openElement', 'notesPanel');

    await (result.iframe as Frame).evaluate(async() => {
      const annotManager = window.instance.Core.documentViewer.getAnnotationManager();

      const replyList = annotManager.getAnnotationsList().filter(a => a.InReplyTo).map(a => a.InReplyTo);
      const map = replyList.reduce((acc, e) => {
        let nextAcc = {...acc};
        nextAcc[e] = nextAcc[e] ? (nextAcc[e] + 1) : 1;
        return nextAcc;
      }, {});

      const annotIDWithMostReplies = Array.from(Object.entries(map)).sort((a, b) => (b[1] as number) -(a[1] as number))[0][0];
      annotManager.selectAnnotation(annotManager.getAnnotationById(annotIDWithMostReplies));
    });

    await page.waitFor(500);

    const notePanel = await result.iframe.$(`.NotesPanel .ReactVirtualized__Grid`);

    await notePanel.evaluate((node) => {
      // scroll down a bit so that it looking at the "reply" area
      node.scrollTop = node.scrollTop + 300;
      return node.scrollTop;
    });

    await page.waitFor(500);

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
        (document.querySelector('.reply-area-container > textarea') as HTMLElement).blur();
    });

    await page.waitFor(500);

    expect(await notePanel.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: `note-panel-scrolling-when-added`,
    });
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

  it('should be able enable and disable virtualized list', async() => {
    const instance = await result.waitForInstance();

    await instance('loadDocument', '/test-files/VirtualizedAnnotTest.pdf');
    await result.waitForWVEvent('annotationsLoaded');

    instance('openElement', 'notesPanel');
    await page.waitFor(500);

    let annotCount = await (result.iframe as Frame).evaluate(async() => {
      return window.instance.Core.documentViewer.getAnnotationManager().getAnnotationsList().filter(a => !a.InReplyTo && a.Listable).length;
    });

    let noteEleCount = await (result.iframe as Frame).evaluate(async() => {
      return Array.from(document.querySelectorAll('.Note')).length;
    });

    await page.waitFor(500);
    expect(annotCount).toBeGreaterThan(noteEleCount);

    await (result.iframe as Frame).evaluate(async() => {
      window.instance.UI.disableFeatures(window.instance.UI.Feature.NotesPanelVirtualizedList);
    });

    await page.waitFor(1000);

    let nonVirtualListNoteEleCount = await (result.iframe as Frame).evaluate(async() => {
      return Array.from(document.querySelectorAll('.Note')).length;
    });

    expect(annotCount).toEqual(nonVirtualListNoteEleCount);

    await (result.iframe as Frame).evaluate(async() => {
      window.instance.UI.enableFeatures(window.instance.UI.Feature.NotesPanelVirtualizedList);
    });

    let virtualNoteEleCount = await (result.iframe as Frame).evaluate(async() => {
      return Array.from(document.querySelectorAll('.Note')).length;
    });

    expect(virtualNoteEleCount).toEqual(noteEleCount);
  });

  it('should update row positions when changing sort strategies', async() => {
    const instance = await result.waitForInstance();

    await instance('loadDocument', '/test-files/VirtualizedAnnotTest.pdf');
    await result.waitForWVEvent('annotationsLoaded');

    instance('openElement', 'notesPanel');
    await page.waitFor(500);

    const notesTopStyle = await (result.iframe as Frame).evaluate(async() => {
      return  (Array.from(document.querySelectorAll('.virtualized-notes-container .ReactVirtualized__Grid__innerScrollContainer > div')) as Array<HTMLElement>).map((a) => a.style.top);
    });

    await (result.iframe as Frame).evaluate(async() => {
      (document.querySelector('button[data-element="dropdown-item-time"]') as HTMLElement).click();
    });

    await page.waitFor(1000);

    const notesTopStyleAfter = await (result.iframe as Frame).evaluate(async() => {
      return  (Array.from(document.querySelectorAll('.virtualized-notes-container .ReactVirtualized__Grid__innerScrollContainer > div')) as Array<HTMLElement>).map((a) => a.style.top);
    });

    // we expect that "top" of some rows will change when we go from "position" to "time" sorting
    const notesToCompare = Math.min(notesTopStyle.length, notesTopStyleAfter.length);
    let doesPositionsChange = false;

    for(let i = 0; i < notesToCompare; i++) {
      if (notesTopStyle[i] !== notesTopStyleAfter[i]) {
        doesPositionsChange = true;
        break;
      }
    }

    expect(doesPositionsChange).toEqual(true);
  });

  it('should be able resize when selection change for virtualizedList', async() => {
    const instance = await result.waitForInstance();

    await instance('loadDocument', '/test-files/VirtualizedAnnotTest.pdf');
    await result.waitForWVEvent('annotationsLoaded');

    instance('openElement', 'notesPanel');
    await page.waitFor(500);

   let annotIDToSelect = await (result.iframe as Frame).evaluate(async() => {
      const annotManager = window.instance.docViewer.getAnnotationManager();
      const annotList = annotManager.getAnnotationsList();

      const replyCount = annotList.filter(a => a.PageNumber === 2 && a.InReplyTo).reduce((cur, val) => {
        cur[val.InReplyTo] = cur[val.InReplyTo] ? cur[val.InReplyTo] + 1 : 1;
        return cur;
      }, {});

      const annotIDToSelect = Object.entries(replyCount).sort((a, b) => b[1] - a[1])[0][0];
      annotManager.selectAnnotation(annotManager.getAnnotationById(annotIDToSelect));
      return annotIDToSelect;
    });

    await page.waitFor(1000);

    let selectedHeight = await (result.iframe as Frame).evaluate(async(id) => {
      return document.querySelector(`#note_${id}`).getBoundingClientRect().height;
    }, annotIDToSelect);

    const notePanel = await result.iframe.$(`.NotesPanel .ReactVirtualized__Grid`);
    // want selected annotation to be removed from DOM
    await notePanel.evaluate((node) => node.scrollTop = 5000);

    await (result.iframe as Frame).evaluate(async() => {
      const annotManager = window.instance.docViewer.getAnnotationManager();
      const annotList = annotManager.getAnnotationsList();

      annotManager.deselectAllAnnotations();
      const annot = annotList.filter(a => a.PageNumber === 23 && !a.InReplyTo)[0];
      annotManager.selectAnnotation(annot);
    });

    await page.waitFor(1000);

    // scroll back to previous selected annotion
    await notePanel.evaluate((node) => node.scrollTop = 0);
    await page.waitFor(1000);

    let deselectedHeight = await (result.iframe as Frame).evaluate(async(id) => {
      return document.querySelector(`#note_${id}`).getBoundingClientRect().height;
    }, annotIDToSelect);

    expect(selectedHeight).not.toEqual(deselectedHeight);
  });

  it('should be able to handle duplicate Ids', async() => {
    const instance = await result.waitForInstance();

    await instance('loadDocument', '/test-files/demo-annotated.pdf');
    await result.waitForWVEvent('annotationsLoaded');

    instance('openElement', 'notesPanel');
    await page.waitFor(500);

    // import annotation with duplicate IDs on different pages
    await (result.iframe as Frame).evaluate(async() => {
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

      (document.querySelector('button[data-element="dropdown-item-time"]') as HTMLElement).click();
    });

    await page.waitFor(500);
    await (result.iframe as Frame).evaluate(async() => {
      (document.querySelector('button[data-element="dropdown-item-position"]') as HTMLElement).click();
    });

    await page.waitFor(500);
    await (result.iframe as Frame).evaluate(async() => {
      (document.querySelector('button[data-element="dropdown-item-time"]') as HTMLElement).click();
    });

    await page.waitFor(500);
    await (result.iframe as Frame).evaluate(async() => {
      (document.querySelector('button[data-element="dropdown-item-position"]') as HTMLElement).click();
    });

    const duplicateCount = await (result.iframe as Frame).evaluate(async() => {
      return document.querySelectorAll('#note_a698eb86-1317-870f-cd87-cbf2607b4e04').length;
    });

    expect(duplicateCount).toEqual(2);
  });

  it(
    'should have a comment with an anchor tag that captures the prefix "https://" and trailing slash',
    async() => {
      const instance = await result.waitForInstance();

      await instance('loadDocument', '/test-files/autolinker-prefix-and-trailing-slash.pdf');
      await result.waitForWVEvent('annotationsLoaded');

      instance('openElement', 'notesPanel');
      await page.waitFor(500);

      const hrefFromAnchor = await (result.iframe as Frame).evaluate(async() => {
        return String(document.querySelectorAll('.Note')[0].getElementsByTagName('a')[0].getAttribute('href'));
      });

      await page.waitFor(500);
      expect(hrefFromAnchor).toBe('https://www.pdftron.com/');
    }
  );

  it(
    'should continue to render the comment by Justin if Sally is filtered and replies are included',
    async() => {
      const instance = await result.waitForInstance();

      await instance('loadDocument', '/test-files/filter-by-comment-replies.pdf');
      await result.waitForWVEvent('annotationsLoaded');

      instance('openElement', 'notesPanel');
      await page.waitFor(500);
      instance('openElement', 'filterModal');
      await page.waitFor(500);

      await (result.iframe as Frame).evaluate(async() => {
        const sallyCheckbox = document.getElementById('Sally');
        sallyCheckbox.click();
        return;
      });

      await (result.iframe as Frame).evaluate(async() => {
        const searchForApplyBtn = document.getElementsByClassName('filter-annot-apply');
        const applyBtn = searchForApplyBtn[0] as HTMLButtonElement;
        applyBtn.click();
        return;
      });

      let noteEleCount = await (result.iframe as Frame).evaluate(async() => {
        return Array.from(document.querySelectorAll('.Note')).length;
      });

      await page.waitFor(500);
      expect(noteEleCount).toBe(1);

      instance('openElement', 'filterModal');
      await page.waitFor(500);

      await (result.iframe as Frame).evaluate(async() => {
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

      noteEleCount = await (result.iframe as Frame).evaluate(async() => {
        return Array.from(document.querySelectorAll('.Note')).length;
      });

      await page.waitFor(500);
      expect(noteEleCount).toBe(0);
    }
  );
});
