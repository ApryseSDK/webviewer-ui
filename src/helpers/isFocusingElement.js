export default () => {
  const { activeElement } = document;

  return (
    activeElement instanceof window.HTMLInputElement ||
    activeElement instanceof window.HTMLTextAreaElement ||
    activeElement.getAttribute('contenteditable') === 'true'
  );
};
