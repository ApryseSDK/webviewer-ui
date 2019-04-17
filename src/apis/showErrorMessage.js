import fireEvent from '../helpers/fireEvent';

export default message => {
  fireEvent('customErrorMessage', message);
};
