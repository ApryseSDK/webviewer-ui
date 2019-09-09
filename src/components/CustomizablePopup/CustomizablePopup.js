import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';

import ToolButton from 'components/ToolButton';
import ToolGroupButton from 'components/ToolGroupButton';
import ToggleElementButton from 'components/ToggleElementButton';
import ActionButton from 'components/ActionButton';
import StatefulButton from 'components/StatefulButton';
import CustomElement from 'components/CustomElement';

import selectors from 'selectors';

const propTypes = {
  /**
   * The data element of the popup component.
   * Used to grab button props from redux and use those props to override the existing ones, if there're any
   */
  dataElement: PropTypes.string.isRequired,
  /**
   * An object that maps an item's dataElement to a functional React component
   */
  children: PropTypes.objectOf(PropTypes.func.isRequired).isRequired,
};

const CustomizablePopup = ({ dataElement, children }) => {
  const items = useSelector(
    state => selectors.getPopupItems(state, dataElement),
    shallowEqual,
  );

  return items.map((item, i) => {
    const { dataElement, type, hidden, ...overrides } = item;
    const key = `${type}-${dataElement || i}`;
    const mediaQueryClassName = hidden
      ? hidden.map(screen => `hide-in-${screen}`).join(' ')
      : `${item.className || ''}`;
    let Component = children[dataElement];

    // duplicate code in HeaderItems.js, must clean up after 6.0
    if (typeof Component === 'undefined') {
      if (type === 'toolButton') {
        Component = ToolButton;
      }

      if (type === 'toolGroupButton') {
        Component = ToolGroupButton;
      }

      if (type === 'toggleElementButton') {
        Component = ToggleElementButton;
      }

      if (type === 'actionButton') {
        Component = ActionButton;
      }

      if (type === 'statefulButton') {
        Component = StatefulButton;
      }

      if (type === 'customElement') {
        Component = CustomElement;
      }

      if (type === 'spacer' || type === 'divider') {
        Component = () => {
          <div className={`${type} ${mediaQueryClassName}`} />;
        };
      }
    }

    return (
      <Component
        key={key}
        dataElement={dataElement}
        mediaQueryClassName={mediaQueryClassName}
        {...overrides}
      />
    );
  });
};

CustomizablePopup.propTypes = propTypes;

export default CustomizablePopup;
