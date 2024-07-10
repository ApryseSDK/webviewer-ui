import React from 'react';
import { useTranslation } from 'react-i18next';

import GeneralValuesSection from '../GeneralValuesSection/GeneralValuesSection';
import GroupsContainer from '../GroupsContainer/GroupsContainer';
import Group from '../Group/Group';
import HeaderTitle from '../HeaderTitle/HeaderTitle';

function createDataSet(dataMap, propertySet, removeEmptyRows) {
  const combinedMap = {};

  if (removeEmptyRows) {
    for (const item in dataMap) {
      const dataPoint = propertySet[dataMap[item]];
      if (dataPoint !== undefined && dataPoint !== '') {
        combinedMap[item] = dataPoint;
      }
    }
  } else {
    for (const item in dataMap) {
      combinedMap[item] = propertySet[dataMap[item]];
    }
  }

  return combinedMap;
}

function checkForEmptyKeys(data) {
  for (const key in data) {
    const value = data[key];
    if (value !== undefined && value !== '') {
      return false;
    }
  }

  return true;
}

function generateGroupDataSet(dataMap, propertySet, removeEmptyRows, removeEmptyGroups) {
  const combinedGroupMap = {};

  if (removeEmptyGroups) {
    for (const group in dataMap) {
      const dataset = createDataSet(dataMap[group], propertySet, removeEmptyRows);
      if (Object.keys(dataset).length > 0) {
        if (!checkForEmptyKeys(dataset)) {
          combinedGroupMap[group] = dataset;
        }
      }
    }
  } else {
    for (const group in dataMap) {
      combinedGroupMap[group] = createDataSet(dataMap[group], propertySet, removeEmptyRows);
    }
  }

  return combinedGroupMap;
}

const PropertiesElement = (props) => {
  const { element, schema } = props;

  const {
    headerName,
    defaultValues,
    groups,
    groupOrder,
    removeEmptyRows,
    removeEmptyGroups,
    createRawValueGroup,
  } = schema;

  const { t } = useTranslation();

  const defaultItems = createDataSet(defaultValues, element, removeEmptyRows);
  const groupsItems = generateGroupDataSet(groups, element, removeEmptyRows, removeEmptyGroups);
  const name = element[headerName];

  return (
    <section data-element="propertiesElement">
      <HeaderTitle title={name} />
      <GeneralValuesSection entities={defaultItems} />
      <GroupsContainer groups={groupsItems} groupOrder={groupOrder} />
      {createRawValueGroup ? (
        <Group data-element="Group" name={t('wv3dPropertiesPanel.miscValuesHeader')} data={element} open={true} />
      ) : null}
    </section>
  );
};

export default PropertiesElement;
