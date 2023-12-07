import React from 'react';
import { render } from '@testing-library/react';
import { UserPanel, ColorPanel, TypePanel, DocumentFilterActive } from './FilterAnnotModal.stories';

const noop = () => { };

jest.mock('core', () => ({
  getDisplayAuthor: () => 'Test Author',
  addEventListener: noop,
  removeEventListener: noop,
  getAnnotationsList: () => [],
  getDocumentViewers: () => [{
    getAnnotationManager: () => ({
      getAnnotationsList: () => []
    })
  }],
}));

const UserPanelFilterAnnotModalStory = withI18n(UserPanel);
const ColorPanelFilterAnnotModalStory = withI18n(ColorPanel);
const TypePanelFilterAnnotModalStory = withI18n(TypePanel);
const DocumentFilterActiveStory = withI18n(DocumentFilterActive);

describe('FilterAnnotModal', () => {
  it('Stories should not throw any errors', () => {
    expect(() => {
      render(<UserPanelFilterAnnotModalStory />);
      render(<ColorPanelFilterAnnotModalStory />);
      render(<TypePanelFilterAnnotModalStory />);
      render(<DocumentFilterActiveStory />);
    }).not.toThrow();
  });
});