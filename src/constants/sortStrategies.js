import dayjs from 'dayjs';
import orientationManager from 'helpers/orientationManager';
import { rotateRad } from 'helpers/rotate';
import getLatestActivityDate from 'helpers/getLatestActivityDate';

const sortStrategy = {
  position: {
    getSortedNotes: notes => notes.sort((a, b) => {
      if (a.PageNumber === b.PageNumber) {
        const rotation = orientationManager.getRotationRad(a.PageNumber);
        const center = orientationManager.getDocumentCenter(a.PageNumber);

        // Simulated with respect to the document origin
        const rotatedA = [
          rotateRad(center.x, center.y, a.X, a.Y, rotation),
          rotateRad(center.x, center.y, a.X + a.Width, a.Y + a.Height, rotation),
        ];
        const rotatedB = [
          rotateRad(center.x, center.y, b.X, b.Y, rotation),
          rotateRad(center.x, center.y, b.X + b.Width, b.Y + b.Height, rotation),
        ];

        const smallestA = rotatedA.reduce((smallest, current) => current.y < smallest ? current.y : smallest, Number.MAX_SAFE_INTEGER);
        const smallestB = rotatedB.reduce((smallest, current) => current.y < smallest ? current.y : smallest, Number.MAX_SAFE_INTEGER);

        return smallestA - smallestB;
      }
      return a.PageNumber - b.PageNumber;
    }),
    shouldRenderSeparator: (prevNote, currNote) => currNote.PageNumber !== prevNote.PageNumber,
    getSeparatorContent: (prevNote, currNote, pageLabels) => `Page ${pageLabels[currNote.PageNumber - 1]}`
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

export default sortStrategy;
