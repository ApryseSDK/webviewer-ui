export default (className, { isOpen }) => [className, isOpen ? 'open' : 'closed'].join(' ').trim();
