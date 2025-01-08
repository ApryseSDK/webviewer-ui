export default (container) => {
  const focusableElements = [];

  const isElementHidden = (el) => {
    const style = window.getComputedStyle(el);
    return style.display === 'none' || style.visibility === 'hidden';
  };

  const isAncestorHidden = (el) => {
    let current = el.parentElement;
    while (current) {
      if (isElementHidden(current)) {
        return true;
      }
      current = current.parentElement;
    }
    return false;
  };

  const traverse = (el) => {
    if (el && !isElementHidden(el)) {
      const matchingElements = el.querySelectorAll('button:not([disabled]), input:not([disabled]), [role="combobox"]:not([disabled])');
      matchingElements.forEach((elem) => {
        if (!focusableElements.includes(elem) && !isElementHidden(elem) && !isAncestorHidden(elem)) {
          focusableElements.push(elem);
        }
      });

      Array.from(el.children).forEach((child) => {
        if (!isElementHidden(child) && !isAncestorHidden(child)) {
          traverse(child);
        }
      });
    }
  };

  traverse(container);
  return focusableElements;
};