export default (className, { isOpen }) => {
  return [
    className,
    isOpen ? 'open' : 'closed'
  ].join(' ').trim();
};