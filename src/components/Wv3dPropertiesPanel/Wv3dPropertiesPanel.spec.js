import React from 'react';
import { render } from '@testing-library/react';
import Wv3dPropertiesPanel from './Wv3dPropertiesPanel';

import {
  DefaultStandard,
  GroupOrderSpecified,
  MultiplePropertiesElements,
  EmptyPanel,
  RemoveEmptyRows,
  RemoveEmptyGroups,
  RemoveRawValues,
} from './Wv3dPropertiesPanel.stories';

const sampleData = [
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

const sampleSchema = {
  headerName: 'Name',
  defaultValues: {},
  groups: {},
  groupOrder: [],
  removeEmptyRows: false,
  removeEmptyGroups: false,
  createRawValueGroup: false,
};

describe('Wv3dPropertiesPanel', () => {
  it('The Header is populated with a title', () => {
    render(
      <Wv3dPropertiesPanel
        currentWidth={330}
        isInDesktopOnlyMode={false}
        isMobile={false}
        closeWv3dPropertiesPanel={false}
        schema={sampleSchema}
        modelData={sampleData}
      />,
    );

    const name = sampleSchema['headerName'];
    const expectedHeader = sampleData[0][name];
    const res = document.body.getElementsByClassName('header-value');

    expect(res[0].innerHTML).toContain(expectedHeader);
  });

  it('Default Values are generated', () => {
    sampleSchema.defaultValues = {
      'GrossVolume': 'GrossVolume',
      'OwnerHistory': 'OwnerHistory',
    };

    const { getByText } = render(
      <Wv3dPropertiesPanel
        currentWidth={330}
        isInDesktopOnlyMode={false}
        isMobile={false}
        closeWv3dPropertiesPanel={false}
        schema={sampleSchema}
        modelData={sampleData}
      />,
    );

    expect(getByText('GrossVolume')).toBeInTheDocument();
    expect(getByText(sampleData[0]['GrossVolume'])).toBeInTheDocument();

    expect(getByText('OwnerHistory')).toBeInTheDocument();
    expect(getByText(sampleData[0]['OwnerHistory'])).toBeInTheDocument();
  });

  it('Groups are created succesfully', async () => {
    sampleSchema.defaultValues = {};
    sampleSchema.groups = {
      TestGroup: {
        'GrossVolume': 'GrossVolume',
        'OwnerHistory': 'OwnerHistory',
      },
    };

    const { getByText } = render(
      <Wv3dPropertiesPanel
        currentWidth={330}
        isInDesktopOnlyMode={false}
        isMobile={false}
        closeWv3dPropertiesPanel={false}
        schema={sampleSchema}
        modelData={sampleData}
      />,
    );

    expect(getByText('GrossVolume')).toBeInTheDocument();
    expect(getByText(sampleData[0]['GrossVolume'])).toBeInTheDocument();

    expect(getByText('OwnerHistory')).toBeInTheDocument();
    expect(getByText(sampleData[0]['OwnerHistory'])).toBeInTheDocument();

    expect(getByText('TestGroup')).toBeInTheDocument();
  });

  it('Empty Values are removed when removeEmptyRows is true', () => {
    sampleSchema.defaultValues = { 'GrossVolume': 'GrossVolume', 'OwnerHistory': 'OwnerHistory', 'EmptyTest': '' };
    sampleSchema.removeEmptyRows = true;
    sampleSchema.groups = {};

    const { getByText, queryByText } = render(
      <Wv3dPropertiesPanel
        currentWidth={330}
        isInDesktopOnlyMode={false}
        isMobile={false}
        closeWv3dPropertiesPanel={false}
        schema={sampleSchema}
        modelData={sampleData}
      />,
    );

    expect(getByText('GrossVolume')).toBeInTheDocument();
    expect(getByText(sampleData[0]['GrossVolume'])).toBeInTheDocument();

    expect(getByText('OwnerHistory')).toBeInTheDocument();
    expect(getByText(sampleData[0]['OwnerHistory'])).toBeInTheDocument();

    expect(queryByText('EmptyTest')).toBe(null);
  });

  it('Empty Groups are removed when removeEmptyGroups is true', () => {
    sampleSchema.defaultValues = {};
    sampleSchema.groups = {
      TestGroup: {
        'GrossVolume': 'GrossVolume',
        'OwnerHistory': 'OwnerHistory',
        'EmptyTest': '',
      },
      TestGroup2: {
        'EmptyTest': '',
        'EmptyTest2': '',
        'EmptyTest3': '',
      },
    };
    sampleSchema.removeEmptyRows = true;
    sampleSchema.removeEmptyGroups = true;

    const { getByText, queryByText } = render(
      <Wv3dPropertiesPanel
        currentWidth={330}
        isInDesktopOnlyMode={false}
        isMobile={false}
        closeWv3dPropertiesPanel={false}
        schema={sampleSchema}
        modelData={sampleData}
      />,
    );

    expect(getByText('TestGroup')).toBeInTheDocument();
    expect(queryByText('TestGroup2')).toBe(null);
  });

  it('Groups are ordered correctly', () => {
    sampleSchema.defaultValues = {};
    sampleSchema.groups = {
      TestGroup: {
        'GrossVolume': 'GrossVolume',
        'OwnerHistory': 'OwnerHistory',
        'EmptyTest': '',
      },
      TestGroup2: {
        'EmptyTest': '',
        'EmptyTest2': '',
        'EmptyTest3': '',
      },
      TestGroup3: {
        'EmptyTest': '',
        'EmptyTest2': '',
        'EmptyTest3': '',
      },
    };

    sampleSchema.groupOrder = ['TestGroup2', 'TestGroup3'];
    sampleSchema.removeEmptyRows = false;
    sampleSchema.removeEmptyGroups = false;

    const { asFragment } = render(
      <Wv3dPropertiesPanel
        currentWidth={330}
        isInDesktopOnlyMode={false}
        isMobile={false}
        closeWv3dPropertiesPanel={false}
        schema={sampleSchema}
        modelData={sampleData}
      />,
    );

    const fragment = asFragment();
    const groupContainer = fragment.querySelector('[data-element="groupsContainer"]');

    expect(groupContainer.children.length).toBe(3);
    expect(groupContainer.children[0]).toHaveTextContent('TestGroup2');
    expect(groupContainer.children[1]).toHaveTextContent('TestGroup3');
    expect(groupContainer.children[2]).toHaveTextContent('TestGroup');
  });

  it('Raw Value Group was created successfully', () => {
    sampleSchema.createRawValueGroup = true;

    const { getByText } = render(
      <Wv3dPropertiesPanel
        currentWidth={330}
        isInDesktopOnlyMode={false}
        isMobile={false}
        closeWv3dPropertiesPanel={false}
        schema={sampleSchema}
        modelData={sampleData}
      />,
    );

    expect(getByText('All')).toBeInTheDocument();
  });

  it('Raw Value Group should not be in the document', () => {
    sampleSchema.createRawValueGroup = false;

    const { queryByText } = render(
      <Wv3dPropertiesPanel
        currentWidth={330}
        isInDesktopOnlyMode={false}
        isMobile={false}
        closeWv3dPropertiesPanel={false}
        schema={sampleSchema}
        modelData={sampleData}
      />,
    );

    expect(queryByText('All')).toBe(null);
  });

  it('renders the storybook component with defaults correctly', () => {
    expect(() => {
      render(<DefaultStandard />);
    }).not.toThrow();
  });

  it('renders the storybook component with ordered groups correctly', () => {
    expect(() => {
      render(<GroupOrderSpecified />);
    }).not.toThrow();
  });

  it('renders the storybook component with empty rows removed correctly', () => {
    expect(() => {
      render(<RemoveEmptyRows />);
    }).not.toThrow();
  });

  it('renders the storybook component with empty groups removed correctly', () => {
    expect(() => {
      render(<RemoveEmptyGroups />);
    }).not.toThrow();
  });

  it('renders the storybook component with the raw values section removed correctly', () => {
    expect(() => {
      render(<RemoveRawValues />);
    }).not.toThrow();
  });

  it('renders the storybook component with multiple elements correctly', () => {
    expect(() => {
      render(<MultiplePropertiesElements />);
    }).not.toThrow();
  });

  it('renders the storybook component with zero elements correctly', () => {
    expect(() => {
      render(<EmptyPanel />);
    }).not.toThrow();
  });
});
