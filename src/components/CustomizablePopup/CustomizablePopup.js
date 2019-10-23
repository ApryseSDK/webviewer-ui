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
  children: PropTypes.arrayOf(PropTypes.any).isRequired,
};

const CustomizablePopup = ({ dataElement, children }) => {
  const items = useSelector(
    state => selectors.getPopupItems(state, dataElement),
    shallowEqual,
  );
  const childrenArray = React.Children.toArray(children);

  if (process.env.NODE_ENV !== 'production') {
    // give a error message in the console if a child's dataElement in the childrenArray isn't in the redux state
    childrenArray.forEach(child => {
      const found = items.some(({ dataElement }) => dataElement === child.props.dataElement);
      if (!found) {
        const error = `
        A React component with dataElement ${child.props.dataElement} won't be rendered because it isn't in the redux state. Modify initialState.js like below to fix this issue:

        {
          viewer: {
            ...,
            ${dataElement}: [
              ...,
              { dataElement: '${child.props.dataElement}' },
            ]
          }
        }
      `;
        console.error(error.replace(/\s+/, ''));
      }
    });
  }

  return items.map((item, i) => {
    const { dataElement, type, hidden } = item;
    const key = `${type}-${dataElement || i}`;
    const mediaQueryClassName = hidden?.map(screen => `hide-in-${screen}`).join(' ');
    let component = childrenArray.find(child => child.props.dataElement === dataElement);

    // duplicate code in HeaderItems.js, must clean up after 6.0
    if (!component) {
      if (type === 'toolButton') {
        component = <ToolButton />;
      }

      if (type === 'toolGroupButton') {
        component = <ToolGroupButton />;
      }

      if (type === 'toggleElementButton') {
        component = <ToggleElementButton />;
      }

      if (type === 'actionButton') {
        component = <ActionButton />;
      }

      if (type === 'statefulButton') {
        component = <StatefulButton />;
      }

      if (type === 'customElement') {
        component = <CustomElement />;
      }

      if (type === 'spacer' || type === 'divider') {
        component = <div className={`${type} ${mediaQueryClassName}`} />;
      }
    }

    const overrides = { ...item, mediaQueryClassName };
    return component ? React.cloneElement(
      component,
      {
        ...component.props,
        ...overrides,
        key,
      },
    ) : null;
  });
};

CustomizablePopup.propTypes = propTypes;

export default CustomizablePopup;
