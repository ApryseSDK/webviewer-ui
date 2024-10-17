import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BasicHorizontal, IsReadOnlyMode } from './AnnotationPopup.stories';
import AnnotationPopup from './AnnotationPopup';

const TestAnnotationPopup = withProviders(BasicHorizontal);

describe('AnnotationPopup Component', () => {
  it('Should not throw any errors when rendering storybook component', () => {
    expect(() => {
      render(<TestAnnotationPopup />);
    }).not.toThrow();
  });

  it.skip('OLD: Should have the focus trapped in the Annotation Popup component', () => {
    render(<TestAnnotationPopup />);

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(4);
    const [button1, button2, button3, button4] = buttons;

    // Initial focus on the first button
    button1.focus();
    expect(button1).toHaveFocus();

    // Press Tab to move focus to button 2
    userEvent.tab();
    expect(button2).toHaveFocus();

    // Press Tab to move focus to button 3
    userEvent.tab();
    expect(button3).toHaveFocus();

    // Press Tab to move focus to button 4
    userEvent.tab();
    expect(button4).toHaveFocus();

    // Press Tab again to move focus back to the first button
    userEvent.tab();
    expect(button1).toHaveFocus();

    // Press Shift+Tab to move focus back to the last button
    userEvent.tab({ shift: true });
    expect(button4).toHaveFocus();
  });


  it('WISEflow: Should have the focus trapped in the Annotation Popup component', () => {
    render(<TestAnnotationPopup />);

    const buttons = screen.getAllByRole('button');
    // expect(buttons.length).toBe(4); // We've out commented the "link" button AnnotationPopup.js:409
    expect(buttons.length).toBe(3);
    const [button1, button2, button3] = buttons;

    // Initial focus on the first button
    button1.focus();
    expect(button1).toHaveFocus();

    // Press Tab to move focus to button 2
    userEvent.tab();
    expect(button2).toHaveFocus();

    // Press Tab to move focus to button 3
    userEvent.tab();
    expect(button3).toHaveFocus();

    // Press Tab to move focus to button 4
    // userEvent.tab();
    // expect(button4).toHaveFocus();

    // Press Tab again to move focus back to the first button
    userEvent.tab();
    expect(button1).toHaveFocus();

    // Press Shift+Tab to move focus back to the last button
    userEvent.tab({ shift: true });
    expect(button3).toHaveFocus();
  });
});

const TestReadOnlyAnnotationPopup = withProviders(IsReadOnlyMode);

const AnnotationPopupWithProviders = withProviders(AnnotationPopup);

describe('AnnotationPopup in read-only mode', () => {
  const mockFileAttachmentAnnotation = new window.Core.Annotations.FileAttachmentAnnotation();
  const fileAttachmentProps = {
    isOpen: true,
    isRightClickMenu: false,
    focusedAnnotation: mockFileAttachmentAnnotation,
    position: { top: 0, left: 0 },
    showCommentButton: true,
    onCommentAnnotation: () => console.log('Comment'),
    showEditStyleButton: false,
    showLinkButton: false,
    linkAnnotationToURL: () => console.log('Link'),
    showDeleteButton: false,
    onDeleteAnnotation: () => console.log('Delete'),
    showFileDownloadButton: true,
    showCalibrateButton: false,
  };

  it('Should no throw any error', () => {
    expect(() => {
      render(<TestReadOnlyAnnotationPopup {...fileAttachmentProps} />);
    }).not.toThrow();
  });

  it('Should render the "download button" when annotation is FileAttachmentAnnotation', () => {
    const mockFileAttachmentAnnotation = new window.Core.Annotations.FileAttachmentAnnotation();
    const fileAttachmentProps = {
      isOpen: true,
      isRightClickMenu: false,
      focusedAnnotation: mockFileAttachmentAnnotation,
      position: { top: 0, left: 0 },
      showCommentButton: true,
      onCommentAnnotation: () => console.log('Comment'),
      showEditStyleButton: false,
      showLinkButton: false,
      linkAnnotationToURL: () => console.log('Link'),
      showDeleteButton: false,
      onDeleteAnnotation: () => console.log('Delete'),
      showFileDownloadButton: true,
      showCalibrateButton: false,
    };

    render(
      <AnnotationPopupWithProviders {...fileAttachmentProps} />
    );

    screen.getByLabelText('Download attached file');
    screen.getByLabelText('Comment');
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(2);
  });

  describe('should only render the "Comment Button"', () => {
    // The following properties are related to canModify in AnnotationPopupContainer
    // showCalibrateButton, showDeleteButton, showEditStyleButton, showGroupButton
    const basicProps = {
      isOpen: true,
      isRightClickMenu: false,
      position: { top: 0, left: 0 },
      showCommentButton: true,
      onCommentAnnotation: () => console.log('Comment'),
      showEditStyleButton: false,
      showLinkButton: false,
      linkAnnotationToURL: () => console.log('Link'),
      showDeleteButton: false,
      onDeleteAnnotation: () => console.log('Delete'),
      showCalibrateButton: false,
      isInReadOnlyMode: true
    };

    function createAnnotationProps(annotation) {
      return {
        ...basicProps,
        focusedAnnotation: annotation
      };
    }

    function shouldOnlyRenderCommentButton(annotation) {
      render(
        <AnnotationPopupWithProviders {...createAnnotationProps(annotation)} />
      );

      screen.getByLabelText('Comment');
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBe(1);
    }

    it('for FreeTextAnnotation', () => {
      const freeTextAnnotation = new window.Core.Annotations.FreeTextAnnotation();
      shouldOnlyRenderCommentButton(freeTextAnnotation);
    });

    it('for freehand annotations', () => {
      const freeHandAnnotation = new window.Core.Annotations.FreeHandAnnotation();
      shouldOnlyRenderCommentButton(freeHandAnnotation);
    });

    it('for Line Annotation', () => {
      const lineAnnotation = new window.Core.Annotations.LineAnnotation();
      shouldOnlyRenderCommentButton(lineAnnotation);
    });

    it('for EllipseAnnotation', () => {
      const ellipseAnnotation = new window.Core.Annotations.EllipseAnnotation();
      shouldOnlyRenderCommentButton(ellipseAnnotation);
    });

    it('for RedactionAnnotation', () => {
      const redactionAnnotation = new window.Core.Annotations.RedactionAnnotation();
      shouldOnlyRenderCommentButton(redactionAnnotation);
    });

    it('for RectangleAnnotation', () => {
      const rectangleAnnotation = new window.Core.Annotations.RectangleAnnotation();
      shouldOnlyRenderCommentButton(rectangleAnnotation);
    });

    it('for Model3DAnnotation', () => {
      const Model3DAnnotation = new window.Core.Annotations.Model3DAnnotation();
      shouldOnlyRenderCommentButton(Model3DAnnotation);
    });
  });
});