import onRubberStampsUpdated from './onRubberStampsUpdated';
import core from 'core';
import actions from 'actions';
import getCurrentT from 'helpers/getCurrentT';

jest.mock('core', () => ({
  getTool: jest.fn(),
}));

jest.mock('actions', () => ({
  setStandardStamps: jest.fn(() => ({ type: 'SET_STANDARD_STAMPS' })),
  setCustomStamps: jest.fn(() => ({ type: 'SET_CUSTOM_STAMPS' })),
  setCustomStampCategories: jest.fn((customStampCategories) => ({
    type: 'SET_CUSTOM_STAMP_CATEGORIES',
    payload: { customStampCategories },
  })),
}));

jest.mock('helpers/getCurrentT', () => jest.fn(() => jest.fn()));

describe('onRubberStampsUpdated', () => {
  it('stores custom stamp categories from custom stamp data', async () => {
    const rubberStampTool = {
      getCustomStamps: jest.fn().mockResolvedValue([
        { category: 'Legal' },
        { __params: { category: 'Internal' } },
        { category: 'Legal' },
      ]),
    };
    const dispatch = jest.fn();
    core.getTool.mockReturnValue(rubberStampTool);

    await onRubberStampsUpdated(dispatch)();

    expect(actions.setCustomStampCategories).toHaveBeenCalledWith(['Legal', 'Internal']);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_CUSTOM_STAMP_CATEGORIES',
      payload: { customStampCategories: ['Legal', 'Internal'] },
    });
    expect(getCurrentT).toHaveBeenCalled();
  });
});