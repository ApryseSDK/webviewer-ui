import i18next from 'i18next';
import dayjs from 'dayjs';
import orientationManager from 'helpers/orientationManager';
import core from 'core';
import { rotateRad } from 'helpers/rotate';
import getLatestActivityDate from 'helpers/getLatestActivityDate';

const sortStrategies = {
  position: {
    getSortedNotes: notes =>
      notes.sort((a, b) => {
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

          const smallestA = rotatedA.reduce(
            (smallest, current) => (current.y < smallest ? current.y : smallest),
            Number.MAX_SAFE_INTEGER,
          );
          const smallestB = rotatedB.reduce(
            (smallest, current) => (current.y < smallest ? current.y : smallest),
            Number.MAX_SAFE_INTEGER,
          );

          return smallestA - smallestB;
        }
        return a.PageNumber - b.PageNumber;
      }),
    shouldRenderSeparator: (prevNote, currNote) => currNote.PageNumber !== prevNote.PageNumber,
    getSeparatorContent: (prevNote, currNote, { pageLabels }) =>
      `${i18next.t('option.shared.page')} ${pageLabels[currNote.PageNumber - 1]}`,
  },
  time: {
    getSortedNotes: notes => notes.sort((a, b) => getLatestActivityDate(b) - getLatestActivityDate(a)),
    shouldRenderSeparator: (prevNote, currNote) =>
      dayjs(getLatestActivityDate(prevNote)).format('MMM D, YYYY') !==
      dayjs(getLatestActivityDate(currNote)).format('MMM D, YYYY'),
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
  status: {
    getSortedNotes: notes =>
      notes.sort((a, b) => {
        const statusA =
          a.getStatus() === ''
            ? i18next.t('option.state.none').toUpperCase()
            : i18next.t(`option.state.${a.getStatus().toLowerCase()}`).toUpperCase();
        const statusB =
          b.getStatus() === ''
            ? i18next.t('option.state.none').toUpperCase()
            : i18next.t(`option.state.${b.getStatus().toLowerCase()}`).toUpperCase();
        return statusA < statusB ? -1 : statusA > statusB ? 1 : 0;
      }),
    shouldRenderSeparator: (prevNote, currNote) => prevNote.getStatus() !== currNote.getStatus(),
    getSeparatorContent: (prevNote, currNote) => {
      return currNote.getStatus() === ''
        ? i18next.t('option.state.none')
        : i18next.t(`option.state.${currNote.getStatus().toLowerCase()}`);
    },
  },
  author: {
    getSortedNotes: notes =>
      notes.sort((a, b) => {
        const authorA = core.getDisplayAuthor(a).toUpperCase();
        const authorB = core.getDisplayAuthor(b).toUpperCase();
        return authorA < authorB ? -1 : authorA > authorB ? 1 : 0;
      }),
    shouldRenderSeparator: (prevNote, currNote) => core.getDisplayAuthor(prevNote) !== core.getDisplayAuthor(currNote),
    getSeparatorContent: (prevNote, currNote) => {
      return core.getDisplayAuthor(currNote);
    },
  },
  type: {
    getSortedNotes: notes =>
      notes.sort((a, b) => {
        const typeA = a.Subject.toUpperCase();
        const typeB = b.Subject.toUpperCase();
        return typeA < typeB ? -1 : typeA > typeB ? 1 : 0;
      }),
    shouldRenderSeparator: (prevNote, currNote) => prevNote.Subject !== currNote.Subject,
    getSeparatorContent: (prevNote, currNote) => {
      return currNote.Subject;
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
