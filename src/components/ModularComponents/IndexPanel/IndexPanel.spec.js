import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import core from 'core';
import selectors from 'selectors';
import { widgets } from './helper';

// Uncomment the following lines after fixing the import issue in `createFeatureAPI.js`
// import { WithWidgets } from './IndexPanel.stories';

const WithWidgets = {};

jest.mock('core');
jest.mock('selectors');

jest.mock('constants/map', () => ({
  getDataWithKey: jest.fn(() => ({ icon: 'test-icon' })),
  mapAnnotationToKey: jest.fn(),
  copyMapWithDataProperties: jest.fn(),
}));

// Skipped due to failing import in `createFeatureAPI.js`
// To be fixed as part of https://apryse.atlassian.net/browse/WVR-8684
describe.skip('IndexPanel Component', () => {
  beforeEach(() => {
    const mockAnnotation = { Id: 1 };
    selectors.isElementOpen.mockImplementation((state, element) => true);
    selectors.isElementDisabled.mockImplementation((state, element) => false);
    selectors.getFlyoutMap.mockReturnValue({});

    core.addEventListener = jest.fn();
    core.removeEventListener = jest.fn();
    core.deselectAllAnnotations = jest.fn();
    core.selectAnnotation = jest.fn();
    core.jumpToAnnotation = jest.fn();
    core.getAnnotationById = jest.fn();
    core.getSelectedAnnotations = jest.fn().mockReturnValue([mockAnnotation]);
  });

  it('renders IndexPanel with widgets', () => {
    render(<WithWidgets />);
    expect(screen.getByText('Form Field List')).toBeInTheDocument();
    expect(screen.getByText(`(${widgets.length})`)).toBeInTheDocument();
    expect(screen.getByText('Page 1')).toBeInTheDocument();
    expect(screen.getByText('Page 2')).toBeInTheDocument();
  });

  it('handles edit and done button clicks', () => {
    render(<WithWidgets />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);
    expect(screen.getByText('Done')).toBeInTheDocument();

    const doneButton = screen.getByText('Done');
    fireEvent.click(doneButton);
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('handles selection of widgets', () => {
    const getField = () => {
      return {
        'widgets': []
      };
    };
    const mockAnnotation = { Id: 1, getField };
    core.getAnnotationById.mockReturnValue(mockAnnotation);
    render(<WithWidgets />);
    const field = screen.getByText(`${widgets[0].fieldName}`);
    fireEvent.click(field);
    expect(core.deselectAllAnnotations).toHaveBeenCalled();
    expect(core.selectAnnotation).toHaveBeenCalledWith(mockAnnotation);
    expect(core.jumpToAnnotation).toHaveBeenCalledWith(mockAnnotation);
  });
});