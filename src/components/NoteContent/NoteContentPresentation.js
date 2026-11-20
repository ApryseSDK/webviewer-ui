import React from 'react';
import Autolinker from 'autolinker';
import isString from 'lodash/isString';
import { css } from '@emotion/react';
import NoteTextPreview from 'components/NoteTextPreview';
import DataElementWrapper from '../DataElementWrapper';
import { isDarkColorHex, isLightColorHex } from 'helpers/color';
import { COMMON_COLORS } from 'constants/commonColors';
import Theme from 'constants/theme';

const getRichTextSpan = (text, richTextStyle, key) => {
  const style = {
    fontWeight: richTextStyle['font-weight'],
    fontStyle: richTextStyle['font-style'],
    textDecoration: richTextStyle['text-decoration'],
    color: richTextStyle['color']
  };
  if (style.textDecoration) {
    style.textDecoration = style.textDecoration.replace('word', 'underline');
  }
  return (
    <span css={css({ ...style })} key={key}>{text}</span>
  );
};

const renderRichText = (text, richTextStyle, start) => {
  if (!richTextStyle || !text) {
    return text;
  }

  const styles = {};
  const indices = Object.keys(richTextStyle).map(Number).sort((a, b) => a - b);
  for (const styleIndex of indices) {
    let index = styleIndex - start;
    index = Math.min(Math.max(index, 0), text.length);
    styles[index] = richTextStyle[styleIndex];
    if (index === text.length) {
      break;
    }
  }

  const contentToRender = [];
  const styleIndices = Object.keys(styles).map(Number).sort((a, b) => a - b);
  for (let i = 1; i < styleIndices.length; i++) {
    contentToRender.push(getRichTextSpan(
      text.slice(styleIndices[i - 1], styleIndices[i]),
      styles[styleIndices[i - 1]],
      `richtext_span_${i}`
    ));
  }

  return contentToRender;
};

export const highlightSearchInput = (fullText, searchInput, richTextStyle, start = 0, end = fullText.length) => {
  const text = fullText.slice(start, end);
  const loweredText = text.toLowerCase();
  const loweredSearchInput = searchInput.toLowerCase();
  if (richTextStyle) {
    richTextStyle['0'] = richTextStyle['0'] || {};
    richTextStyle[fullText.length] = richTextStyle[fullText.length] || {};
  }
  let lastFoundInstance = loweredText.indexOf(loweredSearchInput);
  if (!loweredSearchInput.trim() || lastFoundInstance === -1) {
    return renderRichText(text, richTextStyle, start);
  }
  const contentToRender = [];
  const allFoundPositions = [lastFoundInstance];
  // Escape all RegExp special characters
  const regexSafeSearchInput = loweredSearchInput.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
  if (new RegExp(`(${regexSafeSearchInput})`, 'gi').test(loweredText)) {
    while (lastFoundInstance !== -1) {
      lastFoundInstance = loweredText.indexOf(loweredSearchInput, lastFoundInstance + loweredSearchInput.length);
      if (lastFoundInstance !== -1) {
        allFoundPositions.push(lastFoundInstance);
      }
    }
  }
  allFoundPositions.forEach((position, idx) => {
    if (idx === 0 && position !== 0) {
      contentToRender.push(renderRichText(text.substring(0, position), richTextStyle, start));
    }
    contentToRender.push(
      <span className="highlight" key={`highlight_span_${start + position}`}>
        {
          renderRichText(
            text.substring(position, position + loweredSearchInput.length),
            richTextStyle,
            start + position)
        }
      </span>
    );
    if (
      position + loweredSearchInput.length < loweredText.length
      && position + loweredSearchInput.length !== allFoundPositions[idx + 1]
    ) {
      contentToRender.push(renderRichText(
        text.substring(position + loweredSearchInput.length, allFoundPositions[idx + 1]),
        richTextStyle,
        start + position + loweredSearchInput.length
      ));
    }
  });
  return contentToRender;
};

// The supplied style object is intentionally adjusted in place, just as the annotation's style was.
export const adjustTextForTheme = (textColor, richTextStyle, activeTheme, Color) => {
  if (activeTheme === Theme.DARK) {
    if (textColor && isDarkColorHex(textColor.toHexString())) {
      textColor = new Color(255, 255, 255, 1);
    }
    if (richTextStyle) {
      const sections = Object.keys(richTextStyle);
      sections.forEach((a) => {
        if (richTextStyle[a]['color'] && isDarkColorHex(richTextStyle[a]['color'])) {
          richTextStyle[a]['color'] = COMMON_COLORS['white'];
        }
      });
    }
  } else if (activeTheme === Theme.LIGHT) {
    if (textColor && isLightColorHex(textColor.toHexString())) {
      textColor = new Color(0, 0, 0, 1);
    }
    if (richTextStyle) {
      const sections = Object.keys(richTextStyle);
      sections.forEach((a) => {
        if (richTextStyle[a]['color'] && isLightColorHex(richTextStyle[a]['color'])) {
          richTextStyle[a]['color'] = COMMON_COLORS['black'];
        }
      });
    }
  }
  return { textColor, richTextStyle };
};

export const renderNoteContents = ({
  contents, richTextStyle, fontColor, skipAutoLink, searchInput,
  isReply, canCollapseTextPreview, canCollapseReplyPreview, isTrackedChange,
  trackedChangeLabels, annotation, resize,
}) => {
  const autolinkerContent = [];
  if (!skipAutoLink) {
    Autolinker.link(contents, {
      stripPrefix: false,
      stripTrailingSlash: false,
      replaceFn(match) {
        const href = match.getAnchorHref();
        const anchorText = match.getAnchorText();
        const offset = match.getOffset();

        switch (match.getType()) {
          case 'url':
          case 'email':
          case 'phone':
            autolinkerContent.push({
              href,
              text: anchorText,
              start: offset,
              end: offset + match.getMatchedText().length
            });
        }
      }
    });
  }

  if (!autolinkerContent.length) {
    const highlightResult = highlightSearchInput(contents, searchInput, richTextStyle);
    const shouldCollapseAnnotationText = !isReply && canCollapseTextPreview;
    const shouldCollapseReply = isReply && canCollapseReplyPreview;

    if (!searchInput && (shouldCollapseAnnotationText || shouldCollapseReply)) {
      const beforeContent = () => {
        if (!isTrackedChange) {
          return null;
        }

        const text = trackedChangeLabels[annotation['TrackedChangeType']];
        return text && (
          <span
            className="tracked-change-label"
            css={css({ color: annotation.FillColor.toString() })}
          >
            {text}
          </span>
        );
      };

      return (
        <NoteTextPreview
          linesToBreak={3}
          comment
          renderRichText={renderRichText}
          richTextStyle={richTextStyle}
          resize={resize}
          textStyle={fontColor}
          beforeContent={beforeContent}
        >
          {contents}
        </NoteTextPreview>
      );
    }
    return highlightResult;
  }
  const contentToRender = [];
  let strIdx = 0;
  autolinkerContent.forEach((anchorData) => {
    const { start, end, href } = anchorData;
    if (strIdx < start) {
      contentToRender.push(
        <span key={`span_${strIdx}_${start}`}>
          {highlightSearchInput(contents, searchInput, richTextStyle, strIdx, start)}
        </span>
      );
    }
    contentToRender.push(
      <a href={href} target="_blank" rel="noopener noreferrer" key={`a_${start}_${end}`}>
        {highlightSearchInput(contents, searchInput, richTextStyle, start, end)}
      </a>
    );
    strIdx = end;
  });
  // Preserve the existing end-of-string boundary when rendering text after a link.
  if (strIdx < contents.length - 1) {
    contentToRender.push(highlightSearchInput(contents, searchInput, richTextStyle, strIdx));
  }
  return contentToRender;
};

export const renderSelectedTextPreview = (text, searchInput, isReply, canCollapseTextPreview, handleNoteClick) => {
  if (!isString(text) || text === '') {
    return null;
  }

  const highlightSearchResult = highlightSearchInput(text, searchInput);
  const shouldCollapseAnnotationText = !isReply && canCollapseTextPreview;
  if (isString(highlightSearchResult) && shouldCollapseAnnotationText) {
    return (
      <DataElementWrapper
        onClick={handleNoteClick}
        className="selected-text-preview"
        dataElement="notesSelectedTextPreview">
        <NoteTextPreview linesToBreak={3}>
          {`"${highlightSearchResult}"`}
        </NoteTextPreview>
      </DataElementWrapper>
    );
  }
  return (
    <div className="selected-text-preview">
      {highlightSearchResult}
    </div>
  );
};
