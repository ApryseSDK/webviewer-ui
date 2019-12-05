import React, { useState, useContext } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

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

export const Tab = ({ children, index, isSelected }) => {
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

  // only inject isSelected if children is a component
  if (typeof children.type === 'function') {
    propsToInject = Object.assign(propsToInject, {
      isTabSelected: isSelected,
    });
  }

  return React.cloneElement(children, propsToInject);
};

Tab.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.number,
  isSelected: PropTypes.bool,
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

// eslint-disable-next-line arrow-body-style
export const TabPanel = ({ isSelected, children }) => {
  return (
    <div className="tab-panel" style={{ display: isSelected ? '' : 'none' }}>
      {typeof children.type === 'function'
        ? React.cloneElement(children, { isTabPanelSelected: isSelected })
        : children}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  isSelected: PropTypes.bool,
};
