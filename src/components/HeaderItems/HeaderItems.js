import React from 'react';
import PropTypes from 'prop-types';

import ToolButton from 'components/ToolButton';
import GroupButton from 'components/GroupButton';
import ToggleElementButton from 'components/ToggleElementButton';
import ActionButton from 'components/ActionButton';
import StatefulButton from 'components/StatefulButton';
import CustomElement from 'components/CustomElement';
import ResponsiveButton from 'components/ResponsiveButton';

import './HeaderItems.scss';

class HeaderItems extends React.PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  render() {
    const { items } = this.props;
    return (
      <div className="HeaderItems">
        {items.map((item, i) => {
          const { type, dataElement, hidden } = item;
          const mediaQueryClassName = hidden ? hidden.map(screen => `hide-in-${screen}`).join(' ') : `${item.className || ''}`;
          const key = `${type}-${dataElement || i}`;
          switch (type) {
            case 'toolButton':
              return <ToolButton key={key} mediaQueryClassName={mediaQueryClassName} {...item} />;
            case 'toolGroupButton':
            case 'dropdownButton':
              return <GroupButton key={key} mediaQueryClassName={mediaQueryClassName} {...item} toolNames={item.children.map(tool => tool.toolName)} children={item.children}/>;
            case 'toggleElementButton':
              return <ToggleElementButton key={key} mediaQueryClassName={mediaQueryClassName} {...item} />;
            case 'actionButton':
              return <ActionButton key={key} mediaQueryClassName={mediaQueryClassName} {...item} />;
            case 'statefulButton': {
              return <StatefulButton key={key} mediaQueryClassName={mediaQueryClassName} {...item} />;
            }
            case 'customElement':
              return <CustomElement key={key} mediaQueryClassName={mediaQueryClassName} {...item} />;
            case 'responsiveButton':
              return <ResponsiveButton key={key} mediaQueryClassName={mediaQueryClassName} {...item} />;
            case 'spacer':
            case 'divider':
              return <div key={key} className={`${type} ${mediaQueryClassName}`}></div>;
            default:
              console.warn(`${type} is not a valid header item type.`);
          }
        })}
      </div>
    );
  }
}

export default HeaderItems;