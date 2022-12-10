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
    await page.waitForTimeout(1000);

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

    const getIsChecked = async (choice) => (await choice.getAttribute('class')).includes('ui__choice--checked');
    for (const settingSection of settingSections) {
      const choices = await settingSection.$$('.setting-item .ui__choice');
      for (const choice of choices) {
        const isChecked = await getIsChecked(choice);

        await (await choice.$('input')).click();

        await page.waitForTimeout(1000);
        expect(await getIsChecked(choice)).toBe(!isChecked);
      }
    }
  });

  test('Keyboard Shortcut tab', async ({ page }) => {
    const { iframe } = await loadViewerSample(page, 'viewing/blank');
    await page.waitForTimeout(5000);

    await iframe.click('[data-element="menuButton"]');
    await iframe.click('[data-element="settingsButton"]');
    await page.waitForTimeout(1000);
    await iframe.click('[data-element="settingsKeyboardButton"]');
    await page.waitForTimeout(1000);

    const shortcutItems = await iframe.$$('.settings-content .shortcut-table-item');
    expect(shortcutItems.length).toBe(36);

    await (await shortcutItems[0].$('button')).click();
    await page.waitForTimeout(1000);

    const editKeyboardShortcutModal = await iframe.$('.EditKeyboardShortcutModal .container');

    // Change shortcut to ctrl+c which should trigger the conflict warning message
    await page.keyboard.down('Control');
    await page.keyboard.down('KeyC');
    await page.keyboard.up('Control');
    await page.keyboard.up('KeyC');
    await page.waitForTimeout(3000);

    expect(await editKeyboardShortcutModal.screenshot()).toMatchSnapshot(['settings-modal', 'editKeyboardShortcutModal-warning.png']);

    // Change shortcut to ctrl+m
    await page.keyboard.down('Control');
    await page.keyboard.down('KeyM');
    await page.keyboard.up('Control');
    await page.keyboard.up('KeyM');
    await page.waitForTimeout(1000);

    expect(await editKeyboardShortcutModal.screenshot()).toMatchSnapshot(['settings-modal', 'editKeyboardShortcutModal.png']);

    // Apply the new shortcut
    await (await editKeyboardShortcutModal.$('.footer button')).click();
    await page.waitForTimeout(1000);

    const spans = await shortcutItems[0].$$('.shortcut-table-item-command span');
    expect((await Promise.all(spans.map(span => span.textContent()))).join('')).toBe('CTRL+M');
  });

  test('Retain user preferences', async ({ page }) => {
    const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/blank');
    const instance = await waitForInstance();
    await page.waitForTimeout(5000);

    await iframe.click('[data-element="menuButton"]');
    await iframe.click('[data-element="settingsButton"]');
    await page.waitForTimeout(1000);

    // Change shortcut settings
    await iframe.click('[data-element="settingsKeyboardButton"]');
    await page.waitForTimeout(1000);
    const shortcutItem = await iframe.$('.settings-content .shortcut-table-item');
    await (await shortcutItem.$('button')).click();
    await page.waitForTimeout(1000);
    const editKeyboardShortcutModal = await iframe.$('.EditKeyboardShortcutModal .container');
    await page.keyboard.down('Control');
    await page.keyboard.down('KeyM');
    await page.keyboard.up('Control');
    await page.keyboard.up('KeyM');
    await page.waitForTimeout(1000);
    await (await editKeyboardShortcutModal.$('.footer button')).click();
    await page.waitForTimeout(1000);
    const spans = await shortcutItem.$$('.shortcut-table-item-command span');
    expect((await Promise.all(spans.map(span => span.textContent()))).join('')).toBe('CTRL+M');

    // Change advanced settings
    await iframe.click('[data-element="settingsAdvancedButton"]');
    await page.waitForTimeout(1000);
    const settingSections = await iframe.$$('.settings-content .setting-section');
    const settingsData = [];
    const getIsChecked = async (choice) => (await choice.getAttribute('class')).includes('ui__choice--checked');
    for (const settingSection of settingSections) {
      const settings = [];
      const choices = await settingSection.$$('.setting-item .ui__choice');
      for (const choice of choices) {
        const isChecked = await getIsChecked(choice);
        await (await choice.$('input')).click();
        await page.waitForTimeout(1000);
        expect(await getIsChecked(choice)).toBe(!isChecked);
        settings.push(!isChecked);
      }
      settingsData.push(settings);
    }

    // Change general settings
    await iframe.click('[data-element="settingsGeneralButton"]');
    const darkModeOption = (await iframe.$$('.theme-options .theme-option'))[1];
    await (await darkModeOption.$('.theme-choice .ui__choice__input input')).click();
    const activeTheme = await iframe.$('.theme-option.active-theme .ui__choice__label');
    expect(await activeTheme.textContent()).toBe('Dark mode');
    await instance('setLanguage', 'zh_cn');
    await page.waitForTimeout(1000);
    const currentLanguage = await iframe.$('.SettingsModal .picked-option-text');
    expect(await currentLanguage.textContent()).toBe('简体中文');

    // Refresh page
    const { iframe: iframe_1, waitForInstance: waitForInstance_1 } = await loadViewerSample(page, 'viewing/blank');
    const instance_1 = await waitForInstance_1();
    await page.waitForTimeout(5000);

    await iframe_1.click('[data-element="menuButton"]');
    await iframe_1.click('[data-element="settingsButton"]');
    await page.waitForTimeout(1000);

    // Check general settings
    const currentLanguage_1 = await iframe_1.$('.SettingsModal .picked-option-text');
    expect(await currentLanguage_1.textContent()).toBe('简体中文');
    await instance_1('setLanguage', 'en');
    await page.waitForTimeout(1000);
    const activeTheme_1 = await iframe_1.$('.theme-option.active-theme .ui__choice__label');
    expect(await activeTheme_1.textContent()).toBe('Dark mode');

    // Check shortcut settings
    await iframe_1.click('[data-element="settingsKeyboardButton"]');
    await page.waitForTimeout(1000);
    const shortcutItem_1 = await iframe_1.$('.settings-content .shortcut-table-item');
    const spans_1 = await shortcutItem_1.$$('.shortcut-table-item-command span');
    expect((await Promise.all(spans_1.map(span => span.textContent()))).join('')).toBe('CTRL+M');

    // Check advanced settings
    await iframe_1.click('[data-element="settingsAdvancedButton"]');
    await page.waitForTimeout(1000);
    const settingSections_1 = await iframe_1.$$('.settings-content .setting-section');
    let i = 0;
    for (const settingSection of settingSections_1) {
      const choices = await settingSection.$$('.setting-item .ui__choice');
      let j = 0;
      for (const choice of choices) {
        expect(await getIsChecked(choice)).toBe(settingsData[i][j]);
        j++;
      }
     i++;
    }
  });

  test('Import/export user settings', async ({ page }) => {
    const { iframe } = await loadViewerSample(page, 'viewing/blank');
    await page.waitForTimeout(5000);

    const userSettings = await iframe.evaluate(async () => {
      return window.instance.UI.exportUserSettings();
    });
    expect(Object.keys(userSettings).length).toBe(13);

    const newUserSettings = {
      'language': 'zh_cn',
      'theme': 'dark',
      'disableFadePageNavigationComponent': true,
      'disableNativeScrolling': false,
      'keyboardShortcut': { ...userSettings.keyboardShortcut, 'search': 'control+m' }
    };
    await iframe.evaluate(async (newUserSettings) => {
      return window.instance.UI.importUserSettings(newUserSettings);
    }, newUserSettings);

    await page.waitForTimeout(3000);

    const activeTheme = await iframe.$('.theme-option.active-theme .ui__choice__label');
    expect(await activeTheme.textContent()).toBe('深色模式');

    await iframe.click('[data-element="menuButton"]');

    await page.keyboard.down('Control');
    await page.keyboard.down('KeyM');
    await page.keyboard.up('Control');
    await page.keyboard.up('KeyM');
    await page.waitForTimeout(1000);
    const searchPanel = await iframe.$('[data-element="searchPanel"].open');
    expect(!!searchPanel).toBe(true);

    await iframe.click('[data-element="settingsButton"]');
    await page.waitForTimeout(1000);
    await iframe.click('[data-element="settingsAdvancedButton"]');
    await page.waitForTimeout(1000);
    const settingSection = await iframe.$('.settings-content .setting-section');
    const choices = await settingSection.$$('.setting-item .ui__choice');
    const getIsChecked = async (choice) => (await choice.getAttribute('class')).includes('ui__choice--checked');
    expect(await getIsChecked(choices[0])).toBe(true);
    expect(await getIsChecked(choices[1])).toBe(false);
  });
});
