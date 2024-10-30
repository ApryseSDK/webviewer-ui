const getField = () => {
  return {
    'widgets': [],
  };
};

export const widgets = [
  {
    Id: '1',
    fieldName: 'Signature Field 1',
    icon: 'icon-tool-signature',
    PageNumber: 1,
    getField,
  },
  {
    Id: '2',
    fieldName: 'Signature Field 2',
    icon: 'icon-tool-signature',
    PageNumber: 1,
    getField,
  },
  {
    Id: '3',
    fieldName: 'Signature Field 3',
    icon: 'icon-tool-signature',
    PageNumber: 2,
    getField,
  },
  {
    Id: '4',
    fieldName: 'Radio Button Field 1',
    icon: 'icon-tool-radio-button',
    PageNumber: 1,
    getField: () => {
      return {
        'widgets': [
          {
            Id: '4',
            fieldName: 'Radio Button Field 1',
            icon: 'icon-tool-radio-button',
            PageNumber: 1,
          },
          {
            Id: '5',
            fieldName: 'Radio Button Field 1',
            icon: 'icon-tool-radio-button',
            PageNumber: 1,
          }
        ]
      };
    },
  },
  {
    Id: '5',
    fieldName: 'Radio Button Field 1',
    icon: 'icon-tool-radio-button',
    PageNumber: 1,
    getField: () => {
      return {
        'widgets': [
          {
            Id: '4',
            fieldName: 'Radio Button Field 1',
            icon: 'icon-tool-radio-button',
            PageNumber: 1,
          },
          {
            Id: '5',
            fieldName: 'Radio Button Field 1',
            icon: 'icon-tool-radio-button',
            PageNumber: 1,
          }
        ]
      };
    },
  },
];