import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PageControls from './PageControls';
import core from 'core';

const PageControlWithRedux = withProviders(PageControls);

const props = {
  dataElement: 'page-controls-container',
  size: 0,
  leftChevron: {
    dataElement: 'leftChevronBtn',
    title: 'action.pagePrev',
    label: null,
    img: 'icon-chevron-up',
    type: 'customButton',
    disabled: false,
    ariaLabel: 'action.pagePrev',
    onClick: jest.fn(),
  },
  rightChevron: {
    dataElement: 'rightChevronBtn',
    title: 'action.pageNext',
    label: null,
    img: 'icon-chevron-right',
    type: 'customButton',
    disabled: false,
    ariaLabel: 'action.pageNext',
    onClick: jest.fn(),
  },
  input: '7',
  totalPages: 11,
  onChange: jest.fn(),
};

describe('Page Controls Container component', () => {
  beforeEach(() => {
    const documentViewer = core.setDocumentViewer(1, new window.Core.DocumentViewer());
    documentViewer.doc = new window.Core.Document('dummy', 'pdf');
  });

  it('Should be able to find input and check input value', () => {
    render(<PageControlWithRedux {...props} />);
    const input = screen.getByRole('textbox');
    expect(input.value).toEqual(props.input);
  });

  it('Should be able to type into input of Page Controls', () => {
    render(<PageControlWithRedux {...props} />);
    const input = screen.getByRole('textbox');
    userEvent.type(input, '8');
    expect(input.value).toEqual(props.input);
  });

  it('Should call onClick on left/right button on Page Controls component', () => {
    render(<PageControlWithRedux {...props} />);
    const leftBtn = screen.getByRole('button', { name: 'action.pagePrev' });
    const rightBtn = screen.getByRole('button', { name: 'action.pageNext' });
    expect(leftBtn).toBeInTheDocument();
    expect(rightBtn).toBeInTheDocument();
    fireEvent.click(leftBtn);
    fireEvent.click(rightBtn);
    expect(props.leftChevron.onClick).toHaveBeenCalledTimes(1);
    expect(props.rightChevron.onClick).toHaveBeenCalledTimes(1);
  });
});
