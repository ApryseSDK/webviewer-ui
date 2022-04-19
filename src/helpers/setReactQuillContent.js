/**
 * Transforming RichText Style object into the Object acceptable by React Quill component.
 */

const setReactQuillContent = annotation => {
  const richTextStyle = annotation.getRichTextStyle();
  const indexes = Object.keys(richTextStyle);
  const text = annotation.getContents();
  const editor = annotation.editor;
  const ops = [];

  for (let i = 0; i < indexes.length; i++) {
    const element = richTextStyle[indexes[i]];
    const attr = getAttributtes(element);
    const textSlice = text.slice(indexes[i], indexes[i + 1]);

    ops.push({ insert: textSlice, attributes: attr });
  }

  editor.setContents(ops);
  editor.setSelection(text.length, 0);
};

const getAttributtes = element => {
  const attr = {};
  if (element['font-weight']) {
    attr['bold'] = true;
  }
  if (element['font-style']) {
    attr['italic'] = true;
  }
  if (element['color']) {
    attr['color'] = element['color'];
  }
  if (element['text-decoration']) {
    const decoration = element['text-decoration'].split(' ');

    if (decoration.includes('line-through')) {
      attr['strike'] = true;
    }
    if (decoration.includes('word')) {
      attr['underline'] = true;
    }
  }

  return attr;
};

export default setReactQuillContent;
