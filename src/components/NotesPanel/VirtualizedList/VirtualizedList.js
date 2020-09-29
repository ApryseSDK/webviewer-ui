import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import Measure from 'react-measure';
import { CellMeasurer, CellMeasurerCache, List } from 'react-virtualized';

const propTypes = {
  notes: PropTypes.array.isRequired,
  children: PropTypes.func.isRequired,
  onScroll: PropTypes.func.isRequired,
  initialScrollTop: PropTypes.number.isRequired,
};

const cache = new CellMeasurerCache({ defaultHeight: 50, fixedWidth: true });

const VirtualizedList = React.forwardRef(
  ({ notes, children, onScroll, initialScrollTop }, forwardedRef) => {
    const listRef = useRef();
    const [offset, setOffset] = useState(0);
    const [dimension, setDimension] = useState({ width: 0, height: 0 });
    let prevWindowHeight = window.innerHeight;

    useImperativeHandle(forwardedRef, () => ({
      scrollToPosition: scrollTop => {
        listRef.current.scrollToPosition(scrollTop);
      },
      scrollToRow: index => {
        listRef.current.scrollToRow(index);
      },
    }));

    useEffect(() => {
      listRef.current.scrollToPosition(initialScrollTop);
    }, [initialScrollTop]);

    useEffect(() => {
      cache.clearAll();
      listRef?.current?.recomputeRowHeights();
    }, [notes.length]);

    useEffect(() => {
      const windowResizeHandler = () => {
        const diff = window.innerHeight - prevWindowHeight;
        if (diff) {
          // List height never resizes down after exiting fullscreen
          if (window.innerHeight < prevWindowHeight) {
            setOffset(diff);
          }
          prevWindowHeight = window.innerHeight;
        }
      };
      window.addEventListener('resize', windowResizeHandler);

      return () => {
        window.removeEventListener('resize', windowResizeHandler);
      };
    });

    const _resize = index => {
      cache.clear(index);
      listRef.current?.recomputeRowHeights(index);
    };

    const handleScroll = ({ scrollTop }) => {
      onScroll(scrollTop);
    };

    /* eslint-disable react/prop-types */
    const rowRenderer = ({ index, key, parent, style }) => {
      const currNote = notes[index];

      return (
        <CellMeasurer
          key={`${key}${currNote.Id}`}
          cache={cache}
          columnIndex={0}
          parent={parent}
          rowIndex={index}
        >
          <div style={style}>
            {children(notes, index, () => _resize(index))}
          </div>
        </CellMeasurer>
      );
    };

    return (
      <Measure bounds offset onResize={({ bounds }) => {
        setDimension({
          ...bounds,
          // Override height and compensate for extra size
          height: bounds.height + offset * 2,
        });
        setOffset(0);
      }}>
        {({ measureRef }) => (
          <div ref={measureRef} className="virtualized-notes-container">
            <List
              deferredMeasurementCache={cache}
              style={{ outline: 'none' }}
              height={dimension.height - offset}
              width={dimension.width}
              overscanRowCount={10}
              ref={listRef}
              rowCount={notes.length}
              rowHeight={cache.rowHeight}
              rowRenderer={rowRenderer}
              onScroll={handleScroll}
            />
          </div>
        )}
      </Measure>
    );
  },
);

VirtualizedList.propTypes = propTypes;

export default VirtualizedList;