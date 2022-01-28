import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import './NoteTextPreview.scss'

function NoteTextPreview(props) {
  const text = props.children;
  const { notePanelWidth, linesToBreak, comment } = props;
  const [expanded, setExpand] = useState(false);
  const [previewElementWidth, setPreviewWidth] = useState(null);
  const [charsPerLine, setCharsperLine] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const ref = React.useRef(null);// Must import this way in order to mock it properly
  const { t } = useTranslation();

  const onClickHandler = (event) => {
    event.stopPropagation();
    setExpand(!expanded)
  };

  const textToDisplay = expanded ? text : text.substring(0, charsPerLine * linesToBreak);
  const prompt = expanded ? t('action.showLess') : t('action.showMore');
  const noteTextPreviewClass = classNames('note-text-preview', { 'preview-comment': comment })

  useEffect(() => {
    const textNodeWidth = ref.current.clientWidth;
    setPreviewWidth(textNodeWidth)
  }, [notePanelWidth]);

  //useLayoutEffect to avoid a flicker before we get the final text prop
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

  }, [text, previewElementWidth])

  return (
    <div className={noteTextPreviewClass} ref={ref}>
      {textToDisplay} {showPrompt && <a className="note-text-preview-prompt" onClick={onClickHandler}>{prompt}</a>}
    </div>
  )
};

export default NoteTextPreview;