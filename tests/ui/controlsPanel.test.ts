import {loadViewerSample, Timeouts} from '../../utils';
import { MatchImageSnapshotOptions } from "jest-image-snapshot";

it('rotate and delete buttons are shown if the document is not loaded from the webviewer server', async() => {
    const { iframe, waitForInstance, waitForWVEvents } = await loadViewerSample('viewing/viewing');

    const instance = await waitForInstance();
    await waitForWVEvents(['annotationsLoaded', 'pageComplete']);

    await iframe.click('[data-element=leftPanelButton]');

    await page.waitFor(2000);

    const thumbnail = await iframe.$('.Thumbnail.active');

    expect(await thumbnail.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `rotate-and-delete-buttons-visible`
    });
});

it('rotate and delete buttons are hidden if the document is loaded from the webviewer server', async() => {
    const { iframe, waitForInstance, waitForWVEvents } = await loadViewerSample('viewing/viewing-with-webviewer-server');

    const instance = await waitForInstance();
    await waitForWVEvents(['annotationsLoaded', 'pageComplete']);

    await page.waitFor(Timeouts.PDF_PRIME_DOCUMENT);

    await iframe.click('[data-element=leftPanelButton]');

    await page.waitFor(2000);

    const thumbnail = await iframe.$('.Thumbnail.active');

    expect(await thumbnail.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `rotate-and-delete-buttons-hidden`
    });
});