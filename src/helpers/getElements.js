export function getOpenedWarningModal() {
  return document.querySelector('.WarningModal.open .container');
}

export function getOpenedColorPicker() {
  return document.querySelector('.ColorPickerModal.open');
}

export function getAllOpenedModals() {
  return document.querySelectorAll('.Modal.open');
}

export function getDatePicker() {
  return document.querySelector('[data-element="datePickerContainer"]');
}
