export const mockCustomModal = {
  dataElement: 'customModal',
  header: {
    title: 'Custom Modal Test',
    className: 'myCustomModal-header',
    style: {},
    children: [
      {
        title: 'Sub Header Title',
        className: 'sub-header-title',
      }],
  },
  body: {
    className: 'myCustomModal-body',
    style: {},
    children: [
      {
        title: 'Custom Modal Body Test',
        className: 'sub-header-title',
      },
    ],
  },
  footer: {
    className: 'myCustomModal-footer footer',
    style: {},
    children: [
      {
        title: 'Cancel',
        button: true,
        style: {},
        className: 'modal-button cancel-form-field-button',
      },
      {
        title: 'OK',
        button: true,
        style: {},
        className: 'modal-button confirm ok-btn',
      },
    ]
  }
};