import React from 'react';
import PropTypes from 'prop-types';

import ToolButton from 'components/ToolButton';
import FullscreenButton from 'components/FullscreenButton';
import ToggleElementButton from 'components/ToggleElementButton';
import ToolGroupButton from 'components/ToolGroupButton';
import ActionButton from 'components/ActionButton';
import StatefulButton from 'components/StatefulButton';
import CustomElement from 'components/CustomElement';
import CustomStatefulElement from 'components/CustomStatefulElement';
import ToolGroupButtonsScroll from './ToolGroupButtonsScroll';
import ScrollGroup from './ScrollGroup';
import { isMobileSize } from 'helpers/getDeviceSize';
import { isMobileDeviceFunc } from 'helpers/device';

import './HeaderItems.scss';

class HeaderItems extends React.PureComponent {
  static propTypes = {
    isToolGroupReorderingEnabled: PropTypes.bool.isRequired,
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    isInDesktopOnlyMode: PropTypes.bool,
    isOfficeEditorMode: PropTypes.bool,
  };

  render() {
    const { items, isToolGroupReorderingEnabled, isInDesktopOnlyMode, isOfficeEditorMode } = this.props;
    let handledToolGroupButtons = false;

    const headers = items.map((item, i) => {
      const { type, dataElement, hidden, hiddenOnMobileDevice, isOfficeEditorOnly } = item;
      if (isOfficeEditorOnly && !isOfficeEditorMode) {
        return null;
      }
      let mediaQueryClassName = hidden
        ? hidden
          .map((screen) => {
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
          .join(' ')
        : '';
      if (hiddenOnMobileDevice && isMobileDeviceFunc()) {
        mediaQueryClassName += ' hide-in-mobile hide-in-small-mobile';
      }
      const key = `${type}-${dataElement || i}`;

      if (dataElement === 'fullscreenButton') {
        return <FullscreenButton />;
      }

      switch (type) {
        case 'toolButton':
          return <ToolButton key={key} mediaQueryClassName={mediaQueryClassName} {...item} />;
        case 'scrollGroup':
          return (
            <ScrollGroup key={key}>
              <HeaderItems
                items={item.children}
                isToolGroupReorderingEnabled={isToolGroupReorderingEnabled}
                isInDesktopOnlyMode={isInDesktopOnlyMode}
              />
            </ScrollGroup>
          );
        case 'toolGroupButton':
          if (!isToolGroupReorderingEnabled) {
            return <ToolGroupButton key={key} mediaQueryClassName={mediaQueryClassName} {...item} />;
          }
          if (!handledToolGroupButtons) {
            handledToolGroupButtons = true;
            const toolGroupButtonsItems = items.filter(({ type }) => type === 'toolGroupButton');
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
        case 'customStatefulElement':
          return <CustomStatefulElement key={key} mediaQueryClassName={mediaQueryClassName} {...item} />;
        case 'spacer':
        case 'divider':
          return <div key={key} className={`${type} ${mediaQueryClassName}`}></div>;
        default:
          console.warn(`${type} is not a valid header item type.`);
          return null;
      }
    });

    return <div className="HeaderItems">{headers}</div>;
  }
}

const connectedComponent = (props) => {
  const isMobile = isMobileSize();

  return <HeaderItems {...props} isMobile={isMobile} />;
};

export default connectedComponent;
