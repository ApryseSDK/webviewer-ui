import React, { useEffect, useRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  notes: PropTypes.array.isRequired,
  children: PropTypes.func.isRequired,
  onScroll: PropTypes.func.isRequired,
  initialScrollTop: PropTypes.number.isRequired,
};

const NormalList = React.forwardRef(
  ({ notes, children, onScroll, initialScrollTop }, forwardedRef) => {
    const listRef = useRef();

    useImperativeHandle(forwardedRef, () => ({
      scrollToPosition: scrollTop => {
        listRef.current.scrollTop = scrollTop;
      },
      scrollToRow: index => {
        const parent = listRef.current;
        const child = parent.children[index];

        const parentRect = parent.getBoundingClientRect();
        const childRect = child.getBoundingClientRect();

        const isViewable =
          childRect.top >= parentRect.top &&
          childRect.top <= parentRect.top + parent.clientHeight;
        if (!isViewable) {
          parent.scrollTop = childRect.top + parent.scrollTop - parentRect.top;
        }
      },
    }));

    useEffect(() => {
      listRef.current.scrollTop = initialScrollTop;
    }, [initialScrollTop]);

    const handleScroll = e => {
      onScroll(e.target.scrollTop);
    };

    return (
      <div
        ref={listRef}
        className="normal-notes-container"
        onScroll={handleScroll}
        role="list"
      >
        {notes.map((currNote, index) => (
          <React.Fragment key={`${index}${currNote.Id}`}>
            {children(notes, index)}
          </React.Fragment>
        ))}
      </div>
    );
  },
);

NormalList.propTypes = propTypes;

export default NormalList;
