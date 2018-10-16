import dayjs from 'dayjs';
import getLatestActivityDate from 'helpers/getLatestActivityDate';

const sortMap = {
  position: {
    getSortedNotes: notes => notes.sort((a, b) => {
      if (a.PageNumber === b.PageNumber) {
        return a.Y - b.Y;
      }
      return a.PageNumber - b.PageNumber;
    }),
    shouldRenderSeparator: (prevNote, currNote) => currNote.PageNumber !== prevNote.PageNumber,
    getSeparatorContent: (prevNote, currNote) => `Page ${currNote.PageNumber}`
  },
  time: {
    getSortedNotes: notes => notes.sort((a, b) => getLatestActivityDate(b) - getLatestActivityDate(a)),
    shouldRenderSeparator: (prevNote, currNote) => getLatestActivityDate(prevNote).getDate() !== getLatestActivityDate(currNote).getDate(),
    getSeparatorContent: (prevNote, currNote) => {
      const today = dayjs(new Date()).format('MMM D, YYYY');
      const yesterday = dayjs(new Date(new Date() - 86400000)).format('MMM D, YYYY');
      const latestActivityDate = dayjs(getLatestActivityDate(currNote)).format('MMM D, YYYY');

      if (latestActivityDate === today) {
        return 'Today';
      }
      if (latestActivityDate === yesterday) {
        return 'Yesterday';
      }
      return latestActivityDate;
    }
  }
};

export default sortMap;
