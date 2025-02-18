import { userEvent, within, expect } from '@storybook/test';
import Flyout from './Flyout';
import { createMockAppTemplate } from '../AppStories/helpers/appResponsivenessHelpers';

export default {
  title: 'ModularComponents/Flyout',
  component: Flyout,
};

export const FlyoutResponsiveness = createMockAppTemplate({ isOffset: true });

FlyoutResponsiveness.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const viewFlyoutToggle = await canvas.findByRole('button', { 'name': 'View Controls' });
  await userEvent.click(viewFlyoutToggle);
  const flyoutHeader = await canvas.findByText('Page Transition');
  expect(flyoutHeader).toBeInTheDocument();
};