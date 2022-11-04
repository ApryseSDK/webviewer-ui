import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import RightPanel from 'components/RightPanel';

import Wv3dPropertiesPanel from './Wv3dPropertiesPanel';

export default {
  title: 'Components/Wv3dPropertiesPanel',
  component: Wv3dPropertiesPanel,
};

const baseSchema = {
  headerName: 'Name',
  defaultValues: {
    Description: 'Description',
    GlobalID: 'GlobalId',
    Handle: 'handle',
    EmptyRow1: 'EmptyRow1',
  },
  groups: {
    Dimensions: {
      Length: 'Length',
      Width: 'Width',
      Height: 'Height',
      EmptyRow2: 'EmptyRow2',
      GrossFootprintArea: 'GrossFootprintArea',
      GrossSideArea: 'GrossSideArea',
      GrossVolume: 'GrossVolume',
    },
    RandomStuff: {
      ObjectType: 'ObjectType',
      EmptyRow3: 'EmptyRow3',
      ObjectPlacement: 'ObjectPlacement',
    },
    EmptyGroupTest: {
      ObjectType: 'Elephants',
      EmptyRow3: 'Tigers',
      ObjectPlacement: 'Bears',
    },
  },
  groupOrder: [],
  removeEmptyRows: false,
  removeEmptyGroups: false,
  createRawValueGroup: true,
};

const oneElement = [
  {
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
    HasAssignments: '',
    HasAssociations: '2260414',
    HasContext: '',
    HasCoverings: '',
    HasOpenings: '',
    HasProjections: '',
    Height: '25.604167',
    InterferesElements: '',
    IsConnectionRealization: '',
    IsDeclaredBy: '',
    IsDefinedBy: '29092,29099',
    IsExternal: 'T',
    IsInterferedByElements: '',
    IsNestedBy: '',
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
];

const twoElement = [
  {
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
    HasAssignments: '',
    HasAssociations: '2260414',
    HasContext: '',
    HasCoverings: '',
    HasOpenings: '',
    HasProjections: '',
    Height: '25.604167',
    InterferesElements: '',
    IsConnectionRealization: '',
    IsDeclaredBy: '',
    IsDefinedBy: '29092,29099',
    IsExternal: 'T',
    IsInterferedByElements: '',
    IsNestedBy: '',
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
  {
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
    HasAssignments: '',
    HasAssociations: '2260414',
    HasContext: '',
    HasCoverings: '',
    HasOpenings: '',
    HasProjections: '',
    Height: '25.604167',
    InterferesElements: '',
    IsConnectionRealization: '',
    IsDeclaredBy: '',
    IsDefinedBy: '29092,29099',
    IsExternal: 'T',
    IsInterferedByElements: '',
    IsNestedBy: '',
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
];

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

const StandardTemplate = (args) => (
  <PropertiesPanelStoryWrapper>
    <div className="Panel wv3d-properties-panel" style={{ width: '330px', minWidth: '330px' }}>
      <Wv3dPropertiesPanel {...args} />
    </div>
  </PropertiesPanelStoryWrapper>
);

const WideTemplate = (args) => (
  <PropertiesPanelStoryWrapper>
    <div className="Panel wv3d-properties-panel" style={{ width: '660px', minWidth: '330px' }}>
      <Wv3dPropertiesPanel {...args} />
    </div>
  </PropertiesPanelStoryWrapper>
);

const Default = StandardTemplate.bind({});

const defaultArgs = {
  modelData: oneElement,
  schema: baseSchema,
  currentWidth: '330px',
  isInDesktopOnlyMode: false,
  isMobile: false,
  closeWv3dPropertiesPanel: false,
};

Default.args = defaultArgs;

export function DefaultStandard() {
  return <Default {...defaultArgs} />;
}

export const DefaultWide = WideTemplate.bind({});

DefaultWide.args = {
  modelData: oneElement,
  schema: baseSchema,
  currentWidth: '660px',
  isInDesktopOnlyMode: false,
  isMobile: false,
  closeWv3dPropertiesPanel: false,
};

const MultipleElements = StandardTemplate.bind({});

const multipleElementsArgs = {
  modelData: twoElement,
  schema: baseSchema,
  currentWidth: '300px',
  isInDesktopOnlyMode: false,
  isMobile: false,
  closeWv3dPropertiesPanel: false,
};

MultipleElements.args = multipleElementsArgs;

export function MultiplePropertiesElements() {
  return <MultipleElements {...multipleElementsArgs} />;
}

const NoElementsSelected = StandardTemplate.bind({});

const noElementsSelectedArgs = {
  modelData: [],
  schema: baseSchema,
  currentWidth: '300px',
  isInDesktopOnlyMode: false,
  isMobile: false,
  closeWv3dPropertiesPanel: false,
};

NoElementsSelected.args = noElementsSelectedArgs;

export function EmptyPanel() {
  return <NoElementsSelected {...noElementsSelectedArgs} />;
}

const GroupOrderDefined = StandardTemplate.bind({});

const groupOrderSchema = JSON.parse(JSON.stringify(baseSchema));
groupOrderSchema.groupOrder = ['RandomStuff', 'Dimensions'];

const groupOrderDefinedArgs = {
  modelData: oneElement,
  schema: groupOrderSchema,
  currentWidth: '300px',
  isInDesktopOnlyMode: false,
  isMobile: false,
  closeWv3dPropertiesPanel: false,
};

GroupOrderDefined.args = groupOrderDefinedArgs;

export function GroupOrderSpecified() {
  return <GroupOrderDefined {...groupOrderDefinedArgs} />;
}

const EmptyRowsRemoved = StandardTemplate.bind({});

const rowsRemovedSchema = JSON.parse(JSON.stringify(baseSchema));
rowsRemovedSchema.removeEmptyRows = true;

const emptyRowsRemovedArgs = {
  modelData: oneElement,
  schema: rowsRemovedSchema,
  currentWidth: '300px',
  isInDesktopOnlyMode: false,
  isMobile: false,
  closeWv3dPropertiesPanel: false,
};

EmptyRowsRemoved.args = emptyRowsRemovedArgs;

export function RemoveEmptyRows() {
  return <EmptyRowsRemoved {...emptyRowsRemovedArgs} />;
}

const EmptyGroupsRemoved = StandardTemplate.bind({});

const rowsAndGroupsRemovedSchema = JSON.parse(JSON.stringify(baseSchema));
rowsAndGroupsRemovedSchema.removeEmptyRows = true;
rowsAndGroupsRemovedSchema.removeEmptyGroups = true;

const emptyGroupsRemovedArgs = {
  modelData: oneElement,
  schema: rowsAndGroupsRemovedSchema,
  currentWidth: '300px',
  isInDesktopOnlyMode: false,
  isMobile: false,
  closeWv3dPropertiesPanel: false,
};

EmptyGroupsRemoved.args = emptyGroupsRemovedArgs;

export function RemoveEmptyGroups() {
  return <EmptyGroupsRemoved {...emptyRowsRemovedArgs} />;
}

const NoRawValues = StandardTemplate.bind({});

const NoRawValuesSchema = JSON.parse(JSON.stringify(baseSchema));
NoRawValuesSchema.createRawValueGroup = false;

const noRawValuesArgs = {
  modelData: oneElement,
  schema: NoRawValuesSchema,
  currentWidth: '300px',
  isInDesktopOnlyMode: false,
  isMobile: false,
  closeWv3dPropertiesPanel: false,
};

NoRawValues.args = noRawValuesArgs;

export function RemoveRawValues() {
  return <NoRawValues {...noRawValuesArgs} />;
}
