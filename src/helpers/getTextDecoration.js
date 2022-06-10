import { isUndefined } from 'lodash';

export default (style, richTextStyle) => {
  let newTextDecoration = '';

  const currentTextDecoration = richTextStyle['text-decoration'];

  const addUnderLine = style['underline'];
  const removeUnderLine = currentTextDecoration !== 'none' && (!isUndefined(style['underline']) && !style['underline']);

  const addLineThrough = style['line-through'];
  const removeLineThrough = currentTextDecoration !== 'none' && (!isUndefined(style['line-through']) && !style['line-through']);

  if (addUnderLine) {
    const hasUnderLine = currentTextDecoration?.indexOf('underline') > -1;
    newTextDecoration = hasUnderLine ? currentTextDecoration : `${currentTextDecoration || ''} underline`.trim();
  } else if (removeUnderLine) {
    newTextDecoration = currentTextDecoration.replace(/underline|word/g, '').trim();
  }

  if (addLineThrough) {
    const hasLineThrough = currentTextDecoration?.indexOf('line-through') > -1;
    newTextDecoration = hasLineThrough ? currentTextDecoration : `${currentTextDecoration || ''} line-through`.trim();
  } else if (removeLineThrough) {
    newTextDecoration = currentTextDecoration.replace(/line-through/g, '').trim();
  }

  return newTextDecoration;
};