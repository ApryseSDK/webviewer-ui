import convertNewlinesToParagraphs from './convertNewlinesToParagraphs';

describe('Quill text transform for proper multiline handling', () => {
  it('should transform sample text correctly', () => {
    expect(convertNewlinesToParagraphs('&lt;div&gt; some text &lt;/div&gt;\n'))
      .toEqual('<p>&lt;div&gt; some text &lt;/div&gt;</p><p><br></p>');

    expect(convertNewlinesToParagraphs('<div> some text </div>\n'))
      .toEqual('<p><div> some text </div></p><p><br></p>');

    const response = convertNewlinesToParagraphs('Lorem Ipsum is simply dummy text of the printing \nand typesetting industry. Lorem Ipsum has been \nthe industry\'s standard dummy text ever since the 1500s');
    expect(response).toEqual('<p>Lorem Ipsum is simply dummy text of the printing </p><p>and typesetting industry. Lorem Ipsum has been </p><p>the industry\'s standard dummy text ever since the 1500s</p>');
  });
  it('should not transform sample text', () => {

    expect(convertNewlinesToParagraphs('&lt;div&gt; some text &lt;/div&gt;'))
      .toEqual('&lt;div&gt; some text &lt;/div&gt;');
    expect(convertNewlinesToParagraphs('<div> some text </div>'))
      .toEqual('<div> some text </div>');
  });

  it('should correctly transform the sample text across various cases.', () => {
    expect(convertNewlinesToParagraphs('')).toEqual('');

    expect(convertNewlinesToParagraphs('some more text without newline'))
      .toEqual('some more text without newline');

    expect(convertNewlinesToParagraphs('\n'))
      .toEqual('<p><br></p><p><br></p>');

    expect(convertNewlinesToParagraphs('\n\n\n'))
      .toEqual('<p><br></p><p><br></p><p><br></p><p><br></p>');

    expect(convertNewlinesToParagraphs('      text    \n     sample\ntest      '))
      .toEqual('<p>      text    </p><p>     sample</p><p>test      </p>');

    expect(convertNewlinesToParagraphs('<h1><a herf="http://link.com">link</a></h1>\n'))
      .toEqual('<p><h1><a herf="http://link.com">link</a></h1></p><p><br></p>');
  });
});
