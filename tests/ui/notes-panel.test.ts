import { Frame } from 'puppeteer';
import { loadViewerSample } from '../../utils';

it('getSelectedThumbnailPageNumbers should return even if there is only one thumbnail selected', async() => {
  const { iframe, waitForInstance, waitForWVEvents } = await loadViewerSample('viewing/viewing');

  await waitForInstance();
  await waitForWVEvents(['annotationsLoaded', 'pageComplete']);

  await iframe.click('[data-element=toggleNotesButton]');
  await page.waitFor(1000);

  await iframe.click('[data-element=notesOrderDropdown] .down-arrow');
  await page.waitFor(500);

  await iframe.click('[data-element=dropdown-item-modifiedDate]');
  await page.waitFor(500);

  const notesPanelContainer = await iframe.$('[data-element=notesPanel]');
  await page.waitFor(1000);

  expect(await notesPanelContainer.screenshot()).toMatchImageSnapshot({
    customSnapshotIdentifier: 'note-panel-order-by-modified',
  });
});

it('black sticky annotation in dark mode should invert colors', async () => {
  const { iframe, waitForInstance, waitForWVEvent } = await loadViewerSample(
    'viewing/viewing',
  );
  const instance = await waitForInstance();
  await instance('disableElements', ['pageNavOverlay']);
  await instance('loadDocument', '/test-files/blank.pdf');
  await waitForWVEvent('annotationsLoaded');
  await instance('openElements', ['notesPanel']);

  await iframe.evaluate(async () => {
    window.instance.UI.setTheme(window.instance.UI.Theme.DARK);

    const xfdfStringOne = `<?xml version="1.0" encoding="UTF-8" ?><xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve"><pdf-info xmlns="http://www.pdftron.com/pdfinfo" version="2" import-version="4" /><fields /><annots><text color="#000000" creationdate="D:20220426095352-07'00'" flags="print,nozoom,norotate" date="D:20220426095517-07'00'" name="f37d02c2-b919-d34d-85c6-5df4593ed625" icon="Comment" page="0" rect="266.894,649.948,290.894,673.948" subject="Sticky Note" title="prask">
    <popup flags="print,nozoom,norotate" name="897530fa23c65af2-f3e074202396dc1e" open="no" page="0" rect="612,559.948,816,673.948"/>
    <apref y="673.948" x="266.894" gennum="0" objnum="72"/>
    <apref annotation-state="Rollover" y="673.948" x="266.894" gennum="0" objnum="72"/>
  </text></annots><pages><defmtx matrix="1,0,0,-1,0,792" /></pages></xfdf>`;

    const annotManager = window.instance.Core.documentViewer.getAnnotationManager();
    await annotManager.importAnnotations(xfdfStringOne);
  });

  await page.waitFor(4000);

  const app = await iframe.$('.App');
  expect(await app.screenshot()).toMatchImageSnapshot({
    customSnapshotIdentifier: 'annotations-in-dark-mode-test',
  });
});

it('should have the Notes replies expanded after called the API to enable the expansion of the comments thread', async () => {
  const { iframe, waitForInstance, waitForWVEvent } = await loadViewerSample(
    'viewing/viewing',
  );
  const instance = await waitForInstance();
  await instance('loadDocument', '/test-files/VirtualizedAnnotTest.pdf');
  await waitForWVEvent('annotationsLoaded');

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

  await instance('closeElements', ['notesPanel']);

  await (iframe as Frame).evaluate(async () => {
    window.instance.UI.NotesPanel.disableAutoExpandCommentThread();
  });

  await instance('openElements', ['notesPanel']);

  firstAnnotationReply = await (iframe as Frame).evaluate(async () => {
    return String(document.querySelectorAll('.Note')[0].getElementsByClassName('replies')[0]);
  });

  expect(firstAnnotationReply).toBe('undefined');
})