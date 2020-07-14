import React from 'react';
import PropTypes from 'prop-types';

import ToolButton from 'components/ToolButton';
import ToggleElementButton from 'components/ToggleElementButton';
import ActionButton from 'components/ActionButton';
import StatefulButton from 'components/StatefulButton';
import CustomElement from 'components/CustomElement';
import ToolGroupButtonsScroll from './ToolGroupButtonsScroll';
import useMedia from 'hooks/useMedia';
import { isMobileDeviceFunc } from 'helpers/device';

import './HeaderItems.scss';

class HeaderItems extends React.PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  render() {
    const { items } = this.props;

    const toolGroupButtonsItems = items.filter(({ type }) => type === 'toolGroupButton');
    let handledToolGroupButtons = false;

    return (
      <div className="HeaderItems">
        {items.map((item, i) => {
          const { type, dataElement, hidden, toolName, hiddenOnMobileDevice } = item;
          let mediaQueryClassName = hidden ? hidden.map(screen => `hide-in-${screen}`).join(' ') : '';
          if (hiddenOnMobileDevice && isMobileDeviceFunc()) {
            mediaQueryClassName += ' hide-in-mobile hide-in-small-mobile';
          }
          const key = `${type}-${dataElement || i}`;

          switch (type) {
            case 'toolButton':
              return <ToolButton key={key} mediaQueryClassName={mediaQueryClassName} {...item} />;
            case 'toolGroupButton':
              if (!handledToolGroupButtons) {
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
        })}
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