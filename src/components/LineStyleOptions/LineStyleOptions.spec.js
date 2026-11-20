import React from 'react';
import { TOOLTIP_SHOW_DELAY } from 'constants/tooltip';
import { render, fireEvent, screen, within, act } from '@testing-library/react';
import LineStyleOptions from './LineStyleOptions';
import { Basic } from './LineStyleOptions.stories';

const BasicLineStyleOptionsStory = withI18n(Basic);
const TestLineStyleOptions = withProviders(LineStyleOptions);

function noop() { }

describe('LineStyleOptions', () => {
  describe('Component', () => {
    it('Story should not throw any errors', () => {
      expect(() => {
        render(<BasicLineStyleOptionsStory />);
      }).not.toThrow();
    });
  });

  describe('Basic tests', () => {
    it('should render two dropdown containers, one for each line style', () => {
      const lineStyleKey = 'None';
      const properties = { StartLineStyle: lineStyleKey, EndLineStyle: lineStyleKey };

      render(
        <TestLineStyleOptions
          properties={properties}
          onLineStyleChange={noop}
        />
      );

      const dropdowns = screen.getAllByRole('combobox');
      expect(dropdowns.length).toBe(3);
    });

    it('when a new choice is selected the callback should be invoked', () => {
      const onLineStyleChangeMock = jest.fn();
      const properties = { StartLineStyle: 'None', EndLineStyle: 'None' };

      render(
        <TestLineStyleOptions
          properties={properties}
          onLineStyleChange={onLineStyleChangeMock}
        />
      );

      //First we assert the start line style dropdown is the default
      const dropdowns = screen.getAllByRole('combobox', { description: 'None' });
      const startDropDownCombobox = dropdowns[0];
      expect(startDropDownCombobox).toBeInTheDocument();
      expect(startDropDownCombobox).toHaveAttribute('aria-describedby', 'startLineStyleDropdown-None');

      // We get the first one for the Start of the line
      const openArrowOption = screen.getAllByRole('option', { name: 'ClosedArrow' })[0];
      fireEvent.click(openArrowOption);

      // There should now be one combo box with the new value of ClosedArrow
      expect(startDropDownCombobox).toHaveAttribute('aria-describedby', 'startLineStyleDropdown-ClosedArrow');


      expect(onLineStyleChangeMock).toBeCalled();
    });

    it('shows custom styles that apply to line annotations', () => {
      const CustomLineStyleOptions = withProviders(LineStyleOptions, {
        viewer: {
          customLineStyles: {
            start: [],
            middle: [
              { key: 'line-style', title: 'Line Style', appliesTo: ['line'] },
              { key: 'shape-style', title: 'Shape Style', appliesTo: ['shape'] },
            ],
            end: [],
          },
        },
      });

      render(
        <CustomLineStyleOptions
          properties={{ StartLineStyle: 'None', StrokeStyle: 'solid', EndLineStyle: 'None' }}
          onLineStyleChange={noop}
        />,
      );

      expect(screen.getByRole('option', { name: 'Line Style' })).toBeInTheDocument();
      expect(screen.queryByRole('option', { name: 'Shape Style' })).not.toBeInTheDocument();
    });

    it('selects custom start and end styles', () => {
      const onLineStyleChange = jest.fn();
      const CustomLineStyleOptions = withProviders(LineStyleOptions, {
        viewer: {
          customLineStyles: {
            start: [{ key: 'custom-start', title: 'Custom Start', appliesTo: ['line'] }],
            middle: [],
            end: [{ key: 'custom-end', title: 'Custom End', appliesTo: ['line'] }],
          },
        },
      });
      render(
        <CustomLineStyleOptions
          properties={{ StartLineStyle: 'None', StrokeStyle: 'solid', EndLineStyle: 'None' }}
          onLineStyleChange={onLineStyleChange}
        />,
      );

      fireEvent.click(screen.getByRole('option', { name: 'Custom Start' }));
      fireEvent.click(screen.getByRole('option', { name: 'Custom End' }));

      expect(onLineStyleChange).toHaveBeenCalledWith('start', 'custom-start');
      expect(onLineStyleChange).toHaveBeenCalledWith('end', 'custom-end');
    });
  });

  describe('Line style tooltips', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => {
      jest.clearAllTimers();
      jest.useRealTimers();
    });

    it.each([
      { index: 0, key: 'ClosedArrow' },
      { index: 0, key: 'Butt' },
      { index: 1, key: 'dash,2,2' },
      { index: 2, key: 'ROpenArrow' },
    ])('shows a tooltip without changing the existing option name for $key', ({ index, key }) => {
      const onLineStyleChange = jest.fn();
      render(<TestLineStyleOptions properties={{ StartLineStyle: 'None', StrokeStyle: 'solid', EndLineStyle: 'None' }} onLineStyleChange={onLineStyleChange} />);
      fireEvent.keyDown(screen.getAllByRole('combobox')[index], { key: 'Enter' });
      const option = within(screen.getAllByRole('listbox')[index]).getByRole('option', { name: key });
      fireEvent.pointerMove(option);
      act(() => jest.advanceTimersByTime(TOOLTIP_SHOW_DELAY));
      expect(document.querySelector('[data-element="tooltip"]')).toHaveTextContent(key);
      fireEvent.click(option);
      expect(onLineStyleChange).toHaveBeenCalledWith(['start', 'middle', 'end'][index], key);
    });

    it.each([
      { index: 0, position: 'start', key: 'custom-start', title: 'Custom Start', description: 'Custom Start' },
      { index: 1, position: 'middle', key: 'custom-middle', title: 'option.lineStyleOptions.title', description: 'Style' },
      { index: 2, position: 'end', key: 'custom-end', description: 'custom-end' },
    ])('describes custom $position styles and selects their registered key', ({ index, position, key, title, description }) => {
      const onLineStyleChange = jest.fn();
      const CustomLineStyleOptions = withProviders(LineStyleOptions, {
        viewer: {
          customLineStyles: {
            start: [],
            middle: [],
            end: [],
            [position]: [{ key, title, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 8"><path d="M0 4h24" /></svg>', appliesTo: ['line'] }],
          },
        },
      });
      render(<CustomLineStyleOptions properties={{ StartLineStyle: 'None', StrokeStyle: 'solid', EndLineStyle: 'None' }} onLineStyleChange={onLineStyleChange} />);
      fireEvent.mouseDown(screen.getAllByRole('combobox')[index]);
      const option = screen.getByRole('option', { name: title || key });
      fireEvent.pointerMove(option);
      act(() => jest.advanceTimersByTime(TOOLTIP_SHOW_DELAY));
      expect(document.querySelector('[data-element="tooltip"]')).toHaveTextContent(description);
      fireEvent.click(option);
      expect(onLineStyleChange).toHaveBeenCalledWith(position, key);
      expect(document.querySelector('[data-element="tooltip"]')).not.toBeInTheDocument();
    });
  });
});