import { formatsMap } from 'src/constants/spreadsheetEditor';

const getFormatTypeFromFormatString = (formatString) => {
  const formatType = Object.keys(formatsMap).find((key) => {
    return formatsMap[key] === formatString;
  });

  if (formatType) {
    return formatType;
  }

  const numberFormatPatterns = [
    { key: 'currencyRoundedFormat', pattern: /^\$0$/ },
    { key: 'currencyFormat', pattern: /^\$0\.\d+$/ },
    { key: 'financialFormat', pattern: /^#,##0(\.\d+)?;\(#,##0(\.\d+)?\)$/ },
    { key: 'accountingFormat', pattern: /^_\(\$\* #,##0(\.\d+)?_\);_\(\$\* \(#,##0(\.\d+)?\);$/ },
    { key: 'numberFormat', pattern: /^#,##0(\.\d+)?$/ },
    { key: 'percentFormat', pattern: /^0(\.\d+)?%$/ }
  ];

  const match = numberFormatPatterns.find((pattern) => pattern.pattern.test(formatString));
  return match ? match.key : '';
};

export default getFormatTypeFromFormatString;