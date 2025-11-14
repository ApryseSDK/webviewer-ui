import App from 'components/App';
import { mockHeadersNormalized, mockModularComponents } from './mockAppState';
import { within, expect } from 'storybook/test';
import { createTemplate } from 'helpers/storybookHelper';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';

export default {
  title: 'ModularComponents/App/Panels',
  component: App,
};

export const SetActiveTabInPanel = createTemplate({ headers: mockHeadersNormalized, components: mockModularComponents });

SetActiveTabInPanel.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  // We open the tab panel programatically
  window.instance.UI.openElements(['tabPanel']);
  // the active tab should be the thumbnails tab
  const thumbnailsTab = await canvas.findByRole('button', { name: getTranslatedText('component.thumbnailsPanel') });
  await expect(thumbnailsTab.classList.contains('active')).toBe(true);
  await expect(thumbnailsTab.getAttribute('aria-current')).toBe('true');

  // At this point the outlines tab should not be selected or active
  const outlinesTab = await canvas.findByRole('button', { name: getTranslatedText('component.outlinesPanel') });
  await expect(outlinesTab.getAttribute('aria-current')).toBe('false');
  await expect(outlinesTab.classList.contains('active')).toBe(false);
  // Call API to set the active tab to outlines
  window.instance.UI.setActiveTabInPanel({ tabPanel: 'tabPanel', tabName: 'outlinesPanel' });
  // Now it should be selected and active
  await expect(outlinesTab.getAttribute('aria-current')).toBe('true');
  await expect(outlinesTab.classList.contains('active')).toBe(true);

  // Now we test backwards compatibility with the old API
  window.instance.UI.setActiveLeftPanel('thumbnailsPanel');
  // Now it should be selected and active
  await expect(thumbnailsTab.getAttribute('aria-current')).toBe('true');
  await expect(thumbnailsTab.classList.contains('active')).toBe(true);
  // And outlines should not be selected or active
  await expect(outlinesTab.getAttribute('aria-current')).toBe('false');
  await expect(outlinesTab.classList.contains('active')).toBe(false);
};

export const ThumbnailsPanelRightToLeft = createTemplate({
  headers: mockHeadersNormalized,
  components: mockModularComponents
});

ThumbnailsPanelRightToLeft.play = async ({ canvasElement }) => {
  window.instance.UI.openElements(['tabPanel']);
  window.instance.UI.setLanguage('ur');
};
