/**
 * Set the configuration schema for the WV3D Properties Panel
 * @method UI.setWv3dPropertiesPanelSchema
 * @param {object} schema Object containing options for configuring the 3d properties panel.
 * @param {string} schema.headerName Sets the Title Header
 * @param {object} schema.defaultValues Defines the key/value pairs that will appear under the title, outside of a group.
 * @param {object} schema.groups Defines the collapsible groups that appear below the default values.
 * @param {array} schema.groupOrder Defines the order of the groups. If a group is not included it is appended to the end of the defined groups.
 * @param {boolean} schema.removeEmptyRows Defines whether to remove rows that contain empty string values.
 * @param {boolean} schema.removeEmptyGroups Defines whether to remove groups that contain only empty string values.
 * @param {boolean} schema.createRawValueGroup Defines whether to create a final group that has all the raw values.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.setWv3dPropertiesPanelSchema({
      headerName: 'Name',
      defaultValues: {
        Description: 'Description',
        GlobalID: 'GlobalId',
        Handle: 'handle',
        EmptyRow1: 'EmptyRow1',
      },
      groups: {
        SampleGroup01: {
          SampleField01: 'Sample01',
          SampleField02: 'Sample02',
          SampleField03: 'Sample03',
          EmptyRow2: 'EmptyRow2',
          GrossFootprintArea: 'GrossFootprintArea',
          GrossSideArea: 'GrossSideArea',
          GrossVolume: 'GrossVolume',
        },
        SampleGroup02: {
          SampleField01: 'Sample01',
          SampleField02: 'Sample02',
          SampleField03: 'Sample03',
        },
        SampleGroup03: {
          ObjectType: 'Elephants',
          EmptyRow3: 'Tigers',
          ObjectPlacement: 'Bears',
        },
      },
      groupOrder: ['Dimensions', 'RandomStuff'],
      removeEmptyRows: false,
      removeEmptyGroups: true,
      createRawValueGroup: true,
    })
  });
 */

import actions from 'actions';

export default (store) => (schema) => {
  store.dispatch(actions.setWv3dPropertiesPanelSchema(schema));
};
