import { userEvent, within, expect } from 'storybook/test';
import Flyout from './Flyout';
import { createMockAppTemplate } from '../AppStories/helpers/appResponsivenessHelpers';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';

export default {
  title: 'ModularComponents/Flyout',
  component: Flyout,
};

export const FlyoutResponsiveness = createMockAppTemplate({ isOffset: true });

FlyoutResponsiveness.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const viewFlyoutToggle = await canvas.findByRole('button', { name: getTranslatedText('component.viewControls') });
  await userEvent.click(viewFlyoutToggle);
  const flyoutHeader = await canvas.findByText(getTranslatedText('option.displayMode.pageTransition'));
  expect(flyoutHeader).toBeInTheDocument();
};