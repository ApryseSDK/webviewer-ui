import setCellFormatString, {
  getDecimalAdjustedFormatString,
  isAccountingFormat,
  isFinancialFormat,
  addOneDecimalPlace,
  removeOneDecimalPlace,
  adjustDecimalOnFormatString,
  adjustDecimalForSemicolonSeparatedFormat,
  cannotBeAdjustedWithDecimal,
} from './setCellFormatString';
import core from 'core';
import { formatsMap } from 'src/constants/spreadsheetEditor';

jest.mock('core', () => ({
  getDocumentViewer: jest.fn(() => ({
    getSpreadsheetEditorManager: jest.fn(() => ({
      setSelectedCellsStyle: jest.fn(),
      getSelectedCells: jest.fn(() => [{
        getStyle: () => null,
      }]),
    })),
  })),
}));

describe('setCellFormatString', () => {
  let mockSpreadsheetEditorManager;

  beforeEach(() => {
    mockSpreadsheetEditorManager = {
      setSelectedCellsStyle: jest.fn(),
    };

    core.getDocumentViewer.mockReturnValue({
      getSpreadsheetEditorManager: jest.fn(() => mockSpreadsheetEditorManager),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should do nothing when provided an invalid format type', () => {
    setCellFormatString('invalidType');

    expect(mockSpreadsheetEditorManager.setSelectedCellsStyle).not.toHaveBeenCalled();
  });

  it('should do nothing when no format type is provided', () => {
    setCellFormatString();

    expect(mockSpreadsheetEditorManager.setSelectedCellsStyle).not.toHaveBeenCalled();
  });

  it('should test all format types in the formatsMap', () => {
    // Test each format type in the formatsMap
    Object.keys(formatsMap).forEach((formatType) => {
      jest.clearAllMocks();

      setCellFormatString(formatType);

      expect(mockSpreadsheetEditorManager.setSelectedCellsStyle).toHaveBeenCalledWith({
        formatString: formatsMap[formatType],
      });
    });
  });
});

const makeCase = (input, increaseDecimalOutput, decreaseDecimalOutput) => ({
  input,
  increaseDecimalOutput,
  decreaseDecimalOutput,
});

const makeUnchangedCase = (input) => ({
  input,
  increaseDecimalOutput: input,
  decreaseDecimalOutput: input,
});

const caseGroup = (title, rows) => ({
  title,
  cases: rows.map(([input, inc, dec]) => makeCase(input, inc, dec)),
});

// See https://support.microsoft.com/en-us/office/review-guidelines-for-customizing-a-number-format-c0a1d1fa-d3f4-4018-96b7-9c9354dd99f5
// for the guidelines of how the following formats are defined
const testCasesForIncreaseDecreaseDecimal = [
  caseGroup('number formats', [
    ['#0', '#0.0', '#0'],
    ['#0.0', '#0.00', '#0'],
    ['0.00', '0.000', '0.0'],
    ['0.0', '0.00', '0'],
    ['0', '0.0', '0'],
  ]),
  caseGroup('percentage formats', [
    ['0%', '0.0%', '0%'],
    ['#0%', '#0.0%', '#0%'],
    ['0.00%', '0.000%', '0.0%'],
    ['0.0%', '0.00%', '0%'],
  ]),
  caseGroup('currency formats', [
    ['$0', '$0.0', '$0'],
    ['$0.00', '$0.000', '$0.0'],
    ['€#,##0.000', '€#,##0.0000', '€#,##0.00'],
    ['0.00¥', '0.000¥', '0.0¥'],
  ]),
  {
    title: 'composite formats',
    cases: [
      makeUnchangedCase('$0.00;($0.00)'),
      makeUnchangedCase('0.00;[Red]-0.00'),
    ]
  },
  {
    title: 'quoted string formats',
    cases: [
      makeUnchangedCase('"abc"0.00'),
      makeUnchangedCase('"text"0.000%'),
    ]
  },
  caseGroup('accounting formats', [
    ['_($* #,##0_);_($* (#,##0);', '_($* #,##0.0_);_($* (#,##0.0);', '_($* #,##0_);_($* (#,##0);'],
    ['_($* #,##0.0_);_($* (#,##0.0);', '_($* #,##0.00_);_($* (#,##0.00);', '_($* #,##0_);_($* (#,##0);'],
    ['_($* #,##0.00_);_($* (#,##0.00);', '_($* #,##0.000_);_($* (#,##0.000);', '_($* #,##0.0_);_($* (#,##0.0);'],
    ['_($* #,##0.000_);_($* (#,##0.000);', '_($* #,##0.0000_);_($* (#,##0.0000);', '_($* #,##0.00_);_($* (#,##0.00);'],

  ]),
  caseGroup('financial formats', [
    ['#,##0;(#,##0)', '#,##0.0;(#,##0.0)', '#,##0;(#,##0)'],
    ['#,##0.0;(#,##0.0)', '#,##0.00;(#,##0.00)', '#,##0;(#,##0)'],
    ['#,##0.00;(#,##0.00)', '#,##0.000;(#,##0.000)', '#,##0.0;(#,##0.0)'],
    ['#,##0.000;(#,##0.000)', '#,##0.0000;(#,##0.0000)', '#,##0.00;(#,##0.00)'],
  ]),
  {
    title: 'complex formats with underscores or asterisks',
    cases: [
      makeUnchangedCase('_($* #,##0.00_)'),
      makeUnchangedCase('_(* #,##0.00_);_(* (#,##0.00);_(* "-"??_);_(@_)'),
    ]
  }
];

describe('increaseDecimal and decreaseDecimal', () => {
  for (const { title, cases } of testCasesForIncreaseDecreaseDecimal) {
    describe(title, createTestCaseBlock(cases));
  }
});

function createTestCaseBlock(cases) {
  return () => {
    for (const { input, increaseDecimalOutput, decreaseDecimalOutput } of cases) {
      it(`should increase decimal for "${input}"`, () => {
        expect(adjustDecimalOnFormatString(input, 'increaseDecimalFormat')).toBe(increaseDecimalOutput);
      });

      it(`should decrease decimal for "${input}"`, () => {
        expect(adjustDecimalOnFormatString(input, 'decreaseDecimalFormat')).toBe(decreaseDecimalOutput);
      });
    }
  };
}

describe('adjustDecimal', () => {
  beforeEach(() => {
    core.getDocumentViewer.mockReturnValue({
      getSpreadsheetEditorManager: jest.fn(() => ({
        getSelectedCells: jest.fn(() => [{
          getStyle: () => null,
        }]),
      })),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not throw an error for an empty cell', () => {
    const type = 'increaseDecimalFormat';

    let error;
    try {
      getDecimalAdjustedFormatString(type);
    } catch (err) {
      error = err;
    }
    expect(error).toBeUndefined();
  });

  it('should not call increaseDecimal for an empty cell', () => {
    const spyIncrease = jest.spyOn(require('./setCellFormatString'), 'adjustDecimalOnFormatString');
    const type = 'increaseDecimalFormat';

    getDecimalAdjustedFormatString(type);

    expect(spyIncrease).not.toHaveBeenCalled();

    spyIncrease.mockRestore();
  });
});

describe('isAccountingFormat', () => {
  it('should return true for accounting formats with variable decimals', () => {
    expect(isAccountingFormat('_($* #,##0_);_($* (#,##0);')).toBe(true);
    expect(isAccountingFormat('_($* #,##0.0_);_($* (#,##0.0);')).toBe(true);
    expect(isAccountingFormat('_($* #,##0.00_);_($* (#,##0.00);')).toBe(true);
    expect(isAccountingFormat('_($* #,##0.000_);_($* (#,##0.000);')).toBe(true);
    expect(isAccountingFormat('_($* #,##0.0000_);_($* (#,##0.0000);')).toBe(true);
  });

  it('should return false for non-accounting formats', () => {
    expect(isAccountingFormat('$#,##0.00')).toBe(false);
    expect(isAccountingFormat('_($* #,##0.00_)')).toBe(false);
    expect(isAccountingFormat('#0')).toBe(false);
    expect(isAccountingFormat('0%')).toBe(false);
    // Technically this case is an account format in Excel
    // but since in WebViewer SE, we are limiting accounting formats to the base '_($* #,##0.00_);_($* (#,##0.00)' with variable decimals
    // so we are treating this as a non-accounting format
    expect(isAccountingFormat('_($* #,##0_);_($* (#,##0);_($* "-"_);_(@_)')).toBe(false);
    expect(isAccountingFormat('#,##0.00;(#,##0.00)')).toBe(false);
  });
});

describe('isFinancialFormat', () => {
  it('should return true for financial formats with variable decimals', () => {
    expect(isFinancialFormat('#,##0.00;(#,##0.00)')).toBe(true);
    expect(isFinancialFormat('#,##0.0;(#,##0.0)')).toBe(true);
    expect(isFinancialFormat('#,##0.000;(#,##0.000)')).toBe(true);
    expect(isFinancialFormat('#,##0.0000;(#,##0.0000)')).toBe(true);
  });

  it('should return false for non-financial formats', () => {
    expect(isFinancialFormat('$#,##0.00')).toBe(false);
    expect(isFinancialFormat('#0')).toBe(false);
    expect(isFinancialFormat('0%')).toBe(false);
    expect(isFinancialFormat('_($* #,##0_);_($* (#,##0);')).toBe(false);
  });
});

describe('addOneDecimalPlace', () => {
  it('should add one decimal place to a format string of accounting format or financial format', () => {
    expect(addOneDecimalPlace('#0.0')).toBe('#0.00');
    expect(addOneDecimalPlace('#0.00')).toBe('#0.000');
    expect(addOneDecimalPlace('#0.000')).toBe('#0.0000');
    expect(addOneDecimalPlace('#0')).toBe('#0.0');
    expect(addOneDecimalPlace('_($* #,##0.0_)')).toBe('_($* #,##0.00_)');
    expect(addOneDecimalPlace('$#,##0.00')).toBe('$#,##0.000');
  });
});

describe('removeOneDecimalPlace', () => {
  it('should remove one decimal place from a format string of accounting format or financial format', () => {
    expect(removeOneDecimalPlace('#0.00')).toBe('#0.0');
    expect(removeOneDecimalPlace('#0.000')).toBe('#0.00');
    expect(removeOneDecimalPlace('#0.0000')).toBe('#0.000');
    expect(removeOneDecimalPlace('#0')).toBe('#0');
    expect(removeOneDecimalPlace('_($* #,##0.00_)')).toBe('_($* #,##0.0_)');
    expect(removeOneDecimalPlace('$#,##0.00')).toBe('$#,##0.0');
  });
});

describe('adjustDecimalForSemicolonSeparatedFormat', () => {
  it('should adjust decimal places for semicolon-separated formats', () => {
    const formatString = '#,##0.00;(#,##0.00)';
    const adjustedFormat = adjustDecimalForSemicolonSeparatedFormat(formatString, {
      adjustDecimalFunction: addOneDecimalPlace,
    });
    expect(adjustedFormat).toBe('#,##0.000;(#,##0.000)');
  });

  it('should preserve trailing semicolon for accounting formats', () => {
    const formatString = '_($* #,##0.00_);_($* (#,##0.00);';
    const adjustedFormat = adjustDecimalForSemicolonSeparatedFormat(formatString, {
      preserveTrailingSemicolon: true,
      adjustDecimalFunction: addOneDecimalPlace,
    });
    expect(adjustedFormat).toBe('_($* #,##0.000_);_($* (#,##0.000);');
  });

  it('should not change the format string if it is not a semicolon-separated format', () => {
    const formatString = '#0.00';
    const adjustedFormat = adjustDecimalForSemicolonSeparatedFormat(formatString, {
      adjustDecimalFunction: addOneDecimalPlace,
    });
    expect(adjustedFormat).toBe('#0.00');
  });
});

describe('cannotBeAdjustedWithDecimal', () => {
  it('should return true for formats that cannot be adjusted with decimal', () => {
    expect(cannotBeAdjustedWithDecimal('General')).toBe(true);
    expect(cannotBeAdjustedWithDecimal('yyyy-MM-dd')).toBe(true);
    expect(cannotBeAdjustedWithDecimal('dd-MM-yyyy HH:MM:SS)')).toBe(true);
    expect(cannotBeAdjustedWithDecimal('@')).toBe(true);
    expect(cannotBeAdjustedWithDecimal('_($* #,##0a_)')).toBe(true);
    expect(cannotBeAdjustedWithDecimal('_($* #,##0_)')).toBe(true);
    expect(cannotBeAdjustedWithDecimal('$#,##0.00@')).toBe(true);
    expect(cannotBeAdjustedWithDecimal('"$#,##0.00"')).toBe(true);
    expect(cannotBeAdjustedWithDecimal('_($* #,##0_);_($* (#,##0);_($* "-"_);_(@_)')).toBe(true);
  });

  it('should return false for formats that can be adjusted with decimal', () => {
    expect(cannotBeAdjustedWithDecimal('#0.0')).toBe(false);
    expect(cannotBeAdjustedWithDecimal('#0.00')).toBe(false);
    expect(cannotBeAdjustedWithDecimal('#0.000')).toBe(false);
    expect(cannotBeAdjustedWithDecimal('#0.00%')).toBe(false);
    expect(cannotBeAdjustedWithDecimal('#0%')).toBe(false);
    expect(cannotBeAdjustedWithDecimal('_($* #,##0.00_);_($* (#,##0.00);')).toBe(false);
    expect(cannotBeAdjustedWithDecimal('#,##0.00;(#,##0.00)')).toBe(false);
    expect(cannotBeAdjustedWithDecimal('$0')).toBe(false);
  });
});
