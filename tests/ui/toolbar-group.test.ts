import { ElementHandle } from 'puppeteer';
import { loadViewerSample } from '../../utils';

describe('Test toolbar group Component', () => {
  it('Should create a new toolbar group', async () => {
    const { iframe,  waitForInstance, waitForWVEvents } = await loadViewerSample('viewing/blank');
    const instance = await waitForInstance();
    await waitForWVEvents(['annotationsLoaded']);
    await iframe.evaluate(async () => {
      const { UI } = window.instance;

      UI.setTranslations('en', { 'option.draw': 'Drawing' });

      UI.createToolbarGroup(
        {
          name: 'option.draw',
          dataElementSuffix: 'Draw',
          useDefaultElements: true,
          children: [
            { type: 'toolGroupButton', toolGroup: 'freeHandTools', dataElement: 'freeHandToolGroupButton', title: 'annotation.freehand' },
            { type: 'toolGroupButton', toolGroup: 'ellipseAreaTools', dataElement: 'ellipseAreaToolGroupButton', title: 'annotation.areaMeasurement' },
            { type: 'toolGroupButton', toolGroup: 'rectangleTools', dataElement: 'shapeToolGroupButton', title: 'annotation.rectangle' }
          ] 
        })
    });

    await instance('setToolbarGroup', 'toolbarGroup-Draw');

    const toolbarGroupDraw: ElementHandle<HTMLInputElement> = await iframe.$('[data-element=toolbarGroup-Draw]');
    const freeHandButton: ElementHandle<HTMLInputElement> = await iframe.$('[data-element=freeHandToolGroupButton]');

    expect(await toolbarGroupDraw.evaluate((input) => Object.values(input.classList))).toContain('active');
    expect(await freeHandButton.evaluate((input) => Object.values(input.classList))).toContain('active');
  })
})