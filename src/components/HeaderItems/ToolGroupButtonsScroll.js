import React from 'react';
import ToolGroupButton from 'components/ToolGroupButton';
import ScrollGroup from './ScrollGroup';

const ToolGroupButtonsScroll = ({ toolGroupButtonsItems, key }) => {
  return <ScrollGroup key={key}>
    {
      toolGroupButtonsItems.map((toolBtn, i) => {
        const { type, dataElement, hidden } = toolBtn;
        const mediaQueryClassName = hidden ? hidden.map(screen => `hide-in-${screen}`).join(' ') : '';
        const innerKey = `${type}-${dataElement || i}`;

        return (
          <React.Fragment key={innerKey}>
            {
              <ToolGroupButton key={innerKey} mediaQueryClassName={mediaQueryClassName} {...toolBtn} />
            }
          </React.Fragment>
        );
      })}
  </ScrollGroup>
};

export default ToolGroupButtonsScroll;
