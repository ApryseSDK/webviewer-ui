import { loadViewerSample } from '../../playwright-utils';
import { expect, test } from '@playwright/test';

test.describe('Toolbar group', () => {
  test('Should change to parent toolbar group after changing tools', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');
    await waitForInstance();
    await page.waitForTimeout(5000);
    await iframe.evaluate(async () => {
      const { UI, Core } = window.instance;

      UI.setToolbarGroup(UI.ToolbarGroup.SHAPES);

      Core.documentViewer.setToolMode(Core.documentViewer.getTool(Core.Tools.ToolNames.STICKY));
    });

    const ribbons = await iframe.$('[data-element=ribbons]');

    expect(await ribbons.screenshot()).toMatchSnapshot(['toolbar-group', 'ribbon-changes-with-tool.png']);
  });

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
      const enabledButtons = [
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
        const insertHeader = header.getHeader('toolbarGroup-Insert');
        const originalInsertHeaderItems = insertHeader.getItems();
        const spacer = { type: 'spacer' };
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

  test('should be able to show correct name after creating multiple toolbargroup', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');
    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    await iframe.evaluate(async () => {
      const { UI } = window.instance;
      await UI.createToolbarGroup({
        name: 'testGroup1',
        dataElementSuffix: 'Test Group 1',
        children: [
          {
            type: 'spacer'
          },
          {
            type: 'toolGroupButton',
            toolGroup: 'freeHandTools',
            dataElement: 'freeHandToolGroupButton',
            title: 'annotation.freehand'
          },
        ]
      });
      await UI.createToolbarGroup({
        name: 'testGroup2',
        dataElementSuffix: 'Test Group 2',
        children: [
          {
            type: 'spacer'
          },
          {
            type: 'toolGroupButton',
            toolGroup: 'freeHandTools',
            dataElement: 'freeHandToolGroupButton',
            title: 'annotation.freehand'
          },
        ]
      });
    });
    await instance('setToolbarGroup', 'toolbarGroup-testGroup1');
    const testGroup1 = await iframe!.$('[data-element="toolbarGroup-Test Group 1"]');
    const testGroup2 = await iframe?.$('[data-element="toolbarGroup-Test Group 2"]');
    expect(await testGroup1.evaluate((input) => input.innerHTML)).toBe('testGroup1');
    expect(await testGroup2.evaluate((input) => input.innerHTML)).toBe('testGroup2');
  });

  test('If we disable a toolbar group that is currently active, we should switch out of it', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');
    await waitForInstance();
    await page.waitForTimeout(5000);
    await iframe.evaluate(async () => {
      const { UI } = window.instance;

      UI.setToolbarGroup(UI.ToolbarGroup.SHAPES);

      // Disable a number of toolbar groups, one of which is the currently active one
      UI.disableElements([
        UI.ToolbarGroup.VIEW,
        UI.ToolbarGroup.ANNOTATE,
        UI.ToolbarGroup.SHAPES,
        UI.ToolbarGroup.EDIT,
        UI.ToolbarGroup.FILL_AND_SIGN,
        UI.ToolbarGroup.FORMS,
      ]);
    });

    const ribbons = await iframe.$('[data-element=ribbons]');
    const headerToolsContainer = await iframe.$('.HeaderToolsContainer');

    expect(await ribbons.screenshot()).toMatchSnapshot(['toolbar-group', 'ribbon-changes-disabled-groups.png']);
    expect(await headerToolsContainer.screenshot()).toMatchSnapshot(['toolbar-group', 'header-tools-container-disabled-groups.png']);
  });
});