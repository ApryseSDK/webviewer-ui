import React, { useRef, useEffect, useState } from 'react';
import classNames from 'classnames';
import Icon from 'components/Icon';
import Measure from 'react-measure';
import { useTranslation } from 'react-i18next';

const ScrollGroup = ({ children }) => {
  const [t] = useTranslation();
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
    checkScrollPosition();
  });

  return (
    <Measure
      onResize={() => {
        checkScrollPosition();
      }}
    >
      {({ measureRef }) => (
        <div
          ref={measureRef}
          className="tool-group-buttons-container"
        >
          {!isScrolledToStart &&
            <div
              className={classNames(
                'chevron-scroll',
                'left',
              )}
            >
              <div
                className={classNames(
                  'scroll-edge',
                  'left',
                )}
              />
              <button
                className={classNames(
                  'tool-group-button',
                )}
                onClick={() => {
                  // Move two tools over
                  // don't use scrollTo as it doesn't work in IE11
                  scrollRef.current.scrollTop = 0;
                  scrollRef.current.scrollLeft -= 54 * 2;
                }}
                aria-label={t('action.prev')}
              >
                <Icon glyph="icon-chevron-left" />
              </button>
            </div>}
          {!isScrolledToEnd &&
            <div
              className={classNames(
                'chevron-scroll',
                'right',
              )}
            >
              <button
                className={classNames(
                  'tool-group-button',
                )}
                onClick={() => {
                  // Move two tools over
                  // don't use scrollTo as it doesn't work in IE11
                  scrollRef.current.scrollTop = 0;
                  scrollRef.current.scrollLeft += 54 * 2;
                }}
                aria-label={t('action.next')}
              >
                <Icon glyph="icon-chevron-right" />
              </button>
            </div>}
          <div
            className="tool-group-buttons-scroll"
            ref={scrollRef}
            onScroll={checkScrollPosition}
          >
            {
              children
            }
          </div>
        </div>
      )}
    </Measure>
  );
};

export default ScrollGroup;
