import getRootNode from './getRootNode';

export function getOpenedWarningModal() {
  return getRootNode().querySelector('.WarningModal.open .container');
}

export function getOpenedColorPicker() {
  return getRootNode().querySelector('.ColorPickerModal.open');
}

export function getAllOpenedModals() {
  return document.querySelectorAll('.Modal.open');
}

export function getDatePicker() {
  return document.querySelector('[data-element="datePickerContainer"]');
}