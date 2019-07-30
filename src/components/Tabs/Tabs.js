import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';

import './Tabs.scss';

const TabsContext = React.createContext();

export const Tabs = props => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <TabsContext.Provider
      value={{
        activeIndex,
        setActiveIndex
      }}
    >
      {props.children}
    </TabsContext.Provider>
  );
};

Tabs.propTypes = {
  children: PropTypes.node.isRequired
};

export const TabList = props => {
  const { activeIndex } = useContext(TabsContext);

  return (
    <div className="tab-list">
      {React.Children.map(props.children, (child, index) =>
        React.cloneElement(child, {
          index,
          isActive: activeIndex === index
        })
      )}
    </div>
  );
};

export const Tab = ({ children, index }) => {
  const { setActiveIndex } = useContext(TabsContext);

  console.log(children);
  // TODO: check if children.type is a function
  // TODO: check if it's just a string

  return React.cloneElement(children, {
    onClick: () => {
      if (children.props.onClick) {
        children.props.onClick();
      }

      setActiveIndex(index);
    }
  });
};

export const TabPanels = props => {
  const { activeIndex } = useContext(TabsContext);

  return (
    <div className="tab-panels">
      {React.Children.map(props.children, (child, index) =>
        React.cloneElement(child, {
          isActive: activeIndex === index
        })
      )}
    </div>
  );
};

export const TabPanel = ({ isActive, children }) => {
  return isActive ? children : null;
};
