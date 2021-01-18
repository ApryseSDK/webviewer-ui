import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Outline from './Outline';
import { Basic } from './Outline.stories';
import core from 'core';

const BasicOutline = withI18n(Basic);

export function createOutlines(plainOutlines) {
  // given outline objects which have only string key-value pairs
  // add getters for each key
  return plainOutlines.map(outline => createOutline(outline));
}

export function createOutline(outline) {
  const children = outline.children.map(child => createOutline(child));

  return {
    name: outline.name,
    getName: () => outline.name,
    children: children,
    getChildren: () => children,
  };
}

jest.mock('core');

describe('Outline', () => {
  it('Story should not throw any errors', () => {
    expect(() => {
      render(<BasicOutline />);
    }).not.toThrow();
  });

  it('Clicks on the arrow of a parent outline should expand the child outlines', () => {
    const { container } = render(<BasicOutline />);

    let outlineElements = container.querySelectorAll('.Outline');
    expect(outlineElements.length).toBe(1);

    const arrowElements = container.querySelectorAll('.arrow');
    expect(arrowElements.length).toBe(1);

    fireEvent.click(arrowElements[0]);

    outlineElements = container.querySelectorAll('.Outline');
    expect(outlineElements.length).toBe(2);
  });
});
