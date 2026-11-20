import React from 'react';
import { render } from '@testing-library/react';
import useCore from 'hooks/useCore';
import applyRedactions from 'helpers/applyRedactions';
import RedactionSearchResultsContainer from './RedactionSearchResultsContainer';

jest.mock('core', () => ({
  getCurrentUser: () => 'test-user',
}));

jest.mock('hooks/useCore');

jest.mock('helpers/applyRedactions', () => jest.fn(() => () => {}));

const mockRedactionSearchResults = jest.fn(() => null);
jest.mock('./RedactionSearchResults', () => (props) => mockRedactionSearchResults(props));

const mockSearchResults = [
  {
    page_num: 1,
    quads: [{ getPoints: () => [0, 0, 100, 0, 0, 20, 100, 20] }],
    result_str: 'secret',
    type: 'text',
  },
];

const customOverlayText = 'CONFIDENTIAL';
const activeToolStyles = {
  StrokeColor: new window.Core.Annotations.Color(0, 0, 255, 1),
  OverlayText: customOverlayText,
  FillColor: new window.Core.Annotations.Color(0, 0, 0, 1),
  Font: 'Courier',
  TextColor: new window.Core.Annotations.Color(255, 255, 255, 1),
};

describe('RedactionSearchResultsContainer', () => {
  const addAnnotations = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useCore.mockReturnValue({
      core: {
        getTool: () => null,
        getAnnotationManager: () => ({ addAnnotations }),
      },
    });
  });

  const renderContainer = () => {
    const Wrapped = withProviders(RedactionSearchResultsContainer, {
      viewer: {
        activeToolName: 'AnnotationCreateRedaction',
        activeToolStyles,
      },
    });
    render(<Wrapped onCancelSearch={() => {}} />);
    return mockRedactionSearchResults.mock.calls[0][0];
  };

  it('applies the active redaction tool styles (including overlay text) when redacting from search results', () => {
    const props = renderContainer();

    props.redactSelectedResults(mockSearchResults);

    expect(applyRedactions).toHaveBeenCalled();
    const [annotations] = applyRedactions.mock.calls[0];
    expect(annotations[0]['OverlayText']).toEqual(customOverlayText);
  });

  it('applies the same active redaction tool styles when marking results for redaction', () => {
    const props = renderContainer();

    props.markSelectedResultsForRedaction(mockSearchResults);

    expect(addAnnotations).toHaveBeenCalled();
    const [annotations] = addAnnotations.mock.calls[0];
    expect(annotations[0]['OverlayText']).toEqual(customOverlayText);
  });
});
