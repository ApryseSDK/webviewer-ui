import React, { useRef, useEffect, useState } from 'react';
import classNames from 'classnames';
import Icon from 'components/Icon';
import ToolGroupButton from 'components/ToolGroupButton';

const ToolGroupButtonsScroll = ({ toolGroupButtonsItems }) => {
  const scrollRef = useRef();
  const [isScrolledToEnd, setIsScrolledToEnd] = useState(false);
  const [isScrolledToStart, setIsScrolledToStart] = useState(false);

  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const {
        scrollWidth,
        scrollLeft,
        offsetWidth,
      } = scrollRef.current;

      if (scrollLeft >= (scrollWidth - offsetWidth)) {
        setIsScrolledToEnd(true);
      } else {
        setIsScrolledToEnd(false);
      }

      if (scrollLeft === 0) {
        setIsScrolledToStart(true);
      } else {
        setIsScrolledToStart(false);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('resize', checkScrollPosition);
    return () => window.removeEventListener('resize', checkScrollPosition);
  }, []);

  useEffect(() => {
    checkScrollPosition();
  });

  return (
    <div
      className="tool-group-buttons-container"
    >
      {!isScrolledToStart &&
        <div
          className={classNames({
            "chevron-scroll": true,
            "left-chevron": true,
          })}
        >
          <div className="chevron-edge" />
          <div>
            <div
              className={classNames({
                "tool-group-button": true,
              })}
              onClick={() => {
                // Move two tools over
                scrollRef.current.scrollTo(scrollRef.current.scrollLeft - 56 * 2, 0);
              }}
            >
              <Icon  glyph="icon-chevron-left" />
            </div>
          </div>
        </div>}
      {!isScrolledToEnd &&
        <div
          className={classNames({
            "chevron-scroll": true,
            "right-chevron": true,
          })}
        >
          <div
            className={classNames({
              "tool-group-button": true,
            })}
            onClick={() => {
              // Move two tools over
              scrollRef.current.scrollTo(scrollRef.current.scrollLeft + 56 * 2, 0);
            }}
          >
            <Icon  glyph="icon-chevron-right" />
          </div>
          {/* <div className="chevron-edge" /> */}
        </div>}
      <div
        className="tool-group-buttons-scroll"
        ref={scrollRef}
        onScroll={checkScrollPosition}
      >
        {toolGroupButtonsItems.map((item, i) => {
          const { type, dataElement, hidden } = item;
          const mediaQueryClassName = hidden ? hidden.map(screen => `hide-in-${screen}`).join(' ') : '';
          const key = `${type}-${dataElement || i}`;
          return (
            <React.Fragment key={key}>
              <ToolGroupButton mediaQueryClassName={mediaQueryClassName} {...item} />
            </React.Fragment>
          );
        })}
        {/* <div className="scroll-edge"></div> */}
      </div>
    </div>
  );
};

export default ToolGroupButtonsScroll;