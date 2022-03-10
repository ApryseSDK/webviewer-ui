import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RedactionPageGroup from './RedactionPageGroup';
import { Basic } from './RedactionPageGroup.stories'
import { RedactionPanelContext } from '../RedactionPanel/RedactionPanelContext';

jest.mock('core', () => ({
  getDisplayAuthor: () => 'Duncan Idaho'
}));

let id = 1;
export const getMockRedactionAnnotation = (options) => ({
  Author: 'Duncan Idaho',
  IsText: false,
  Id: id++,
  DateCreated: '2021-08-19T22:43:04.795Z',
  getReplies: () => [1, 2, 3],
  getStatus: () => '',
  isReply: () => false,
  StrokeColor: {
    toString: () => 'rgba(255,0,0,1)'
  },
  getCustomData: () => 'This is a preview of the text that will be redacted and it is too long to fit ',
  ...options,
});

const RedactionPageGroupWithRedux = withProviders(RedactionPageGroup);

const RedactionPageGroupWithContext = (props) => {
  const context = {
    selectedRedactionItemId: '1',
    setSelectedRedactionItemId: (id) => { console.log({ id }) },
  };
  return (
    <RedactionPanelContext.Provider value={context}>
      <RedactionPageGroupWithRedux {...props} />
    </RedactionPanelContext.Provider>
  )
}

describe('RedactionPageGroup', () => {
  it('renders text redaction item correctly', () => {
    expect(() => {
      render(<Basic />)
    }).not.toThrow();
  });

  it('renders the correct number of redaction items and page number', () => {
    const textRedaction = getMockRedactionAnnotation();
    const regionRedaction = getMockRedactionAnnotation({ isText: false });
    const redactionItems = [textRedaction, regionRedaction];
    const props = {
      pageNumber: 1,
      redactionItems,
    };

    render(<RedactionPageGroupWithContext {...props} />);
    const renderedRedactionItems = screen.getAllByRole('listitem');
    expect(renderedRedactionItems.length).toEqual(redactionItems.length);
    screen.getByText(`Page ${props.pageNumber}`);
  });

  it('when I click on the chevron it collapses and expands the page group items', () => {
    const textRedaction = getMockRedactionAnnotation();
    const regionRedaction = getMockRedactionAnnotation({ isText: false });
    const redactionItems = [textRedaction, regionRedaction];
    const props = {
      pageNumber: 1,
      redactionItems,
    };

    render(<RedactionPageGroupWithContext {...props} />);

    let renderedRedactionItems = screen.getAllByRole('listitem');
    expect(renderedRedactionItems.length).toEqual(redactionItems.length);

    const collapseButton = screen.getByLabelText('Collapse');
    userEvent.click(collapseButton);

    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();

    const expandButton = screen.getByLabelText('Expand');
    userEvent.click(expandButton);

    renderedRedactionItems = screen.getAllByRole('listitem');
    expect(renderedRedactionItems.length).toEqual(redactionItems.length);
  })
});