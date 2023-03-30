import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import './NoteTextPreview.scss';

function NoteTextPreview(props) {
  /* This replace is to remove the break line that the React Quill component add into the text */
  const text = props.children.replace(/\n$/, '');
  const {
    panelWidth,
    linesToBreak,
    renderRichText,
    richTextStyle,
    resize,
    style,
    /* If text being previewed is a comment it gets a darker font color */
    comment = false
  } = props;
  const [expanded, setExpand] = useState(false);
  const [previewElementWidth, setPreviewWidth] = useState(null);
  const [charsPerLine, setCharsperLine] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const ref = React.useRef(null);// Must import this way in order to mock it properly
  const { t } = useTranslation();

  const onClickHandler = (event) => {
    event.stopPropagation();
    setExpand(!expanded);
    resize && resize();
  };

  const textToDisplay = expanded ? text : text.substring(0, charsPerLine * linesToBreak);
  const prompt = expanded ? t('action.showLess') : t('action.showMore');
  const noteTextPreviewClass = classNames('note-text-preview', { 'preview-comment': comment });

  useEffect(() => {
    const textNodeWidth = ref.current.clientWidth;
    setPreviewWidth(textNodeWidth);
  }, [panelWidth]);

  // useLayoutEffect to avoid a flicker before we get the final text prop
  useLayoutEffect(() => {
    function getTextWidth(text) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      context.font = '13px sans-serif';

      return context.measureText(text).width;
    }

    const textWidth = getTextWidth(text);
    const averageCharWidth = textWidth / text.length;
    const charsPerLine = Math.floor(previewElementWidth / averageCharWidth);
    setCharsperLine(charsPerLine);

    const totalLines = textWidth / previewElementWidth;
    setShowPrompt(totalLines > linesToBreak);
  }, [text, previewElementWidth]);

  return (
    <div className={noteTextPreviewClass} ref={ref} style={style}>
      {renderRichText && richTextStyle ? renderRichText(textToDisplay, richTextStyle, 0) : textToDisplay} {showPrompt && <a className="note-text-preview-prompt" onClick={onClickHandler}>{prompt}</a>}
    </div>
  );
}

export default NoteTextPreview;