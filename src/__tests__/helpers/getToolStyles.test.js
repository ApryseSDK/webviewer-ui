import getToolStyles from 'helpers/getToolStyles';
import core from 'core';

test('getToolStyles', () => {
  const test = { defaults: 'test' };
  core.getTool = jest.fn();
  core.getTool.mockReturnValue(test);
  expect(getToolStyles(test)).toEqual('test');
});
