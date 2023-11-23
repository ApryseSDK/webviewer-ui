import { getSortStrategies } from './sortStrategies';

const notes = [
  new Core.Annotations.FreeTextAnnotation('', {
    Color: new Core.Annotations.Color(255, 255, 0, 1),
    TextColor: new Core.Annotations.Color(230, 15, 0, 1),
  }),
  new Core.Annotations.FreeTextAnnotation('', {
    Color: new Core.Annotations.Color(255, 255, 0, 1),
    TextColor: new Core.Annotations.Color(230, 230, 200, 1),
  }),
  new Core.Annotations.FreeTextAnnotation('', {
    Color: new Core.Annotations.Color(255, 255, 0, 1),
    TextColor: new Core.Annotations.Color(230, 15, 0, 1),
  }),
  new Core.Annotations.FreeTextAnnotation('', {
    Color: new Core.Annotations.Color(255, 255, 0, 1),
    TextColor: new Core.Annotations.Color(200, 200, 0, 1),
  }),
  new Core.Annotations.RectangleAnnotation({
    Color: new Core.Annotations.Color(200, 200, 0, 1)
  })
];

describe('Sort Strategies', () => {
  describe('sort by color', () => {
    it('should sort by text color for free text annotations', () => {
      const sortStrategies = getSortStrategies();
      const getSortedNotes = sortStrategies.color.getSortedNotes;

      const sortedNotes = getSortedNotes(notes);
      const NotesColorList = sortedNotes.map((note) => {
        if (note instanceof Core.Annotations.FreeTextAnnotation) {
          return note.TextColor;
        }
        return note.Color;
      });
      expect(NotesColorList[0]).toEqual({ R: 230, B: 200, G: 230, A: 1 });
      expect(NotesColorList[1]).toEqual({ R: 230, B: 0, G: 15, A: 1 });
      expect(NotesColorList[2]).toEqual({ R: 230, B: 0, G: 15, A: 1 });
      expect(NotesColorList[3]).toEqual({ R: 200, B: 0, G: 200, A: 1 });
      expect(NotesColorList[4]).toEqual({ R: 200, B: 0, G: 200, A: 1 });
    });

    it('should separate by text color for free text annotations', () => {
      const sortStrategies = getSortStrategies();
      const shouldRenderSeparator = sortStrategies.color.shouldRenderSeparator;
      const separators = [];

      notes.forEach((note, index) => {
        const prevNote = notes[index - 1];

        if (prevNote && shouldRenderSeparator(prevNote, note)) {
          separators.push(index);
        }
      });

      expect(separators.length).toEqual(2);
      expect(separators[0]).toEqual(1);
      expect(separators[1]).toEqual(3);
    });
  });
});