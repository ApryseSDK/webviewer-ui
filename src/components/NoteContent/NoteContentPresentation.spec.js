import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { COMMON_COLORS } from 'constants/commonColors';
import Theme from 'constants/theme';
import {
  adjustTextForTheme,
  renderNoteContents,
  renderSelectedTextPreview,
} from './NoteContentPresentation';

jest.mock('components/NoteTextPreview', () => {
  const MockPreview = ({ children, beforeContent }) => (
    <div data-testid="text-preview">{beforeContent?.()}{children}</div>
  );
  return MockPreview;
});

jest.mock('../DataElementWrapper', () => {
  const MockWrapper = ({ children, onClick, className, dataElement }) => (
    <div onClick={onClick} className={className} data-element={dataElement}>{children}</div>
  );
  return MockWrapper;
});

// eslint-disable-next-line custom/no-hex-colors
const BLACK_HEX = '#000000';
// eslint-disable-next-line custom/no-hex-colors
const WHITE_HEX = '#ffffff';
// eslint-disable-next-line custom/no-hex-colors
const MUTED_HEX = '#888888';
// eslint-disable-next-line custom/no-hex-colors
const FIRST_STYLE_HEX = '#abc';
// eslint-disable-next-line custom/no-hex-colors
const SECOND_STYLE_HEX = '#def';
// eslint-disable-next-line custom/no-hex-colors
const SEARCH_STYLE_HEX = '#123456';
// eslint-disable-next-line custom/no-hex-colors
const TRACKED_CHANGE_HEX = '#112233';

const renderNote = (overrides = {}) => render(
  <div>{renderNoteContents({
    contents: 'Hello world',
    richTextStyle: null,
    fontColor: {},
    skipAutoLink: false,
    searchInput: '',
    isReply: false,
    canCollapseTextPreview: false,
    canCollapseReplyPreview: false,
    isTrackedChange: false,
    trackedChangeLabels: {},
    annotation: {},
    resize: jest.fn(),
    ...overrides,
  })}</div>
);

describe('NoteContent presentation', () => {
  it('renders styled rich text with underline normalization', () => {
    const style = { 0: { 'text-decoration': 'word', color: FIRST_STYLE_HEX }, 4: { color: SECOND_STYLE_HEX }, 8: {} };
    const { container } = renderNote({ contents: 'abcdefgh', richTextStyle: style, skipAutoLink: true });
    const spans = container.querySelectorAll('span');
    expect(container.textContent).toBe('abcdefgh');
    expect(spans).toHaveLength(2);
    expect(spans[0]).toHaveTextContent('abcd');
    expect(spans[0]).toHaveStyle('text-decoration: underline');
    expect(spans[1]).toHaveTextContent('efgh');
  });

  it('highlights case-insensitive literal searches and preserves style sentinel mutation', () => {
    const style = { 2: { color: SEARCH_STYLE_HEX } };
    const { container } = renderNote({ contents: 'a+b A+B', searchInput: 'a+b', richTextStyle: style, skipAutoLink: true });
    expect(style[0]).toEqual({});
    expect(style[7]).toEqual({});
    const highlights = container.querySelectorAll('.highlight');
    expect(highlights).toHaveLength(2);
    expect(highlights[0]).toHaveTextContent('a+b');
    expect(highlights[1]).toHaveTextContent('A+B');
  });

  it('renders autolinks with destination and safe target attributes', () => {
    const { container } = renderNote({ contents: 'Before https://example.com after', searchInput: 'Before' });
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(container.querySelector('.highlight')).toHaveTextContent('Before');
    expect(container).toHaveTextContent('Before https://example.com after');
  });

  it('honors skipAutoLink and collapse settings, including tracked-change label', () => {
    const annotation = { TrackedChangeType: 1, FillColor: { toString: () => TRACKED_CHANGE_HEX } };
    const { rerender, container } = renderNote({
      contents: 'https://example.com', skipAutoLink: true, canCollapseTextPreview: true,
      isTrackedChange: true, trackedChangeLabels: { 1: 'Added' }, annotation,
    });
    expect(screen.getByTestId('text-preview')).toHaveTextContent('Addedhttps://example.com');
    expect(container.querySelector('.tracked-change-label')).toHaveTextContent('Added');
    rerender(<div>{renderNoteContents({
      contents: 'https://example.com', richTextStyle: null, fontColor: {}, skipAutoLink: true,
      searchInput: 'example', isReply: false, canCollapseTextPreview: true,
      canCollapseReplyPreview: false, isTrackedChange: true,
      trackedChangeLabels: { 1: 'Added' }, annotation, resize: jest.fn(),
    })}</div>);
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.queryByTestId('text-preview')).toBeNull();
    expect(container.querySelector('.highlight')).toHaveTextContent('example');
  });

  it.each`
    noteType   | isReply  | canCollapseTextPreview | canCollapseReplyPreview | shouldCollapse
    ${'root'}  | ${false} | ${true}                | ${false}                | ${true}
    ${'root'}  | ${false} | ${false}               | ${true}                 | ${false}
    ${'reply'} | ${true}  | ${false}               | ${true}                 | ${true}
    ${'reply'} | ${true}  | ${true}                | ${false}                | ${false}
  `('$noteType note with text collapse $canCollapseTextPreview and reply collapse $canCollapseReplyPreview collapses: $shouldCollapse', ({
    isReply, canCollapseTextPreview, canCollapseReplyPreview, shouldCollapse,
  }) => {
    const { container } = renderNote({
      contents: 'Plain note', skipAutoLink: true, isReply, canCollapseTextPreview, canCollapseReplyPreview,
    });

    expect(container.textContent).toBe('Plain note');
    if (shouldCollapse) {
      expect(screen.getByTestId('text-preview')).toHaveTextContent('Plain note');
    } else {
      expect(screen.queryByTestId('text-preview')).toBeNull();
    }
  });

  it('does not collapse selected text for a reply', () => {
    const { container } = render(<div>{renderSelectedTextPreview('Selected', '', true, true, jest.fn())}</div>);

    expect(screen.queryByTestId('text-preview')).toBeNull();
    expect(container.querySelector('.selected-text-preview')).toHaveTextContent('Selected');
  });

  it('collapses plain selected text but shows the full highlighted preview when searching', () => {
    const onClick = jest.fn();
    const { rerender, container } = render(<div>{renderSelectedTextPreview('Selected', '', false, true, onClick)}</div>);
    expect(screen.getByTestId('text-preview')).toHaveTextContent('"Selected"');
    fireEvent.click(container.querySelector('[data-element="notesSelectedTextPreview"]'));
    expect(onClick).toHaveBeenCalledTimes(1);
    rerender(<div>{renderSelectedTextPreview('Selected', 'lect', false, true, onClick)}</div>);
    expect(screen.queryByTestId('text-preview')).toBeNull();
    expect(container.querySelector('.highlight')).toHaveTextContent('lect');
    expect(renderSelectedTextPreview('', '', false, true, onClick)).toBeNull();
    expect(renderSelectedTextPreview(undefined, '', false, true, onClick)).toBeNull();
    expect(renderSelectedTextPreview(null, '', false, true, onClick)).toBeNull();
    expect(renderSelectedTextPreview(42, '', false, true, onClick)).toBeNull();
  });

  it('adjusts colors for each theme while mutating the existing rich-text style object', () => {
    const Color = jest.fn((...rgba) => ({ rgba }));
    const darkStyle = { 0: { color: BLACK_HEX }, 2: { color: MUTED_HEX } };
    const darkText = { toHexString: () => BLACK_HEX };
    const darkResult = adjustTextForTheme(darkText, darkStyle, Theme.DARK, Color);
    expect(darkResult.textColor.rgba).toEqual([255, 255, 255, 1]);
    expect(darkResult.richTextStyle).toBe(darkStyle);
    expect(darkStyle[0].color).toBe(COMMON_COLORS['white']);
    expect(darkStyle[2].color).toBe(MUTED_HEX);

    const lightStyle = { 0: { color: WHITE_HEX } };
    const lightResult = adjustTextForTheme({ toHexString: () => WHITE_HEX }, lightStyle, Theme.LIGHT, Color);
    expect(lightResult.textColor.rgba).toEqual([0, 0, 0, 1]);
    expect(lightStyle[0].color).toBe(COMMON_COLORS['black']);
    const unchanged = { toHexString: () => MUTED_HEX };
    expect(adjustTextForTheme(unchanged, lightStyle, 'custom', Color).textColor).toBe(unchanged);
  });
});
