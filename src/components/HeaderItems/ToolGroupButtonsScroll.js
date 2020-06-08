import React, { useRef } from 'react';
import classNames from 'classnames';
import Icon from 'components/Icon';
import ToolGroupButton from 'components/ToolGroupButton';

const ToolGroupButtonsScroll = ({ toolGroupButtonsItems }) => {
  const scrollRef = useRef();

  return (
    <div
      className="tool-group-buttons-container"
    >
      <div
        className={classNames({
          "chevron-scroll": true,
          "left-chevron": true,
        })}
      >
        <div
          className={classNames({
            "tool-group-button": true,
          })}
          onClick={() => {
            console.log(scrollRef.current.scrollLeft);
            scrollRef.current.scrollTo(scrollRef.current.scrollLeft - 56 * 3, 0);
          }}
        >
          <Icon  glyph="icon-chevron-left" />
        </div>
      </div>
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
            console.log(scrollRef.current.scrollLeft);
            scrollRef.current.scrollTo(scrollRef.current.scrollLeft + 56 * 3, 0);
          }}
        >
          <Icon  glyph="icon-chevron-right" />
        </div>
        <div className="chevron-edge"></div>
      </div>
      <div
        className="tool-group-buttons-scroll"
        ref={scrollRef}
      >
        <div className="scroll-edge"></div>
        {toolGroupButtonsItems.map((item, i) => {
          const { type, dataElement, hidden } = item;
          const mediaQueryClassName = hidden ? hidden.map(screen => `hide-in-${screen}`).join(' ') : '';
          const key = `${type}-${dataElement || i}`;
          return (
            <React.Fragment key={key}>
              {/* {i !== 0 && <div className="scroll-gap"></div>} */}
              <ToolGroupButton mediaQueryClassName={mediaQueryClassName} {...item} />
            </React.Fragment>
          );
        })}
        <div className="scroll-edge"></div>
      </div>
    </div>
  );
};

export default ToolGroupButtonsScroll;