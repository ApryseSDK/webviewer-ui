import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { InsertBlankPagePanel, InsertUploadedPagePanel } from './InsertPageModal.stories';
import userEvent from '@testing-library/user-event';

describe('InsertPageModal', () => {
  describe('Storybook component', () => {
    it('Renders InsertBlankPagePanel StoryBook component with file selected with no errors', async () => {
      expect(() => {
        render(<InsertBlankPagePanel />);
      }).not.toThrow();
    });

    it('Renders InsertUploadedPagePanel StoryBook component with file selected with no errors', async () => {
      expect(() => {
        render(<InsertUploadedPagePanel />);
      }).not.toThrow();
    });

    it('Opens custom dimension options when Custom is selected', () => {
      render(<InsertBlankPagePanel />);
      const customOption = Array.from(document.getElementsByClassName('options')).find(
        (option) => option.textContent === 'Custom',
      );
      expect(customOption).toBeInTheDocument();
      fireEvent.click(customOption);

      const unitSelector = screen.getByText('Units');
      expect(unitSelector).toBeInTheDocument();

      const widthInput = screen.getByDisplayValue('8.5');
      expect(widthInput).toBeInTheDocument();

      const heightInput = screen.getByDisplayValue('11');
      expect(heightInput).toBeInTheDocument();

      const addButton = document.getElementsByClassName('insertPageModalConfirmButton')[0];

      // add button gets disabled when width is set to 0
      fireEvent.change(widthInput, { target: { value: 0 } });
      expect(addButton).toBeDisabled();

      fireEvent.change(widthInput, { target: { value: 1 } });
      expect(addButton).not.toBeDisabled();

      // add button gets disabled when height is set to 0
      fireEvent.change(heightInput, { target: { value: 0 } });
      expect(addButton).toBeDisabled();

      fireEvent.change(heightInput, { target: { value: 1 } });
      expect(addButton).not.toBeDisabled();

      // click 'Letter' to make custom options go away
      const letterOption = Array.from(document.getElementsByClassName('options')).find(
        (option) => option.textContent === 'Letter',
      );
      expect(letterOption).toBeInTheDocument();
      fireEvent.click(letterOption);

      expect(unitSelector).not.toBeVisible();
      expect(widthInput).not.toBeVisible();
      expect(heightInput).not.toBeVisible();
    });

    it('Can use arrows to increment number of pages', () => {
      render(<InsertBlankPagePanel />);
      const numberInput = screen.getByDisplayValue(1);
      expect(numberInput).toBeInTheDocument();

      const upArrow = document.getElementsByClassName('increment-arrow-button')[0];
      const downArrow = document.getElementsByClassName('increment-arrow-button')[1];
      expect(upArrow).toBeInTheDocument();
      expect(downArrow).toBeInTheDocument();
      fireEvent.click(upArrow);
      expect(numberInput).toHaveValue(2);
      fireEvent.click(downArrow);
      fireEvent.click(downArrow);
      expect(numberInput).toHaveValue(0);

      fireEvent.change(numberInput, { target: { value: 23 } });
      expect(numberInput).toHaveValue(23);
    });

    it('Add pages button is disabled by default in the upload page panel', () => {
      render(<InsertUploadedPagePanel />);
      const addButton = screen.getByRole('button', { name: 'Add Page(s)' });
      expect(addButton).toBeDisabled();
    });

    it('Add pages button is disabled if user enters an invalid page location', () => {
      render(<InsertBlankPagePanel />);

      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const textboxes = screen.getAllByRole('textbox');
      const pageInput = textboxes[0];
      // Loaded doc only has 9 pages
      userEvent.clear(pageInput);
      userEvent.type(pageInput, '20');

      screen.getByText('Invalid page number. Limit is 9');
      fireEvent.blur(pageInput);

      expect(pageInput.value).toEqual('');

      const addButton = screen.getByRole('button', { name: 'Add Page(s)' });
      expect(addButton).toBeDisabled();

      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });
  });
});
