import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Outline from './Outline';
import { Basic } from './Outline.stories';
import core from 'core';

const BasicOutline = withI18n(Basic);

export function getDefaultOutlines() {
  return createOutlines([
    {
      name: 'Introduction',
      children: [
        {
          name: 'Overview',
          children: [
            {
              name: 'Why WebViewer?',
              children: [],
            },
            {
              name: 'Supported File Formats',
              children: [],
            },
          ],
        },
      ],
    },
    {
      name: 'Pick the right SDK',
      children: [],
    },
  ]);
}

export function createOutlines(plainOutlines) {
  // given outline objects which have only string key-value pairs
  // add getters for each key
  return plainOutlines.map((outline, i) => createOutline(outline, null, i));
}

export function createOutline(outline, parent, i) {
  const children = [];

  const copy = {
    name: outline.name,
    getName: () => outline.name,
    children: children,
    getChildren: () => children,
    index: i,
    getIndex: () => i,
    parent: parent,
    getParent: () => parent,
  };

  outline.children.forEach((child, i) => children.push(createOutline(child, copy, i)));

  return copy;
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
