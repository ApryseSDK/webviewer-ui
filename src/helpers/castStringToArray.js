const castStringToArray = (input) => {
  if (!Array.isArray(input)) {
    input = [input];
  }
  return input;
};

export default castStringToArray;
