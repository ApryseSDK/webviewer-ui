import React from 'react';
import { render, screen } from '@testing-library/react';
import { UserPanel, ColorPanel, TypePanel } from './FilterAnnotModal.stories';

const noop = () => {
};
const mockAnnotation = {
  getStatus: () => '',
  getCustomData: (key) => {
    const customData = {
      'trn-annot-preview': ''
    };
    return customData[key];
  }
};

const mockAnnotationManager = {
  getFormFieldCreationManager: () => ({
    isInFormFieldCreationMode: () => false
  }),
  getAnnotationsList: () => [
    mockAnnotation
  ],
};

const mockDocumentViewer = {
  getPageSearchResults: () => [],
  addEventListener: noop,
  removeEventListener: noop,
  getAnnotationManager: () => mockAnnotationManager
};

jest.mock('core', () => ({
  addEventListener: noop,
  removeEventListener: noop,
  getDocumentViewer: () => mockDocumentViewer,
  getDocumentViewers: () => [mockDocumentViewer],
  getAnnotationsList: () => [
    mockAnnotation
  ],
  getDisplayAuthor: () => 'Mikel Landa',
  getAnnotationManager: () => mockAnnotationManager,
}));

describe('FilterAnnotModal', () => {
  // Test each component in the FilterAnnotModal story
  const componentsToTest = [
    { name: 'UserPanel', component: <UserPanel /> },
    { name: 'ColorPanel', component: <ColorPanel /> },
    { name: 'TypePanel', component: <TypePanel /> },
  ];

  componentsToTest.forEach(({ name, component }) => {
    it(`Renders ${name} StoryBook component with no errors`, () => {
      expect(() => {
        render(component);
      }).not.toThrow();
    });
  });
  it('FilterAnnotModal filter option checkboxes have aria-labels', async () => {
    render(<UserPanel />);
    const checkbox = screen.getByLabelText('Mikel Landa Check box');
    expect(checkbox).toBeInTheDocument();
  });
  it('FilterAnnotModal renders proper group labels', async () => {
    render(<UserPanel />);
    const container = screen.getAllByRole('group', { name: 'Filter Settings' });
    expect(container[1]).toHaveAttribute('aria-labelledby', 'filter-settings');
  });
});
