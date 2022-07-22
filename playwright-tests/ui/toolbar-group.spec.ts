import { loadViewerSample } from '../../playwright-utils';
import { expect, test } from '@playwright/test';

test.describe('Toolbar group', () => {
  test('Should create a new toolbar group', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');
    const instance = await waitForInstance();
    await page.waitForTimeout(5000);
    await iframe.evaluate(async () => {
      const { UI } = window.instance;

      UI.setTranslations('en', { 'option.draw': 'Drawing' });

      UI.createToolbarGroup({
        name: 'option.draw',
        dataElementSuffix: 'Draw',
        useDefaultElements: true,
        children: [
          { type: 'toolGroupButton', toolGroup: 'freeHandTools', dataElement: 'freeHandToolGroupButton', title: 'annotation.freehand' },
          { type: 'toolGroupButton', toolGroup: 'ellipseAreaTools', dataElement: 'ellipseAreaToolGroupButton', title: 'annotation.areaMeasurement' },
          { type: 'toolGroupButton', toolGroup: 'rectangleTools', dataElement: 'shapeToolGroupButton', title: 'annotation.rectangle' }
        ]
      });
    });

    await instance('setToolbarGroup', 'toolbarGroup-Draw');

    const toolbarGroupDraw = await iframe.$('[data-element=toolbarGroup-Draw]');
    const freeHandButton = await iframe.$('[data-element=freeHandToolGroupButton]');

    expect(await toolbarGroupDraw.evaluate((input) => Object.values(input.classList))).toContain('active');
    expect(await freeHandButton.evaluate((input) => Object.values(input.classList))).toContain('active');
  });

  test('should be able to use setHeaderItems API properly after create a new toolbar group', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');
    const instance = await waitForInstance();
    await page.waitForTimeout(3000);
    
    await iframe.evaluate(async () => {  
       const { UI } = window.instance;
      let enabledCustomHeaderItems;
      let enabledButtons = [
        { type: 'toolGroupButton', toolGroup: 'freeHandTools', dataElement: 'freeHandToolGroupButton', title: 'annotation.freehand' },
        { type: 'toolGroupButton', toolGroup: 'ellipseAreaTools', dataElement: 'ellipseAreaToolGroupButton', title: 'annotation.areaMeasurement' },
      ];

      await UI.createToolbarGroup({
        name: 'testGroup',
        dataElementSuffix: 'newTestGroup',
        useDefaultElements: false,
        children: [{
          type: 'spacer',
        },
        { 
          type: 'toolGroupButton', 
          toolGroup: 'freeHandTools', 
          dataElement: 'freeHandToolGroupButton', 
          title: 'annotation.freehand' 
        },
      ],
      });

      await UI.setHeaderItems((header) => {
        let insertHeader = header.getHeader('toolbarGroup-Insert');
        let originalInsertHeaderItems = insertHeader.getItems();
        let spacer = { type: 'spacer' };
        enabledCustomHeaderItems = [spacer].concat(enabledButtons).concat(originalInsertHeaderItems);
      });
        
      await UI.createToolbarGroup({
        name: 'newCustomGroup',
        dataElementSuffix: 'newCustomGroup',
        useDefaultElements: false,
        children: enabledCustomHeaderItems,
      });
    });

    await instance('setToolbarGroup', 'toolbarGroup-newCustomGroup');
    const newToolbarGroup = await iframe!.$('[data-element=toolbarGroup-newCustomGroup]');
    expect(await newToolbarGroup!.evaluate((input) => Object.values(input.classList))).toContain('active');
  });
});