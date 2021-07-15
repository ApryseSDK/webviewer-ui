import React from 'react';
import PropTypes from 'prop-types';

import ToolButton from 'components/ToolButton';
import ToggleElementButton from 'components/ToggleElementButton';
import ToolGroupButton from 'components/ToolGroupButton';
import ActionButton from 'components/ActionButton';
import StatefulButton from 'components/StatefulButton';
import CustomElement from 'components/CustomElement';
import ToolGroupButtonsScroll from './ToolGroupButtonsScroll';
import useMedia from 'hooks/useMedia';
import { isMobileDeviceFunc } from 'helpers/device';

import './HeaderItems.scss';

class HeaderItems extends React.PureComponent {
  static propTypes = {
    isToolGroupReorderingEnabled: PropTypes.bool.isRequired,
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    isInDesktopOnlyMode: PropTypes.bool
  }

  render() {
    const { items, isToolGroupReorderingEnabled, isInDesktopOnlyMode } = this.props;
    const toolGroupButtonsItems = items.filter(({ type }) => (type === 'toolGroupButton'));
    let handledToolGroupButtons = false;

    const headers = items.map((item, i) => {
      const { type, dataElement, hidden, toolName, hiddenOnMobileDevice } = item;
      let mediaQueryClassName = hidden ? hidden.map(screen => {
        let result = '';
        if (isInDesktopOnlyMode) {
          // if in desktop only mode and if it should hide in desktop
          // append style to always make it hidden
          if (screen === 'desktop') {
            result = `always-hide hide-in-${screen}`;
          }
        } else {
          result = `hide-in-${screen}`;
        }
        return result;
      })
        .join(' ') : '';
      if (hiddenOnMobileDevice && isMobileDeviceFunc()) {
        mediaQueryClassName += ' hide-in-mobile hide-in-small-mobile';
      }
      const key = `${type}-${dataElement || i}`;

      switch (type) {
        case 'toolButton':
          return <ToolButton key={key} mediaQueryClassName={mediaQueryClassName} {...item} />;
        case 'toolGroupButton':
          if (!isToolGroupReorderingEnabled) {
            return <ToolGroupButton  key={key} mediaQueryClassName={mediaQueryClassName} {...item} />;
          } else if (!handledToolGroupButtons) {
            handledToolGroupButtons = true;
            return <ToolGroupButtonsScroll key={key} toolGroupButtonsItems={toolGroupButtonsItems} />;
          }
          return null;
        case 'toggleElementButton':
          return <ToggleElementButton key={key} mediaQueryClassName={mediaQueryClassName} {...item} />;
        case 'actionButton':
          return <ActionButton key={key} mediaQueryClassName={mediaQueryClassName} {...item} />;
        case 'statefulButton':
          return <StatefulButton key={key} mediaQueryClassName={mediaQueryClassName} {...item} />;
        case 'customElement':
          return <CustomElement key={key} mediaQueryClassName={mediaQueryClassName} {...item} />;
        case 'spacer':
        case 'divider':
          return <div key={key} className={`${type} ${mediaQueryClassName}`}></div>;
        default:
          console.warn(`${type} is not a valid header item type.`);
          return null;
      }
    });

    return (
      <div className="HeaderItems">
        { headers }
      </div>
    );
  }
}

export default props => {
  const isMobile = useMedia(
    // Media queries
    ['(max-width: 640px)'],
    [true],
    // Default value
    false,
  );

  return (
    <HeaderItems {...props} isMobile={isMobile} />
  );
};