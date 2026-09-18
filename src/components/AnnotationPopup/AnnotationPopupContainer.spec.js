import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useDispatch, useSelector } from 'react-redux';
import useCore from 'hooks/useCore';
import FocusStackManager from 'helpers/focusStackManager';
import AnnotationPopupContainer from './AnnotationPopupContainer';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('hooks/useCore');

jest.mock('./AnnotationPopup', () => {
  function MockAnnotationPopup({ onClearAppearanceSignature, popupRef }) {
    return (
      <div ref={popupRef}>
        <button onClick={onClearAppearanceSignature}>Clear signature</button>
      </div>
    );
  }

  return MockAnnotationPopup;
});

describe('AnnotationPopupContainer', () => {
  const dispatch = jest.fn();
  const annotationManager = {
    deselectAnnotation: jest.fn(),
    getFormFieldCreationManager: jest.fn(() => ({
      isInFormFieldCreationMode: () => false,
    })),
  };
  const signatureWidget = Object.create(window.Core.Annotations.SignatureWidgetAnnotation.prototype);
  const associatedSignature = Object.create(window.Core.Annotations.FreeHandAnnotation.prototype);

  beforeEach(() => {
    jest.clearAllMocks();

    useDispatch.mockReturnValue(dispatch);
    useSelector
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValue(false);
    useCore.mockReturnValue({
      core: {
        canModifyContents: () => false,
        getAnnotationManager: () => annotationManager,
        getContentEditManager: () => ({ isInContentEditMode: () => false }),
        getAnnotationsList: () => [signatureWidget],
        getDisplayModeObject: () => ({ getVisiblePages: () => [1] }),
        getFormFieldCreationManager: annotationManager.getFormFieldCreationManager,
        getNumberOfGroups: () => 0,
        getSelectedAnnotations: () => [],
        getTotalPages: () => 1,
        isAnnotationRedactable: () => false,
        isAnnotationSelected: () => false,
        isContinuousDisplayMode: () => true,
      },
    });

    signatureWidget.PageNumber = 1;
    signatureWidget.ToolName = '';
    signatureWidget.Measure = false;
    signatureWidget.isContentEditPlaceholder = () => false;
    signatureWidget.isSignedByAppearance = () => true;
    signatureWidget.clearSignature = jest.fn();
    signatureWidget.getInnerElement = () => ({ dataset: { element: 'signature-widget-1' } });
    signatureWidget.getAssociatedSignatureAnnotation = () => null;

    associatedSignature.PageNumber = 1;
    associatedSignature.ToolName = '';
    associatedSignature.Measure = false;
    associatedSignature.Subject = 'Signature';
    associatedSignature.isContentEditPlaceholder = () => false;

    FocusStackManager.clear();
  });

  afterEach(() => {
    FocusStackManager.clear();
  });

  const setupTest = (widgetThatOpenedPopupRef = { current: null }, focusedAnnotation = signatureWidget) => {
    const closePopup = jest.fn();

    const renderComponent = render(
      <AnnotationPopupContainer
        focusedAnnotation={focusedAnnotation}
        selectedMultipleAnnotations={false}
        canModify
        focusedAnnotationStyle={null}
        isDatePickerOpen={false}
        setDatePickerOpen={jest.fn()}
        isDatePickerMount={false}
        setDatePickerMount={jest.fn()}
        hasAssociatedLink={false}
        includesFormFieldAnnotation={false}
        closePopup={closePopup}
        widgetThatOpenedPopupRef={widgetThatOpenedPopupRef}
      />
    );

    return { ...renderComponent, closePopup };
  };

  it('clears the focus stack when an appearance signature is cleared', () => {
    const { closePopup } = setupTest();

    userEvent.click(screen.getByRole('button', { name: 'Clear signature' }));

    expect(signatureWidget.clearSignature).toHaveBeenCalledWith(annotationManager);
    expect(FocusStackManager.getStack()).toEqual(['signature-widget-1']);
    expect(closePopup).toHaveBeenCalledTimes(1);
  });

  it('clears the focus stack when an appearance signature is deleted with the keyboard', () => {
    const { closePopup } = setupTest({ current: signatureWidget });

    fireEvent.keyDown(screen.getByRole('button', { name: 'Clear signature' }), { key: 'Delete' });

    expect(signatureWidget.clearSignature).toHaveBeenCalledWith(annotationManager);
    expect(FocusStackManager.getStack()).toEqual(['signature-widget-1']);
    expect(closePopup).toHaveBeenCalledTimes(1);
  });

  it('restores focus to the signature widget when the popup closes with Escape', () => {
    const { closePopup } = setupTest();

    fireEvent.keyDown(screen.getByRole('button', { name: 'Clear signature' }), { key: 'Escape' });

    expect(FocusStackManager.getStack()).toEqual(['signature-widget-1']);
    expect(closePopup).toHaveBeenCalledTimes(1);
  });

  it('restores focus to the signature widget when an annotation-mode signature popup closes with Escape', () => {
    signatureWidget.getAssociatedSignatureAnnotation = () => associatedSignature;
    const { closePopup } = setupTest(undefined, associatedSignature);

    fireEvent.keyDown(screen.getByRole('button', { name: 'Clear signature' }), { key: 'Escape' });

    expect(FocusStackManager.getStack()).toEqual(['signature-widget-1']);
    expect(closePopup).toHaveBeenCalledTimes(1);
  });
});
