import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import RightPanel from 'components/RightPanel';
import GroupsContainer from './GroupsContainer';

export default {
  title: 'Components/Wv3dPropertiesPanel/GroupsContainer/GroupsContainer',
  component: GroupsContainer,
};

const initialState = {
  viewer: {
    isInDesktopOnlyMode: true,
    disabledElements: {},
    customElementOverrides: {},
    openElements: {
      header: true,
      wv3dPropertiesPanel: true,
    },
    currentLanguage: 'en',
    panelWidths: {
      wv3dPropertiesPanel: 330,
    },
  },
  wv3dPropertiesPanel: {
    modelData: [],
    schema: {
      headerName: 'Name',
      defaultValues: {},
      groups: {},
      groupOrder: [],
      removeEmptyRows: false,
      removeEmptyGroups: false,
      createRawValueGroup: true,
    },
  },
};

function rootReducer(state = initialState) {
  return state;
}

const store = createStore(rootReducer);

const PropertiesPanelStoryWrapper = ({ children }) => {
  return (
    <Provider store={store}>
      <RightPanel dataElement="wv3dPropertiesPanel">{children}</RightPanel>
    </Provider>
  );
};

const Template = (args) => (
  <PropertiesPanelStoryWrapper>
    <div className="Panel wv3d-properties-panel" style={{ width: '330px', minWidth: '330px' }}>
      <GroupsContainer {...args} />
    </div>
  </PropertiesPanelStoryWrapper>
);

export const Default = Template.bind({});

Default.args = {
  groupOrder: [],
  groups: {
    Group1: {
      ConnectedFrom: '2274843',
      ConnectedTo: '2274847',
      ContainedInStructure: '2258156',
      Name: 'Basic Wall:Reinforced Concrete - 1\'-8":117463',
      Nests: '',
      ObjectPlacement: '29040',
      ObjectType: 'Basic Wall:Reinforced Concrete - 1\'-8":118691',
      OwnerHistory: '42',
      PredefinedType: 'NOTDEFINED',
      ProvidesBoundaries: '',
      Reference: 'Basic Wall:Reinforced Concrete - 1\'-8"',
      ReferencedBy: '',
      ReferencedInStructures: '',
      Representation: '29077',
      Tag: '117463',
      Width: '1.666667',
      handle: '29081',
    },
    Groups2: {
      ConnectedFrom: '2274843',
      ConnectedTo: '2274847',
      ContainedInStructure: '2258156',
      Declares: '',
      Decomposes: '',
      Description: 'ÿ',
      ExtendToStructure: 'T',
      FillsVoids: '',
      GlobalId: '3_YR89Qiz6UgyQsBcI$FJz',
      GrossFootprintArea: '317.638889',
      GrossSideArea: '4879.727431',
      GrossVolume: '8132.879051',
      IsTypedBy: '2266845',
      Length: '190.583333',
      LoadBearing: 'F',
      Name: 'Basic Wall:Reinforced Concrete - 1\'-8":117463',
      Nests: '',
      ObjectPlacement: '29040',
      ObjectType: 'Basic Wall:Reinforced Concrete - 1\'-8":118691',
      OwnerHistory: '42',
      PredefinedType: 'NOTDEFINED',
      ProvidesBoundaries: '',
      Reference: 'Basic Wall:Reinforced Concrete - 1\'-8"',
      ReferencedBy: '',
      ReferencedInStructures: '',
      Representation: '29077',
      Tag: '117463',
      Width: '1.666667',
      handle: '29081',
    },
  },
};
