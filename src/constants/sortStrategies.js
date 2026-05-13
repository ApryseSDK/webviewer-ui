import i18next from 'i18next';
import dayjs from 'dayjs';
// eslint-disable-next-line custom/use-core-hook-in-components
import core from 'core';
import React from 'react';
import { rotateRad } from 'helpers/rotate';
import { rgbaToHex } from 'helpers/color';
import { getAnnotationClass } from 'helpers/getAnnotationClass';
import getLatestActivityDate from 'helpers/getLatestActivityDate';
import { COMMON_COLORS } from './commonColors';
import './sortStrategies.scss';

function getDocumentCenter(pageNumber, documentViewerKey = 1) {
  let result;
  if (pageNumber <= core.getTotalPages(documentViewerKey)) {
    result = core.getPageInfo(pageNumber, documentViewerKey);
  } else {
    result = {
      width: 0,
      height: 0,
    };
  }
  return { x: result.width / 2, y: result.height / 2 };
}

function getRotationRad(pageNumber, documentViewerKey = 1) {
  const orientation = core.getRotation(pageNumber, documentViewerKey);
  return (4 - orientation) * (Math.PI / 2);
}

function isNoteFreeTextAnnotation(note) {
  return note instanceof window.Core.Annotations.FreeTextAnnotation;
}

function getNoteColor(note) {
  let color = COMMON_COLORS['gray8'];
  if (isNoteFreeTextAnnotation(note) && note.TextColor) {
    color = rgbaToHex(note.TextColor.R, note.TextColor.G, note.TextColor.B, note.TextColor.A);
  } else if (note.Color) {
    color = rgbaToHex(note.Color.R, note.Color.G, note.Color.B, note.Color.A);
  }
  return color;
}

function getRotatedBounds(note, documentViewerKey = 1) {
  const rotation = getRotationRad(note.PageNumber, documentViewerKey);
  const center = getDocumentCenter(note.PageNumber, documentViewerKey);

  const rotated = [
    rotateRad(center.x, center.y, note.X, note.Y, rotation),
    rotateRad(center.x, center.y, note.X + note.Width, note.Y, rotation),
    rotateRad(center.x, center.y, note.X, note.Y + note.Height, rotation),
    rotateRad(center.x, center.y, note.X + note.Width, note.Y + note.Height, rotation),
  ];

  const bounds = rotated.reduce(
    (acc, point) => ({
      minX: Math.min(acc.minX, point.x),
      maxX: Math.max(acc.maxX, point.x),
      minY: Math.min(acc.minY, point.y),
      maxY: Math.max(acc.maxY, point.y),
    }),
    {
      minX: Number.MAX_SAFE_INTEGER,
      maxX: Number.MIN_SAFE_INTEGER,
      minY: Number.MAX_SAFE_INTEGER,
      maxY: Number.MIN_SAFE_INTEGER,
    },
  );

  return bounds;
}

function getFirstQuadPosition(note) {
  const quads = typeof note.getQuads === 'function' ? note.getQuads() : null;
  if (!Array.isArray(quads) || quads.length === 0) {
    return null;
  }

  return quads[0];
}

const linePositionSortStrategy = {
  getSortedNotes: (notes, documentViewerKey = 1) => notes.sort((a, b) => {
    if (a.PageNumber !== b.PageNumber) {
      return a.PageNumber - b.PageNumber;
    }
    const boundsA = getRotatedBounds(a, documentViewerKey);
    const boundsB = getRotatedBounds(b, documentViewerKey);

    const overlapsY = boundsA.maxY >= boundsB.minY && boundsB.maxY >= boundsA.minY;

    if (!overlapsY) {
      return boundsA.minY - boundsB.minY;
    }

    const quadA = getFirstQuadPosition(a);
    const quadB = getFirstQuadPosition(b);

    if (!quadA || !quadB) {
      return boundsA.minX - boundsB.minX;
    }

    const rotation = getRotationRad(a.PageNumber, documentViewerKey);
    const center = getDocumentCenter(a.PageNumber, documentViewerKey);
    const rotatedA = rotateRad(center.x, center.y, quadA.x1, quadA.y1, rotation);
    const rotatedB = rotateRad(center.x, center.y, quadB.x1, quadB.y1, rotation);

    return rotatedA.x - rotatedB.x;
  }),
  shouldRenderSeparator: (prevNote, currNote) => currNote.PageNumber !== prevNote.PageNumber,
  getSeparatorContent: (_prevNote, currNote, { pageLabels }) => `${i18next.t('option.shared.page')} ${pageLabels[currNote.PageNumber - 1]}`,
};

const sortStrategies = {
  position: {
    getSortedNotes: (notes, documentViewerKey = 1) => notes.sort((a, b) => {
      if (a.PageNumber === b.PageNumber) {
        const boundsA = getRotatedBounds(a, documentViewerKey);
        const boundsB = getRotatedBounds(b, documentViewerKey);
        return boundsA.minY - boundsB.minY;
      }
      return a.PageNumber - b.PageNumber;
    }),
    // eslint-disable-next-line no-unused-vars
    shouldRenderSeparator: (prevNote, currNote, _options, _documentViewerKey = 1) => currNote.PageNumber !== prevNote.PageNumber,
    // eslint-disable-next-line no-unused-vars
    getSeparatorContent: (_prevNote, currNote, { pageLabels }, _documentViewerKey = 1) => `${i18next.t('option.shared.page')} ${pageLabels[currNote.PageNumber - 1]}`,
  },
  createdDate: {
    // eslint-disable-next-line no-unused-vars
    getSortedNotes: (notes, _documentViewerKey = 1) => notes.sort((a, b) => (a.DateCreated || 0) - (b.DateCreated || 0)),
    // eslint-disable-next-line no-unused-vars
    shouldRenderSeparator: (prevNote, currNote, _options, _documentViewerKey = 1) => {
      const prevNoteDate = prevNote.DateCreated;
      const currNoteDate = currNote.DateCreated;
      if (prevNoteDate && currNoteDate) {
        const dayFormat = 'MMM D, YYYY';
        return dayjs(prevNoteDate).format(dayFormat) !== dayjs(currNoteDate).format(dayFormat);
      }

      if (!prevNoteDate && !currNoteDate) {
        return false;
      }

      return true;
    },
    // eslint-disable-next-line no-unused-vars
    getSeparatorContent: (prevNote, currNote, _options, _documentViewerKey = 1) => {
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
      }

      return i18next.t('option.notesPanel.separator.unknown');
    },
  },
  modifiedDate: {
    // eslint-disable-next-line no-unused-vars
    getSortedNotes: (notes, _documentViewerKey = 1) => notes.sort((a, b) => (getLatestActivityDate(b) || 0) - (getLatestActivityDate(a) || 0)),
    // eslint-disable-next-line no-unused-vars
    shouldRenderSeparator: (prevNote, currNote, _options, _documentViewerKey = 1) => {
      const prevNoteDate = getLatestActivityDate(prevNote);
      const currNoteDate = getLatestActivityDate(currNote);
      if (prevNoteDate && currNoteDate) {
        const dayFormat = 'MMM D, YYYY';
        return dayjs(prevNoteDate).format(dayFormat) !== dayjs(currNoteDate).format(dayFormat);
      }

      if (!prevNoteDate && !currNoteDate) {
        return false;
      }

      return true;
    },
    // eslint-disable-next-line no-unused-vars
    getSeparatorContent: (prevNote, currNote, _options, _documentViewerKey = 1) => {
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
      }

      return i18next.t('option.notesPanel.separator.unknown');
    },
  },
  status: {
    // eslint-disable-next-line no-unused-vars
    getSortedNotes: (notes, _documentViewerKey = 1) => notes.sort((a, b) => {
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
    // eslint-disable-next-line no-unused-vars
    shouldRenderSeparator: (prevNote, currNote, _options, _documentViewerKey = 1) => prevNote.getStatus() !== currNote.getStatus(),
    // eslint-disable-next-line no-unused-vars
    getSeparatorContent: (prevNote, currNote, _options, _documentViewerKey = 1) => {
      return currNote.getStatus() === ''
        ? i18next.t('option.state.none')
        : i18next.t(`option.state.${currNote.getStatus().toLowerCase()}`);
    },
  },
  author: {
    getSortedNotes: (notes, documentViewerKey = 1) => notes.sort((a, b) => {
      const authorA = core.getDisplayAuthor(a['Author'], documentViewerKey)?.toUpperCase();
      const authorB = core.getDisplayAuthor(b['Author'], documentViewerKey)?.toUpperCase();
      return authorA < authorB ? -1 : authorA > authorB ? 1 : 0;
    }),
    shouldRenderSeparator: (prevNote, currNote, _options, documentViewerKey = 1) => core.getDisplayAuthor(prevNote['Author'], documentViewerKey) !== core.getDisplayAuthor(currNote['Author'], documentViewerKey),
    getSeparatorContent: (_prevNote, currNote, _options, documentViewerKey = 1) => {
      return core.getDisplayAuthor(currNote['Author'], documentViewerKey);
    },
  },
  type: {
    // eslint-disable-next-line no-unused-vars
    getSortedNotes: (notes, _documentViewerKey = 1) => notes.sort((a, b) => {
      const typeA = getAnnotationClass(a);
      const typeB = getAnnotationClass(b);
      return typeA < typeB ? -1 : typeA > typeB ? 1 : 0;
    }),
    // eslint-disable-next-line no-unused-vars
    shouldRenderSeparator: (prevNote, currNote, _options, _documentViewerKey = 1) => {
      return getAnnotationClass(prevNote) !== getAnnotationClass(currNote);
    },
    // eslint-disable-next-line no-unused-vars
    getSeparatorContent: (prevNote, currNote, _options, _documentViewerKey = 1) => {
      return i18next.t(`option.type.${getAnnotationClass(currNote)}`);
    },
  },
  color: {
    // eslint-disable-next-line no-unused-vars
    getSortedNotes: (notes, _documentViewerKey = 1) => notes.sort((prevNote, currNote) => {
      const colorA = getNoteColor(currNote);
      const colorB = getNoteColor(prevNote);

      return colorA < colorB ? -1 : colorA > colorB ? 1 : 0;
    }),
    // eslint-disable-next-line no-unused-vars
    shouldRenderSeparator: (prevNote, currNote, _options, _documentViewerKey = 1) => {
      const colorA = getNoteColor(currNote);
      const colorB = getNoteColor(prevNote);

      return colorA !== colorB;
    },
    // eslint-disable-next-line no-unused-vars
    getSeparatorContent: (prevNote, currNote, _options, _documentViewerKey = 1) => {
      const color = getNoteColor(currNote);

      return (
        <div className="sort-separator-color">
          {i18next.t('option.notesOrder.color')}
          <div
            className="sort-separator-color__swatch"
            css={{ background: color }}
          ></div>
        </div>
      );
    },
  },
};

export const getSortStrategies = () => sortStrategies;
export const getExtendedSortStrategies = () => ({ // Sort strategies extended for office editor
  ...sortStrategies,
  linePosition: linePositionSortStrategy,
});

export const addSortStrategy = (newStrategy) => {
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
 * @property {string} STATUS Sort notes by status.
 * @property {string} AUTHOR Sort notes by the author.
 * @property {string} TYPE Sort notes by type.
 * @property {string} COLOR Sort notes by color.
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
  STATUS: 'status',
  AUTHOR: 'author',
  TYPE: 'type',
  COLOR: 'color'
};

export const OfficeEditorNotesPanelSortStrategy = {
  LINE_POSITION: 'linePosition',
};

export const BASE_SORT_STRATEGIES = Object.values(NotesPanelSortStrategy);
export const OFFICE_EDITOR_SORT_STRATEGIES = [OfficeEditorNotesPanelSortStrategy.LINE_POSITION, NotesPanelSortStrategy.CREATED_DATE, NotesPanelSortStrategy.AUTHOR];
