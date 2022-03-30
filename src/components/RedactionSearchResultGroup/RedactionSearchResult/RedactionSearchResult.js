import React from 'react';
import { Choice } from '@pdftron/webviewer-react-toolkit';
import Icon from 'components/Icon'
import './RedactionSearchResult.scss'
import classNames from 'classnames';
import { redactionTypeMap } from 'components/RedactionPageGroup/RedactionItem/RedactionItem';

const mapRedactionSearchTypeToIcon = (type) => {
  switch (type) {
    case redactionTypeMap['TEXT']:
      return 'icon-form-field-text';
    case redactionTypeMap['CREDIT_CARD']:
      return 'redact-icons-credit-card';
    case redactionTypeMap['PHONE']:
      return 'redact-icons-phone-number';
    case redactionTypeMap['IMAGE']:
      return 'redact-icons-image';
    case redactionTypeMap['EMAIL']:
      return 'redact-icons-email';
  };
};

// Alternatively wrap this in useCallback and declare inside component
const displayRedactionSearchResult = (props) => {
  const { ambientStr, resultStrStart, resultStrEnd, resultStr, type } = props;
  if (type === redactionTypeMap['TEXT']) {
    const searchValue = ambientStr === '' ? resultStr : ambientStr.slice(resultStrStart, resultStrEnd);
    const textBeforeSearchValue = ambientStr.slice(0, resultStrStart);
    const textAfterSearchValue = ambientStr.slice(resultStrEnd);
    return (
      <>
        {textBeforeSearchValue}
        <span className="search-value">{searchValue}</span>
        {textAfterSearchValue}
      </>
    );
  } else {
    return resultStr;
  };
};

const RedactionSearchResult = (props) => {
  const {
    type,
    isChecked,
    onChange,
    onClickResult,
    isActive,
  } = props;
  const icon = mapRedactionSearchTypeToIcon(type);
  const displayResult = displayRedactionSearchResult(props);

  const searchResultClassname = classNames('redaction-search-result', { active: isActive });

  return (
    <div className={searchResultClassname} role="listitem" onClick={onClickResult}>
      <div style={{ paddingRight: '14px' }}>
        <Choice
          checked={isChecked}
          onChange={onChange}
        />
      </div>
      <div style={{ paddingRight: '14px' }}>
        <Icon glyph={icon} />
      </div>
      <div className="redaction-search-result-info">
        {displayResult}
      </div>
    </div >
  )
};

export default React.memo(RedactionSearchResult);