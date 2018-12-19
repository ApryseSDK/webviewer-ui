export default {
  whitelist: [
    'getBBAnnotManager',
    'setNotesPanelSort',
    'setSortNotesBy',
    'setEngineType',
    'setPrintQuality',
    'updateOutlines',
    'getShowSideWindow',
    'setShowSideWindow',
    'getSideWindowVisibility',
    'setSideWindowVisibility',
    'saveAnnotations'
  ],
  searchListener: function(searchValue, options, results) {
    console.log('Search listener triggered.', results);
  },
  sortStrategy: {
    name: 'annotationType',
    getSortedNotes: notes => {
      return notes.sort((a ,b) => {
        if (a.Subject < b.Subject) return -1;
        if (a.Subject > b.Subject) return 1;
        if (a.Subject === b.Subject) return 0;
      })
    },
    shouldRenderSeparator: (prevNote, currNote) => prevNote.Subject !== currNote.Subject,
    getSeparatorContent: (prevNote, currNote) => `${currNote.Subject}`
  },
}