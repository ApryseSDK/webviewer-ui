import React from 'react';
import { render } from '@testing-library/react';
import { BasicHorizontal } from './AnnotationPopup.stories';

const TestAnnotationPopup = withProviders(BasicHorizontal);

describe('AnnotationPopup Component', () => {
  it('Should not throw any errors when rendering storybook component', () => {
    expect(() => {
      render(<TestAnnotationPopup />);
    }).not.toThrow();
  });
});