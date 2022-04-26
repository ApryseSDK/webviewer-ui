import i18next from 'i18next';
import dayjs from 'dayjs';
import core from 'core';
import React from 'react';
import { rotateRad } from 'helpers/rotate';
import { rgbaToHex } from 'helpers/color';
import { getAnnotationClass } from 'helpers/getAnnotationClass';
import getLatestActivityDate from 'helpers/getLatestActivityDate';
import { getAnnotationShareType } from 'helpers/annotationShareType';
import ShareTypes, { ShareTypeOrder } from './shareTypes';

function getDocumentCenter(pageNumber) {
  let result;
  if (pageNumber <= core.getTotalPages()) {
    result = core.getPageInfo(pageNumber);
  } else {
    result = {
      width: 0,
      height: 0,
    };
  }
  return { x: result.width / 2, y: result.height / 2 };
}

function getRotationRad(pageNumber) {
  const orientation = core.getRotation(pageNumber);
  return (4 - orientation) * (Math.PI / 2);
}

const sortStrategies = {
  position: {
    getSortedNotes: notes =>
      notes.sort((a, b) => {
        if (a.PageNumber === b.PageNumber) {
          const rotation = getRotationRad(a.PageNumber);
          const center = getDocumentCenter(a.PageNumber);

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
  createdDate: {
    getSortedNotes: notes => notes.sort((a, b) => (a.DateCreated || 0) - (b.DateCreated || 0)),
    shouldRenderSeparator: (prevNote, currNote) => {
      const prevNoteDate = prevNote.DateCreated;
      const currNoteDate = currNote.DateCreated;
      if (prevNoteDate && currNoteDate) {
        const dayFormat = 'MMM D, YYYY';
        return dayjs(prevNoteDate).format(dayFormat) !== dayjs(currNoteDate).format(dayFormat);
      } else if (!prevNoteDate && !currNoteDate) {
        return false;
      } else {
        return true;
      }
    },
    getSeparatorContent: (prevNote, currNote) => {
      const createdDate = currNote.DateCreated;
      if (createdDate) {
        const dayFormat = 'MMM D, YYYY';
        const today = dayjs(new Date()).format(dayFormat);
        const yesterday = dayjs(new Date(new Date() - 86400000)).format(dayFormat);
        const createdDateString = dayjs(new Date(createdDate)).format(dayFormat);

        if (createdDateString === today) {
          return i18next.t('option.notesPanel.separator.today');
        }
        if (createdDateString === yesterday) {
          return i18next.t('option.notesPanel.separator.yesterday');
        }
        return createdDateString;
      } else {
        return i18next.t('option.notesPanel.separator.unknown');
      }
    },
  },
  modifiedDate: {
    getSortedNotes: notes => notes.sort((a, b) => (getLatestActivityDate(b) || 0) - (getLatestActivityDate(a) || 0)),
    shouldRenderSeparator: (prevNote, currNote) => {
      const prevNoteDate = getLatestActivityDate(prevNote);
      const currNoteDate = getLatestActivityDate(currNote);
      if (prevNoteDate && currNoteDate) {
        const dayFormat = 'MMM D, YYYY';
        return dayjs(prevNoteDate).format(dayFormat) !== dayjs(currNoteDate).format(dayFormat);
      } else if (!prevNoteDate && !currNoteDate) {
        return false;
      } else {
        return true;
      }
    },
    getSeparatorContent: (prevNote, currNote) => {
      const latestActivityDate = getLatestActivityDate(currNote);
      if (latestActivityDate) {
        const dayFormat = 'MMM D, YYYY';
        const today = dayjs(new Date()).format(dayFormat);
        const yesterday = dayjs(new Date(new Date() - 86400000)).format(dayFormat);
        const latestActivityDay = dayjs(latestActivityDate).format(dayFormat);

        if (latestActivityDay === today) {
          return i18next.t('option.notesPanel.separator.today');
        }
        if (latestActivityDay === yesterday) {
          return i18next.t('option.notesPanel.separator.yesterday');
        }
        return latestActivityDay;
      } else {
        return i18next.t('option.notesPanel.separator.unknown');
      }
    },
  },
  shareType: {
    getSortedNotes: notes =>
      notes.sort((a, b) => {
        const shareTypeA = getAnnotationShareType(a);
        const shareTypeB = getAnnotationShareType(b);
        return ShareTypeOrder[shareTypeA] - ShareTypeOrder[shareTypeB];
      }),
    shouldRenderSeparator: (prevNote, currNote) => {
      if (prevNote === null) return true;
      const prevShareType = getAnnotationShareType(prevNote);
      const currShareType = getAnnotationShareType(currNote);
      return prevShareType !== currShareType;
    },
    getSeparatorContent: (prevNote, currNote) => {
      return i18next.t(`option.state.${getAnnotationShareType(currNote).toLowerCase()}`);
    },
  },
  author: {
    getSortedNotes: notes =>
      notes.sort((a, b) => {
        const authorA = core.getDisplayAuthor(a['Author'])?.toUpperCase();
        const authorB = core.getDisplayAuthor(b['Author'])?.toUpperCase();
        return authorA < authorB ? -1 : authorA > authorB ? 1 : 0;
      }),
    shouldRenderSeparator: (prevNote, currNote) =>
      core.getDisplayAuthor(prevNote['Author']) !== core.getDisplayAuthor(currNote['Author']),
    getSeparatorContent: (prevNote, currNote) => {
      return core.getDisplayAuthor(currNote['Author']);
    },
  },
  type: {
    getSortedNotes: notes =>
      notes.sort((a, b) => {
        const typeA = getAnnotationClass(a);
        const typeB = getAnnotationClass(b);
        return typeA < typeB ? -1 : typeA > typeB ? 1 : 0;
      }),
    shouldRenderSeparator: (prevNote, currNote) => {
      return getAnnotationClass(prevNote) !== getAnnotationClass(currNote);
    },
    getSeparatorContent: (prevNote, currNote) => {
      return i18next.t(`option.type.${getAnnotationClass(currNote)}`);
    },
  },
  color: {
    getSortedNotes: notes =>
      notes.sort((prevNote, currNote) => {
        let colorA = '#485056';
        let colorB = '#485056';
        if (currNote.Color) {
          colorA = rgbaToHex(currNote.Color.R, currNote.Color.G, currNote.Color.B, currNote.Color.A);
        }
        if (prevNote.Color) {
          colorB = rgbaToHex(prevNote.Color.R, prevNote.Color.G, prevNote.Color.B, prevNote.Color.A);
        }
        return colorA < colorB ? -1 : colorA > colorB ? 1 : 0;
      }),
    shouldRenderSeparator: (prevNote, currNote) => {
      let colorA = '#485056';
      let colorB = '#485056';
      if (currNote.Color) {
        colorA = rgbaToHex(currNote.Color.R, currNote.Color.G, currNote.Color.B, currNote.Color.A);
      }
      if (prevNote.Color) {
        colorB = rgbaToHex(prevNote.Color.R, prevNote.Color.G, prevNote.Color.B, prevNote.Color.A);
      }
      return colorA !== colorB;
    },
    getSeparatorContent: (prevNote, currNote) => {
      let color = '#485056';
      if (currNote.Color) {
        color = rgbaToHex(currNote.Color.R, currNote.Color.G, currNote.Color.B, currNote.Color.A);
      }
      return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          {i18next.t('option.notesOrder.color')}
          <div
            style={{ background: color, width: '7px', height: '7px', borderRadius: '10000000px', marginLeft: '10px' }}
          ></div>
        </div>
      );
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

/**
 * Contains string enums for all the possible sorting algorithms available in NotesPanel.
 * @name UI.NotesPanelSortStrategy
 * @property {string} POSITION Sort notes by position.
 * @property {string} CREATED_DATE Sort notes by creation date.
 * @property {string} MODIFIED_DATE Sort notes by last modification date.
 * @property {string} AUTHOR Sort notes by the author.
 * @property {string} TYPE Sort notes by type.
 * @property {string} COLOR Sort notes by color.
 * @property {string} SHARE_TYPE CUSTOM WISEFLOW Sort notes by share type.
 *
 * @example
WebViewer(...)
  .then(function(instance) {
    const sortStrategy = instance.UI.NotesPanelSortStrategy;
    instance.UI.setNotesPanelSortStrategy(sortStrategy.AUTHOR);
  });
 */
export const NotesPanelSortStrategy = {
  POSITION: 'position',
  CREATED_DATE: 'createdDate',
  MODIFIED_DATE: 'modifiedDate',
  AUTHOR: 'author',
  TYPE: 'type',
  COLOR: 'color',
  // CUSTOM WISEFLOW: own sort strategy
  SHARE_TYPE: 'shareType',
};
