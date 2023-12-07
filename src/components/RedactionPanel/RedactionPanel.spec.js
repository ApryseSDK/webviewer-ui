import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RedactionPanel from './RedactionPanel';
import { EmptyList, PanelWithRedactionItems, mockRedactionTypesDictionary } from './RedactionPanel.stories';
import { RedactionPanelContext } from './RedactionPanelContext';
import { getMockRedactionAnnotation } from '../RedactionPageGroup/RedactionPageGroup.spec';

jest.mock('core', () => ({
  getDisplayAuthor: () => 'Duncan Idaho',
  getRotation: () => 1,
  getTotalPages: () => 1,
  getPageInfo: () => ({ width: 100, height: 100 }),
  deselectAllAnnotations: () => { },
  selectAnnotation: () => { },
  jumpToAnnotation: () => { },
}));


const RedactionPanelWithRedux = withProviders(RedactionPanel);

// Helper function that allows us to inject different context scenarios to test with
const customRenderWithContext = (component, providerProps = {}) => {
  return render(
    <RedactionPanelContext.Provider value={providerProps}>
      {component}
    </RedactionPanelContext.Provider>,
  );
};

describe('RedactionPanel', () => {
  it('renders the storybook component with no redaction items correctly', () => {
    expect(() => {
      render(<EmptyList />);
    }).not.toThrow();
  });

  it('renders the storybook component with redaction items correctly', () => {
    expect(() => {
      render(<PanelWithRedactionItems />);
    }).not.toThrow();
  });

  it('correctly renders two separate redaction groups when redact annotations are in two different pages', () => {
    const mockTextRedactionAnnotation = getMockRedactionAnnotation({ IsText: true, PageNumber: 1 });
    const mockRegionRedactionAnnotation = getMockRedactionAnnotation({ PageNumber: 1 });
    const mockRegionRedactionAnnotationPageTwo = getMockRedactionAnnotation({ PageNumber: 2 });

    const mockRedactionAnnotations = [
      mockTextRedactionAnnotation,
      mockRegionRedactionAnnotation,
      mockRegionRedactionAnnotationPageTwo,
    ];

    const providerProps = {
      isTestMode: true,
    };

    customRenderWithContext(
      <RedactionPanelWithRedux
        currentWidth={330}
        redactionTypesDictionary={mockRedactionTypesDictionary}
        redactionAnnotations={mockRedactionAnnotations}
      />,
      providerProps
    );

    // There should be two list of redactions, one for each page
    screen.getByText('Page 1');
    screen.getByText('Page 2');
    // Only two collapse buttons as each page group has one button
    const collapseButons = screen.getAllByLabelText('Collapse');
    expect(collapseButons.length).toEqual(2);

    // Check that we have 3 redact items in the panel total
    const redactionItems = screen.getAllByRole('listitem');
    expect(redactionItems.length).toEqual(mockRedactionAnnotations.length);
    // getByText accepts matcher functions too, which are idea for text thats broken up in elements
    screen.getByText((_, node) => node.textContent === `Marked for Redaction (${mockRedactionAnnotations.length})`);
  });

  it('calls the correct handlers when pressing the Redact All or Clear buttons', () => {
    const mockedRedactAll = jest.fn();
    const mockClearAll = jest.fn();
    const mockTextRedactionAnnotation = getMockRedactionAnnotation({ IsText: true, PageNumber: 1 });

    customRenderWithContext(
      <RedactionPanelWithRedux
        currentWidth={330}
        applyAllRedactions={mockedRedactAll}
        deleteAllRedactionAnnotations={mockClearAll}
        redactionTypesDictionary={mockRedactionTypesDictionary}
        redactionAnnotations={[mockTextRedactionAnnotation]}
      />
    );

    const redactAllButton = screen.getByRole('button', { name: 'Redact All' });
    userEvent.click(redactAllButton);
    expect(mockedRedactAll).toHaveBeenCalled();

    const clearAllButton = screen.getByRole('button', { name: 'Clear' });
    userEvent.click(clearAllButton);
    expect(mockClearAll).toHaveBeenCalled();
  });

  it('when there is no redaction annotations, the Redact All and Clear buttons are disabled and can not be clicked', () => {
    const mockedRedactAll = jest.fn();
    const mockClearAll = jest.fn();

    customRenderWithContext(
      <RedactionPanelWithRedux
        currentWidth={330}
        applyAllRedactions={mockedRedactAll}
        deleteAllRedactionAnnotations={mockClearAll}
        redactionAnnotations={[]}
      />
    );

    const redactAllButton = screen.getByRole('button', { name: 'Redact All' });
    expect(redactAllButton).toBeDisabled();
    userEvent.click(redactAllButton);
    expect(mockedRedactAll).not.toHaveBeenCalled();

    const clearAllButton = screen.getByRole('button', { name: 'Clear' });
    expect(clearAllButton).toBeDisabled();
    userEvent.click(clearAllButton);
    expect(mockClearAll).not.toHaveBeenCalled();
  });

  it('when a user selects a redaction item, it sets its state as selected', () => {
    const mockTextRedactionAnnotation = getMockRedactionAnnotation({ IsText: true, PageNumber: 1 });
    const mockRegionRedactionAnnotationPageTwo = getMockRedactionAnnotation({ PageNumber: 2 });

    const mockRedactionAnnotations = [
      mockTextRedactionAnnotation,
      mockRegionRedactionAnnotationPageTwo,
    ];

    const props = {
      currentWidth: 330,
      redactionAnnotations: mockRedactionAnnotations,
      redactionTypesDictionary: mockRedactionTypesDictionary,
    };

    let selectedRedactionItemId = '';
    const providerProps = {
      selectedRedactionItemId,
      setSelectedRedactionItemId: (id) => {
        selectedRedactionItemId = id;
      },
      isTestMode: true,
    };

    customRenderWithContext(<RedactionPanelWithRedux {...props} />, providerProps);

    const redactionItems = screen.getAllByRole('listitem');
    // User clicks on the first item
    userEvent.click(redactionItems[0]);
    expect(selectedRedactionItemId).toEqual(mockTextRedactionAnnotation.Id);

    // User clicks on the second item
    userEvent.click(redactionItems[1]);
    expect(selectedRedactionItemId).toEqual(mockRegionRedactionAnnotationPageTwo.Id);
  });

  it('when a redaction item is the selected one in the context, it has the correct styling', () => {
    const mockTextRedactionAnnotation = getMockRedactionAnnotation({ IsText: true, PageNumber: 1 });
    const mockRegionRedactionAnnotationPageTwo = getMockRedactionAnnotation({ PageNumber: 2 });

    const mockRedactionAnnotations = [
      mockTextRedactionAnnotation,
      mockRegionRedactionAnnotationPageTwo,
    ];

    const props = {
      currentWidth: 330,
      redactionAnnotations: mockRedactionAnnotations,
      redactionTypesDictionary: mockRedactionTypesDictionary,
    };

    const providerProps = {
      selectedRedactionItemId: mockTextRedactionAnnotation.Id,
      setSelectedRedactionItemId: jest.fn(),
      isTestMode: true,
    };

    customRenderWithContext(<RedactionPanelWithRedux {...props} />, providerProps);

    const redactionItems = screen.getAllByRole('listitem');
    // First one is selected
    expect(redactionItems[0]).toHaveClass('redaction-item redaction-item-selected', { exact: true });
    // Second one is not selected
    expect(redactionItems[1]).toHaveClass('redaction-item', { exact: true });
  });
});