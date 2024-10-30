const FocusStackManager = (() => {
  let stack = [];

  return {
    push: (element) => {
      stack.push(element);
    },
    pop: () => {
      return stack.length > 0 ? stack.pop() : null;
    },
    clear: () => {
      stack = [];
    },
    getStack: () => stack,
  };
})();

export default FocusStackManager;
