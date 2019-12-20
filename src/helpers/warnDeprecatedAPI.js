export default (deprecated, current, majorVersion = '7.0') => {
  console.warn(
    `instance.${deprecated} is deprecated, please use instance.${current} instead. The deprecated API will be removed in ${majorVersion}.`,
  );
};
