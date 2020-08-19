import i18next from 'i18next';
import dayjs from 'dayjs';
import orientationManager from 'helpers/orientationManager';
import { rotateRad } from 'helpers/rotate';
import getLatestActivityDate from 'helpers/getLatestActivityDate';

const sortStrategies = {
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

        const smallestA = rotatedA.reduce((smallest, current) => (current.y < smallest ? current.y : smallest), Number.MAX_SAFE_INTEGER);
        const smallestB = rotatedB.reduce((smallest, current) => (current.y < smallest ? current.y : smallest), Number.MAX_SAFE_INTEGER);

        return smallestA - smallestB;
      }
      return a.PageNumber - b.PageNumber;
    }),
    shouldRenderSeparator: (prevNote, currNote) => currNote.PageNumber !== prevNote.PageNumber,
    getSeparatorContent: (prevNote, currNote, { pageLabels }) => `${i18next.t('option.shared.page')} ${pageLabels[currNote.PageNumber - 1]}`,
  },
  time: {
    getSortedNotes: notes => notes.sort((a, b) => getLatestActivityDate(b) - getLatestActivityDate(a)),
    shouldRenderSeparator: (prevNote, currNote) => dayjs(getLatestActivityDate(prevNote)).format('MMM D, YYYY') !== dayjs(getLatestActivityDate(currNote)).format('MMM D, YYYY'),
    getSeparatorContent: (prevNote, currNote) => {
      const today = dayjs(new Date()).format('MMM D, YYYY');
      const yesterday = dayjs(new Date(new Date() - 86400000)).format('MMM D, YYYY');
      const latestActivityDate = dayjs(getLatestActivityDate(currNote)).format('MMM D, YYYY');

      if (latestActivityDate === today) {
        return i18next.t('option.notesPanel.separator.today');
      }
      if (latestActivityDate === yesterday) {
        return i18next.t('option.notesPanel.separator.yesterday');
      }
      return latestActivityDate;
    },
  },
};

export const getSortStrategies = () => sortStrategies;

export const addSortStrategy = newStrategy => {
  const { name, getSortedNotes, shouldRenderSeparator, getSeparatorContent } = newStrategy;

  sortStrategies[name] = {
    getSortedNotes,
    shouldRenderSeparator,
    getSeparatorContent,
  };
};
