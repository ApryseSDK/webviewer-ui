import getClassName from 'helpers/getClassName';

test('getClassName', () => {
  const trueTest = { isOpen: true };
  const falseTest = { isOpen: false };
  const undefinedTest = { isOpen: undefined };
  expect(getClassName('test', trueTest)).toEqual('test open');
  expect(getClassName('test', falseTest)).toEqual('test closed');
  expect(getClassName('test', undefinedTest)).toEqual('test closed');
});
