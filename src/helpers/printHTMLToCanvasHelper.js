/**
 * @ignore
 * This function corrects for a bug in html2canvas where select elements are not rendered correctly.
 * It hides all select elements and adds divs that mimic the select element.
 * Since these divs are only being printed and not interacted with, this is a suitable workaround.
 * @param {HTMLElement} container The container element that contains the select elements to be replaced
 * @returns {void}
 */
function adjustListBoxForPrint(container) {
  if (!container) {
    return;
  }

  const selects = container.querySelectorAll('select');
  selects.forEach((select) => {
    const fakeSelectContainer = createFakeContainerForSelect(select);

    Array.from(select.options).forEach((option) => {
      const optionDiv = createFakeOption(option);
      fakeSelectContainer.appendChild(optionDiv);
    });

    hideSelectContainer(select);
    select.parentNode.insertBefore(fakeSelectContainer, select.nextSibling);
  });
}

/**
 * @ignore
 * This function creates a div that mimics the select element.
 * @param {HTMLElement} select
 * @returns {HTMLDivElement}
 */
function createFakeContainerForSelect(select) {
  const fakeSelectContainer = document.createElement('div');
  fakeSelectContainer.style.position = select.style.position;
  fakeSelectContainer.style.top = select.style.top;
  fakeSelectContainer.style.left = select.style.left;
  fakeSelectContainer.style.width = select.style.width;
  fakeSelectContainer.style.height = select.style.height;
  fakeSelectContainer.style.backgroundColor = select.style.backgroundColor;
  fakeSelectContainer.style.border = select.style.border;
  fakeSelectContainer.style.borderRadius = select.style.borderRadius;
  fakeSelectContainer.style.fontFamily = select.style.fontFamily;
  fakeSelectContainer.style.fontSize = select.style.fontSize;
  fakeSelectContainer.style.fontWeight = select.style.fontWeight;
  fakeSelectContainer.style.fontStyle = select.style.fontStyle;
  fakeSelectContainer.style.color = select.style.color;
  fakeSelectContainer.style.overflow = 'auto';

  return fakeSelectContainer;
}

/**
 * @ignore
 * This function creates a div that mimics the option element.
 * We handle both single and multi select options.
 * @param {HTMLElement} option
 * @returns {HTMLDivElement}
 */
function createFakeOption(option) {
  const optionDiv = document.createElement('div');
  optionDiv.textContent = option.text;
  optionDiv.style.padding = '0px';
  optionDiv.style.margin = '0px';
  optionDiv.style.backgroundColor = option.selected ? '#b3d9ff' : 'transparent';
  optionDiv.style.textAlign = 'left';
  optionDiv.style.justifyContent = 'flex-start';

  const isMultiSelect = option.hasAttribute('selected');
  const isSelected = option.selected;
  if (isMultiSelect || isSelected) {
    optionDiv.style.backgroundColor = '#b3d9ff';
  } else {
    optionDiv.style.backgroundColor = 'transparent';
  }

  return optionDiv;
}

/**
 * @ignore
 * This function hides the select element and its container div. We do this instead of deleting the div
 * because its faster to hide and show elements than to create and destroy them.
 * @param {HTMLElement} select
 * @returns {void}
 */
function hideSelectContainer(select) {
  select.style.display = 'none';
}

export {
  adjustListBoxForPrint,
  createFakeContainerForSelect,
  createFakeOption,
  hideSelectContainer
};