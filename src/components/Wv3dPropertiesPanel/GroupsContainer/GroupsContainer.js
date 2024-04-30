import React from 'react';
import Group from '../Group/Group';

function addOrderedGroups(orderedGroup, groups) {
  const orderArray = [];
  for (const group in orderedGroup) {
    const groupName = orderedGroup[group];

    if (groupName in groups) {
      orderArray.push(<Group name={groupName} key={groupName} data={groups[groupName]} open />);
    }
  }

  return orderArray;
}

const GroupsContainer = (props) => {
  const { groups, groupOrder } = props;

  let combinedGroups = [];

  if (groupOrder && groupOrder.length > 0) {
    combinedGroups = addOrderedGroups(groupOrder, groups);

    for (const group in groups) {
      if (!groupOrder.includes(group)) {
        combinedGroups.push(<Group name={group} key={group} data={groups[group]} open />);
      }
    }
  } else {
    for (const group in groups) {
      combinedGroups.push(<Group name={group} key={group} data={groups[group]} open />);
    }
  }

  return <div data-element="groupsContainer">{combinedGroups}</div>;
};

export default GroupsContainer;
