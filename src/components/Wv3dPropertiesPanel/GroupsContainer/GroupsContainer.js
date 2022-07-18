import React from 'react';
import Group from '../Group/Group';

function addOrderedGroups(orderedGroup, groups) {
  const orderArray = [];
  for (let group in orderedGroup) {
    const groupName = orderedGroup[group];

    if (groupName in groups) {
      orderArray.push(<Group name={groupName} key={groupName} data={groups[groupName]} open={true} />);
    }
  }

  return orderArray;
}

const GroupsContainer = props => {
  const { groups, groupOrder } = props;

  let combinedGroups = [];

  if (groupOrder && groupOrder.length > 0) {
    combinedGroups = addOrderedGroups(groupOrder, groups);

    for (let group in groups) {
      if (!groupOrder.includes(group)) {
        combinedGroups.push(<Group name={group} key={group} data={groups[group]} open={true} />);
      }
    }
  } else {
    for (let group in groups) {
      combinedGroups.push(<Group name={group} key={group} data={groups[group]} open={true} />);
    }
  }

  return <div data-element="groupsContainer">{combinedGroups}</div>;
};

export default GroupsContainer;
