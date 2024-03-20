const setAnnotationRichTextStyle = (editor, annotation) => {
  const richTextStyle = {};
  const ops = editor.getContents().ops;
  let breakpoint = 0;
  ops.forEach((item) => {
    const attributes = item.attributes;
    const isMention = item.insert?.mention;
    let value = item.insert;
    if (isMention) {
      const mention = item.insert.mention;
      value = mention.denotationChar + mention.value;
    }
    const cssStyle = {};
    if (attributes === null || attributes === undefined ? undefined : attributes.bold) {
      cssStyle['font-weight'] = 'bold';
    }
    if (attributes === null || attributes === undefined ? undefined : attributes.italic) {
      cssStyle['font-style'] = 'italic';
    }
    if (attributes === null || attributes === undefined ? undefined : attributes.color) {
      cssStyle['color'] = attributes.color;
    }
    if (attributes === null || attributes === undefined ? undefined : attributes.underline) {
      cssStyle['text-decoration'] = 'word';
    }
    if (attributes === null || attributes === undefined ? undefined : attributes.strike) {
      if (cssStyle['text-decoration']) {
        cssStyle['text-decoration'] = `${cssStyle['text-decoration']} line-through`;
      } else {
        cssStyle['text-decoration'] = 'line-through';
      }
    }
    if (attributes === null || attributes === undefined ? undefined : attributes.size) {
      cssStyle['font-size'] = attributes.size;
    }
    if (attributes === null || attributes === undefined ? undefined : attributes.font) {
      cssStyle['font-family'] = attributes.font;
    }

    richTextStyle[breakpoint] = cssStyle;
    breakpoint += value.length;
  });
  annotation.setRichTextStyle(richTextStyle);
};

export default setAnnotationRichTextStyle;
