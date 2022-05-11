const setAnnotationRichTextStyle = (editor, annotation) => {
  const richTextStyle = {};
  const ops = editor.getContents().ops;
  let breakpoint = 0;
  ops.forEach(item => {
    const attributes = item.attributes;
    const insert = item.insert;
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
    richTextStyle[breakpoint] = cssStyle;
    breakpoint += insert.length;
  });
  annotation.setRichTextStyle(richTextStyle);
};

export default setAnnotationRichTextStyle;
