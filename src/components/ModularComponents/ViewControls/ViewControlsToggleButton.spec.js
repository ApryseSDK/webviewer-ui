import React from 'react';
import { render } from '@testing-library/react';
import ViewControlsToggleButton from './ViewControlsToggleButton';

const ViewControlsToggleButtonWithRedux = withProviders(ViewControlsToggleButton);

describe('ViewControlsToggleButton', () => {
  it('should use the dataElement prop passed from props', () => {
    const testDataElement = 'custom-view-controls-button';
    const { container } = render(
      <ViewControlsToggleButtonWithRedux dataElement={testDataElement} />
    );

    const button = container.querySelector(`[data-element="${testDataElement}"]`);
    expect(button).toBeInTheDocument();
  });

  it('should use default dataElement when not provided', () => {
    const { container } = render(<ViewControlsToggleButtonWithRedux />);

    const button = container.querySelector('[data-element="view-controls-toggle-button"]');
    expect(button).toBeInTheDocument();
  });
});
