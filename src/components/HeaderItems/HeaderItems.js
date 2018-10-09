import React from 'react';
import PropTypes from 'prop-types';

import ToolButton from 'components/ToolButton';
import ToolGroupButton from 'components/ToolGroupButton';
import ToggleElementButton from 'components/ToggleElementButton';
import ActionButton from 'components/ActionButton';
import StatefulButton from 'components/StatefulButton';
import CustomElement from 'components/CustomElement';

import './HeaderItems.scss';

class HeaderItems extends React.PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  render() {
    return (
      <div className="HeaderItems">
        {this.props.items.map((item, i) => {
          const { type, dataElement, hidden } = item;
          const mediaQueryClassName = hidden ? hidden.map(screen => `hide-in-${screen}`).join(' ') : '';
          const key = `${type}-${dataElement}-${i}`;

          switch (type) {
            case 'toolButton':
              return <ToolButton key={key} mediaQueryClassName={mediaQueryClassName} {...item} />;
            case 'toolGroupButton':
              return <ToolGroupButton key={key} mediaQueryClassName={mediaQueryClassName} {...item} />;
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
          }
        })}
      </div>
    );
  }
}

export default HeaderItems;