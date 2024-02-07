import { loadViewerSample } from '../../playwright-utils';
import { expect, test, Frame } from '@playwright/test';

test.describe('Notes Panel', () => {
  test('Should be able to sort the notes by modified date', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing');
    await waitForInstance();
    await page.waitForTimeout(5000);

    await iframe.click('[data-element=toggleNotesButton]');
    await page.waitForTimeout(1000);

    await iframe.click('[data-element=notesOrderDropdown] .arrow');
    await page.waitForTimeout(500);

    await iframe.click('[data-element=dropdown-item-modifiedDate]');
    await page.waitForTimeout(500);

    const notesPanelContainer = await iframe.$('[data-element=notesPanel]');
    await page.waitForTimeout(1000);

    expect(await notesPanelContainer.screenshot()).toMatchSnapshot(['notes-panel', 'note-panel-order-by-modified.png']);
  });

  test('Ensure the NotesPanel AnnotationNoteConnectorLine does not cause a crash in webviewer when deleting the last page', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing');
    const instance = await waitForInstance();
    await instance('loadDocument', '/test-files/bookmarkSample.pdf');
    await page.waitForTimeout(5000);
    await instance('openElements', ['notesPanel']);
    const { lastPageCount, listAnnotation } = await iframe.evaluate(async () => {
      const document = window.instance.Core.documentViewer.getDocument();
      const annotManager = window.instance.Core.annotationManager;
      const lastPage = document.getPageCount();
      const rectAnnot = new Core.Annotations.RectangleAnnotation();
      rectAnnot.X = 100;
      rectAnnot.Y = 200;
      rectAnnot.Width = 100;
      rectAnnot.Height = 50;
      rectAnnot.PageNumber = lastPage;
      annotManager.addAnnotation(rectAnnot);
      annotManager.selectAnnotation(rectAnnot);
      setTimeout(async () => {
        await document.removePages([lastPage]);
      }, 1000);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return {
        lastPageCount: document.getPageCount(),
        listAnnotation: annotManager.getAnnotationsList()
      };
    });
    expect(lastPageCount).toBe(1);
    expect(listAnnotation.length).toBe(0);
  });

  test('black sticky annotation in dark mode should invert colors', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');
    const instance = await waitForInstance();
    await page.waitForTimeout(5000);
    await instance('openElements', ['notesPanel']);
    await page.waitForTimeout(3000);

    await iframe.evaluate(async () => {
      window.instance.UI.setTheme(window.instance.UI.Theme.DARK);

      const xfdfStringOne = `<?xml version="1.0" encoding="UTF-8" ?><xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve"><pdf-info xmlns="http://www.pdftron.com/pdfinfo" version="2" import-version="4" /><fields /><annots><text color="#000000" creationdate="D:20220426095352-07'00'" flags="print,nozoom,norotate" date="D:20220426095517-07'00'" name="f37d02c2-b919-d34d-85c6-5df4593ed625" icon="Comment" page="0" rect="266.894,649.948,290.894,673.948" subject="Sticky Note" title="prask">
    <popup flags="print,nozoom,norotate" name="897530fa23c65af2-f3e074202396dc1e" open="no" page="0" rect="612,559.948,816,673.948"/>
    <apref y="673.948" x="266.894" gennum="0" objnum="72"/>
    <apref annotation-state="Rollover" y="673.948" x="266.894" gennum="0" objnum="72"/>
  </text></annots><pages><defmtx matrix="1,0,0,-1,0,792" /></pages></xfdf>`;

      await window.instance.Core.annotationManager.importAnnotations(xfdfStringOne);
    });

    await page.waitForTimeout(4000);

    const app = await iframe.$('.App');
    expect(await app.screenshot()).toMatchSnapshot(['notes-panel', 'annotations-in-dark-mode-test.png']);
  });

  test('note panel should use correct icons', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'annotation/custom-annotations');
    const instance = await waitForInstance();
    await instance('loadDocument', '/test-files/blank.pdf');
    await page.waitForTimeout(5000);
    await instance('openElements', ['notesPanel']);
    await page.waitForTimeout(3000);
    await page.click('#custom-triangle-tool');
    await page.click('#custom-stamp');

    // annotations don't get the correct ToolName when WV open files or import XFDF
    // so creating new annotations using tools
    const pageContainer = await iframe.$('#pageContainer1');
    const { x, y } = await pageContainer.boundingBox();

    // add stamp
    await page.mouse.click(x + 200, y + 200);

    // add triangle
    await iframe.click('[data-element="triangleToolButton"]');
    await page.mouse.move(x + 200, y + 250);
    await page.mouse.down();
    await page.mouse.move(x + 300, y + 250);

    await page.mouse.move(x + 300, y + 300);
    await page.mouse.up();

    await instance('setToolMode', 'AnnotationCreateRubberStamp');
    await iframe.click('.signature-row-content');
    await page.mouse.move(x + 350, y + 350);
    await page.mouse.down();
    await page.mouse.up();

    await iframe.evaluate(async () => {
      const { annotationManager, Annotations } = window.instance.Core;
      const stampAnnotation = new Core.Annotations.StampAnnotation();
      stampAnnotation.PageNumber = 1;
      stampAnnotation.X = 100;
      stampAnnotation.Y = 450;
      stampAnnotation.Width = 275;
      stampAnnotation.Height = 40;
      const keepAsSVG = false;
      stampAnnotation.setImageData('data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==', keepAsSVG);
      stampAnnotation.Author = annotationManager.getCurrentUser();

      annotationManager.addAnnotation(stampAnnotation);
      annotationManager.redrawAnnotation(stampAnnotation);
      annotationManager.deselectAllAnnotations();
    });

    await page.waitForTimeout(2000);

    // hide date time so it doesn't fail constantly
    await iframe.evaluate(async () => {
      const nodes = document.querySelectorAll('.date-and-time');
      for (const node of nodes) {
        node.style.opacity = 0;
      }
    });

    await page.waitForTimeout(2000);

    const notesPanel = await iframe.$('.NotesPanel');
    expect(await notesPanel.screenshot()).toMatchSnapshot(['notes-panel', 'note-panel-icons.png']);
  });

  test.skip('should have the Notes replies expanded after called the API to enable the expansion of the comments thread', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing');
    const instance = await waitForInstance();
    await instance('loadDocument', '/test-files/VirtualizedAnnotTest.pdf');
    await page.waitForTimeout(5000);

    await (iframe as Frame).evaluate(async () => {
      window.instance.UI.NotesPanel.enableAutoExpandCommentThread();
    });

    await instance('openElements', ['notesPanel']);

    let firstAnnotationReply = await (iframe as Frame).evaluate(async () => {
      return String(document.querySelectorAll('.Note')[0]
        .getElementsByClassName('replies')[0]
        .getElementsByClassName('reply')[0]
        .getElementsByClassName('preview-comment')[0].innerHTML);
    });

    expect(firstAnnotationReply).toBe(' Sed sed fermentum diam ');
    const notesPanel = await iframe.$('.NotesPanel');
    expect(await notesPanel.screenshot()).toMatchSnapshot(['notes-panel', 'note-panel-replies-expanded.png']);

    await instance('closeElements', ['notesPanel']);

    await (iframe as Frame).evaluate(async () => {
      window.instance.UI.NotesPanel.disableAutoExpandCommentThread();
    });

    await instance('openElements', ['notesPanel']);

    firstAnnotationReply = await (iframe as Frame).evaluate(async () => {
      return String(document.querySelectorAll('.Note')[0].getElementsByClassName('replies')[0]);
    });

    expect(firstAnnotationReply).toBe('undefined');
  });

  test('Should overwrite default header after calling UI.NotesPanel.setCustomHeader()', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');
    const instance = await waitForInstance();

    await (iframe as Frame).evaluate(async () => {
      function customHeaderRenderFunction(notes) {
        const div = document.createElement('div');
        div.style.margin = '20px 0';

        const header = document.createElement('h2');
        header.className = 'custom-header-h2';
        header.innerHTML = 'Custom header!';
        div.appendChild(header);

        const subheader = document.createElement('h3');
        subheader.className = 'custom-header-h3';
        subheader.innerHTML = `Number of comments: ${notes.length}`;
        div.appendChild(subheader);

        const button = document.createElement('button');
        button.className = 'custom-header-button';
        button.innerHTML = 'Custom button';
        div.appendChild(button);

        return div;
      }

      window.instance.UI.NotesPanel.setCustomHeader({
        overwriteDefaultHeader: true,
        render: customHeaderRenderFunction
      });
    });

    await instance('openElements', ['notesPanel']);
    await page.waitForTimeout(2000);

    const customElements = await (iframe as Frame).evaluate(async () => {
      return {
        heading2: document.querySelector('h2.custom-header-h2')?.innerHTML,
        heading3: document.querySelector('h3.custom-header-h3')?.innerHTML,
        button: document.querySelector('button.custom-header-button')?.innerHTML,
        defaultHeader: document.querySelector('div[data-element="notesPanelHeader"]')
      };
    });

    expect(customElements).toBeDefined;
    expect(customElements.heading2).toBe('Custom header!');
    expect(customElements.heading3).toBe('Number of comments: 0');
    expect(customElements.button).toBe('Custom button');
    expect(customElements.defaultHeader).toBeNull;
  });

  test('Should prepend custom header to default header after calling UI.NotesPanel.setCustomHeader()', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');
    const instance = await waitForInstance();

    await (iframe as Frame).evaluate(async () => {
      function customHeaderRenderFunction(notes) {
        const div = document.createElement('div');
        div.style.margin = '20px 0';

        const header = document.createElement('h2');
        header.className = 'custom-header-h2';
        header.innerHTML = 'Custom header!';
        div.appendChild(header);

        const subheader = document.createElement('h3');
        subheader.className = 'custom-header-h3';
        subheader.innerHTML = `Number of comments: ${notes.length}`;
        div.appendChild(subheader);

        const button = document.createElement('button');
        button.className = 'custom-header-button';
        button.innerHTML = 'Custom button';
        div.appendChild(button);

        return div;
      }

      window.instance.UI.NotesPanel.setCustomHeader({
        render: customHeaderRenderFunction
      });
    });

    await instance('openElements', ['notesPanel']);
    await page.waitForTimeout(2000);

    const customElements = await (iframe as Frame).evaluate(async () => {
      return {
        heading2: document.querySelector('h2.custom-header-h2')?.innerHTML,
        heading3: document.querySelector('h3.custom-header-h3')?.innerHTML,
        button: document.querySelector('button.custom-header-button')?.innerHTML,
        defaultHeader: document.querySelector('div[data-element="notesPanelHeader"]')?.innerHTML,
      };
    });

    expect(customElements).toBeDefined;
    expect(customElements.heading2).toBe('Custom header!');
    expect(customElements.heading3).toBe('Number of comments: 0');
    expect(customElements.button).toBe('Custom button');

    // For some reason, even if defaultHeader is null or undefined, the test
    // still passes if we check if header is defined. So instead we check
    // to make sure there is a div in the inner HTML.
    expect(customElements.defaultHeader).toContain('div');
  });


  test('should be able to use dangerouslySetNoteTransformFunction API', async ({ page }) => {
    // should be able to run the sample code for "dangerouslySetNoteTransformFunction" in the API doc

    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing');
    const instance = await waitForInstance();
    await page.waitForTimeout(5000);
    await instance('openElements', ['notesPanel']);
    await page.waitForTimeout(3000);

    await iframe.evaluate(async () => {
      instance.UI.dangerouslySetNoteTransformFunction((wrapper, state, createElement) => {
        // Change the title of every note
        wrapper.querySelector('.author-and-time > .author').innerHTML = 'My custom note title';

        // Add a button that alerts the user when clicked
        const button = createElement('button');
        button.innerHTML = 'Alert me';
        wrapper.appendChild(button);
      });
    });

    await page.waitForTimeout(4000);

    const notesPanelContainer = await iframe.$('[data-element=notesPanel]');
    await page.waitForTimeout(1000);

    expect(await notesPanelContainer.screenshot()).toMatchSnapshot(['notes-panel', 'note-panel-dangerouslySetNoteTransformFunction.png']);
  });

  test('should be able to show detached replies', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');
    const instance = await waitForInstance();

    await iframe.evaluate(async () => {
      const annotationManager = window.instance.Core.annotationManager;
      // This is the default behavior but just in case.
      annotationManager.showDetachedReplies();
    });

    await instance('loadDocument', '/test-files/detached-replies.pdf');
    await page.waitForTimeout(5000);
    await instance('openElements', ['notesPanel']);
    await page.waitForTimeout(3000);

    const notesPanelContainer = await iframe.$('[data-element=notesPanel]');
    expect(await notesPanelContainer.screenshot()).toMatchSnapshot(['notes-panel', 'note-panel-detachedReplies.png']);
  });

  test('should be able to hide detached replies', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');
    const instance = await waitForInstance();

    await iframe.evaluate(async () => {
      const annotationManager = window.instance.Core.annotationManager;
      annotationManager.hideDetachedReplies();
    });

    await instance('loadDocument', '/test-files/detached-replies.pdf');
    await page.waitForTimeout(5000);
    await instance('openElements', ['notesPanel']);
    await page.waitForTimeout(3000);

    const notesPanelContainer = await iframe.$('[data-element=notesPanel]');
    expect(await notesPanelContainer.screenshot()).toMatchSnapshot(['notes-panel', 'note-panel-detachedRepliesHidden.png']);
  });

  test('should not crash when opening links with a custom timezone set', async ({ page }) => {
    const { iframe, waitForInstance, getTextPosition } = await loadViewerSample(page, 'viewing/viewing');
    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    await instance('setTimezone', 'Europe/London');

    await instance('setToolMode', 'TextSelect');
    const text = await getTextPosition('6 Important');

    // Select the text
    await page.mouse.move(text.x1, text.y1);
    await page.mouse.down();
    await page.mouse.move(text.x2, text.y2);
    await page.mouse.up();

    // Wait for the text selection to finish
    await iframe.waitForSelector('[data-element=textPopup]');
    await iframe.click('[data-element=linkButton]');
    await iframe.waitForSelector('[data-element=URLPanel]');
    await iframe.type('.urlInput', 'www.google.ca');
    await iframe.click('[data-element=linkSubmitButton]');

    await page.waitForTimeout(1000);
    const link = await iframe.$('#pageWidgetContainer1 > div > span');
    expect(link).not.toBeNull();

    await instance('openElements', ['notesPanel']);
    await page.waitForTimeout(2000);

    const notes = await iframe.$$('.Note');
    await notes[1].click();

    const textButton = await iframe.$('.Note > div.group-section > div.text-button');
    await textButton.click();

    const dateString = await (iframe as Frame).evaluate(async () => {
      return document.querySelector('.Note > div.group-section > div.group-child > div > div > div.author-and-date > div > div.author-and-time > div.date-and-num-replies > div')?.innerHTML;
    });

    expect(dateString).toBe('(no date) (Page 1)');
  });

  test('should be able to add a reply without a comment', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');
    const instance = await waitForInstance();
    await page.waitForTimeout(1000);
    await instance('setToolMode', 'AnnotationCreateSticky');
    const pageContainer = await iframe.$('#pageContainer1');
    const { x, y } = await pageContainer.boundingBox();
    await page.mouse.click(x + 100, y + 20);
    await page.waitForTimeout(1000);
    const cancelButton = await iframe.$('.cancel-button');
    await cancelButton?.click();
    await page.waitForTimeout(1000);
    await page.keyboard.type('Adding reply without comment');
    await page.keyboard.down('Control');
    await page.keyboard.down('Enter');
    await page.keyboard.up('Control');
    await page.waitForTimeout(1000);
    // hide date time so it doesn't fail constantly
    await iframe.evaluate(async () => {
      const nodes = document.querySelectorAll('.date-and-time');
      for (const node of nodes) {
        node.style.opacity = 0;
      }
    });
    await page.waitForTimeout(1000);
    const note = await iframe.$('.Note.expanded');
    expect(await note.screenshot()).toMatchSnapshot(['notes-panel', 'note-panel-no-comment.png']);
  });

  // flaky
  test.skip('should update when annotations are selected and unselected', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing');
    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    await instance('openElements', ['notesPanel']);

    const pageContainer1 = await iframe.$('#pageContainer1');
    const { x, y, width, height } = await pageContainer1.boundingBox();

    await page.mouse.move(x, y);
    await page.waitForTimeout(300);
    await page.mouse.down();
    await page.waitForTimeout(300);
    await page.mouse.move(x + width, y + height);
    await page.waitForTimeout(300);
    await page.mouse.up();
    await page.waitForTimeout(200);

    const notesContainer = await iframe.$('.NotesPanel .normal-notes-container');
    expect(await notesContainer.screenshot()).toMatchSnapshot(['notes-panel', 'note-panel-selected-annotations.png']);

    await iframe.evaluate(async () => {
      const annotationManager = window.instance.Core.annotationManager;
      annotationManager.deselectAnnotation(annotationManager.getAnnotationsList().filter((a) => a.PageNumber === 1)[0]);
    });
    await page.waitForTimeout(500);

    expect(await notesContainer.screenshot()).toMatchSnapshot(['notes-panel', 'note-panel-unselected-annotations.png']);

    await iframe.click('.note-wrapper .state-and-overflow input');
    await page.waitForTimeout(200);
    expect(await notesContainer.screenshot()).toMatchSnapshot(['notes-panel', 'note-panel-selected-annotations.png']);

    await iframe.click('.note-wrapper .state-and-overflow input');
    await page.waitForTimeout(200);
    expect(await notesContainer.screenshot()).toMatchSnapshot(['notes-panel', 'note-panel-unselected-annotations.png']);
  });

  test('should be able to select notes without notes panel scrolling to other locations', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');
    const instance = await waitForInstance();
    await instance('loadDocument', '/test-files/VirtualizedAnnotTest.pdf');
    await page.waitForTimeout(5000);

    // open note panel and go to "multi select" mode
    await instance('openElements', ['notesPanel']);
    await page.waitForTimeout(1000);
    await iframe.click('[data-element="multiSelectModeButton"]');
    await page.waitForTimeout(1000);

    // selection annotations on page 1
    await iframe.evaluate(async () => {
      instance.Core.annotationManager.selectAnnotations(instance.Core.annotationManager.getAnnotationsList().filter(a => a.PageNumber === 1));
    });

    // scroll to the bottom of the note panel virtual list
    const notesPanelVirtualList = await iframe.$('.ReactVirtualized__Grid__innerScrollContainer');
    const { x, y } = await notesPanelVirtualList.boundingBox();

    await page.mouse.move(x + 25, y + 50);
    let listSeparators;
    let lastText = '';

    while (lastText !== 'Page 51') {
      await page.mouse.wheel(0, 1000);
      listSeparators = await iframe.$$('.ListSeparator');
      lastText = await listSeparators[listSeparators.length - 1].textContent();
    }

    // select an annotation on the last page
    const annotIDOnPage51 = await iframe.evaluate(async () => {
      return instance.Core.annotationManager.getAnnotationsList().filter(a => a.PageNumber === 51 && !a.InReplyTo)[0].Id;
    });
    const annotOnLastPage = await iframe.$(`#note-multi-select-toggle_${annotIDOnPage51}`);
    await annotOnLastPage?.click();

    await page.waitForTimeout(1000);

    // WV should not scroll
    listSeparators = await iframe.$$('.ListSeparator');
    let lastPageSeparator;

    for (let i = 0; i < listSeparators.length; i++) {
      if ((await listSeparators[i].textContent()) === 'Page 51') {
        lastPageSeparator = listSeparators[i];
        break;
      }
    }

    expect(lastPageSeparator).toBeTruthy();
  });

  test('should disable multiselect controls if document is readonly', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing');
    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    await instance('openElements', ['notesPanel']);

    await iframe.evaluate(async () => {
      instance.Core.annotationManager.promoteUserToAdmin();
      instance.Core.annotationManager.enableReadOnlyMode();
    });

    await page.waitForTimeout(2000);

    await iframe.evaluate(async () => {
      instance.Core.annotationManager.selectAnnotations(instance.Core.annotationManager.getAnnotationsList().filter(a => a.PageNumber === 1));
    });

    const multiselectFooter = await iframe.$('.multi-select-footer');
    expect(await multiselectFooter.screenshot()).toMatchSnapshot(['notes-panel', 'readonly-mode-multiselect-footer.png']);
  });
});