import setReactQuillContent from './setReactQuillContent';

jest.mock('./MentionsManager', () => ({
  getFormattedTextFromDeltas: jest.fn(),
  extractMentionDataFromStr: jest.fn().mockReturnValue({ plainTextValue: 'TEST' })
}));

describe('setReactQuillContent', () => {
  it('should not apply italic / bold styling when the annotation has normal font weight and style', () => {
    const mockAnnotation = {
      getRichTextStyle: () => {
        return { 0: { 'font-size': '10.5pt', 'font-style': 'normal', 'font-weight': 'normal', 'text-align': 'left' } };
      }
    };

    const mockEditor = {
      getContents: jest.fn(),
      setContents: jest.fn(),
      setSelection: jest.fn()
    };
    const setContentsSpy = jest.spyOn(mockEditor, 'setContents');

    setReactQuillContent(mockAnnotation, mockEditor);
    //Attributes should be unstyled
    expect(setContentsSpy).toHaveBeenCalledWith([{ 'attributes': {}, 'insert': 'TEST' }]);
  });
});
