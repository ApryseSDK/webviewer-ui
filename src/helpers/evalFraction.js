export default (fraction) => {
  const [numerator, denominator] = fraction.split('/');
  return Number(numerator) / Number(denominator);
};
