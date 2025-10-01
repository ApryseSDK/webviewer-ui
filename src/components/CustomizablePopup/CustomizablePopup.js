import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';

import ToolButton from 'components/ToolButton';
import ToolGroupButton from 'components/ToolGroupButton';
import ToggleElementButton from 'components/ToggleElementButton';
import ActionButton from 'components/ActionButton';
import StatefulButton from 'components/StatefulButton';
import CustomElement from 'components/CustomElement';

/** Modular Components */
import ToolButtonModular from 'components/ModularComponents/ToolButton';
import ToggleElementButtonModular from 'components/ModularComponents/ToggleElementButton';
import CustomButtonModular from 'components/ModularComponents/CustomButton';
import StatefulButtonModular from 'components/ModularComponents/StatefulButton';
import selectors from 'selectors';
import { ITEM_TYPE } from 'constants/customizationVariables';

const propTypes = {
  // The data element of the popup component.
  // Used to grab button props from redux and use those props to override the existing ones, if there're any
  dataElement: PropTypes.string.isRequired,
  // An object that maps an item's dataElement to a functional React component
  children: PropTypes.arrayOf(PropTypes.any).isRequired,
};

const CustomizablePopup = ({ dataElement, children, childrenClassName }) => {
  const items = useSelector(
    (state) => selectors.getPopupItems(state, dataElement),
    shallowEqual,
  );
  const isModularUIEnabled = useSelector(selectors.getIsCustomUIEnabled);
  const childrenArray = React.Children.toArray(children);

  if (process.env.NODE_ENV !== 'production') {
    // give a error message in the console if a child's dataElement in the childrenArray isn't in the redux state
    childrenArray.forEach((child) => {
      const found = items.some(
        ({ dataElement }) => dataElement === child.props.dataElement,
      );
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
    const mediaQueryClassName = hidden
      ?.map((screen) => `hide-in-${screen}`)
      .join(' ');
    let component = childrenArray.find(
      (child) => child.props.dataElement === dataElement,
    );

    // When we remove the legacy UI we can simplify this logic as we won't need to check for modular UI
    if (!component) {
      const props = { ...item, mediaQueryClassName, className: childrenClassName };

      if (type === ITEM_TYPE.TOOL_BUTTON) {
        if (isModularUIEnabled) {
          component = <ToolButtonModular {...props} />;
        } else {
          component = <ToolButton {...props} />;
        }
      }

      if (type === 'toolGroupButton') {
        if (isModularUIEnabled) {
          console.warn('ToolGroupButton is not supported in modular UI. Please use ToolButton instead.');
        } else {
          component = <ToolGroupButton {...props} />;
        }
      }

      // Legacy UI uses toggleElementButton but modular UI uses toggleButton
      if (type === 'toggleElementButton') {
        component = <ToggleElementButton {...props} />;
      }
      if (type === ITEM_TYPE.TOGGLE_BUTTON) {
        if (isModularUIEnabled) {
          component = <ToggleElementButtonModular {...props} />;
        }
      }

      if (type === 'actionButton') {
        component = <ActionButton {...props} />;
      }

      if (type === ITEM_TYPE.BUTTON) {
        if (isModularUIEnabled) {
          component = <CustomButtonModular {...props} />;
        } else {
          console.warn('customButton is not supported in Legacy UI. Please use customElement instead.');
        }
      }

      if (type === ITEM_TYPE.STATEFUL_BUTTON) {
        if (isModularUIEnabled) {
          component = <StatefulButtonModular {...props} />;
        } else {
          component = <StatefulButton {...props} />;
        }
      }

      if (type === ITEM_TYPE.CUSTOM_ELEMENT) {
        component = <CustomElement {...props} />;
      }

      if (type === 'spacer' || type === ITEM_TYPE.DIVIDER) {
        component = (
          <div className={`${type} ${mediaQueryClassName}`} {...props} />
        );
      }
    }

    return component
      ? React.cloneElement(component, {
        key,
      })
      : null;
  });
};

CustomizablePopup.propTypes = propTypes;

export default CustomizablePopup;
