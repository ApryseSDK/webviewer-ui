import { loadViewerSample } from '../../utils';

it('should close overlays on click outside WebViewer iframe', async () => {
  const { iframe, waitForInstance, waitForWVEvents } = await loadViewerSample('viewing/viewing');

  const overlays = [
    'viewControlsOverlay',
    'searchOverlay',
    'menuOverlay',
    'zoomOverlay',
    'toolsOverlay',
    'stampOverlay',
    'signatureOverlay',
    'measurementOverlay'
  ];

  const instance = await waitForInstance();
  await instance('loadDocument', '/test-files/blank.pdf');
  await waitForWVEvents(['pageComplete', 'annotationsLoaded']);

  // Enable Measurement feature for measurement overlay.
  await iframe.evaluate(async() => {
    window.instance.UI.enableFeatures(window.instance.UI.Feature.Measurement);
  });
  
  const viewerAside = await page.$('body aside');
  const appContainer = await iframe.$('div.App');

  for(let i=0; i<overlays.length; i++) {
    // Set focus on WebViewer iframe.
    await appContainer.click();

    // Assert overlay is closed by default.
    let isElementOpen = await instance('isElementOpen', [overlays[i]]);
    expect(isElementOpen).toBe(false);

    await instance('openElement', overlays[i]);
    isElementOpen = await instance('isElementOpen', [overlays[i]]);
    expect(isElementOpen).toBe(true);

    // Set focus outside iframe (triggers onBlur event).
    // Assert this closes overlay.
    await viewerAside.click();
    isElementOpen = await instance('isElementOpen', [overlays[i]]);
    expect(isElementOpen).toBe(false);
  }
});

it('should close overlays when document unloads', async () => {
  const { iframe, waitForInstance, waitForWVEvents } = await loadViewerSample('viewing/viewing');

  const overlays = [
    'viewControlsOverlay',
    'searchOverlay',
    'menuOverlay',
    'zoomOverlay',
    'toolsOverlay',
    'stampOverlay',
    'signatureOverlay',
    'measurementOverlay'
  ];

  const instance = await waitForInstance();
  await instance('loadDocument', '/test-files/blank.pdf');
  await waitForWVEvents(['pageComplete', 'annotationsLoaded']);

  // Enable Measurement feature for measurement overlay.
  await iframe.evaluate(async() => {
    window.instance.UI.enableFeatures(window.instance.UI.Feature.Measurement);
  });

  for(let i=0; i<overlays.length; i++) {
    // Assert overlay is closed by default.
    let isElementOpen = await instance('isElementOpen', [overlays[i]]);
    expect(isElementOpen).toBe(false);
  
    // Open overlay dropdown.
    await instance('openElements', [overlays[i]]);
    isElementOpen = await instance('isElementOpen', [overlays[i]]);
    expect(isElementOpen).toBe(true);
    
    // Load new document.
    await instance('loadDocument', '/test-files/blank.pdf');
    await waitForWVEvents(['pageComplete', 'annotationsLoaded']);
    isElementOpen = await instance('isElementOpen', [overlays[i]]);
    expect(isElementOpen).toBe(false);
  }
});