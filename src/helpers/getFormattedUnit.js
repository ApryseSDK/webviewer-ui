export default (unit) => {
  switch (unit) {
    case 'ft\'':
      return 'ft';
    case 'in"':
      return 'in';
    case 'ft-in':
      return 'ft';
    default:
      return unit;
  }
};
