import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useSelector, useDispatch } from 'react-redux';
import core from 'core';
import selectors from 'selectors';
import { widgets } from './helper';
import useCore from 'hooks/useCore';
import IndexPanelContainer from './IndexPanelContainer';

// Uncomment the following lines after fixing the import issue in `createFeatureAPI.js`
// import { WithWidgets } from './IndexPanel.stories';

const WithWidgets = {};

jest.mock('core');
jest.mock('selectors');

jest.mock('hooks/useCore');
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

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

describe('MultiViewerMode Tests', function() {
  let mockCore;
  let mockWidgetAnnotation;

  beforeEach(() => {
    // Setup Core API mocks
    mockWidgetAnnotation = function() {};
    window.Core = {
      Annotations: {
        WidgetAnnotation: mockWidgetAnnotation,
        Color: function(r, g, b, a) {
          this.R = r;
          this.G = g;
          this.B = b;
          this.A = a;
        }
      }
    };

    mockCore = {
      getAnnotationsList: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      getSelectedAnnotations: jest.fn(() => []),
    };

    // Mock Redux hooks
    useSelector.mockImplementation((selector) => {
      // Simulating the selector call with a mock state
      return selector({ viewer: { openElements: { 'indexPanel': true } } });
    });
    useDispatch.mockReturnValue(jest.fn());

    // Mock selectors
    selectors.isElementOpen.mockReturnValue(true);
    selectors.isElementDisabled.mockReturnValue(false);
    selectors.getFlyoutMap.mockReturnValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('updates widgets when core changes (multiviewer mode)', () => {
    // Initial core returns widget1
    const widget1 = Object.create(mockWidgetAnnotation.prototype);
    widget1.fieldName = 'Widget1';
    widget1.Id = 'widget1';
    widget1.getField = jest.fn(() => ({ name: 'Widget1', widgets: [widget1] }));
    mockCore.getAnnotationsList.mockReturnValue([widget1]);
    useCore.mockReturnValue({ core: mockCore });

    const { getByText, rerender } = render(<IndexPanelContainer dataElement="indexPanel" />);
    expect(getByText('Widget1')).toBeInTheDocument();

    // Simulate core switching to another viewer with widget2
    const widget2 = Object.create(mockWidgetAnnotation.prototype);
    widget2.fieldName = 'Widget2';
    widget2.Id = 'widget2';
    widget2.getField = jest.fn(() => ({ name: 'Widget2', widgets: [widget2] }));
    const mockCore2 = {
      getAnnotationsList: jest.fn(() => [widget2]),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      getSelectedAnnotations: jest.fn(() => []),
    };
    useCore.mockReturnValue({ core: mockCore2 });
    rerender(<IndexPanelContainer dataElement="indexPanel" />);
    expect(getByText('Widget2')).toBeInTheDocument();
  });
});