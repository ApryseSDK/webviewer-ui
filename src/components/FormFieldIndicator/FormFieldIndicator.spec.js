import React from 'react';
import { render, screen } from '@testing-library/react';
import FormFieldIndicator from './FormFieldIndicator';
import useCore from 'hooks/useCore';
import * as getPopupPosition from 'helpers/getPopupPosition';

jest.mock('helpers/getPopupPosition', () => ({
  getAnnotationPosition: jest.fn(),
  getContainingBlockDocOffset: jest.fn(),
}));

jest.mock('hooks/useCore', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('FormFieldIndicator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, 'pageYOffset', { configurable: true, value: 0 });
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
    useCore.mockReturnValue({
      core: {
        getFormFieldCreationManager: jest.fn(() => ({
          isInFormFieldCreationMode: () => false,
        })),
      },
    });
    getPopupPosition.getAnnotationPosition.mockReturnValue({
      topLeft: { y: 100 },
      bottomRight: { y: 160 },
    });
    getPopupPosition.getContainingBlockDocOffset.mockReturnValue({ top: 0, left: 0 });
  });

  const testCases = [
    {
      name: 'single mode with visible page in non-builder mode',
      mode: 'Single',
      pageNumber: 1,
      visiblePages: [1],
      isFormBuilderMode: false,
      geometry: {
        viewerBoundingRect: { left: 200, right: 400 },
        appBoundingRect: { left: 10 },
        scrollLeft: 5,
        scrollTop: 10,
      },
      expected: {
        top: '100px',
        left: '75px',
        opacity: '1',
        visibility: 'visible',
        hasRightSideClass: false,
      },
    },
    {
      name: 'single mode with visible page in form builder mode',
      mode: 'Single',
      pageNumber: 1,
      visiblePages: [1],
      isFormBuilderMode: true,
      geometry: {
        viewerBoundingRect: { left: 200, right: 400 },
        appBoundingRect: { left: 10 },
        scrollLeft: 5,
        scrollTop: 10,
      },
      expected: {
        top: '100px',
        left: '75px',
        opacity: '0.5',
        visibility: 'visible',
        hasRightSideClass: false,
      },
    },
    {
      name: 'single mode with hidden page',
      mode: 'Single',
      pageNumber: 1,
      visiblePages: [2],
      isFormBuilderMode: false,
      geometry: {
        viewerBoundingRect: { left: 200, right: 400 },
        appBoundingRect: { left: 10 },
        scrollLeft: 5,
        scrollTop: 10,
      },
      expected: {
        top: '100px',
        left: '75px',
        opacity: '1',
        visibility: 'hidden',
        hasRightSideClass: false,
      },
    },
    {
      name: 'facing mode on right-side page',
      mode: 'Facing',
      pageNumber: 2,
      visiblePages: [2],
      isFormBuilderMode: false,
      geometry: {
        viewerBoundingRect: { left: 200, right: 400 },
        appBoundingRect: { left: 10 },
        scrollLeft: 5,
        scrollTop: 10,
      },
      expected: {
        top: '100px',
        left: '425px',
        opacity: '1',
        visibility: 'visible',
        hasRightSideClass: true,
      },
    },
    {
      name: 'single mode with custom geometry and scroll offsets',
      mode: 'Single',
      pageNumber: 3,
      visiblePages: [3],
      isFormBuilderMode: false,
      geometry: {
        viewerBoundingRect: { left: 320, right: 610 },
        appBoundingRect: { left: 50 },
        scrollLeft: 30,
        scrollTop: 30,
      },
      expected: {
        top: '80px',
        left: '180px',
        opacity: '1',
        visibility: 'visible',
        hasRightSideClass: false,
      },
    },
    {
      name: 'facing mode on left-side page keeps left formula',
      mode: 'Facing',
      pageNumber: 1,
      visiblePages: [1],
      isFormBuilderMode: false,
      geometry: {
        viewerBoundingRect: { left: 250, right: 520 },
        appBoundingRect: { left: 40 },
        scrollLeft: 15,
        scrollTop: 0,
      },
      expected: {
        top: '110px',
        left: '105px',
        opacity: '1',
        visibility: 'visible',
        hasRightSideClass: false,
      },
    },
    {
      name: 'cover mode on odd page uses right-side formula independent of app origin',
      mode: 'Cover',
      pageNumber: 3,
      visiblePages: [3],
      isFormBuilderMode: false,
      geometry: {
        viewerBoundingRect: { left: 330, right: 700 },
        appBoundingRect: { left: 500 },
        scrollLeft: 7,
        scrollTop: 10,
      },
      expected: {
        top: '100px',
        left: '727px',
        opacity: '1',
        visibility: 'visible',
        hasRightSideClass: true,
      },
    },
  ];

  const createParameters = ({
    mode,
    visiblePages,
    scrollLeft = 5,
    scrollTop = 10,
    viewerBoundingRect = { left: 200, right: 400 },
    appBoundingRect = { left: 10 },
  }) => {

    return ({
      displayMode: {
        mode,
        getVisiblePages: jest.fn(() => visiblePages),
      },
      viewerBoundingRect,
      appBoundingRect,
      scrollLeft,
      scrollTop,
    });
  };

  it.each(testCases)('should set computed styles for $name', ({
    mode,
    pageNumber,
    visiblePages,
    isFormBuilderMode,
    geometry,
    expected,
  }) => {
    useCore.mockReturnValue({
      core: {
        getFormFieldCreationManager: jest.fn(() => ({
          isInFormFieldCreationMode: () => isFormBuilderMode,
        })),
      },
    });

    const annotation = {
      PageNumber: pageNumber,
      getCustomData: () => 'Indicator Text',
    };
    const parameters = createParameters({ mode, visiblePages, ...geometry });

    render(
      <FormFieldIndicator
        annotation={annotation}
        parameters={parameters}
      />,
    );

    const indicator = screen.getByText('Indicator Text').closest('.formFieldIndicator');

    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveStyle({
      top: expected.top,
      left: expected.left,
      opacity: expected.opacity,
      visibility: expected.visibility,
    });

    if (expected.hasRightSideClass) {
      expect(indicator).toHaveClass('rightSidePage');
    } else {
      expect(indicator).not.toHaveClass('rightSidePage');
    }
  });

  it('positions the indicator relative to the Web Component host', () => {
    getPopupPosition.getContainingBlockDocOffset.mockReturnValue({ top: 30, left: 0 });

    const annotation = {
      PageNumber: 1,
      getCustomData: () => 'Indicator Text',
    };

    render(
      <FormFieldIndicator
        annotation={annotation}
        parameters={createParameters({ mode: 'Single', visiblePages: [1] })}
      />,
    );

    const indicator = screen.getByText('Indicator Text').closest('.formFieldIndicator');
    expect(indicator).toHaveStyle({
      top: '70px',
    });
    expect(getPopupPosition.getContainingBlockDocOffset).toHaveBeenLastCalledWith(indicator);
  });

  it('accounts for window scroll when positioning outside a Web Component', () => {
    getPopupPosition.getContainingBlockDocOffset.mockReturnValue({ top: 25, left: 0 });

    const annotation = {
      PageNumber: 1,
      getCustomData: () => 'Indicator Text',
    };

    render(
      <FormFieldIndicator
        annotation={annotation}
        parameters={createParameters({ mode: 'Single', visiblePages: [1] })}
      />,
    );

    expect(screen.getByText('Indicator Text').closest('.formFieldIndicator')).toHaveStyle({
      top: '75px',
    });
  });
});
