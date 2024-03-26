import { loadViewerSample } from '../../playwright-utils';
import { expect, test } from '@playwright/test';

test.describe('Accessible Mode Tests', () => {
  test('Should tab into the current page from outside of the document', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'TODO: investigate why this test is flaky on webkit');
    const { iframe, waitForInstance } = await loadViewerSample(page, 'advanced/accessibility');
    const instance = await waitForInstance();
    await page.waitForTimeout(2000);

    await iframe.evaluate(async () => {
      instance.UI.setCurrentPageNumber(9);
    });

    await page.waitForTimeout(1000);

    expect(await instance('getCurrentPageNumber')).toBe(9);

    await iframe.click('[data-element="toggleNotesButton"]');

    await page.keyboard.press('Tab');

    expect(await instance('getCurrentPageNumber')).toBe(9);
  });

  test('Should go to the correct page when pressing the document button in accessibility popup', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'TODO: investigate why this test is flaky on webkit');
    const { iframe, waitForInstance } = await loadViewerSample(page, 'advanced/accessibility');
    const instance = await waitForInstance();
    await page.waitForTimeout(2000);

    await iframe.evaluate(async () => {
      instance.UI.setCurrentPageNumber(9);
    });

    await page.waitForTimeout(1000);

    expect(await instance('getCurrentPageNumber')).toBe(9);

    // press tab 7 times to get to the accessibility popup
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    await page.keyboard.press('Enter');

    expect(await instance('getCurrentPageNumber')).toBe(9);
  });

  test('Tabs correctly through pages and links', async ({ page, browserName }) => {
    test.skip(browserName === 'firefox' || browserName === 'webkit', 'TODO: investigate why this test fails on webkit and firefox');
    const { iframe, waitForInstance } = await loadViewerSample(page, 'advanced/accessibility');
    const instance = await waitForInstance();
    await page.waitForTimeout(2000);

    // add a link
    await iframe?.evaluate(() => {
      const core = instance.Core;

      const annot = new core.Annotations.RectangleAnnotation({
        PageNumber: 1,
        X: 50,
        Y: 100,
        Width: 150,
        Height: 100,
      });

      core.annotationManager.addAnnotation(annot);
      core.annotationManager.redrawAnnotation(annot);

      const annotations = core.annotationManager.getAnnotationsList();
      const targetAnnotation = annotations[0];

      const newLink = new core.Annotations.Link();
      newLink.PageNumber = targetAnnotation.PageNumber;
      newLink.X = targetAnnotation.X;
      newLink.Y = targetAnnotation.Y;
      newLink.Width = targetAnnotation.Width;
      newLink.Height = targetAnnotation.Height;

      newLink.addAction(
        'U',
        new core.Actions.URI({
          uri: 'https://www.apryse.com',
        }),
      );

      core.annotationManager.addAnnotation(newLink);
      core.annotationManager.groupAnnotations(targetAnnotation, [newLink]);
      core.annotationManager.drawAnnotationsFromList(newLink);
    });

    await page.waitForTimeout(1000);

    // press the document button in the accessibility popup
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // should be on page 1
    expect(await instance('getCurrentPageNumber')).toBe(1);

    // first tab on page 1 should go to link
    await page.keyboard.press('Tab');
    // second tab should go to page 2
    await page.keyboard.press('Tab');

    expect(await instance('getCurrentPageNumber')).toBe(2);
  });
});