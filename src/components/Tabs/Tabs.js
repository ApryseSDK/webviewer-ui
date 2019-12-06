import React, { useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import selectors from 'selectors';

import './Tabs.scss';

const TabsContext = React.createContext();

export const Tabs = props => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <TabsContext.Provider
      value={{
        currentIndex,
        setCurrentIndex,
      }}
    >
      {props.children}
    </TabsContext.Provider>
  );
};

Tabs.propTypes = {
  children: PropTypes.node.isRequired,
};

export const TabList = ({ children }) => {
  const { currentIndex } = useContext(TabsContext);

  return (
    <div className="tab-list">
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, {
          index,
          isSelected: currentIndex === index,
        }),
      )}
    </div>
  );
};

TabList.propTypes = {
  children: PropTypes.node.isRequired,
};

export const Tab = ({ children, index, isSelected, dataElement }) => {
  const isDisabled = useSelector(state =>
    selectors.isElementDisabled(state, dataElement),
  );
  const { setCurrentIndex } = useContext(TabsContext);

  let propsToInject = {
    className: classNames({
      selected: isSelected,
      [children.props.className]: !!children.props.className,
    }),
    onClick: () => {
      children.props.onClick?.();
      setCurrentIndex(index);
    },
  };

  // need to do this because the children may be wrapped by React.memo
  const type = typeof (children.type.type || children.type);
  // only inject isSelected if children is a component
  if (type === 'function') {
    propsToInject = Object.assign(propsToInject, {
      isTabSelected: isSelected,
      dataElement,
    });
  } else {
    propsToInject = Object.assign(propsToInject, {
      'data-element': dataElement,
    });
  }

  return isDisabled ? null : React.cloneElement(children, propsToInject);
};

Tab.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.number,
  isSelected: PropTypes.bool,
  dataElement: PropTypes.string.isRequired,
};

export const TabPanels = ({ children }) => {
  const { currentIndex } = useContext(TabsContext);

  return (
    <div className="tab-panels">
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, {
          isSelected: currentIndex === index,
        }),
      )}
    </div>
  );
};

TabPanels.propTypes = {
  children: PropTypes.node.isRequired,
};

export const TabPanel = ({ isSelected, children, dataElement }) => {
  const isDisabled = useSelector(state =>
    selectors.isElementDisabled(state, dataElement),
  );

  return isDisabled ? null : (
    <div
      className="tab-panel"
      data-element={dataElement}
      style={{ display: isSelected ? '' : 'none' }}
    >
      {typeof children.type === 'function'
        ? React.cloneElement(children, { isTabPanelSelected: isSelected })
        : children}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  isSelected: PropTypes.bool,
  dataElement: PropTypes.string.isRequired,
};
