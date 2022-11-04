import { loadViewerSample } from '../../playwright-utils';
import { expect, test } from '@playwright/test';

test.describe('Settings modal', () => {
  test('General tab', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');
    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    await iframe.click('[data-element="menuButton"]');
    await iframe.click('[data-element="settingsButton"]');
    await page.waitForTimeout(1000);

    const currentLanguage = await iframe.$('.SettingsModal .picked-option-text');
    expect(await currentLanguage.textContent()).toBe('English');

    await instance('setLanguage', 'zh_cn');
    await page.waitForTimeout(1000);
    expect(await currentLanguage.textContent()).toBe('简体中文');
    await instance('setLanguage', 'en');

    let activeTheme = await iframe.$('.theme-option.active-theme .ui__choice__label');
    expect(await activeTheme.textContent()).toBe('Light mode');

    const darkModeOption = (await iframe.$$('.theme-options .theme-option'))[1];
    await (await darkModeOption.$('.theme-choice .ui__choice__input input')).click();
    activeTheme = await iframe.$('.theme-option.active-theme .ui__choice__label');
    expect(await activeTheme.textContent()).toBe('Dark mode');
  });

  test('Advanced tab', async ({ page }) => {
    const { iframe } = await loadViewerSample(page, 'viewing/blank');
    await page.waitForTimeout(5000);

    await iframe.evaluate(async () => {
      window.instance.UI.setCustomSettings([
        {
          label: 'Enable High Contrast Mode',
          description: 'Turns high contrast mode on to help with accessibility.',
          isChecked: () => window.instance.UI.isHighContrastModeEnabled(),
          onToggled: (enable) => {
            if (enable) {
              window.instance.UI.enableHighContrastMode();
            } else {
              window.instance.UI.disableHighContrastMode();
            }
          }
        }
      ]);
    });

    await iframe.click('[data-element="menuButton"]');
    await iframe.click('[data-element="settingsButton"]');
    await page.waitForTimeout(1000);
    await iframe.click('[data-element="settingsAdvancedButton"]');
    await page.waitForTimeout(1000);

    const settingSections = await iframe.$$('.settings-content .setting-section');
    expect(settingSections.length).toBe(6);

    for (const settingSection of settingSections) {
      const getIsChecked = async () => (await choice.getAttribute('class')).includes('ui__choice--checked');

      const choice = await settingSection.$('.setting-item .ui__choice');
      const isChecked = await getIsChecked();

      await (await choice.$('input')).click();

      await page.waitForTimeout(1000);
      expect(await getIsChecked()).toBe(!isChecked);
    }
  });
});
