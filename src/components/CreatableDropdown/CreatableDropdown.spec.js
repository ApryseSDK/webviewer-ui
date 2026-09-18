import React from 'react';
import { render, screen, fireEvent, createEvent, within } from '@testing-library/react';
import CreatableDropdown from './CreatableDropdown';
import InstanceRootNodeContext from 'src/context/InstanceRootNodeContext';

const TestDropdown = withI18n(CreatableDropdown);

describe('CreatableDropdown', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each(['touch', 'mouse'])('clears a selected category with the X using %s', (inputType) => {
    const Dropdown = () => {
      const [value, setValue] = React.useState({ value: 'Review', label: 'Review' });
      return <TestDropdown value={value} onChange={setValue} isClearable textPlaceholder="Category" />;
    };
    const { container } = render(<Dropdown />);
    expect(screen.getByText('Review')).toBeInTheDocument();
    const clearIndicator = container.querySelector('.creatable-dropdown__clear-indicator');
    expect(clearIndicator).toBeInTheDocument();
    if (inputType === 'touch') {
      fireEvent.touchEnd(clearIndicator);
    } else {
      fireEvent.mouseDown(clearIndicator, { button: 0 });
    }
    expect(screen.queryByText('Review')).not.toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(container.querySelector('.creatable-dropdown__clear-indicator')).not.toBeInTheDocument();
  });

  it('keeps the menu open when the input is tapped inside a shadow root', () => {
    const wasWebComponent = window.isApryseWebViewerWebComponent;
    window.isApryseWebViewerWebComponent = true;
    const onChange = jest.fn();
    const host = document.createElement('div');
    document.body.appendChild(host);
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const container = document.createElement('div');
    shadowRoot.appendChild(container);
    const view = render(
      <InstanceRootNodeContext.Provider value={shadowRoot}>
        <TestDropdown options={[{ value: 'Review', label: 'Review' }]} onChange={onChange} />
      </InstanceRootNodeContext.Provider>,
      { container }
    );
    try {
      const input = within(container).getByRole('combobox');
      fireEvent.mouseDown(input, { button: 0 });
      expect(input).toHaveAttribute('aria-expanded', 'true');
      fireEvent.touchEnd(input, { composed: true });
      expect(input).toHaveAttribute('aria-expanded', 'true');
      const option = within(container).getByRole('option', { name: 'Review' });
      fireEvent.touchEnd(option, { composed: true });
      expect(input).toHaveAttribute('aria-expanded', 'true');
      fireEvent.click(option, { composed: true });
      expect(onChange).toHaveBeenCalledWith(
        { value: 'Review', label: 'Review' },
        expect.objectContaining({ action: 'select-option' })
      );
      expect(input).toHaveAttribute('aria-expanded', 'false');

      fireEvent.mouseDown(input, { button: 0 });
      expect(input).toHaveAttribute('aria-expanded', 'true');
      fireEvent.touchEnd(document.body, { composed: true });
      expect(input).toHaveAttribute('aria-expanded', 'false');
    } finally {
      view.unmount();
      host.remove();
      window.isApryseWebViewerWebComponent = wasWebComponent;
    }
  });

  it.each(['touch', 'mouse'])('opens and closes with the arrow using %s and selects a category', (inputType) => {
    const onChange = jest.fn();
    const { container } = render(
      <TestDropdown
        options={[{ value: 'Review', label: 'Review' }]}
        onChange={onChange}
        textPlaceholder="Category"
      />
    );
    const tap = (element) => {
      if (inputType === 'touch') {
        const touchStart = createEvent.touchStart(element);
        Object.defineProperty(touchStart, 'touches', {
          value: { item: () => ({ clientX: 0, clientY: 0 }) },
        });
        fireEvent(element, touchStart);
        fireEvent.touchEnd(element);
      } else {
        fireEvent.mouseDown(element, { button: 0 });
      }
    };
    const arrow = () => container.querySelector('.arrow');
    const input = screen.getByRole('combobox');

    tap(arrow());
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('option', { name: 'Review' })).toBeInTheDocument();

    tap(arrow());
    expect(input).toHaveAttribute('aria-expanded', 'false');

    tap(arrow());
    const option = screen.getByRole('option', { name: 'Review' });
    if (inputType === 'touch') {
      tap(option);
    }
    fireEvent.click(option);
    expect(onChange).toHaveBeenCalledWith(
      { value: 'Review', label: 'Review' },
      expect.objectContaining({ action: 'select-option' })
    );
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });
});
