import { loadViewerSample } from '../../playwright-utils';
import { expect, test } from '@playwright/test';

test.describe('Add Custom Modal test', () => {
  test('should open custom modal', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');
    await waitForInstance();
    await page.waitForTimeout(5000);

    await iframe.evaluate(() => {
      const divInput1 = document.createElement('input');
      divInput1.type = 'text';
      divInput1.id = 'appian_document_name1';
      divInput1.style = 'height: 28px; margin-top: 10px;';

      const divInput2 = document.createElement('input');
      divInput2.type = 'text';
      divInput2.id = 'appian_document_name2';
      divInput2.style = 'height: 28px; margin-top: 10px;';

      const modal = {
        dataElement: 'saveAsDocument',
        header: {
          title: 'Header',
          className: 'myCustomModal-header',
          style: {},
          children: [
            {
              title: 'Cancel',
              className: 'modal-button cancel-form-field-button',
              onClick: () => {
                console.log('ff');
              }
            }],
        },
        body: {
          className: 'myCustomModal-body',
          style: {},
          children: [divInput1, divInput2],
        },
        footer: {
          className: 'myCustomModal-footer footer',
          style: {},
          children: [
            {
              title: 'Cancel',
              button: true,
              style: {},
              className: 'modal-button cancel-form-field-button',
              onClick: () => {
                console.log('ff');
              }
            },
            {
              title: 'OK',
              button: true,
              style: {},
              className: 'modal-button confirm ok-btn',
              onClick: () => {
                console.log('xx');
              }
            },
          ]
        }
      };

      window.instance.UI.addCustomModal(modal);
      window.instance.UI.openElements([modal.dataElement]);
    });

    await page.waitForTimeout(5000);
    const saveAsDocumentModal = await iframe.$('[data-element=saveAsDocument] .CustomModal-container');
    expect(await saveAsDocumentModal.screenshot()).toMatchSnapshot(['custom-modal', 'custom-modal.png']);
  });
});
