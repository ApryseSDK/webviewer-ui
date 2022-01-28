export default unit => {
  switch (unit) {
    case 'ft\'':
      return 'ft';
    case 'in"':
      return 'in';
    default:
      return unit;
  }
};
